# Frontend Engineer — Master Prompt for Codex

> Copy this entire file into Codex as your initial prompt. Read EVERYTHING before writing any code.

---

## Who You Are

You are the **frontend engineer** on a 2-person hackathon team building the **WealthOS Wealth Wellness Hub** — an institutional wealth adviser intelligence terminal. You own **all frontend code** in `src/app/`, `src/components/`, and `src/app/globals.css`.

A backend engineer is working in parallel on `services/orchestrator/`. You must NOT touch any backend files. They own `src/lib/types.ts` and `src/lib/api.ts` — you read these but NEVER edit them.

---

## Critical Context — Read These Files First

Before writing ANY code, you MUST read and fully understand these files:

1. **`CLAUDE.md`** — Full project architecture, commands, module map
2. **`src/lib/types.ts`** — ALL TypeScript types for API responses (your data contracts)
3. **`src/lib/api.ts`** — ALL API call functions you will use (your backend interface)
4. **`src/app/layout.tsx`** — Root layout (Sidebar + main area)
5. **`src/app/globals.css`** — Theme variables, custom classes, color system
6. **`docs/plans/2026-03-11-wealth-wellness-hub-v2.md`** — Full implementation plan with frontend task list and demo script

---

## Commands

```bash
nvm use              # Node 22 (required — see .nvmrc)
npm install          # Install dependencies
npm run dev          # Dev server on http://localhost:3000
                     # Do NOT use npm run dev:turbopack — CSS breaks on Next 15.5.12
npm run build        # Production build — run this to verify before pushing
npm run lint         # ESLint check (next/core-web-vitals + next/typescript)
```

### Start the backend (separate terminal — needed for API calls):
```bash
cd services/orchestrator
pip install -e ".[dev]"
python3 -m uvicorn app.main:app --reload --port 8000
```

The backend runs at `http://127.0.0.1:8000`. All v2 endpoints use `/v2/` prefix.

---

## What This Project Already Has — UNDERSTAND BEFORE CHANGING

This is NOT a greenfield project. There is a fully working dashboard with 6 widgets, 3 workflow pages, a collapsible sidebar, and a complete UI primitive library. You are TRANSFORMING it, not rewriting it from scratch.

### Existing project structure:
```
src/
  app/
    layout.tsx              # Root layout: TooltipProvider → flex → Sidebar + <main>
    page.tsx                # Dashboard page: bento grid with 6 widgets
    globals.css             # Theme: oklch colors, glassmorphism, custom animations
    alerts/page.tsx         # Alerts page: "Run Alerts" button → alert cards
    planning/page.tsx       # Planning page: form + scenario analysis
    research/page.tsx       # Research page: query + answer + citations
    api/portfolio/route.ts  # GET endpoint returning mock-portfolio.json
  components/
    dashboard/
      net-worth-card.tsx    # Total net worth + trend + assets/liabilities
      portfolio-chart.tsx   # Recharts donut pie chart (5 categories)
      health-score.tsx      # SVG circular progress ring + 5 category bars
      asset-table.tsx       # Combined equities+crypto table sorted by value
      recent-transactions.tsx  # ScrollArea with 10 transactions
      market-overview.tsx   # 2×3 grid of hardcoded market indices
    shared/
      sidebar.tsx           # Collapsible sidebar with 4 nav items + user profile
    ui/                     # shadcn-style primitives (DO NOT REWRITE)
      avatar.tsx, badge.tsx, button.tsx, card.tsx, chart.tsx,
      dialog.tsx, input.tsx, scroll-area.tsx, separator.tsx,
      sheet.tsx, skeleton.tsx, table.tsx, tabs.tsx, tooltip.tsx
  data/
    mock-portfolio.json     # Alex Chen portfolio (v1 format, USD values)
    mock-transactions.json  # 15 sample transactions
  lib/
    api.ts                  # API call functions (v1 + v2) — DO NOT EDIT
    types.ts                # TypeScript types (v1 + v2) — DO NOT EDIT
    utils.ts                # cn() utility (clsx + tailwind-merge)
```

### Existing root layout (`src/app/layout.tsx`):
```typescript
// Dark mode enforced: <html className="dark">
// Fonts: Inter (--font-sans) + Geist Mono (--font-geist-mono)
// Structure: TooltipProvider → flex h-screen → Sidebar + <main className="flex-1 overflow-y-auto">
```

