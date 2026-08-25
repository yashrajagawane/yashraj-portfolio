const assert = require('node:assert/strict');
const fs = require('node:fs');
const test = require('node:test');

const profile = require('../server/data/profile.json');
const { getStaticFallback } = require('../server/chat/fallback');
const { streamWithGroq } = require('../server/providers/groq');
const { streamWithGemini } = require('../server/providers/gemini');
const { generateChatResponse, streamChatResponse } = require('../server/router');
const { isOriginAllowed } = require('../server/security/cors');
const { createRateLimiter } = require('../server/security/rate-limit');
const { createMetrics } = require('../server/monitoring/metrics');

function jsonResponse(payload, status = 200) {
    return { ok: status >= 200 && status < 300, status, json: async () => payload };
}

function request(method, body, headers = {}) {
    return { method, body, headers };
}

function responseRecorder() {
    return {
        headers: {},
        statusCode: 200,
        body: null,
        ended: false,
        setHeader(name, value) { this.headers[name] = value; },
        status(code) { this.statusCode = code; return this; },
        json(body) { this.body = body; return this; },
        end() { this.ended = true; return this; }
    };
}

function streamBody(chunks) {
    const encoder = new TextEncoder();
    return new ReadableStream({
        start(controller) {
            chunks.forEach(chunk => controller.enqueue(encoder.encode(chunk)));
            controller.close();
        }
    });
}

const env = {
    GEMINI_API_KEY: 'gemini-test-key',
    GEMINI_MODEL: 'gemini-2.5-flash',
    GROQ_API_KEY: 'groq-test-key',
    GROQ_MODEL: 'openai/gpt-oss-120b'
};

test('static fallback answers common contact questions without AI', () => {
    const answer = getStaticFallback('How can I contact Yashraj?', profile);
    assert.match(answer, /agawaneyash865@gmail\.com/);
    assert.match(answer, /github\.com\/yashrajagawane/);
});

test('Gemini is selected when its response succeeds', async () => {
    let calls = 0;
    const result = await generateChatResponse({
        message: 'What projects has Yashraj built?',
        systemInstruction: 'grounded',
        profile,
        env,
        fetchImpl: async url => {
            calls += 1;
            assert.match(url, /generativelanguage/);
            return jsonResponse({ candidates: [{ content: { parts: [{ text: 'Gemini answer' }] } }] });
        }
    });
    assert.equal(result.provider, 'gemini');
    assert.equal(result.fallbackUsed, false);
    assert.equal(calls, 1);
});

test('transient Gemini errors retry and then fail over to Groq', async () => {
    let geminiCalls = 0;
    let groqCalls = 0;
    const result = await generateChatResponse({
        message: 'Tell me about skills',
        systemInstruction: 'grounded',
        profile,
        env,
        fetchImpl: async url => {
            if (url.includes('generativelanguage')) {
                geminiCalls += 1;
                return jsonResponse({}, 503);
            }
            groqCalls += 1;
            return jsonResponse({ choices: [{ message: { content: 'Groq fallback answer' } }] });
        }
    });
    assert.equal(result.provider, 'groq');
    assert.equal(result.fallbackUsed, true);
    assert.equal(geminiCalls, 2);
    assert.equal(groqCalls, 1);
});

test('both missing providers return a grounded static answer', async () => {
    const result = await generateChatResponse({
        message: 'Is Yashraj available for internships?',
        systemInstruction: 'grounded',
        profile,
        env: {}
    });
    assert.equal(result.provider, 'static');
    assert.equal(result.fallbackUsed, true);
    assert.match(result.answer, /internships/i);
});

test('unknown questions receive an honest portfolio boundary', () => {
    const answer = getStaticFallback('What is Yashraj salary and weather today?', profile);
    assert.match(answer, /outside the portfolio/i);
    assert.doesNotMatch(answer, /salary is|weather is/i);
});

