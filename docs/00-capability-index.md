# 00 — Capability Index

> **Purpose:** Complete cross-layer capability matrix for auditors, risk officers, and institutional due diligence.

This index maps every verified capability across all 7 architectural layers with its current operational status.

---

## Summary

| Layer | Domain | Capabilities | Live | Dry-Run | Planned |
|-------|--------|-------------|------|---------|---------|
| 🟦 L1 | Legal & Control | 10 | 10 | 0 | 0 |
| 🟩 L2 | Custody & Banking | 10 | 10 | 0 | 0 |
| 🟨 L3 | Settlement (XRPL) | 19 | 18 | 0 | 1 |
| 🟨 L3 | AMM | 9 | 9 | 0 | 0 |
| 🟨 L3 | Multisig | 5 | 5 | 0 | 0 |
| 🟨 L3 | Stellar | 9 | 9 | 0 | 0 |
| 🟪 L5 | Automation | 48 | 44 | 4 | 0 |
| ⚫ L6 | Ledger Evidence | 10 | 10 | 0 | 0 |
| 🔵 Cross | Operations & Workflows | 14 | 13 | 1 | 0 |
| | **TOTAL** | **134** | **128** | **5** | **1** |

---

## Full Capability Register

### 🟦 L1 — Legal & Control

| ID | Capability | Mechanism | Status |
|----|-----------|-----------|--------|
| L1.LEG.001 | SPV legal structure | OPTKAS1-MAIN SPV · Wyoming | ✅ Live |
| L1.LEG.002 | Bond indenture framework | $500M MTN program | ✅ Live |
| L1.LEG.003 | Transfer agent registration | SEC-registered agent | ✅ Live |
| L1.LEG.004 | Insurance coverage ($25.75M) | Multi-policy structure | ✅ Live |
| L1.LEG.005 | Qualified custodian designation | Independent custody | ✅ Live |
| L1.LEG.006 | Investor accreditation gate | Reg D compliance | ✅ Live |
| L1.LEG.007 | Offering memorandum issuance | Securities documentation | ✅ Live |
| L1.LEG.008 | Governance authority enforcement | Board resolution authority | ✅ Live |
| L1.LEG.009 | Regulatory filing compliance | Blue sky + federal | ✅ Live |
| L1.LEG.010 | Legal opinion issuance | Counsel opinion letters | ✅ Live |

### 🟩 L2 — Custody & Banking

| ID | Capability | Mechanism | Status |
|----|-----------|-----------|--------|
| L2.CUS.001 | 1:1 USD custody | Segregated bank accounts | ✅ Live |
| L2.CUS.002 | Bitstamp USD trustline | XRPL trustline | ✅ Live |
| L2.CUS.003 | GateHub USD trustline | XRPL trustline | ✅ Live |
| L2.CUS.004 | Tether USD trustline | XRPL trustline | ✅ Live |
| L2.CUS.005 | Circle USDC trustline | XRPL trustline | ✅ Live |
| L2.CUS.006 | Fiat on-ramp processing | Bank wire integration | ✅ Live |
| L2.CUS.007 | Fiat off-ramp processing | Redemption pipeline | ✅ Live |
| L2.CUS.008 | Daily reconciliation | Automated bank-ledger match | ✅ Live |
| L2.CUS.009 | Custody segregation enforcement | Per-investor isolation | ✅ Live |
| L2.CUS.010 | Reserve ratio maintenance | 125% minimum | ✅ Live |

### 🟨 L3 — XRPL Settlement

| ID | Capability | Mechanism | Status |
|----|-----------|-----------|--------|
| L3.XRP.001 | Issue custom IOUs (6 tokens) | Issuer account Payment txns | ✅ Live |
| L3.XRP.002 | Enforce trustline opt-in | XRPL trustline requirement | ✅ Live |
| L3.XRP.003 | Lock funds in time-based escrow | EscrowCreate with FinishAfter | ✅ Live |
| L3.XRP.004 | Lock funds in crypto-condition escrow | EscrowCreate with Condition | ✅ Live |
| L3.XRP.005 | Release escrow on fulfillment | EscrowFinish with Fulfillment | ✅ Live |
| L3.XRP.006 | Cancel expired escrow | EscrowCancel after CancelAfter | ✅ Live |
| L3.XRP.007 | Execute DvP (atomic swap) | Dual escrow release | ✅ Live |
| L3.XRP.008 | Freeze individual trustlines | TrustSet with Freeze flag | ✅ Live |
| L3.XRP.009 | Execute global freeze | AccountSet with GlobalFreeze | ✅ Live |
| L3.XRP.010 | Place limit orders on DEX | OfferCreate transactions | ✅ Live |
| L3.XRP.011 | Cancel DEX orders | OfferCancel transactions | ✅ Live |
| L3.XRP.012 | Route payments across pairs | XRPL pathfinding | ✅ Live |
| L3.XRP.013 | Multi-hop conversions | Auto-routing via DEX | ✅ Live |
| L3.XRP.014 | Monitor orderbook depth | Orderbook subscription | ✅ Live |
| L3.XRP.015 | Enforce RequireDestTag | AccountSet flag | ✅ Live |
| L3.XRP.016 | DefaultRipple for token routing | AccountSet flag on issuer | ✅ Live |
| L3.XRP.017 | Disable master key | AccountSet DisableMaster | 📋 Planned |
| L3.XRP.018 | Mint XLS-20 NFTs | NFTokenMint transactions | ✅ Live |
| L3.XRP.019 | Enforce 0.2 XRP reserve | Native reserve requirement | ✅ Live |

