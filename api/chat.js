const { createErrorResponse, createSuccessResponse } = require('../server/chat/response');
const { buildSystemInstruction } = require('../server/chat/prompt');
const { generateChatResponse, streamChatResponse } = require('../server/router');
const { applyCorsHeaders, isOriginAllowed } = require('../server/security/cors');
const { chatRateLimiter, getClientKey, getRateLimitConfig } = require('../server/security/rate-limit');
const { metrics } = require('../server/monitoring/metrics');
const profile = require('../server/data/profile.json');

/**
 * Chat route with Gemini -> Groq -> static portfolio failover.
 */
module.exports = function chatHandler(request, response) {
    const requestStartedAt = Date.now();
    applyCorsHeaders(request, response);

    if (request.method === 'OPTIONS') {
        if (!isOriginAllowed(request)) {
            metrics.recordError('ORIGIN_NOT_ALLOWED');
            return response.status(403).json(createErrorResponse('This origin is not allowed.', 'ORIGIN_NOT_ALLOWED'));
        }
        return response.status(204).end();
    }

    if (!isOriginAllowed(request)) {
        metrics.recordError('ORIGIN_NOT_ALLOWED');
        return response.status(403).json(
            createErrorResponse('This origin is not allowed.', 'ORIGIN_NOT_ALLOWED')
        );
    }

    if (request.method !== 'POST') {
        metrics.recordError('METHOD_NOT_ALLOWED');
        response.setHeader('Allow', 'POST');
        return response.status(405).json(
            createErrorResponse('Method not allowed', 'METHOD_NOT_ALLOWED')
        );
    }

    const message = typeof request.body?.message === 'string'
        ? request.body.message.trim()
        : '';

    if (!message) {
        metrics.recordError('INVALID_MESSAGE');
        return response.status(400).json(
            createErrorResponse('Please enter a message.', 'INVALID_MESSAGE')
        );
    }

    if (message.length > 1000) {
        metrics.recordError('MESSAGE_TOO_LONG');
        return response.status(413).json(
            createErrorResponse('Please keep your message under 1,000 characters.', 'MESSAGE_TOO_LONG')
        );
    }

    const rateLimit = chatRateLimiter.check(getClientKey(request), getRateLimitConfig());
    metrics.recordRequest();
    response.setHeader('X-RateLimit-Limit', getRateLimitConfig().maxRequests);
    response.setHeader('X-RateLimit-Remaining', rateLimit.remaining);

    if (!rateLimit.allowed) {
        metrics.recordError('RATE_LIMITED');
        response.setHeader('Retry-After', rateLimit.retryAfterSeconds);
        return response.status(429).json(
            createErrorResponse('You have reached the chat request limit. Please try again later.', 'RATE_LIMITED')
        );
    }

    const wantsStream = request.query?.stream === '1' || request.url?.includes('stream=1');
    if (wantsStream) {
        response.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
        response.setHeader('Cache-Control', 'no-cache, no-transform');
        response.setHeader('Connection', 'keep-alive');
        response.setHeader('X-Accel-Buffering', 'no');
        response.flushHeaders?.();
        const writeEvent = (event, payload) => response.write(`event: ${event}\ndata: ${JSON.stringify(payload)}\n\n`);

        return streamChatResponse({
            message,
            systemInstruction: buildSystemInstruction(profile),
            profile,
            onProvider: provider => writeEvent('start', provider),
            onToken: token => writeEvent('token', { text: token })
        })
            .then(result => {
                metrics.recordResponse({ provider: result.provider, fallbackUsed: result.fallbackUsed, latencyMs: Date.now() - requestStartedAt });
                writeEvent('done', { ok: true, provider: result.provider, model: result.model, fallbackUsed: result.fallbackUsed });
                return response.end();
            })
            .catch(() => {
                metrics.recordError('STREAM_ERROR');
                writeEvent('error', { ok: false, message: 'The portfolio assistant is temporarily unavailable.' });
                return response.end();
            });
    }

    return generateChatResponse({
        message,
        systemInstruction: buildSystemInstruction(profile),
        profile
    })
        .then(result => {
            metrics.recordResponse({ provider: result.provider, fallbackUsed: result.fallbackUsed, latencyMs: Date.now() - requestStartedAt });
            return response.status(200).json(createSuccessResponse(result.answer, {
                provider: result.provider,
                model: result.model,
                fallbackUsed: result.fallbackUsed
            }));
        })
        .catch(() => {
            metrics.recordError('CHATBOT_ERROR');
            return response.status(500).json(
                createErrorResponse('The portfolio assistant is temporarily unavailable. Please use the contact links instead.', 'CHATBOT_ERROR')
            );
        });
};