### Existing sidebar (`src/components/shared/sidebar.tsx`):
- Collapsible: 240px expanded, 68px collapsed via `useState(collapsed)`
- 4 nav items: Dashboard (`/`), Research (`/research`), Planning (`/planning`), Alerts (`/alerts`)
- Active route detection via `usePathname()`
- Footer: Avatar "AC" + "Alex Chen" + "Moderate Risk"
- Icons: LayoutDashboard, Search, Calculator, Bell
- Logo: TrendingUp icon in primary badge + "WealthOS" + "Wellness Hub"
- Uses Tooltip for collapsed state (shows label on hover)

### Existing dashboard page (`src/app/page.tsx`):
- NO state, NO API calls — pure composition component
- Header: "Good evening, Alex" + formatted date
- Bento grid: `grid gap-4 md:grid-cols-2 lg:grid-cols-4`
- 6 widgets with staggered animations: `opacity-0 animate-fade-in-up animate-delay-{100-500}`
- Grid spans: NetWorthCard (2 cols), PortfolioChart (2 cols), HealthScore (2 cols), MarketOverview (2 cols), AssetTable (2 tablet / 3 desktop), RecentTransactions (2 tablet / 1 desktop)

### Existing dashboard components (all read from static `mock-portfolio.json`):

**NetWorthCard** — `portfolioData.netWorth` → total net worth ($535,520), trend badge (+2.36%), assets/liabilities grid, monthly change. Uses gradient background `bg-gradient-to-br from-primary/10 via-card to-card`. Color logic: emerald if positive, rose if negative.

**PortfolioChart** — `portfolioData.assetAllocation` → Recharts `PieChart` (donut style, innerRadius 55, outerRadius 80, paddingAngle 3). 5 categories: Equities (emerald), Crypto (violet), Real Estate (cyan), Bank Deposits (amber), CPF (blue). Custom tooltip + right-side legend.

**HealthScore** — `portfolioData.healthScore` → SVG circle (radius 45, circumference 283) with animated stroke-dasharray. 5 category progress bars (savingsRate, debtRatio, diversification, emergencyFund, investmentGrowth). Color thresholds: emerald ≥80, amber ≥60, rose <60. Circle dimensions: `h-[120px] w-[120px]`.

**AssetTable** — `portfolioData.assets.equities` + `portfolioData.assets.crypto` merged and sorted by value desc. Columns: asset (symbol badge + name + shares/units), price, 24h change (Badge with TrendingUp/Down), total value. Uses Table primitives.

**RecentTransactions** — `transactions` from mock-transactions.json, first 10. ScrollArea `h-[280px]`. Transaction type → icon mapping: buy (ArrowDownRight/emerald), sell (ArrowUpRight/rose), deposit (Banknote/emerald), withdrawal (ArrowUpRight/rose), dividend (TrendingUp/amber), interest (TrendingUp/amber), payment (ArrowRightLeft/rose). Debit/credit prefix logic.

**MarketOverview** — Hardcoded `marketIndices` array: S&P 500 (5892.42, +0.84%), NASDAQ (19234.67, +1.12%), STI (3891.45, -0.23%), BTC (97850, +2.45%), ETH (3420, -1.34%), Gold (2987.30, +0.45%). Grid `grid-cols-2 gap-2`.

### Existing workflow pages (all "use client" with useState):

**Alerts** (`/alerts`) — 3 state vars: `result`, `error`, `isLoading`. Calls `runAlerts(4)`. Renders list of alert cards with headline, source, eventSummary, impactedHoldings, recommendation, currentPrice. Uses TriangleAlert icon (amber). Recommendation box: `border-emerald/20 bg-emerald/10`.

**Planning** (`/planning`) — 4 state vars: `question` (initialized to first suggested question), `result`, `error`, `isLoading`. 3 suggested questions as clickable buttons. Calls `queryPlanning(question)`. Two-column layout `grid gap-4 lg:grid-cols-[1.2fr_0.8fr]`. Renders: scenario name box, summary text, recommendation box (emerald), key metrics grid.

