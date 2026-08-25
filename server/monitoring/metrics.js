function createMetrics({ now = () => Date.now() } = {}) {
    const state = {
        startedAt: now(),
        requests: 0,
        responses: 0,
        fallbacks: 0,
        providers: {},
        errors: {},
        latency: { count: 0, totalMs: 0, maxMs: 0 }
    };

    return {
        recordRequest() { state.requests += 1; },
        recordResponse({ provider = 'unknown', fallbackUsed = false, latencyMs = 0 } = {}) {
            state.responses += 1;
            state.providers[provider] = (state.providers[provider] || 0) + 1;
            if (fallbackUsed) state.fallbacks += 1;
            state.latency.count += 1;
            state.latency.totalMs += Math.max(0, latencyMs);
            state.latency.maxMs = Math.max(state.latency.maxMs, latencyMs);
        },
        recordError(code = 'UNKNOWN_ERROR') { state.errors[code] = (state.errors[code] || 0) + 1; },
        snapshot() {
            return {
                startedAt: new Date(state.startedAt).toISOString(),
                requests: state.requests,
                responses: state.responses,
                fallbacks: state.fallbacks,
                providers: { ...state.providers },
                errors: { ...state.errors },
                averageLatencyMs: state.latency.count ? Math.round(state.latency.totalMs / state.latency.count) : 0,
                maxLatencyMs: state.latency.maxMs,
                scope: 'process'
            };
        },
        reset() {
            state.requests = 0; state.responses = 0; state.fallbacks = 0;
            state.providers = {}; state.errors = {}; state.latency = { count: 0, totalMs: 0, maxMs: 0 };
        }
    };
}

const metrics = createMetrics();

module.exports = { createMetrics, metrics };
