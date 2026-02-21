# OPTKAS Sovereign Platform Manual

![Version](https://img.shields.io/badge/version-v1.2-blue)
![Layers](https://img.shields.io/badge/layers-7-gold)
![Capabilities](https://img.shields.io/badge/capabilities-134-brightgreen)
![Readiness](https://img.shields.io/badge/institutional_readiness-82%2F100-green)
![XRPL](https://img.shields.io/badge/Settlement-XRPL-purple)
![Tests](https://img.shields.io/badge/tests-1213-green)
![License](https://img.shields.io/badge/license-MIT-lightgrey)

**Legally Anchored. Multisig Governed. XRPL-Settled.**

> Institutional-grade sovereign capital markets infrastructure manual for OPTKAS.
> XRPL-settled, multisig-governed, legally anchored.
>
> **[View Institutional Overview →](https://fthtrading.github.io/optkas-manual/institutional.html)**

This repository contains the complete operational, architectural, and governance documentation for the OPTKAS Sovereign Financial Platform.

---

## Who This Manual Is For

| Audience | Use Case |
|----------|----------|
| Internal team | Full operational training and reference |
| Institutional partners | Architecture review and due diligence |
| Lenders and risk officers | Credit committee preparation |
| Legal and compliance advisors | Boundary and governance analysis |
| Technical auditors | Capability verification and proof mechanics |

---

## System Architecture (Institutional Hierarchy)

The platform is organized in strict institutional order — not by technical convenience, but by institutional credibility:

| # | Layer | Purpose | Capabilities |
|---|-------|---------|-------------|
| 1 | Legal & Control | SPV, bond indenture, transfer agent, insurance | 10 |
| 2 | Custody & Banking | 1:1 USD custody, stablecoin trustlines, fiat rails | 10 |
| 3 | Settlement (XRPL) | Escrow, DvP, trustlines, DEX, AMM, multisig | 42 |
| 4 | Asset Issuance | 6 XRPL IOUs, 1 Stellar regulated asset | — |
| 5 | Automation & Risk | 28 TypeScript engines across 8 domains | 48 |
| 6 | Ledger Evidence | SHA-256 hashing, NFT attestations, dual-chain proof | 10 |
| 7 | Operations & Revenue | Workflows, revenue lanes, pricing tiers | — |
| 8 | Boundaries & Scope | What the system is NOT — regulatory clarity | — |

**Total: 134 capabilities · 128 live · 5 dry-run · 1 planned**

---

## Institutional Layer Map

Color-coded layer architecture — every section, sidebar, header, and badge follows this mapping:

| Layer | Domain | Color Code | Risk Function |
|-------|--------|------------|---------------|
| 🟦 L1 | Legal & Control | Blue | Authority & enforceability |
| 🟩 L2 | Custody & Banking | Green | Asset protection |
| 🟨 L3 | Settlement (XRPL) | Gold | Counterparty elimination |
| 🟧 L4 | Asset Issuance | Orange | Instrument definition |
| 🟪 L5 | Automation & Risk | Purple | Operational scaling |
| ⚫ L6 | Ledger Evidence | Graphite | Immutable proof |
| 🔴 L7 | Boundaries | Red | Regulatory containment |

> Institutional readers subconsciously process color as hierarchy. Every visual element in this manual reflects this layer map.

---

## System Data Flow

![System Flow](assets/diagrams/system-flow.svg)

**Legal → Custody → XRPL → Automation → Evidence → Dashboards**

---

## Repository Structure

```
optkas-manual/
│
├── README.md                    ← You are here
├── LICENSE                      ← MIT License
├── .gitignore
├── package.json
│
├── /docs                        ← 13 structured documentation chapters
│   ├── 00-capability-index.md   ← Full capability matrix (auditor-grade)
│   ├── 01-executive-overview.md
│   ├── 02-legal-control-layer.md
│   ├── 03-custody-banking.md
│   ├── 04-xrpl-settlement-layer.md
│   ├── 05-asset-issuance.md
│   ├── 06-automation-engines.md
│   ├── 07-ledger-evidence.md
│   ├── 08-risk-analytics.md
│   ├── 09-operations-workflows.md
│   ├── 10-revenue-model.md
│   ├── 11-boundaries-regulatory-scope.md
│   ├── 12-credit-committee-narrative.md
│   └── 13-institutional-readiness.md
│
├── /public                      ← GitHub Pages (interactive web manual)
│   ├── index.html
│   ├── styles.css
│   ├── app.js
│   ├── search.js
│   └── audio-controls.js
│
├── /assets                      ← Branding, diagrams, icons
│   ├── logo.svg
│   └── diagrams/
│       ├── system-flow.svg
│       ├── settlement-dvp.svg
│       ├── governance-multisig.svg
│       ├── risk-curve.svg
│       ├── capital-stack.svg
│       └── token-taxonomy.svg
│
├── /audio                       ← Pre-recorded narration (MP3)
│   └── README.md
│
├── /releases                    ← Generated PDF exports
│
└── /scripts                     ← Build utilities
    ├── build-search-index.js
    ├── build-pdf.js             ← Puppeteer PDF generator
    ├── generate-audio.js
    └── version-bump.js
```

---

## Interactive Web Manual

The web manual is deployed via GitHub Pages from `/public`.

**Live URL:** `https://fthtrading.github.io/optkas-manual/`

### Features

- **Dark sovereign theme** — institutional-grade visual design
- **Sidebar navigation** — 12 sections in institutional hierarchy order
- **Global search** — `Ctrl+K` to search capabilities, wallets, engines, tokens
- **Audio narration** — TTS (Web Speech API) fallback + MP3 upload support
- **Layer color coding** — visual identification of architectural layers
- **Status badges** — Live / Dry-Run / Planned for every capability
- **Printable** — clean print styles for PDF export

### GitHub Pages Deployment

```bash
# After pushing to GitHub:
# Settings → Pages → Branch: main → Folder: /public → Save
```

---

## Audio Training

Each section supports two audio modes:

1. **TTS (Text-to-Speech):** Built-in Web Speech API. Click the 🎧 icon, select a voice, press Play.
2. **MP3 Narration:** Upload pre-recorded `.mp3` files to `/audio/`. The app will detect and play them when available.

---

## Versioning Policy

This manual follows semantic versioning via git tags:

| Tag | Meaning |
|-----|---------|
| `v1.0-launch` | Initial platform manual |
| `v1.1-risk-update` | Risk analytics expansion |
| `v2.0-facility-live` | First facility fully operational |

Create releases:
```bash
git tag -a v1.0-launch -m "Initial platform manual"
git push origin v1.0-launch
```

---

## Key Numbers

| Metric | Value |
|--------|-------|
| Bond Program | $500M Medium-Term Notes |
| First Tranche | $10M · 50 secured notes · 5% coupon · 2030 maturity |
| Capabilities | 134 total (128 live) |
| Mainnet Accounts | 9 (6 XRPL + 3 Stellar) |
| TypeScript Engines | 28 across 8 domains |
| AMM Pools | 9 (6 XRPL + 3 Stellar) |
| NAV | $4.11M |
| Over-Collateralization | 250% |
| Test Coverage | 1,213+ tests · 97.4% success |

---

## License

MIT License. See [LICENSE](LICENSE).

---

*OPTKAS Sovereign Platform — FTH Trading LLC*
