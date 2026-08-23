# Chatbot Implementation Status

Last updated: 2026-08-24

## Current status

Phase 0 is in progress. The portfolio has been audited as the initial source of truth; a few contact and resume details still need confirmation before the knowledge base is finalized.

AI providers selected:

- Primary: Gemini Flash
- Fallback: Groq
- Final emergency fallback: local static portfolio responses

## Phase tracker

### Phase 0 — Confirm scope and content

- Status: `Needs review`
- Notes: Portfolio facts and chatbot boundaries are documented below. Resume and placeholder social links need confirmation.

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

## Phase 0 decisions and findings

### Live-site verification

- Verified the deployed portfolio at `https://yashrajagawane.dev/`.
- The deployed content matches the repository's current profile, skills, projects, experience, and contact sections.
- The deployed site confirms that the resume link is still `#resume` and does not resolve to a resume resource.
- The deployed site confirms that Instagram, WhatsApp, and Telegram links are generic or incomplete destinations.
- The chatbot knowledge source will include only verified links and facts from the live portfolio.
- The chatbot will omit unavailable resume and unverified social actions until valid destinations are supplied.

### Approved source of truth

- Use the current portfolio content as the initial approved knowledge source.
- Use only information visible in `index.html`, the project links, and the finalized profile data file.
- Do not invent experience, awards, employment history, metrics, or achievements.

### Assistant tone

- Professional, friendly, concise, and recruiter-focused.
- Identify itself as Yashraj's portfolio assistant, not as Yashraj himself.
- Answer in English for the first release because the current portfolio content is written in English.
- Refuse or redirect questions that are unrelated to the portfolio when the answer is not available in the approved data.

### Approved chatbot topics

- Yashraj's profile and biography.
- B.Tech Information Technology education and current third-year status shown in the portfolio.
- Technical skills and interests.
- Featured projects, technologies, GitHub links, and live demos.
- The experience section's current statement that Yashraj is building experience.
- Collaboration and internship inquiries.
- Approved contact and social links.

### Contact findings

- Approved contact email: `agawaneyash865@gmail.com`.
- Approved GitHub profile: `https://github.com/yashrajagawane`.
- Approved LinkedIn profile: `https://www.linkedin.com/in/yashraj-agawane/`.
- Instagram, WhatsApp, and Telegram URLs currently contain placeholders or generic destinations and must not be presented as verified contact options.
- The resume button currently points to `#resume`, but no resume section or file is present. The chatbot must not promise a resume download until a valid URL or file is supplied.

### Wording cleanup required before knowledge-base finalization

- Correct the surname typo in the page title and meta description: `Agawnae` → `Agawane`.
- Correct visible `Al` typos to `AI` in project and typing text.
- Confirm whether the portfolio should state that Yashraj is currently open to internships, collaborations, or both.

### Phase 0 review items

- [ ] Confirm the valid resume URL or resume file.
- [ ] Confirm real Instagram, WhatsApp, and Telegram links, or remove those options.
- [ ] Confirm internship/collaboration availability wording.
- [x] Confirm initial chatbot language: English.
- [x] Confirm initial chatbot tone: professional, friendly, concise.
- [x] Confirm Gemini Flash as primary provider and Groq as fallback provider.

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

### Phase 0 audit

- Audited the portfolio as the chatbot's initial approved source of truth.
- Defined the first-release tone, language, and answer boundaries.
- Identified the missing resume destination and placeholder social links.
- Identified title and `AI` wording corrections for the knowledge-base preparation phase.
