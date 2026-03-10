# WealthOS Product Strategy Brief

This is the canonical strategy document for WealthOS.

Use this file to understand:

- what WealthOS is trying to become
- who it is for
- which workflows matter most
- which features belong in the product
- what exists in the repo today versus what is still vision

For local setup and commands, use [README.md](../README.md).
For the technical system map, use [architecture.md](architecture.md).
For active handoff notes, use [worklog.md](worklog.md).

## What WealthOS Is

WealthOS is a modular intelligence and workflow layer for investment banks, private banks, and asset managers.

It is not meant to replace Bloomberg, order management systems, custodian feeds, compliance systems, internal research portals, or portfolio spreadsheets overnight. It sits on top of those systems and connects data that is currently fragmented across tools, teams, and asset classes.

The product goal is to reduce the manual cognitive work involved in:

- understanding fragmented client portfolios
- tracking investment positions across expanding asset classes
- monitoring the investment universe
- connecting current market events to actual portfolio impact
- navigating proprietary research
- drafting investment pitches and recommendations with evidence

WealthOS should feel like a portfolio intelligence operating layer, not just another dashboard.

## Who It Is For

### Primary User

Portfolio managers at investment banks, private banks, and asset managers.

They need to:

- understand client exposures quickly
- monitor wallet and portfolio drift
- compare portfolio state against mandate, risk, and current market conditions
- produce rebalance recommendations with clear reasoning

### Secondary Users

Relationship managers and wealth managers.

They need to:

- move quickly from portfolio context to research context
- understand what to pitch and why now
- prepare client-facing explanations grounded in market conditions and house views

### Additional Stakeholders

- CIO or investment committee teams
- research teams
- risk and compliance reviewers
- operations teams supporting portfolio workflows

### Economic Buyer

The institution itself: investment banks, private banks, wealth platforms, and asset managers that want higher portfolio-manager productivity, better research utilisation, and less fragmented decision-making.

## Core Problem

The main problem is fragmented data.

Institutional portfolio teams are forced to work across:

- multiple custodians and account views
- multiple asset classes
- different internal data schemas
- bank research portals
- Bloomberg terminals and market data products
- research websites and house views
- spreadsheets that become the real operating layer

This creates several painful consequences:

### 1. Fragmented Portfolio Visibility

Teams struggle to maintain one live, coherent view of:

- client holdings
- wallets and sub-accounts
- liquid versus illiquid exposure
- cross-asset allocation
- concentration
- mandate and suitability context

### 2. Manual Rebalancing Work

Rebalancing is not just a math problem. It requires combining:

- position data
- asset-class context
- client objectives
- risk tolerance
- liquidity constraints
- internal views and current market conditions

This is often handled across spreadsheets, slide decks, and fragmented judgment calls.

### 3. Investment-Universe Sprawl

Banks and asset managers are expanding the range of investment vehicles they offer:

- equities
- fixed income
- funds
- structured products
- alternatives
- private markets
- digital assets

The investment universe is wider than the tooling used to track it.

### 4. Proprietary Research Is Hard To Navigate

Valuable internal research exists, but it is trapped across:

- research portals
- PDFs
- notes
- email distributions
- spreadsheets
- legacy repositories

Portfolio teams and wealth managers often know the research exists, but cannot navigate it quickly enough during real workflow moments.

### 5. Pitch Preparation Is Too Manual

When a manager wants to pitch a new name, theme, or allocation change, they must manually combine:

- client context
- existing exposure
- latest market news
- internal research
- external market context
- house view or tactical view

That work is high-value but slow, repetitive, and hard to scale.

## Product Thesis

WealthOS should solve this by becoming the institutional workflow layer that connects portfolio state, research context, and market context in one place.

The thesis is:

- fragmented financial context can be normalized enough to support better decision workflows
- AI is useful when it is grounded in structured data, current events, and proprietary context
- institutional users will trust the system only if it is traceable, modular, and human-approved

This means WealthOS should not behave like a black-box autonomous trader.

It should behave like a governed intelligence layer that helps professionals:

- see the portfolio clearly
- monitor what matters
- draft better rebalance and pitch decisions faster

## Product Approach

### 1. Sit Above Existing Systems

