# 06 — Automation Engines (L3)

> **Key Principle:** Automate everything that law and custody permit.

## Layer Summary

| Attribute | Value |
|-----------|-------|
| Layer | L3 — Automation & Intelligence |
| Engines | 28 TypeScript modules |
| Capabilities | 48 (44 live · 4 dry-run) |
| Domains | 8 |

---

## Domain 1: Bond Lifecycle (5 capabilities)

| ID | Capability | Engine | Status |
|----|-----------|--------|--------|
| L3.BND.001 | Create bond from legal parameters | BondFactory | Live |
| L3.BND.002 | Manage bond lifecycle (issuance → maturity) | BondFactory state machine | Live |
| L3.BND.003 | Calculate accrued interest | Accrual convention engine (30/360, ACT/365) | Live |
| L3.BND.004 | Process coupon payments | Coupon waterfall engine | Live |
| L3.BND.005 | Execute bond redemption | Redemption workflow + token burn | Live |

**Purpose:** Translate legal bond parameters into programmable lifecycle events.  
**Inputs:** Bond indenture terms, tranche allocations, payment schedules.  
**Outputs:** Minted tokens, coupon distributions, redemption events.  
**Layer interaction:** L1 (legal terms) → L3 (automation) → L5 (settlement)

---

## Domain 2: Issuance & Settlement (5 capabilities)

| ID | Capability | Engine | Status |
|----|-----------|--------|--------|
| L3.ISS.001 | Mint XRPL IOUs per tranche terms | IssuanceEngine | Live |
| L3.ISS.002 | Mint Stellar regulated assets | IssuanceEngine (Stellar path) | Live |
| L3.ISS.003 | Orchestrate escrow DvP | EscrowManager | Live |
| L3.ISS.004 | Execute cross-ledger atomic transfers | SettlementEngine (XRPL↔Stellar) | Live |
| L3.ISS.005 | Automate token burn on redemption | RedemptionEngine | Live |

**Purpose:** Execute the mechanical issuance and settlement of digital instruments.  
**Inputs:** Tranche terms, counterparty trustlines, escrow conditions.  
**Outputs:** Minted tokens, settled escrows, burned tokens on maturity.  
**Layer interaction:** L1 (terms) → L3 (orchestration) → L5 (on-chain execution) → L4 (attestation)

---

## Domain 3: Reserve Vault & Portfolio (8 capabilities)

| ID | Capability | Engine | Status |
|----|-----------|--------|--------|
| L3.RVT.001 | Calculate NAV ($4.11M current) | ReserveVaultEngine | Live |
| L3.RVT.002 | Accept deposits with haircut | Deposit + haircut engine | Live |
| L3.RVT.003 | Mint vault shares | Share minting engine | Live |
| L3.RVT.004 | Decompose principal vs yield strips | Circle of Life yield stripping | Live |
| L3.RVT.005 | NFT-gated allocation tiers | NFT-based access control | Live |
| L3.RVT.006 | Generate attestation snapshots | Snapshot + hash engine | Live |
| L3.RVT.007 | Calculate P&L per asset class | PortfolioManager | Live |
| L3.RVT.008 | Track 8 asset class allocations | Asset allocation engine | Live |

**Purpose:** Manage the multi-asset reserve vault backing the bond program.  
**Inputs:** Asset deposits, market prices, allocation targets.  
**Outputs:** NAV calculations, vault shares, attestation snapshots.  
**Layer interaction:** L2 (custody) → L3 (valuation) → L4 (proof) → L5 (on-chain records)

---

## Domain 4: Borrowing Base (5 capabilities)

| ID | Capability | Engine | Status |
|----|-----------|--------|--------|
| L3.BBE.001 | Calculate collateral coverage ratio | BorrowingBaseEngine | Live |
| L3.BBE.002 | Generate borrowing base certificates | Certificate automation | Live |
| L3.BBE.003 | Monitor covenant compliance | Covenant tracking engine | Live |
| L3.BBE.004 | Run borrowing base sensitivity | Sensitivity engine | Live |
| L3.BBE.005 | Maintain 250% over-collateralization | Excess collateral monitoring | Live |

**Purpose:** Automate the borrowing base calculations required by lenders.  
**Inputs:** Collateral valuations, haircut schedules, covenant thresholds.  
**Outputs:** Borrowing base certificates, compliance reports, breach alerts.  
**Layer interaction:** L1 (covenants) → L3 (calculation) → L4 (attestation)

