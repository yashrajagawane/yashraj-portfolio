function getAllowedOrigin(env = process.env) {
    return typeof env.ALLOWED_ORIGIN === 'string' ? env.ALLOWED_ORIGIN.trim() : '';
}

function getRequestOrigin(request) {
    return request.headers?.origin || request.headers?.Origin || '';
}

function isOriginAllowed(request, env = process.env) {
    const origin = getRequestOrigin(request);
    const allowedOrigin = getAllowedOrigin(env);

    // Non-browser/server-to-server requests do not send an Origin header.
    if (!origin) return true;
    return Boolean(allowedOrigin) && origin === allowedOrigin;
}

function applyCorsHeaders(request, response, env = process.env) {
    const origin = getRequestOrigin(request);
    const allowedOrigin = getAllowedOrigin(env);

    if (origin && allowedOrigin && origin === allowedOrigin) {
        response.setHeader('Access-Control-Allow-Origin', allowedOrigin);
        response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
        response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        response.setHeader('Vary', 'Origin');
    }
}

module.exports = { getAllowedOrigin, getRequestOrigin, isOriginAllowed, applyCorsHeaders };
