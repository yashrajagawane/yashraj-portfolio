class ProviderError extends Error {
    constructor(provider, code, message, options = {}) {
        super(message);
        this.name = 'ProviderError';
        this.provider = provider;
        this.code = code;
        this.retryable = Boolean(options.retryable);
        this.status = options.status || null;
    }
}

module.exports = { ProviderError };
