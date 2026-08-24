const DEFAULT_MAX_REQUESTS = 20;
const DEFAULT_WINDOW_SECONDS = 3600;

function getRateLimitConfig(env = process.env) {
    const maxRequests = Number.parseInt(env.RATE_LIMIT_MAX_REQUESTS, 10);
    const windowSeconds = Number.parseInt(env.RATE_LIMIT_WINDOW_SECONDS, 10);

    return {
        maxRequests: Number.isFinite(maxRequests) && maxRequests > 0 ? maxRequests : DEFAULT_MAX_REQUESTS,
        windowMs: (Number.isFinite(windowSeconds) && windowSeconds > 0 ? windowSeconds : DEFAULT_WINDOW_SECONDS) * 1000
    };
}

function getClientKey(request) {
    const forwardedFor = request.headers?.['x-forwarded-for'];
    const realIp = request.headers?.['x-real-ip'];
    const ip = forwardedFor?.split(',')[0]?.trim() || realIp || 'unknown-client';
    return ip;
}

function createRateLimiter({ now = () => Date.now() } = {}) {
    const buckets = new Map();

    return {
        check(key, config) {
            const currentTime = now();
            const current = buckets.get(key);
            const bucket = !current || currentTime - current.startedAt >= config.windowMs
                ? { startedAt: currentTime, count: 0 }
                : current;

            bucket.count += 1;
            buckets.set(key, bucket);

            const allowed = bucket.count <= config.maxRequests;
            return {
                allowed,
                remaining: Math.max(0, config.maxRequests - bucket.count),
                retryAfterSeconds: allowed
                    ? 0
                    : Math.ceil((bucket.startedAt + config.windowMs - currentTime) / 1000)
            };
        },
        clear() {
            buckets.clear();
        }
    };
}

const chatRateLimiter = createRateLimiter();

module.exports = { getRateLimitConfig, getClientKey, createRateLimiter, chatRateLimiter };