test('streaming providers normalize SSE token chunks', async () => {
    const newline = String.fromCharCode(10);
    const geminiChunks = [
        `data: ${JSON.stringify({ candidates: [{ content: { parts: [{ text: 'Gemini ' }] } }] })}${newline}${newline}`,
        `data: ${JSON.stringify({ candidates: [{ content: { parts: [{ text: 'stream' }] } }] })}${newline}${newline}`
    ];
    let geminiText = '';
    const gemini = await streamWithGemini({
        message: 'test', systemInstruction: 'grounded', env,
        fetchImpl: async () => ({ ok: true, status: 200, body: streamBody(geminiChunks) }),
        onToken: token => { geminiText += token; }
    });
    assert.equal(geminiText, 'Gemini stream');
    assert.equal(gemini.provider, 'gemini');

    const groqChunks = [
        `data: ${JSON.stringify({ choices: [{ delta: { content: 'Groq ' } }] })}${newline}${newline}`,
        `data: ${JSON.stringify({ choices: [{ delta: { content: 'stream' } }] })}${newline}${newline}data: [DONE]${newline}${newline}`
    ];
    let groqText = '';
    const groq = await streamWithGroq({
        message: 'test', systemInstruction: 'grounded', env,
        fetchImpl: async () => ({ ok: true, status: 200, body: streamBody(groqChunks) }),
        onToken: token => { groqText += token; }
    });
    assert.equal(groqText, 'Groq stream');
    assert.equal(groq.provider, 'groq');
});

test('stream router emits static fallback when providers are unavailable', async () => {
    let streamed = '';
    const result = await streamChatResponse({
        message: 'How can I contact Yashraj?',
        systemInstruction: 'grounded',
        profile,
        env: {},
        onProvider: () => {},
        onToken: token => { streamed += token; }
    });
    assert.equal(result.provider, 'static');
    assert.match(streamed, /agawaneyash865@gmail\.com/);
});

test('API rejects empty and oversized messages', async () => {
    const handler = require('../api/chat');
    const emptyResponse = responseRecorder();
    handler(request('POST', { message: ' ' }, { 'x-forwarded-for': 'test-empty' }), emptyResponse);
    assert.equal(emptyResponse.statusCode, 400);
    assert.equal(emptyResponse.body.error.code, 'INVALID_MESSAGE');

    const largeResponse = responseRecorder();
    handler(request('POST', { message: 'x'.repeat(1001) }, { 'x-forwarded-for': 'test-large' }), largeResponse);
    assert.equal(largeResponse.statusCode, 413);
    assert.equal(largeResponse.body.error.code, 'MESSAGE_TOO_LONG');
});

test('origin and rate-limit protections behave as configured', () => {
    assert.equal(isOriginAllowed({ headers: { origin: 'https://yashrajagawane.dev' } }, { ALLOWED_ORIGIN: 'https://yashrajagawane.dev' }), true);
    assert.equal(isOriginAllowed({ headers: { origin: 'https://evil.example' } }, { ALLOWED_ORIGIN: 'https://yashrajagawane.dev' }), false);

    let now = 0;
    const limiter = createRateLimiter({ now: () => now });
    const config = { maxRequests: 2, windowMs: 1000 };
    assert.equal(limiter.check('visitor', config).allowed, true);
    assert.equal(limiter.check('visitor', config).allowed, true);
    assert.equal(limiter.check('visitor', config).allowed, false);
    now = 1001;
    assert.equal(limiter.check('visitor', config).allowed, true);
});

test('widget includes accessible launcher and streaming controls', () => {
    const html = fs.readFileSync('index.html', 'utf8');
    const script = fs.readFileSync('assets/js/script.js', 'utf8');
    assert.match(html, /aria-controls="chatbot-panel"/);
    assert.match(html, /aria-live="polite"/);
    assert.match(script, /\/api\/chat\?stream=1/);
    assert.match(script, /AbortController/);
});

test('metrics snapshot is aggregate-only and resettable', () => {
    const metrics = createMetrics({ now: () => 1700000000000 });
    metrics.recordRequest();
    metrics.recordResponse({ provider: 'groq', fallbackUsed: true, latencyMs: 120 });
    metrics.recordError('RATE_LIMITED');
    const snapshot = metrics.snapshot();
    assert.equal(snapshot.requests, 1);
    assert.equal(snapshot.responses, 1);
    assert.equal(snapshot.fallbacks, 1);
    assert.deepEqual(snapshot.providers, { groq: 1 });
    assert.deepEqual(snapshot.errors, { RATE_LIMITED: 1 });
    assert.equal(snapshot.averageLatencyMs, 120);
    assert.equal(snapshot.scope, 'process');
    assert.equal(JSON.stringify(snapshot).includes('message'), false);
    metrics.reset();
    assert.equal(metrics.snapshot().requests, 0);
});
