const { ProviderError } = require('./provider-error');
const { consumeSse } = require('./sse');

function getGeminiConfig(env = process.env) {
    return {
        apiKey: env.GEMINI_API_KEY,
        model: env.GEMINI_MODEL
    };
}

async function generateWithGemini({ message, systemInstruction, env = process.env, fetchImpl = fetch }) {
    const { apiKey, model } = getGeminiConfig(env);

    if (!apiKey || !model) {
        throw new ProviderError('gemini', 'MISSING_CONFIGURATION', 'Gemini provider configuration is missing.');
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;
    let response;

    try {
        response = await fetchImpl(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                systemInstruction: { parts: [{ text: systemInstruction }] },
                contents: [{ role: 'user', parts: [{ text: message }] }],
                generationConfig: { temperature: 0.3, maxOutputTokens: 500 }
            })
        });
    } catch (error) {
        throw new ProviderError('gemini', 'NETWORK_ERROR', 'Gemini network request failed.', { retryable: true });
    }

    if (!response.ok) {
        const retryable = response.status === 408 || response.status === 429 || response.status >= 500;
        throw new ProviderError('gemini', 'PROVIDER_ERROR', `Gemini request failed with status ${response.status}.`, {
            retryable,
            status: response.status
        });
    }

    let payload;
    try {
        payload = await response.json();
    } catch (error) {
        throw new ProviderError('gemini', 'INVALID_RESPONSE', 'Gemini returned an invalid response.');
    }

    const answer = payload?.candidates?.[0]?.content?.parts
        ?.map(part => part.text || '')
        .join('')
        .trim();

    if (!answer) {
        throw new ProviderError('gemini', 'EMPTY_RESPONSE', 'Gemini returned no answer.');
    }

    return { answer, provider: 'gemini', model };
}

async function streamWithGemini({ message, systemInstruction, env = process.env, fetchImpl = fetch, onToken, onProvider }) {
    const { apiKey, model } = getGeminiConfig(env);
    if (!apiKey || !model) {
        throw new ProviderError('gemini', 'MISSING_CONFIGURATION', 'Gemini provider configuration is missing.');
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:streamGenerateContent?alt=sse&key=${encodeURIComponent(apiKey)}`;
    let response;
    try {
        response = await fetchImpl(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                systemInstruction: { parts: [{ text: systemInstruction }] },
                contents: [{ role: 'user', parts: [{ text: message }] }],
                generationConfig: { temperature: 0.3, maxOutputTokens: 500 }
            })
        });
    } catch (error) {
        throw new ProviderError('gemini', 'NETWORK_ERROR', 'Gemini stream request failed.', { retryable: true });
    }

    if (!response.ok) {
        const retryable = response.status === 408 || response.status === 429 || response.status >= 500;
        throw new ProviderError('gemini', 'PROVIDER_ERROR', `Gemini stream failed with status ${response.status}.`, { retryable, status: response.status });
    }

    await onProvider?.({ provider: 'gemini', model });
    let answer = '';
    await consumeSse(response, async payload => {
        const text = payload?.candidates?.[0]?.content?.parts?.map(part => part.text || '').join('') || '';
        if (text) {
            answer += text;
            await onToken(text);
        }
    });

    if (!answer.trim()) throw new ProviderError('gemini', 'EMPTY_RESPONSE', 'Gemini returned no streamed answer.');
    return { answer: answer.trim(), provider: 'gemini', model };
}

module.exports = { generateWithGemini, streamWithGemini, getGeminiConfig };
