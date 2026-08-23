const { createErrorResponse, createSuccessResponse } = require('../server/chat/response');
const { buildSystemInstruction } = require('../server/chat/prompt');
const { generateWithGemini } = require('../server/providers/gemini');
const profile = require('../server/data/profile.json');

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

    const message = typeof request.body?.message === 'string'
        ? request.body.message.trim()
        : '';

    if (!message) {
        return response.status(400).json(
            createErrorResponse('Please enter a message.', 'INVALID_MESSAGE')
        );
    }

    if (message.length > 1000) {
        return response.status(413).json(
            createErrorResponse('Please keep your message under 1,000 characters.', 'MESSAGE_TOO_LONG')
        );
    }

    return generateWithGemini({
        message,
        systemInstruction: buildSystemInstruction(profile)
    })
        .then(result => response.status(200).json(createSuccessResponse(result.answer, {
            provider: result.provider,
            model: result.model,
            fallbackUsed: false
        })))
        .catch(error => {
            const status = error.code === 'MISSING_CONFIGURATION' ? 503 : 502;
            return response.status(status).json(
                createErrorResponse(
                    'The portfolio assistant is temporarily unavailable. Please use the contact links instead.',
                    error.code || 'CHATBOT_ERROR'
                )
            );
        });
};
