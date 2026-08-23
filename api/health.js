/**
 * Minimal serverless health endpoint for the chatbot backend.
 * Provider integrations are intentionally added in later phases.
 */
module.exports = function healthHandler(request, response) {
    if (request.method !== 'GET') {
        response.setHeader('Allow', 'GET');
        return response.status(405).json({
            ok: false,
            error: 'Method not allowed'
        });
    }

    return response.status(200).json({
        ok: true,
        service: 'portfolio-chatbot-api',
        phase: 1,
        providersConfigured: false
    });
};