**Research** (`/research`) — 4 state vars: `question`, `result`, `error`, `isLoading`. 3 suggested prompts as clickable buttons. Calls `queryResearch(question)`. Two-column `grid gap-4 lg:grid-cols-[1.3fr_0.9fr]`. Renders: answer text + citations list with source/snippet.

### Existing theme system (`src/app/globals.css`):

**CSS custom properties** (defined in `@theme inline`):
- `--color-primary`: oklch(0.72 0.17 162) — cyan accent
- `--color-destructive`: oklch(0.65 0.2 15) — red
- Semantic colors: `--color-emerald: #34d399`, `--color-rose: #f43f5e`, `--color-amber: #f59e0b`, `--color-violet: #8b5cf6`, `--color-cyan: #22d3ee`
- Dark background: `--color-background: oklch(0.145 0 0)` (near-black)
- Card: `--color-card: oklch(0.178 0 0)` (dark gray)
- Border radius: `--radius: 0.75rem`

**Custom utility classes:**
- `.glass-card` — backdrop-blur-xl + translucent background + border
- `.glow-emerald` — emerald box-shadow glow
- `.animate-fade-in-up` — translateY(10px→0) + opacity(0→1) over 0.5s
- `.animate-delay-100` through `.animate-delay-500` — animation delays

**Scrollbar:** Thin (6px), dark thumb `oklch(0.3 0 0)`, transparent track

### Existing UI primitives (`src/components/ui/`):

These are shadcn-style components built on `@base-ui/react`. **DO NOT REWRITE THESE.** Re-style them if needed by adding Tailwind classes where you use them.

Available: `Avatar`, `Badge`, `Button`, `Card` (CardHeader, CardTitle, CardDescription, CardContent), `Chart` (Recharts wrappers), `Dialog`, `Input`, `ScrollArea`, `Separator`, `Sheet`, `Skeleton`, `Table` (TableHeader, TableBody, TableRow, TableHead, TableCell), `Tabs` (TabsList, TabsTrigger, TabsContent), `Tooltip` (TooltipTrigger, TooltipContent)

### Existing mock data shapes:

**`mock-portfolio.json`** (v1 — used by current dashboard):
```typescript
{
  clientProfile: { name, age, jurisdiction, riskTolerance, monthlyGrossIncome, ... },
  netWorth: { totalAssets, totalLiabilities, netWorth, monthlyChange, monthlyChangePercent },
  assets: {
    equities: [{ symbol, name, shares, avgCost, currentPrice, value, change24h }],
    crypto: [{ symbol, name, quantity, avgCost, currentPrice, value, change24h }],
    realEstate: { ... },
    bankDeposits: [{ ... }],
    cpf: { ordinary, special, medisave }
  },
  liabilities: [{ ... }],
  healthScore: { overall, categories: { savingsRate, debtRatio, diversification, emergencyFund, investmentGrowth } },
  assetAllocation: [{ category, value, percentage }]
}
```

**`mock-transactions.json`** — Array of 15 objects: `{ id, type, asset, description, date, category, amount }`

---

## API Endpoints You Will Call

All functions are already defined in `src/lib/api.ts`. Import them directly. **DO NOT EDIT `api.ts`.**

### v2 Client endpoints:
```typescript
import { getClients, getClientAnalytics, getClientWellness } from "@/lib/api";

// GET /v2/clients — list all 3 clients with summary data
const clients: ClientSummary[] = await getClients();
// Returns: [{ id, name, age, risk_profile, jurisdiction, net_worth_sgd, wellness_score, wellness_rating }]

// GET /v2/clients/{id}/analytics — full analytics for one client
const analytics: ClientAnalytics = await getClientAnalytics("alex_chen");
// Returns: { client_id, name, net_worth_sgd, gross_assets_sgd, total_liabilities_sgd,
//            allocation: { equities: 12.3, digital_assets: 24.9, ... },
//            liquid_reserves_sgd, liquidity_runway_months, dsr, diversification_score,
//            max_concentration, concentrated_holdings: ["Bitcoin"],
//            digital_asset_pct, digital_asset_level: "high", behavioral_resilience }

// GET /v2/clients/{id}/wellness — wellness score + 5 sub-scores + top risks
const wellness: WellnessResponse = await getClientWellness("alex_chen");
// Returns: { client_id, wellness_score: 71.3, rating: "Good",
//            sub_scores: { liquidity: {score, label}, debt_burden: {score, label},
//                          diversification: {score, label}, digital_safety: {score, label},
//                          concentration: {score, label} },
//            top_risks: ["Digital asset concentration (25% of gross assets)", ...] }
```

