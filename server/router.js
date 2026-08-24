const { generateWithGemini } = require('./providers/gemini');
const { generateWithGroq } = require('./providers/groq');
const { getStaticFallback } = require('./chat/fallback');

async function attemptProvider(provider, request, attempts = 2) {
    let lastError;

    for (let attempt = 1; attempt <= attempts; attempt += 1) {
        try {
            return await provider(request);
        } catch (error) {
            lastError = error;
            if (!error.retryable || attempt === attempts) {
                break;
            }
        }
    }

    throw lastError;
}

async function generateChatResponse({ message, systemInstruction, profile, env = process.env, fetchImpl = fetch }) {
    const providerRequest = { message, systemInstruction, env, fetchImpl };
    const failures = [];

    for (const [name, provider] of [['gemini', generateWithGemini], ['groq', generateWithGroq]]) {
        try {
            const result = await attemptProvider(provider, providerRequest);
            return { ...result, fallbackUsed: name !== 'gemini' };
        } catch (error) {
            failures.push(error);
        }
    }

    return {
        answer: getStaticFallback(message, profile),
        provider: 'static',
        model: null,
        fallbackUsed: true,
        providerFailures: failures.map(error => error.code)
    };
}

module.exports = { attemptProvider, generateChatResponse };
