/**
 * Public deployment health endpoint. It reports configuration state only;
 * it never returns provider keys or other secret values.
 */
module.exports = function healthHandler(request, response) {
    if (request.method !== 'GET') {
        response.setHeader('Allow', 'GET');
        return response.status(405).json({
            ok: false,
            error: 'Method not allowed'
        });
    }

    const geminiConfigured = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_MODEL);
    const groqConfigured = Boolean(process.env.GROQ_API_KEY && process.env.GROQ_MODEL);

    return response.status(200).json({
        ok: true,
        service: 'portfolio-chatbot-api',
        phase: 10,
        providersConfigured: geminiConfigured || groqConfigured,
        providers: {
            geminiConfigured,
            groqConfigured,
            staticFallbackAvailable: true,
            streamingAvailable: true
        }
    });
};