### v2 Event & Alert endpoints:
```typescript
import { getEvents, runEventImpact, generateAlertBrief } from "@/lib/api";

// GET /v2/events — list 3 seeded market events
const events: SeededEvent[] = await getEvents();
// Returns: [{ id, headline, body, source, timestamp, event_type }]

// POST /v2/events/impact — compute impact for a specific event on a specific client
const impact: ImpactManifest = await runEventImpact("evt_crypto_001", "alex_chen");
// Returns: { event_id, headline, matched_holdings: [{ ticker, name, value_sgd, exposure_pct }],
//            total_exposure_pct, severity: "CRITICAL"|"HIGH"|"MODERATE"|"LOW",
//            severity_rationale: "24.9% total exposure across 3 holding(s)..." }

// POST /v2/alerts/generate — generate an LLM-powered alert brief (has seeded fallback)
const brief: AlertBrief = await generateAlertBrief("evt_crypto_001", "alex_chen");
// Returns: { alert_id, subject, severity, brief (long text),
//            recommended_actions: ["Review digital asset allocation...", ...],
//            house_view_citations: [{ doc, excerpt }],
//            grounding_validated: true }
```

### v2 Copilot & Research endpoints:
```typescript
import { queryCopilot, searchResearch } from "@/lib/api";

// POST /v2/copilot/query — ask advisory question about a client
const response: CopilotResponse = await queryCopilot("alex_chen", "What are the top 3 actions?");
// Returns: { question, answer (long text),
//            structured_actions: [{ rank, action, rationale, urgency: "HIGH"|"MEDIUM"|"LOW" }],
//            research_used: [{ doc, score }],
//            grounding_validated: true }

// POST /v2/research/search — BM25 search over house-view documents
const results: ResearchSearchResponse = await searchResearch("crypto exposure risk");
// Returns: { query, results: [{ source, citation, snippet, score }] }
```

### Legacy v1 endpoints (still work, used by pages you haven't migrated yet):
```typescript
import { queryResearch, queryPlanning, runAlerts } from "@/lib/api";
// These call the old /research/query, /planning/query, /alerts/run endpoints
```

---

## Your Mission — 4 Pages to Transform

### Shared State: Active Client Context

Before building pages, create a React context for the active client. Every page needs to know which client is selected.

**Create `src/components/shared/client-context.tsx`:**
```typescript
"use client";
import { createContext, useContext, useState, type ReactNode } from "react";

type ClientContextType = {
  activeClientId: string;
  setActiveClientId: (id: string) => void;
};

const ClientContext = createContext<ClientContextType>({
  activeClientId: "alex_chen",
  setActiveClientId: () => {},
});

export function ClientProvider({ children }: { children: ReactNode }) {
  const [activeClientId, setActiveClientId] = useState("alex_chen");
  return (
    <ClientContext.Provider value={{ activeClientId, setActiveClientId }}>
      {children}
    </ClientContext.Provider>
  );
}

export function useActiveClient() {
  return useContext(ClientContext);
}
```

**Wrap in layout.tsx:** Add `<ClientProvider>` inside `<TooltipProvider>`, wrapping the flex container.

Now every page can call `const { activeClientId, setActiveClientId } = useActiveClient();`

---

### Page 1: `/` — Dashboard (Adviser Terminal)

**Current state:** Static composition page with "Good evening, Alex" + 6 widgets from mock JSON.

**What to change:**

1. **Header transformation:**
   - Remove: `"Good evening, Alex"` greeting and date
   - Add: `"Adviser Terminal"` title (text-lg font-semibold) + `ClientSelector` dropdown + active client summary (name + net worth + wellness badge)
   - The header should feel institutional: `"Adviser Terminal | Active Client: Alex Chen | SGD 1.15M | Wellness: 71 🟡"`

2. **Add `ClientSelector` component:**
   - On mount, call `getClients()` to load 3 clients
   - Render as a dropdown (use the existing `Button` component styled as a selector, or a simple `<select>`)
   - Each option: `"{name} — {wellness_rating} ({wellness_score})"` with color dot
   - On selection change, call `setActiveClientId(id)` from context
   - Color coding: green dot if wellness_score >= 80, amber if >= 60, red if < 60

