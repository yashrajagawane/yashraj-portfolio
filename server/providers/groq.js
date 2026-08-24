const { ProviderError } = require('./provider-error');

const DEFAULT_TIMEOUT_MS = 12000;

function getGroqConfig(env = process.env) {
    return {
        apiKey: env.GROQ_API_KEY,
        model: env.GROQ_MODEL
    };
}

function createTimeoutSignal(timeoutMs) {
    if (typeof AbortSignal !== 'undefined' && typeof AbortSignal.timeout === 'function') {
        return AbortSignal.timeout(timeoutMs);
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    timeout.unref?.();
    return controller.signal;
}

async function generateWithGroq({
    message,
    systemInstruction,
    env = process.env,
    fetchImpl = fetch,
    timeoutMs = DEFAULT_TIMEOUT_MS
}) {
    const { apiKey, model } = getGroqConfig(env);

    if (!apiKey || !model) {
        throw new ProviderError('groq', 'MISSING_CONFIGURATION', 'Groq provider configuration is missing.');
    }

    let response;
    try {
        response = await fetchImpl('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model,
                messages: [
                    { role: 'system', content: systemInstruction },
                    { role: 'user', content: message }
                ],
                temperature: 0.3,
                max_tokens: 500
            }),
            signal: createTimeoutSignal(timeoutMs)
        });
    } catch (error) {
        const code = error?.name === 'AbortError' ? 'TIMEOUT' : 'NETWORK_ERROR';
        throw new ProviderError('groq', code, 'Groq network request failed.', { retryable: true });
    }

    if (!response.ok) {
        const retryable = response.status === 408 || response.status === 429 || response.status >= 500;
        throw new ProviderError('groq', 'PROVIDER_ERROR', `Groq request failed with status ${response.status}.`, {
            retryable,
            status: response.status
        });
    }

    let payload;
    try {
        payload = await response.json();
    } catch (error) {
        throw new ProviderError('groq', 'INVALID_RESPONSE', 'Groq returned an invalid response.');
    }

    const answer = payload?.choices?.[0]?.message?.content?.trim();
    if (!answer) {
        throw new ProviderError('groq', 'EMPTY_RESPONSE', 'Groq returned no answer.');
    }

    return { answer, provider: 'groq', model };
}

module.exports = { generateWithGroq, getGroqConfig };
