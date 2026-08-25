# Chatbot Monitoring and Maintenance

## What is tracked

The server records process-local aggregate metrics only:

- request and response counts
- provider selected (`gemini`, `groq`, or `static`)
- fallback count
- safe error code counts
- average and maximum response latency

It does not store visitor messages, conversation history, IP addresses, API keys, or generated answer text.

## Health checks

Use `GET /api/health` to confirm API reachability, provider configuration state, streaming/static fallback capabilities, and the current process metrics snapshot. Vercel can replace instances at any time, so these are best-effort diagnostics rather than billing or audit data.

## Maintenance routine

1. Run `npm test` before changing provider, prompt, profile, or widget code.
2. Update `server/data/profile.json` when a project, skill, link, education detail, or availability statement changes.
3. Verify every new link manually and remove stale or placeholder links.
4. Deploy to Preview first and test Gemini, Groq fallback, static fallback, CORS, rate limiting, and streaming.
5. Promote only after the production health endpoint and a known portfolio question succeed.
6. Rotate provider keys immediately if they appear in source, logs, screenshots, or commits.

## Alert signals

Investigate unexpected provider configuration changes, sharp increases in static fallback or errors, unusual latency, health endpoint failures, or profile data that no longer matches the live portfolio.

For durable dashboards, connect a privacy-preserving external metrics service later. Do not add full conversation logging as a shortcut.
