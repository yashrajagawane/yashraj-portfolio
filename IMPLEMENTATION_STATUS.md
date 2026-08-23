# Chatbot Implementation Status

Last updated: 2026-08-24

## Current status

Planning complete. Implementation has not started.

AI providers selected:

- Primary: Gemini Flash
- Fallback: Groq
- Final emergency fallback: local static portfolio responses

## Phase tracker

### Phase 0 — Confirm scope and content

- Status: `Not started`
- Notes: Confirm tone, languages, resume, social links, and availability wording.

### Phase 1 — Prepare project structure

- Status: `Not started`
- Notes: Add the backend/serverless route, profile data, environment template, and shared response format.

### Phase 2 — Build profile knowledge base

- Status: `Not started`
- Notes: Create the structured portfolio source of truth and static FAQ fallback.

### Phase 3 — Gemini Flash integration

- Status: `Not started`
- Notes: Add the server-side Gemini adapter, streaming, timeout, and error normalization.

### Phase 4 — Groq integration

- Status: `Not started`
- Notes: Add the independent server-side Groq adapter with a matching response format.

### Phase 5 — Provider router and failover

- Status: `Not started`
- Notes: Implement Gemini → retry → Groq → retry → static fallback.

### Phase 6 — Validation, rate limiting, and safety

- Status: `Not started`
- Notes: Protect the public endpoint and prevent misuse.

### Phase 7 — Chatbot widget

- Status: `Not started`
- Notes: Add the responsive floating UI matching the portfolio design.

### Phase 8 — Streaming responses

- Status: `Not started`
- Notes: Render provider output progressively with cancellation support.

### Phase 9 — Testing

- Status: `Not started`
- Notes: Test normal questions, unknown questions, abuse cases, and provider failures.

### Phase 10 — Deployment

- Status: `Not started`
- Notes: Configure production secrets, origin, alerts, and deployment verification.

### Phase 11 — Monitoring and maintenance

- Status: `Not started`
- Notes: Track health and keep profile data current.

## Status values

- `Not started` — no implementation work completed.
- `In progress` — currently being implemented.
- `Blocked` — requires an external decision, credential, or dependency.
- `Needs review` — implemented but awaiting testing or user approval.
- `Complete` — implemented and verified.

## Environment checklist

- [ ] `GEMINI_API_KEY` configured locally.
- [ ] `GEMINI_MODEL` selected.
- [ ] `GROQ_API_KEY` configured locally.
- [ ] `GROQ_MODEL` selected.
- [ ] `.env` files ignored by Git.
- [ ] No real keys committed.
- [ ] Production environment variables configured only after local verification.

## Verification checklist

- [ ] Gemini answers a known portfolio question.
- [ ] Groq answers when Gemini is unavailable.
- [ ] Static fallback answers when both providers are unavailable.
- [ ] Invalid and oversized input is rejected.
- [ ] Rate limiting works.
- [ ] API keys are absent from browser source and network responses.
- [ ] Chatbot works on desktop.
- [ ] Chatbot works on mobile.
- [ ] Keyboard navigation works.
- [ ] Project, GitHub, LinkedIn, email, and resume actions work.
- [ ] Production deployment is verified.

## Change log

### 2026-08-24

- Created the phased implementation plan.
- Selected Gemini Flash as the primary provider.
- Selected Groq as the independent fallback provider.
- Defined a local static fallback for full provider failure.
- Created this implementation status tracker.