3. **Add `WellnessScoreCard` component (NEW — most important new widget):**
   - On mount (and when activeClientId changes), call `getClientWellness(activeClientId)`
   - Circular SVG gauge (reuse the pattern from existing HealthScore component):
     - Circle radius 50, strokeWidth 8
     - Score in center: large `text-3xl font-bold font-mono`
     - Color: emerald >= 80, amber >= 60, rose < 60
   - Below gauge: 5 horizontal progress bars for sub-scores (liquidity, debt_burden, diversification, digital_safety, concentration)
     - Each bar: label (text-xs uppercase tracking-wider), score number (font-mono), progress bar (colored fill)
   - Below bars: `top_risks` list as Badge components with rose/amber styling
   - Rating label: "Good", "Excellent", etc. as a colored badge next to the score

4. **Add `BookOfBusiness` component:**
   - Call `getClients()` on mount
   - Render 3 client cards in a horizontal row or vertical stack
   - Each card: name, age, risk_profile badge, wellness_score (large number), wellness_rating
   - Click a card → `setActiveClientId(client.id)` → all widgets refresh
   - Active client card should have a highlighted border (primary color)
   - Place this at the top of the grid (spanning full width) or as a sidebar panel

5. **Keep existing widgets** but relabel:
   - "Portfolio Overview" → "Wealth Composition"
   - Keep NetWorthCard, PortfolioChart, AssetTable, RecentTransactions, MarketOverview as-is for now
   - They still read from static `mock-portfolio.json` — this is fine for the demo since the v2 analytics endpoint provides different data shapes. The key new visual is the WellnessScoreCard.
   - If you have time: update NetWorthCard to read from `getClientAnalytics(activeClientId)` for the net_worth_sgd value

6. **Grid layout update:**
   - Top row (full width): BookOfBusiness panel OR header with client selector
   - Second row: WellnessScoreCard (2 cols) + NetWorthCard (2 cols)
   - Third row: PortfolioChart (2 cols) + MarketOverview (2 cols)
   - Bottom row: AssetTable (3 cols) + RecentTransactions (1 col)

---

### Page 2: `/alerts` — Event-to-Impact Alert Centre (THE MOST IMPORTANT PAGE)

**Current state:** Simple "Run Alerts" button → list of alert cards.

**What to build (completely replace the page content):**

This page has 3 progressive states — the user clicks through each:

**State A — Event Feed (initial load):**
- On mount, call `getEvents()` to load 3 seeded events
- Render each as a clickable `EventCard`:
  - Headline (text-lg font-semibold)
  - Source badge (e.g., "Bloomberg", "Reuters") + timestamp (formatted)
  - Event type badge: `regulatory` (rose), `rate_decision` (amber), `trade_policy` (violet)
  - Body text (first 100 chars, truncated)
  - Hover: `bg-accent/50` + `cursor-pointer`
- Layout: vertical stack of 3 cards

**State B — Impact Manifest (after clicking an event):**
- Call `runEventImpact(selectedEventId, activeClientId)`
- Show loading spinner during API call
- Render `ImpactManifestPanel`:
  - Event headline at top
  - **Severity badge** (large, prominent):
    - CRITICAL: `bg-rose text-white` (pulsing animation optional)
    - HIGH: `bg-orange-500 text-white`
    - MODERATE: `bg-amber text-black`
    - LOW: `bg-emerald text-white`
  - **Holdings exposure table** (use Table primitive):
    - Columns: Ticker, Name, Value (SGD), Exposure (%)
    - Each row from `matched_holdings` array
    - Values in `font-mono`
  - **Total exposure**: large number `text-2xl font-mono font-bold`
  - **Severity rationale**: text block explaining the classification
  - **"Generate Adviser Brief" button**: `Button` with primary styling, prominent placement
  - **"Back to Events" link**: to return to State A