### 🟨 L3 — AMM (XLS-30)

| ID | Capability | Mechanism | Status |
|----|-----------|-----------|--------|
| L3.AMM.001 | Create AMM liquidity pools | AMMCreate transactions | ✅ Live |
| L3.AMM.002 | Add liquidity to pools | AMMDeposit transactions | ✅ Live |
| L3.AMM.003 | Remove liquidity from pools | AMMWithdraw transactions | ✅ Live |
| L3.AMM.004 | Execute token swaps via AMM | Payment through AMM path | ✅ Live |
| L3.AMM.005 | Earn passive trading fees | AMM fee distribution | ✅ Live |
| L3.AMM.006 | Monitor pool depth and pricing | AMM info queries | ✅ Live |
| L3.AMM.007 | Operate 6 XRPL pools | OPTKAS/XRP + 5 others | ✅ Live |
| L3.AMM.008 | Provide constant liquidity | Algorithmic pricing curve | ✅ Live |
| L3.AMM.009 | Enable arbitrage correction | Cross-pool price alignment | ✅ Live |

### 🟨 L3 — Multi-Signature Governance

| ID | Capability | Mechanism | Status |
|----|-----------|-----------|--------|
| L3.MSG.001 | Enforce 2-of-3 multisig | SignerListSet | ✅ Live |
| L3.MSG.002 | Require 3-of-3 for config changes | Weight-based signing | ✅ Live |
| L3.MSG.003 | Allow 1-of-3 emergency freeze | Emergency signer weight | ✅ Live |
| L3.MSG.004 | Support signer rotation | SignerListSet update | ✅ Live |
| L3.MSG.005 | Protect against unilateral control | Multi-party approval | ✅ Live |

### 🟨 L3 — Stellar Settlement

| ID | Capability | Mechanism | Status |
|----|-----------|-----------|--------|
| L3.STL.001 | Issue regulated OPTKAS-USD | Stellar asset + AUTH_REQUIRED | ✅ Live |
| L3.STL.002 | Enforce authorization for holders | AUTH_REQUIRED flag | ✅ Live |
| L3.STL.003 | Revoke holder authorization | AUTH_REVOCABLE flag | ✅ Live |
| L3.STL.004 | Clawback tokens if required | CLAIMABLE_BALANCES flag | ✅ Live |
| L3.STL.005 | Operate 3 Stellar AMM pools | OPTKAS-USD/XLM + 2 others | ✅ Live |
| L3.STL.006 | Process fiat via SEP-24 | Anchor integration | ✅ Live |
| L3.STL.007 | Enforce 0.5 XLM reserve | Native reserve requirement | ✅ Live |
| L3.STL.008 | Anchor data hashes | Stellar manage_data | ✅ Live |
| L3.STL.009 | Execute SEP-10 authentication | Web auth standard | ✅ Live |

### 🟪 L5 — Automation Engines

