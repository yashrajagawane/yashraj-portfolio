/**
 * Shared response helpers used by every chatbot provider and fallback.
 * Provider adapters must return this normalized shape to the API route.
 */
function createSuccessResponse(answer, metadata = {}) {
    return {
        ok: true,
        answer,
        provider: metadata.provider || 'fallback',
        model: metadata.model || null,
        fallbackUsed: Boolean(metadata.fallbackUsed),
        requestId: metadata.requestId || null
    };
}

function createErrorResponse(message, code = 'CHATBOT_ERROR') {
    return {
        ok: false,
        error: {
            code,
            message
        }
    };
}

module.exports = {
    createSuccessResponse,
    createErrorResponse
};
