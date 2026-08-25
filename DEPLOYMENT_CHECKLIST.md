# Chatbot Deployment Checklist

## Vercel environment variables

Add these in the Vercel project under **Settings → Environment Variables**. Select **Production** and **Preview** for deployed chatbot testing. Keep API keys server-only and never commit them.

```env
GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.5-flash
GROQ_API_KEY=
GROQ_MODEL=openai/gpt-oss-120b
ALLOWED_ORIGIN=https://yashrajagawane.dev
RATE_LIMIT_MAX_REQUESTS=20
RATE_LIMIT_WINDOW_SECONDS=3600
SENTRY_DSN=
```

After changing variables, create a new Vercel deployment. Existing deployments do not automatically receive changed environment values.

## Production verification

1. Open `https://yashrajagawane.dev/api/health` and confirm `ok: true`, `staticFallbackAvailable: true`, and `streamingAvailable: true`.
2. Confirm `geminiConfigured` and `groqConfigured` match the keys intentionally configured in Vercel. The endpoint must never display key values.
3. Open the portfolio and ask a known question such as `What projects has Yashraj built?`.
4. Confirm the answer begins rendering progressively and the browser network request contains no provider API key.
5. Temporarily test the static fallback only in a Preview deployment by removing provider keys there; restore the keys afterward.
6. Confirm the browser console and Vercel logs contain no API keys or complete visitor conversations.

## Rollback

If a deployment fails, use Vercel's previous ready deployment as the rollback target. Do not delete provider keys to troubleshoot Production; use Preview variables instead.

## Local checks

```bash
npm test
```
