const { createErrorResponse, createSuccessResponse } = require('../server/chat/response');
const { buildSystemInstruction } = require('../server/chat/prompt');
const { generateChatResponse } = require('../server/router');
const { applyCorsHeaders, isOriginAllowed } = require('../server/security/cors');
const { chatRateLimiter, getClientKey, getRateLimitConfig } = require('../server/security/rate-limit');
const profile = require('../server/data/profile.json');

/**
 * Chat route with Gemini -> Groq -> static portfolio failover.
 */
module.exports = function chatHandler(request, response) {
    applyCorsHeaders(request, response);

    if (request.method === 'OPTIONS') {
        if (!isOriginAllowed(request)) {
            return response.status(403).json(createErrorResponse('This origin is not allowed.', 'ORIGIN_NOT_ALLOWED'));
        }
        return response.status(204).end();
    }

    if (!isOriginAllowed(request)) {
        return response.status(403).json(
            createErrorResponse('This origin is not allowed.', 'ORIGIN_NOT_ALLOWED')
        );
    }

    if (request.method !== 'POST') {
        response.setHeader('Allow', 'POST');
        return response.status(405).json(
            createErrorResponse('Method not allowed', 'METHOD_NOT_ALLOWED')
        );
    }

    const message = typeof request.body?.message === 'string'
        ? request.body.message.trim()
        : '';

    if (!message) {
        return response.status(400).json(
            createErrorResponse('Please enter a message.', 'INVALID_MESSAGE')
        );
    }

    if (message.length > 1000) {
        return response.status(413).json(
            createErrorResponse('Please keep your message under 1,000 characters.', 'MESSAGE_TOO_LONG')
        );
    }

    const rateLimit = chatRateLimiter.check(getClientKey(request), getRateLimitConfig());
    response.setHeader('X-RateLimit-Limit', getRateLimitConfig().maxRequests);
    response.setHeader('X-RateLimit-Remaining', rateLimit.remaining);

    if (!rateLimit.allowed) {
        response.setHeader('Retry-After', rateLimit.retryAfterSeconds);
        return response.status(429).json(
            createErrorResponse('You have reached the chat request limit. Please try again later.', 'RATE_LIMITED')
        );
    }

    return generateChatResponse({
        message,
        systemInstruction: buildSystemInstruction(profile),
        profile
    })
        .then(result => response.status(200).json(createSuccessResponse(result.answer, {
            provider: result.provider,
            model: result.model,
            fallbackUsed: result.fallbackUsed
        })))
        .catch(() => response.status(500).json(
            createErrorResponse('The portfolio assistant is temporarily unavailable. Please use the contact links instead.', 'CHATBOT_ERROR')
        ));
};