| ID | Capability | Domain | Status |
|----|-----------|--------|--------|
| L5.AUT.001 | Portfolio rebalancing | Portfolio Management | ✅ Live |
| L5.AUT.002 | NAV calculation | Portfolio Management | ✅ Live |
| L5.AUT.003 | P&L tracking | Portfolio Management | ✅ Live |
| L5.AUT.004 | Position management | Portfolio Management | ✅ Live |
| L5.AUT.005 | Multi-asset valuation | Portfolio Management | ✅ Live |
| L5.AUT.006 | Benchmark tracking | Portfolio Management | ✅ Live |
| L5.AUT.007 | Monte Carlo VaR (95%) | Risk Analytics | ✅ Live |
| L5.AUT.008 | Monte Carlo VaR (99%) | Risk Analytics | ✅ Live |
| L5.AUT.009 | Stress scenario testing | Risk Analytics | ✅ Live |
| L5.AUT.010 | Correlation analysis | Risk Analytics | ✅ Live |
| L5.AUT.011 | Concentration monitoring (HHI) | Risk Analytics | ✅ Live |
| L5.AUT.012 | Borrowing base certificates | Risk Analytics | ✅ Live |
| L5.AUT.013 | Order execution | Trading | ✅ Live |
| L5.AUT.014 | Slippage monitoring | Trading | ✅ Live |
| L5.AUT.015 | Best execution routing | Trading | ✅ Live |
| L5.AUT.016 | Market data feeds | Trading | ✅ Live |
| L5.AUT.017 | XRPL settlement processing | Settlement | ✅ Live |
| L5.AUT.018 | Stellar settlement processing | Settlement | ✅ Live |
| L5.AUT.019 | Cross-chain reconciliation | Settlement | ✅ Live |
| L5.AUT.020 | Escrow automation | Settlement | ✅ Live |
| L5.AUT.021 | DvP orchestration | Settlement | ✅ Live |
| L5.AUT.022 | Position-level compliance | Compliance | ✅ Live |
| L5.AUT.023 | Regulatory reporting | Compliance | 🔶 Dry-Run |
| L5.AUT.024 | Transaction surveillance | Compliance | ✅ Live |
| L5.AUT.025 | KYC/AML screening | Compliance | ✅ Live |
| L5.AUT.026 | Daily bank reconciliation | Reconciliation | ✅ Live |
| L5.AUT.027 | Ledger-to-bank matching | Reconciliation | ✅ Live |
| L5.AUT.028 | Discrepancy alerting | Reconciliation | ✅ Live |
| L5.AUT.029 | Automated audit trail | Reconciliation | ✅ Live |
| L5.AUT.030 | Investor onboarding | Investor Operations | ✅ Live |
| L5.AUT.031 | Distribution calculations | Investor Operations | ✅ Live |
| L5.AUT.032 | Statement generation | Investor Operations | 🔶 Dry-Run |
| L5.AUT.033 | Capital call processing | Investor Operations | ✅ Live |
| L5.AUT.034 | Redemption processing | Investor Operations | ✅ Live |
| L5.AUT.035 | Real-time dashboards | Monitoring | ✅ Live |
| L5.AUT.036 | Alert engine | Monitoring | ✅ Live |
| L5.AUT.037 | Performance attribution | Monitoring | ✅ Live |
| L5.AUT.038 | System health checks | Monitoring | ✅ Live |
| L5.AUT.039 | Covenant tracking | Monitoring | ✅ Live |
| L5.AUT.040 | SHA-256 document hashing | Evidence | ✅ Live |
| L5.AUT.041 | NFT attestation orchestration | Evidence | ✅ Live |
| L5.AUT.042 | Cross-chain evidence anchoring | Evidence | ✅ Live |
| L5.AUT.043 | Audit report generation | Evidence | 🔶 Dry-Run |
| L5.AUT.044 | Data room management | Evidence | ✅ Live |
| L5.AUT.045 | Backup and recovery | Infrastructure | ✅ Live |
| L5.AUT.046 | Key rotation scheduling | Infrastructure | 🔶 Dry-Run |
| L5.AUT.047 | CI/CD pipeline | Infrastructure | ✅ Live |
| L5.AUT.048 | Environment management | Infrastructure | ✅ Live |

### ⚫ L6 — Ledger Evidence

| ID | Capability | Mechanism | Status |
|----|-----------|-----------|--------|
| L6.EVD.001 | SHA-256 document hashing | Hash computation | ✅ Live |
| L6.EVD.002 | XLS-20 NFT minting | XRPL NFTokenMint | ✅ Live |
| L6.EVD.003 | NFT metadata embedding | URI + hash payload | ✅ Live |
| L6.EVD.004 | Stellar data anchoring | manage_data operation | ✅ Live |
| L6.EVD.005 | Dual-chain evidence | XRPL + Stellar | ✅ Live |
| L6.EVD.006 | Attestation timestamp | Ledger close time | ✅ Live |
| L6.EVD.007 | Evidence verification API | Hash comparison | ✅ Live |
| L6.EVD.008 | Audit trail generation | Sequential records | ✅ Live |
| L6.EVD.009 | Compliance attestation | Regulatory evidence | ✅ Live |
| L6.EVD.010 | Immutability guarantee | Native ledger property | ✅ Live |

### 🔴 L7 — Boundaries & Regulatory

| ID | Capability | Domain | Status |
|----|-----------|--------|--------|
| L7.BND.001 | Regulatory boundary disclosure | Legal compliance | ✅ Live |
| L7.BND.002 | "Not a bank" enforcement | Architectural boundary | ✅ Live |
| L7.BND.003 | "Not a broker-dealer" enforcement | Architectural boundary | ✅ Live |
| L7.BND.004 | "Not a custodian" enforcement | Architectural boundary | ✅ Live |
| L7.BND.005 | "Not an exchange" enforcement | Architectural boundary | ✅ Live |
| L7.BND.006 | "Not an investment advisor" enforcement | Architectural boundary | ✅ Live |
| L7.BND.007 | "Not a money transmitter" enforcement | Architectural boundary | ✅ Live |
| L7.BND.008 | "Not a clearinghouse" enforcement | Architectural boundary | ✅ Live |

---

> **Auditor Note:** This register is the verification target. Every capability listed here can be demonstrated on mainnet or validated through evidence trail. This is a verification exercise, not a trust exercise.