**State C — Alert Brief (after clicking "Generate Adviser Brief"):**
- Call `generateAlertBrief(selectedEventId, activeClientId)`
- Show loading spinner (this may take 3-5 seconds for LLM — spinner is essential)
- Render `AlertBriefPanel`:
  - **Subject line**: text-xl font-semibold, top of panel
  - **Severity badge**: same color coding as State B
  - **Brief text**: the main body paragraph(s), nicely formatted
  - **Recommended actions**: numbered list with checkmark icons, each action on its own line
  - **House view citations**: each as a card with doc name (bold) + excerpt (italic, smaller text)
  - **Grounding validated badge**: if `grounding_validated === true`, show a green checkmark badge: "✓ Grounded in house view"
  - **"Send to Client" button** (fake): on click, show a toast/notification: "Draft sent for compliance review" — does NOT call any API
  - **"Back to Impact" link**: to return to State B

**State management:**
```typescript
const [events, setEvents] = useState<SeededEvent[]>([]);
const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
const [impact, setImpact] = useState<ImpactManifest | null>(null);
const [brief, setBrief] = useState<AlertBrief | null>(null);
const [isLoadingImpact, setIsLoadingImpact] = useState(false);
const [isLoadingBrief, setIsLoadingBrief] = useState(false);
const [error, setError] = useState<string | null>(null);
// View state: "events" | "impact" | "brief"
const [view, setView] = useState<"events" | "impact" | "brief">("events");
```

---

### Page 3: `/planning` — Advisor Copilot

**Current state:** Form with 3 suggested questions → scenario analysis output.

**What to build (replace page content):**

**Top section — Client Context Panel:**
- On mount, call `getClientAnalytics(activeClientId)` and `getClientWellness(activeClientId)`
- Render a horizontal strip of key metrics:
  - Net Worth: `SGD {net_worth_sgd.toLocaleString()}` (text-2xl font-mono)
  - Wellness: `{wellness_score}/100` with colored badge
  - DSR: `{(dsr * 100).toFixed(1)}%`
  - Liquidity: `{liquidity_runway_months.toFixed(1)} months`
  - Top Risk: first item from `top_risks` array
- Styling: `bg-accent/20 rounded-lg p-4` with metrics in a flex row

**Middle section — Prompt Chips:**
- 4 pre-written questions as clickable buttons (use Button variant="outline"):
  1. `"What are the top 3 actions for this client this quarter?"`
  2. `"How exposed is this client to digital asset volatility?"`
  3. `"Can this client afford a property upgrade without hurting liquidity?"`
  4. `"What does our house view imply for the equity allocation?"`
- Below chips: freeform Input + "Ask" Button

**Bottom section — Response Panel:**
- On chip click or form submit: call `queryCopilot(activeClientId, question)`
- Show loading spinner during call
- Render:
  - **Answer text**: the main paragraph (well-formatted, possibly multi-paragraph)
  - **Structured actions** as ranked cards:
    - Each card: rank number (large, left side), action text (bold), rationale (smaller), urgency badge
    - Urgency colors: HIGH = rose, MEDIUM = amber, LOW = emerald
    - Cards in vertical stack
  - **Research used**: small section showing doc names + scores as badges
  - **Grounding badge**: "✓ Grounded" if `grounding_validated === true`

---

### Page 4: `/research` — House View Research Navigator

**Current state:** Research query with answer text + citations in two columns.

**What to build:**

This is the simplest page. Don't spend more than 2 hours here.

1. **Full-width search bar** at top (Input component, large, prominent)
2. **Below search**: show 3 document cards (hardcoded names — the corpus is fixed):
   - "Singapore Household Liquidity" — `singapore-household-liquidity.md`
   - "Digital Asset Risk Playbook" — `digital-asset-risk-playbook.md`
   - "Asia Tech Equity Outlook" — `asia-tech-equity-outlook.md`
   - Each card: doc title, brief description, "House View" badge

3. **On search submit**: call `searchResearch(query)`
4. **Results panel**: vertical list of result cards:
   - Each card: source name (bold), citation reference, snippet text, BM25 score as a badge (e.g., "Score: 0.89")
   - Sort by score descending (API already does this)
   - No LLM synthesis — just raw search results

---

## New Components To Create

Create in `src/components/adviser/` (new directory):

