# Chatbot server structure

This directory contains server-only chatbot code. It must never be imported into browser-facing JavaScript when it contains provider credentials or private configuration.

```text
server/
├─ chat/response.js       Shared normalized API response format
├─ data/profile.json      Added in Phase 2
└─ providers/              Gemini and Groq adapters added in Phases 3 and 4
```

The public serverless entry points are in `api/`:

- `api/health.js` verifies that the backend is reachable.
- `api/chat.js` defines the stable chat route and remains intentionally unconfigured until provider integrations are implemented.