---

## Domain 5: Risk Analytics (6 capabilities)

| ID | Capability | Engine | Status |
|----|-----------|--------|--------|
| L3.RSK.001 | Run 10,000 Monte Carlo VaR simulations | RiskAnalyticsEngine | Live |
| L3.RSK.002 | Calculate 95%/99% VaR | Statistical VaR engine | Live |
| L3.RSK.003 | Execute regulatory stress tests | Stress scenario engine | Live |
| L3.RSK.004 | Calculate liquidity coverage ratio | LCR engine | Live |
| L3.RSK.005 | Calculate concentration index (HHI) | Herfindahl-Hirschman engine | Live |
| L3.RSK.006 | Generate risk dashboards | Dashboard rendering engine | Live |

**Purpose:** Institutional-grade risk measurement and reporting.  
**Inputs:** Portfolio positions, market data, stress parameters.  
**Outputs:** VaR reports, stress test results, LCR, HHI, dashboards.  
**Layer interaction:** L3 (analytics) → L4 (proof anchoring)

---

## Domain 6: Trading (7 capabilities)

| ID | Capability | Engine | Status |
|----|-----------|--------|--------|
| L3.TRD.001 | Execute TWAP orders | Time-Weighted Average Price engine | Dry-Run |
| L3.TRD.002 | Execute VWAP orders | Volume-Weighted Average Price engine | Dry-Run |
| L3.TRD.003 | Place limit orders on XRPL DEX | Order placement engine | Dry-Run |
| L3.TRD.004 | Monitor slippage in real-time | Slippage monitoring engine | Live |
| L3.TRD.005 | Trigger circuit breaker at 5% loss | Circuit breaker logic | Live |
| L3.TRD.006 | Trigger kill switch at 10% loss | Kill switch logic | Live |
| L3.TRD.007 | Select best execution path (AMM vs DEX) | Path optimization engine | Live |

**Purpose:** Automated execution and protective controls for market operations.  
**Inputs:** Order parameters, market depth, risk thresholds.  
**Outputs:** Executed trades, slippage reports, circuit breaker events.  
**Layer interaction:** L3 (strategy) → L5 (DEX/AMM execution) → L4 (audit logging)

---

## Domain 7: Deal Pipeline & Lender Management (10 capabilities)

| ID | Capability | Engine | Status |
|----|-----------|--------|--------|
| L3.DPL.001 | Manage 14-stage lender CRM | DealPipelineEngine | Live |
| L3.DPL.002 | Ingest term sheets automatically | TermSheetAnalyzer | Live |
| L3.DPL.003 | Score term sheets with weighted criteria | Weighted scoring engine | Live |
| L3.DPL.004 | Compare term sheets side-by-side | Comparison matrix engine | Live |
| L3.DPL.005 | Track lender interactions in CRM | Interaction logging | Live |
| L3.DPL.006 | Manage draw requests | Draw management engine | Live |
| L3.DPL.007 | Apply accrual conventions to draws | Convention engine (30/360, ACT/365) | Live |
| L3.DPL.008 | Execute waterfall distributions | Waterfall engine | Live |
| L3.DPL.009 | Generate investor reports | Automated reporting engine | Live |
| L3.DPL.010 | Manage Q&A portal for lenders | Q&A management system | Live |

**Purpose:** Full lifecycle management of lender relationships and capital raises.  
**Inputs:** Lender contacts, term sheets, draw requests, Q&A submissions.  
**Outputs:** Scored comparisons, draw schedules, investor reports, waterfall payments.  
**Layer interaction:** L1 (legal terms) → L3 (pipeline) → L5 (settlement)

---

## Domain 8: AI & Intelligence (3 capabilities)

| ID | Capability | Engine | Status |
|----|-----------|--------|--------|
| L3.AIE.001 | AI-assisted document analysis | AI Agent engine | Live |
| L3.AIE.002 | Automated covenant monitoring alerts | AI monitoring agent | Live |
| L3.AIE.003 | Predictive analytics for risk | AI risk prediction engine | Live |

**Purpose:** Machine learning augmentation for document analysis and risk prediction.  
**Inputs:** Documents, covenant data, historical patterns.  
**Outputs:** Extracted terms, breach predictions, risk alerts.  
**Layer interaction:** L1 (documents) → L3 (AI analysis) → L4 (alert logging)
