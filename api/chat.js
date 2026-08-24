const { createErrorResponse, createSuccessResponse } = require('../server/chat/response');
const { buildSystemInstruction } = require('../server/chat/prompt');
const { generateChatResponse } = require('../server/router');
const profile = require('../server/data/profile.json');

/**
 * Chat route with Gemini -> Groq -> static portfolio failover.
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

    return generateChatResponse({
        message,
        systemInstruction: buildSystemInstruction(profile),
        profile
    })
        .then(result => response.status(200).json(createSuccessResponse(result.answer, {
            provider: result.provider,
            model: result.model,
            fallbackUsed: result.fallbackUsed
        })))
        .catch(() => response.status(500).json(
            createErrorResponse('The portfolio assistant is temporarily unavailable. Please use the contact links instead.', 'CHATBOT_ERROR')
        ));
};
