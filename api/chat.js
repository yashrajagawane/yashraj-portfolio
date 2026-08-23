const { createErrorResponse } = require('../server/chat/response');

/**
 * Chat route contract. Gemini and Groq adapters are added in Phases 3 and 4.
 * Keeping this route in place now gives the frontend a stable API boundary.
 */
module.exports = function chatHandler(request, response) {
    if (request.method !== 'POST') {
        response.setHeader('Allow', 'POST');
        return response.status(405).json(
            createErrorResponse('Method not allowed', 'METHOD_NOT_ALLOWED')
        );
    }

    return response.status(503).json(
        createErrorResponse(
            'The portfolio assistant is being prepared. Please use the contact links instead.',
            'CHATBOT_NOT_CONFIGURED'
        )
    );
};
