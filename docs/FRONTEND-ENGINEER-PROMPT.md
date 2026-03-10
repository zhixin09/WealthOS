# Frontend Engineer — Master Prompt for Codex

> Copy this entire file into Codex as your initial prompt.

---

## Context

You are working on the **WealthOS Wealth Wellness Hub** — a hackathon project that transforms a retail portfolio dashboard into an institutional adviser intelligence terminal. You own the **frontend only** (`src/` directory). A backend engineer is building the FastAPI backend in parallel.

## Your Codebase

This is a **Next.js 15 App Router** project with React 19, TypeScript, Tailwind CSS 4, Recharts, Lucide icons, and shadcn-style UI primitives. Dark mode only.

### Key files you should read first:
- `CLAUDE.md` — full project architecture and commands
- `src/lib/types.ts` — **ALL API response types** (your data contracts)
- `src/lib/api.ts` — **ALL API call functions** (your backend interface)
- `src/app/layout.tsx` — root layout with sidebar
- `src/app/globals.css` — theme variables and custom classes
- `docs/plans/2026-03-11-wealth-wellness-hub-v2.md` — full implementation plan with your task list

### Commands:
```bash
nvm use          # Node 22
npm install
npm run dev      # Do NOT use dev:turbopack — CSS breaks
npm run build
npm run lint
```

### Backend (run in separate terminal):
```bash
cd services/orchestrator
pip install -e ".[dev]"
python3 -m uvicorn app.main:app --reload --port 8000
```

The backend runs at `http://127.0.0.1:8000`. All v2 endpoints are prefixed with `/v2/`.

---

## Your Mission

Transform the existing retail dashboard into a **dark, data-dense, institutional adviser terminal** (think Bloomberg/Addepar aesthetic). Rebuild 4 pages against the new v2 API endpoints.

### Rules:
1. **NEVER touch** files in `services/orchestrator/` — that's the backend engineer's territory
2. **NEVER edit** `src/lib/types.ts` or `src/lib/api.ts` — those are the shared contracts owned by the backend engineer. If you need a change, ask.
3. **DO reuse** existing `src/components/ui/` primitives (Card, Badge, Table, etc.) — re-style them, don't rewrite them
4. **DO keep** the existing component structure — add new components alongside existing ones
5. **Pull before push:** Always `git pull --rebase` before pushing to avoid conflicts

---

## API Endpoints You Will Call

All functions are already defined in `src/lib/api.ts`. Import and use them directly.

### Client endpoints:
```typescript
getClients(): Promise<ClientSummary[]>
// GET /v2/clients — returns 3 clients with id, name, wellness_score, wellness_rating

getClientAnalytics(clientId: string): Promise<ClientAnalytics>
// GET /v2/clients/{id}/analytics — full analytics: net_worth, allocation, dsr, concentration, etc.

getClientWellness(clientId: string): Promise<WellnessResponse>
// GET /v2/clients/{id}/wellness — wellness_score, 5 sub_scores, top_risks
```

### Event & Alert endpoints:
```typescript
getEvents(): Promise<SeededEvent[]>
// GET /v2/events — returns 3 seeded market events

runEventImpact(eventId: string, clientId: string): Promise<ImpactManifest>
// POST /v2/events/impact — returns matched_holdings, total_exposure_pct, severity

generateAlertBrief(eventId: string, clientId: string): Promise<AlertBrief>
// POST /v2/alerts/generate — returns brief, recommended_actions, house_view_citations
```

### Copilot & Research endpoints:
```typescript
queryCopilot(clientId: string, question: string): Promise<CopilotResponse>
// POST /v2/copilot/query — returns answer, structured_actions, research_used

searchResearch(query: string, limit?: number): Promise<ResearchSearchResponse>
// POST /v2/research/search — returns ranked results with BM25 scores
```

---

## Pages To Build

### 1. `/` — Dashboard (Adviser Terminal)

**Current state:** Retail dashboard with "Good evening, Alex" header and 6 widgets reading from static JSON.

**Target state:**
- **Header:** Replace greeting with `Adviser Terminal | Active Client: [ClientSelector dropdown]`
- **ClientSelector:** Dropdown that calls `getClients()`, shows 3 clients with wellness badges (color-coded: green >= 80, amber >= 60, red < 60)
- **WellnessScoreCard:** New component — circular SVG gauge (0-100) with 5 sub-score progress bars (liquidity, debt_burden, diversification, digital_safety, concentration). Calls `getClientWellness(clientId)`.
- **Book of Business panel:** Mini sidebar or top panel showing all 3 clients: name, risk profile, wellness score badge
- **Keep existing widgets** (NetWorthCard, PortfolioChart, AssetTable, etc.) but update them to read from `getClientAnalytics(clientId)` instead of static JSON import when the v2 endpoint is ready. If v2 data doesn't map cleanly to the old widget props, keep the old static data for now and focus on the new components.
- **Relabel:** "Portfolio Overview" → "Wealth Composition", remove casual language

**Visual pivot:**
- Enforce `bg-zinc-950` background, `text-zinc-50` text
- Sharp edges (reduce border-radius), minimal padding, dense grid
- Use monospace font for numbers (`font-mono`)
- Keep glassmorphism but make it more subtle

### 2. `/alerts` — Event-to-Impact Alert Centre

**Current state:** Simple "Run Alerts" button that shows alert cards.

**Target state:**
1. **Event feed panel** (left or top): Load with `getEvents()`. Show each event as a clickable card with headline, source, severity icon, timestamp.
2. **Click event** → call `runEventImpact(eventId, clientId)` → show **Impact Manifest Panel**:
   - Severity badge (color-coded: CRITICAL=red, HIGH=orange, MODERATE=amber, LOW=green)
   - Holdings exposure table (ticker, name, value_sgd, exposure_pct)
   - Total exposure percentage
   - Severity rationale text