WealthOS should integrate across the institution’s existing stack rather than attempt to replace it all.

Examples include:

- Bloomberg
- S2i and other research platforms
- OMS platforms
- custodian feeds
- portfolio systems
- internal research repositories
- spreadsheets that still hold critical working state

### 2. Normalize Context, Not Just Data

The product should not only collect data. It should normalize working context:

- client and mandate context
- position and wallet context
- universe coverage context
- research relevance context
- market event context

### 3. Use Specialized Workflows

The product should use specialized agents or controllers for distinct jobs, rather than one generic assistant.

Examples:

- portfolio insight workflow
- universe monitoring workflow
- research navigation workflow
- pitch drafting workflow

### 4. Keep Human Approval In The Loop

No autonomous execution.

Every meaningful output should be:

- inspectable
- source-backed
- reviewable
- editable by a human before use

### 5. Design For Institutional Trust

That requires:

- source trails
- auditability
- modular workflow boundaries
- explainability
- compliance-aware output design

## Core Workflows

### 1. Portfolio Command

This is the main workflow and should become the core product surface.

### User

Portfolio manager.

### Goal

Give the PM one working view across fragmented client portfolios so they can understand, streamline, and rebalance faster.

### Inputs

- client accounts and wallets
- positions across asset classes
- allocation targets
- mandate rules
- risk profile
- liquidity and liability context
- current market conditions

### Core Jobs

- unify fragmented holdings into one coherent portfolio view
- identify drift, concentration, and liquidity issues
- highlight mandate or suitability mismatches
- surface cross-asset exposures
- propose rebalance ideas with rationale
- connect proposed changes to research and market context

### Expected Output

- portfolio health view
- rebalance draft
- rationale tied to exposures and market conditions
- explicit watchpoints and approval points

### 2. Universe Monitor

This is the second core workflow.

### User

Portfolio manager and investment teams.

### Goal

Track the expanding investment universe and connect new information to the actual book of business.

### Inputs

- internal research
- market headlines
- house views
- issuer and sector developments
- watchlists
- owned positions
- candidate positions

### Core Jobs

- monitor relevant assets and themes
- connect new information to impacted clients, books, or mandates
- reduce the need to search across research systems manually
- keep the PM aware of what changed and why it matters

### Expected Output

- event-triggered alerts
- impacted holdings or watchlist names
- suggested follow-up actions
- linked research and supporting evidence

### 3. Pitch Copilot

This is a downstream but important workflow.

### User

Relationship manager or portfolio manager preparing a recommendation.

### Goal

Draft a high-quality pitch grounded in live market conditions, internal research, and client-specific context.

### Inputs

- target security, theme, or allocation change
- current market news
- proprietary research
- current portfolio and exposure context
- client mandate and risk profile

### Core Jobs

- synthesize why the opportunity matters now
- explain fit within the client’s broader portfolio
- surface risks and objections
- produce a draft narrative that can be reviewed and edited

### Expected Output

- pitch draft
- research-backed talking points
- risks and caveats
- client-fit rationale

## Full Feature Breakdown

### 1. Unified Portfolio And Wallet Layer

Purpose:

- create one coherent view across accounts, wallets, custodians, and asset classes

Capabilities:

- aggregate holdings across multiple containers
- classify positions by asset class, strategy, liquidity, and risk bucket
- map accounts to client, mandate, and portfolio objectives
- track allocation and concentration at multiple levels

### 2. Mandate And Constraint Layer

Purpose:

- make portfolio recommendations institutionally usable

Capabilities:

- capture client risk profile
- capture portfolio-level constraints
- encode mandate boundaries
- surface recommendation conflicts before output is shared

### 3. Rebalance Workspace

Purpose:

- help PMs move from fragmented visibility to action

Capabilities:

- detect allocation drift
- identify overweights and underweights
- compare current versus target exposures
- generate rebalance drafts
- show why a rebalance is being suggested

Important principle:

WealthOS drafts recommendations. Humans approve and execute externally.

### 4. Universe Coverage Map

Purpose:

- track the growing investment universe without relying on scattered spreadsheets

Capabilities:

- organize universe by asset class, theme, issuer, geography, and internal coverage
- distinguish owned, approved, watchlist, and candidate assets
- connect each asset to research availability and current event activity

### 5. Research Navigation Layer

Purpose:

- make proprietary and external research actually usable in day-to-day workflow

Capabilities:

- search and retrieve internal research quickly
- connect retrieved research to specific holdings or candidate ideas
- show citations and source provenance
- support question answering over a curated corpus

### 6. Event And Alerting Engine

Purpose:

- turn market noise into portfolio-relevant signals

Capabilities:

- monitor headlines and event feeds
- connect events to held or watched assets
- summarize why the event matters
- prioritize alerts by exposure and relevance

### 7. Pitch Drafting Layer

Purpose:

- reduce the manual effort of creating investment recommendations and client-facing narratives

Capabilities:

- synthesize portfolio context, market context, and research context
- draft investment talking points
- explain fit, upside case, and risk case
- support human editing and approval

### 8. Audit, Governance, And Control Layer

Purpose:

- make the system acceptable in institutional settings

Capabilities:

- source trail for every answer and recommendation
- workflow separation by module
- explicit approval boundaries
- clear distinction between analysis, recommendation, and execution

### 9. Role-Aware Workspace Model

Purpose:

- support different jobs without collapsing into one generic interface

Capabilities:

- PM-focused portfolio command surface
- investment monitoring and alert surface
- RM-facing pitch and explanation workflow
- future support for reviewer and compliance workflows

## Operating Principles

- no autonomous trade execution
- no black-box recommendations without traceable inputs
- every important output should have evidence
- structured data should anchor reasoning wherever possible
- the product should respect institutional controls and approval chains
- the architecture should remain modular so each workflow can be inspected independently

## What Exists In The Repo Today

The repo is an early product prototype, not the full platform.

### Current Product Surface

- a Next.js frontend
- a portfolio dashboard
- a research route
- a planning route
- an alerts route
- a small FastAPI orchestration service

### Current Data Model

- local mock portfolio data
- local mock transaction data
- seeded client profile data for the orchestrator
- seeded research corpus files

### Current Workflow Coverage

- dashboard visualisation of mock portfolio data
- research query flow with citations
- planning query flow with deterministic metrics
- portfolio alert flow tied to orchestrator responses

### What Does Not Exist Yet

- live institutional integrations
- real OMS or custody connectivity
- entitlement-aware access control
- production-grade compliance workflow
- full portfolio normalization across many institutions and asset classes
- real rebalance engine with mandate-aware draft generation
- pitch copilot workflow

## Target Platform Vision

The target platform is a modular institutional system with five major layers:

1. integration layer for internal and external data sources
2. normalized portfolio and client context layer
3. intelligence workflows for portfolio, universe, research, and pitch tasks
4. audit and approval layer
5. operator-facing product surfaces for PMs and RMs

In that target state, WealthOS becomes the place where a PM can:

- understand current portfolio state
- see what changed in the market and research landscape
- draft rebalance ideas
- move directly into client-ready pitch material

## Transition Path

### Phase 1: Portfolio Visibility And Monitoring

Focus:

- strengthen the portfolio command surface
- improve asset and wallet visibility
- make the alerts workflow more directly portfolio-aware

### Phase 2: Research Navigation And Pitching

Focus:

- connect internal research to positions and candidate ideas
- add pitch drafting based on portfolio state and market context
- reduce spreadsheet and document hunting

### Phase 3: Institutional Hardening

Focus:

- richer data connectors
- permissioning and governance
- stronger audit and review model
- deeper asset-class coverage

## Why This Wins If Executed Well

Most institutions already have the data somewhere. The failure is that the context is fragmented across too many tools.

WealthOS can win if it becomes the layer that:

- unifies fragmented portfolio context
- keeps pace with an expanding investment universe
- makes internal research navigable
- shortens the path from market event to portfolio action to client communication

## Open Questions

- which data sources should be treated as system-of-record versus reference-only
- how mandate and suitability logic should be encoded in the first institutional version
- which asset classes should be prioritized first beyond current prototype coverage
- how proprietary research ingestion should be permissioned and structured
- what the first pitch copilot output format should be
- how much of the rebalancing workflow should be deterministic versus model-assisted