| Component | File | Props | Data Source |
|-----------|------|-------|-------------|
| `ClientProvider` | `src/components/shared/client-context.tsx` | `{ children }` | None (context provider) |
| `ClientSelector` | `client-selector.tsx` | None (reads context) | `getClients()` |
| `BookOfBusiness` | `book-of-business.tsx` | None (reads context) | `getClients()` |
| `WellnessScoreCard` | `wellness-score-card.tsx` | None (reads context) | `getClientWellness(id)` |
| `EventCard` | `event-card.tsx` | `{ event: SeededEvent, onClick }` | None (display only) |
| `ImpactManifestPanel` | `impact-manifest-panel.tsx` | `{ impact: ImpactManifest, onGenerateBrief, onBack }` | None (display only) |
| `AlertBriefPanel` | `alert-brief-panel.tsx` | `{ brief: AlertBrief, onBack }` | None (display only) |
| `CopilotPanel` | `copilot-panel.tsx` | `{ clientId: string }` | `queryCopilot(id, q)` |
| `ResearchResultCard` | `research-result-card.tsx` | `{ result: ResearchResult }` | None (display only) |

---

## Visual Design System — Institutional Dark Mode

### The aesthetic target:
Bloomberg Terminal / Addepar — NOT a consumer fintech app. Data-dense, sharp, professional.

### Color rules:
```
Backgrounds:     bg-zinc-950 (page), bg-zinc-900 (cards), bg-zinc-800/50 (hover)
Text:            text-zinc-50 (primary), text-zinc-400 (secondary), text-zinc-500 (muted labels)
Borders:         border-zinc-800 (default), border-zinc-700 (hover), border-primary/30 (accent)
Accent:          The existing primary color (cyan oklch) for active states and highlights
Numbers:         ALWAYS font-mono — this is non-negotiable for financial data
Severity:        emerald (LOW/good), amber (MODERATE/warning), orange-500 (HIGH), rose (CRITICAL/bad)
Wellness:        emerald >= 80, amber >= 60, rose < 60
```

### Typography rules:
```
Page titles:     text-lg font-semibold tracking-tight
Section headers: text-sm font-semibold uppercase tracking-wider text-zinc-500
Large metrics:   text-2xl md:text-3xl font-bold font-mono
Medium metrics:  text-lg font-semibold font-mono
Small labels:    text-xs uppercase tracking-wider text-zinc-500
Body text:       text-sm text-zinc-300
Badges:          text-xs font-medium px-2 py-0.5 rounded
```

### Layout rules:
```
Page padding:    p-6 lg:p-8
Card padding:    p-4 (dense) or p-6 (standard)
Card borders:    border border-zinc-800 rounded-lg (sharper than current rounded-xl)
Grid gaps:       gap-3 (dense) or gap-4 (standard)
Hover states:    Always add hover:bg-zinc-800/50 transition-colors on interactive elements
```

### What to change from current styling:
- Reduce `border-radius` — current uses `rounded-xl`, switch to `rounded-lg` or even `rounded-md`
- Reduce padding — current cards are spacious, make them denser
- Remove casual language ("Good evening") — replace with institutional telemetry
- Add `font-mono` to ALL numbers (prices, percentages, scores, SGD values)
- Make severity colors more prominent (larger badges, bolder)

---

## Golden-Path Demo Flow — THIS MUST WORK PERFECTLY

The presenter will follow this exact sequence during the 5-minute hackathon pitch:

**[0:00-0:45] Dashboard**
1. Open `http://localhost:3000` → Adviser Terminal loads
2. See Book of Business: Alex Chen (🟡 ~71), Priya Sharma (🔴 ~54), David Lim (🟢 ~82)
3. Alex is selected by default → WellnessScoreCard shows score + 5 sub-scores + top risks
4. Dashboard widgets show wealth composition data

**[0:45-2:00] Alerts (THE WOW MOMENT)**
5. Click "Alerts" in sidebar → 3 event cards appear
6. Click "Bitcoin drops 18% amid sweeping US regulatory crackdown"
7. Impact manifest appears: BTC, ETH, SOL exposure, severity badge "CRITICAL", exact SGD values
8. Click "Generate Adviser Brief"
9. 3-5 second spinner → brief appears with subject, body text, recommended actions, house view citations, "✓ Grounded" badge
10. (Optional) Click "Send to Client" → toast appears

**[2:00-3:30] Copilot**
11. Click "Planning" in sidebar → client context metrics load at top
12. Click chip "What are the top 3 actions for this client this quarter?"
13. 3-5 second spinner → structured response with ranked actions, each citing specific metrics

