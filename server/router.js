const { generateWithGemini, streamWithGemini } = require('./providers/gemini');
const { generateWithGroq, streamWithGroq } = require('./providers/groq');
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

async function streamChatResponse({ message, systemInstruction, profile, env = process.env, fetchImpl = fetch, onToken, onProvider }) {
    const providers = [['gemini', streamWithGemini], ['groq', streamWithGroq]];

    for (const [name, provider] of providers) {
        let output = '';
        let lastError;
        for (let attempt = 1; attempt <= 2; attempt += 1) {
            try {
                const result = await provider({
                    message,
                    systemInstruction,
                    env,
                    fetchImpl,
                    onProvider,
                    onToken: async token => {
                        output += token;
                        await onToken(token);
                    }
                });
                return { ...result, fallbackUsed: name !== 'gemini' };
            } catch (error) {
                lastError = error;
                if (output || !error.retryable || attempt === 2) break;
            }
        }

        // If a provider failed after sending text, complete that partial answer
        // instead of switching providers and duplicating content in the UI.
        if (output.trim()) return { answer: output.trim(), provider: name, model: null, fallbackUsed: name !== 'gemini' };
        void lastError;
    }

    const fallback = getStaticFallback(message, profile);
    await onProvider?.({ provider: 'static', model: null });
    for (const chunk of fallback.split(/(?<=\s)/)) await onToken(chunk);
    return { answer: fallback, provider: 'static', model: null, fallbackUsed: true };
}

module.exports = { attemptProvider, generateChatResponse, streamChatResponse };
