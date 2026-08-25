const { ProviderError } = require('./provider-error');

async function consumeSse(response, onData) {
    if (!response.body?.getReader) {
        throw new ProviderError('provider', 'INVALID_STREAM', 'Provider returned no readable stream.');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    const consumeEvent = async event => {
        const data = event.split('\n')
            .filter(line => line.startsWith('data:'))
            .map(line => line.slice(5).trim())
            .join('\n');

        if (!data || data === '[DONE]') return;
        let payload;
        try {
            payload = JSON.parse(data);
        } catch (error) {
            throw new ProviderError('provider', 'INVALID_STREAM', 'Provider returned malformed stream data.');
        }
        await onData(payload);
    };

    while (true) {
        const { done, value } = await reader.read();
        buffer += decoder.decode(value || new Uint8Array(), { stream: !done });
        const events = buffer.split('\n\n');
        buffer = events.pop() || '';
        for (const event of events) await consumeEvent(event);
        if (done) break;
    }

    if (buffer.trim()) await consumeEvent(buffer);
}

module.exports = { consumeSse };