**[3:30-4:15] Research**
14. Click "Research" in sidebar → search bar + 3 doc cards
15. Type "crypto exposure risk" → submit → BM25 results appear with scores

**[4:15-5:00] Presenter talks about architecture (no UI interactions needed)**

### Priority if running out of time:
1. **Alerts page** — MUST work (States A → B → C)
2. **Dashboard** — MUST have WellnessScoreCard + ClientSelector
3. **Copilot page** — HIGH priority (prompt chips + response)
4. **Research page** — lowest priority (simple search + results)

---

## Error Handling Pattern

NEVER show raw error messages or error toasts for background API calls. Use this pattern:

```typescript
const [data, setData] = useState<T | null>(null);
const [isLoading, setIsLoading] = useState(false);

async function loadData() {
  setIsLoading(true);
  try {
    const result = await apiCall();
    setData(result);
  } catch {
    // Show skeleton or fallback UI, NOT an error message
    setData(null);
  } finally {
    setIsLoading(false);
  }
}

// In JSX:
{isLoading ? <Skeleton className="h-40 w-full" /> : data ? <RenderData data={data} /> : <EmptyState />}
```

---

## Loading States — CRITICAL FOR DEMO

A 3-second wait with a spinner looks intentional. A 3-second wait without one looks broken.

**Add loading spinners to:**
- `getClientWellness()` in WellnessScoreCard
- `getClientAnalytics()` in Copilot context panel
- `runEventImpact()` in alerts page (State A → B transition)
- `generateAlertBrief()` in alerts page (State B → C transition) — THIS ONE IS THE MOST IMPORTANT
- `queryCopilot()` in copilot page

**Simple spinner component (or use Skeleton):**
```typescript
function Spinner() {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-700 border-t-primary" />
    </div>
  );
}
```

---

## Git Rules

- Work on `main` branch directly (no feature branches — hackathon speed)
- Always `git pull --rebase` before committing and pushing
- Commit frequently with descriptive messages: `feat: rebuild alerts page with event-to-impact flow`
- Never commit `.env.local` or API keys (`.env*` is gitignored)
- `npm run build` must pass before pushing — broken builds block the other engineer

---

## File Ownership — NEVER Touch These

```
services/orchestrator/**    ← backend engineer's territory
src/lib/types.ts            ← shared contract, owned by backend engineer
src/lib/api.ts              ← shared contract, owned by backend engineer
src/data/mock-portfolio.json  ← backend engineer may modify
src/data/mock-transactions.json
CLAUDE.md                   ← backend engineer maintains
```

You DO own and should modify:
```
src/app/layout.tsx          ← add ClientProvider wrapper
src/app/page.tsx            ← transform dashboard
src/app/alerts/page.tsx     ← rebuild completely
src/app/planning/page.tsx   ← rebuild as copilot
src/app/research/page.tsx   ← upgrade with BM25 search
src/app/globals.css         ← adjust theme if needed
src/components/shared/      ← add client-context.tsx, update sidebar if needed
src/components/dashboard/   ← keep existing, add new widgets
src/components/adviser/     ← new directory for v2 components
```

---

## Coordination With Backend Engineer

- Both push to `main` — always `git pull --rebase` first
- If a v2 endpoint returns 404 or 500, the backend task may not be deployed yet — use a try/catch and show skeleton UI
- The backend serves seeded/fallback data even without an LLM API key — all endpoints return valid data immediately
- If you need a field added to an API response, ask the backend engineer — do not modify `types.ts` yourself
- The backend will finish the core endpoints (Tasks 1-12) by end of Day 1. You should focus on dashboard + alerts on Day 2 morning, then copilot + research in the afternoon.

---

## Verification Checklist

Before considering your work done:

1. `npm run lint` passes
2. `npm run build` passes (no TypeScript errors, no missing imports)
3. Golden-path demo flow works end-to-end (all 15 steps above)
4. All loading spinners appear during API calls
5. No raw error messages shown to user
6. All financial numbers use `font-mono`
7. Severity badges are color-coded correctly
8. Sidebar navigation works between all 4 pages
9. Client selector changes propagate to all pages
10. "Send to Client" fake button shows toast notification