3. **"Generate Adviser Brief" button** → call `generateAlertBrief(eventId, clientId)` → show **Alert Brief Panel**:
   - Subject line
   - Brief text (main body)
   - Recommended actions as a numbered list
   - House view citations with doc name and excerpt
   - "grounding_validated" green checkmark badge
4. **"Send to Client" button** (fake) → show toast: "Draft sent for compliance review"

**This is the WOW moment in the demo.** Make the transition from event → impact → brief feel smooth and fast. Add loading spinners for the API calls.

### 3. `/planning` — Advisor Copilot

**Current state:** Planning scenario form with 3 suggested questions.

**Target state:**
1. **Client context panel** (top or sidebar): Auto-load `getClientAnalytics(clientId)` and show key metrics: net worth, wellness score, top risks, dsr, liquidity runway
2. **4 prompt chips** (clickable buttons, pre-written):
   - "What are the top 3 actions for this client this quarter?"
   - "How exposed is this client to digital asset volatility?"
   - "Can this client afford a property upgrade without hurting liquidity?"
   - "What does our house view imply for the equity allocation?"
3. **Freeform input** below the chips
4. **Click chip or submit** → call `queryCopilot(clientId, question)` → show **Response Panel**:
   - Answer text (main body)
   - Structured actions as ranked cards (rank number, action, rationale, urgency badge)
   - Research used section (doc name + score)
   - "grounding_validated" badge

### 4. `/research` — House View Research Navigator

**Current state:** Research query with answer + citations layout.

**Target state:**
1. **Full-width search bar** (prominent, top of page)
2. **Below search:** Show 3 available house-view docs as cards with metadata (title, first line preview)
3. **Type query + submit** → call `searchResearch(query)` → show **Results Panel**:
   - Each result: doc title, excerpt, relevance score badge (e.g., "0.89"), citation reference
   - Sort by score descending
4. **No LLM synthesis** on this page — just raw BM25 results. Keep it clean and fast.

---

## New Components To Create

All in `src/components/dashboard/` or a new `src/components/adviser/` directory:

| Component | Purpose |
|-----------|---------|
| `ClientSelector` | Dropdown loading from `getClients()`, emits selected client ID |
| `WellnessScoreCard` | Circular gauge (0-100) + 5 sub-score bars + top risks list |
| `BookOfBusiness` | Mini panel showing 3 clients with name + wellness badge |
| `EventCard` | Clickable event card with headline, source, timestamp |
| `ImpactManifestPanel` | Holdings table + severity badge + exposure stats |
| `AlertBriefPanel` | Formatted brief with citations and action list |
| `CopilotPanel` | Prompt chips + response display with ranked actions |
| `ResearchResultCard` | Single search result with score badge and excerpt |

---

## Visual Reference (Institutional Dark Mode)

```
Colors to use:
- Background: zinc-950, zinc-900
- Text: zinc-50, zinc-400 (secondary)
- Borders: zinc-800
- Accent: cyan/primary (oklch(0.72 0.17 162))
- Severity: emerald (low), amber (moderate), orange (high), rose (critical)
- Numbers: font-mono, slightly larger than body text

Typography:
- Headers: font-semibold, tracking-tight
- Metrics: font-mono, text-2xl or text-3xl
- Labels: text-xs, uppercase, tracking-wider, text-zinc-500
```

The dashboard should feel like a Bloomberg terminal — data-dense, sharp edges, minimal whitespace, lots of numbers visible at a glance. NOT a consumer fintech app.

---

## Golden-Path Demo Flow

This is the exact sequence the presenter will follow during the 5-minute demo. Every page transition and button click must work flawlessly for this path:

1. Open `/` → see 3 clients in Book of Business → click Alex Chen → analytics + wellness load
2. Navigate to `/alerts` → see 3 event cards → click "Bitcoin drops 18%..." → impact manifest appears → click "Generate Brief" → brief appears with citations
3. Navigate to `/planning` → click "Top 3 actions" chip → structured response appears
4. Navigate to `/research` → search "crypto exposure risk" → BM25 results appear

**Priority order if running out of time:** Alerts page > Dashboard > Copilot page > Research page

---

## State Management Pattern

Use `useState` + `useEffect` for each page. Active client ID should be stored in a shared way (React context or URL query param) so all pages know which client is selected. Simplest approach:

```typescript
// In layout or a context provider:
const [activeClientId, setActiveClientId] = useState("alex_chen");
```

Pass down via context or props. Every v2 API call takes `clientId` as a parameter.

---

## Coordination With Backend Engineer

- Backend engineer pushes code to `main` directly
- You push to `main` directly
- Always `git pull --rebase` before pushing
- If an endpoint returns 404 or 500, the backend may not have deployed that task yet — check with the backend engineer
- The backend serves seeded/fallback data even without an LLM API key, so all endpoints should return valid responses immediately

---

## Do This / Don't Do This

**DO:**
- Add loading spinners to all API calls (a 3s spinner looks intentional, 3s without looks broken)
- Use `font-mono` for all financial numbers
- Color-code severity badges (emerald/amber/orange/rose)
- Make clickable elements obvious (hover states, cursor-pointer)
- Keep the existing sidebar navigation — just update labels if needed
- Test with `npm run build` before considering anything done

**DON'T:**
- Don't build a real auth system — hardcode "alex_chen" as default client
- Don't add new npm dependencies unless absolutely necessary
- Don't spend more than 2 hours on the research page — it's the lowest-priority demo page
- Don't add animations that slow down the perceived response time
- Don't show raw error messages to the user — show a skeleton or "Loading..." state instead
