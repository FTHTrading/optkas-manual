# 09 — Operations & Workflows

## Overview

Three critical workflows define the operational heartbeat of the platform. Every team member must know these by heart.

---

## Workflow 1: Funding Ceremony (10 Steps)

The funding ceremony is the end-to-end process from document preparation to capital deployment.

| Step | Action | Layer |
|------|--------|-------|
| 1 | Final document hash | L4 |
| 2 | Mainnet attestation (hash + NFT) | L4 + L5 |
| 3 | Lender outreach (14 targets) | L3 |
| 4 | Data room access logging | L3 |
| 5 | Q&A management | L3 |
| 6 | Term sheet ingestion | L3 |
| 7 | Weighted scoring | L3 |
| 8 | Negotiation strategy | L1 + L3 |
| 9 | Signed LOI | L1 |
| 10 | Draw management | L3 + L5 |

### Pre-Flight Checklist

Before executing any funding ceremony, the pre-flight verification suite runs 70+ automated checks:

- Wallet balance verification
- Trustline configuration validation
- Multisig status confirmation
- Escrow parameter validation
- Network connectivity checks
- Reserve ratio compliance
- Covenant status verification

**All checks must pass before proceeding.**

---

## Workflow 2: Asset Lifecycle (7 Steps)

The complete lifecycle of a tokenized claim from creation to evidence.

| Step | Action | Layer |
|------|--------|-------|
| 1 | Bond tranche allocated (off-chain) | L1 |
| 2 | Token minted (Issuer → Treasury) | L5 |
| 3 | Lender trustline established | L5 |
| 4 | Escrow created (settlement locked) | L5 |
| 5 | DvP triggered (atomic release) | L5 |
| 6 | Attestation NFT minted | L4 |
| 7 | All events logged to audit store | L4 |

### Key Controls

- Token minting requires 2-of-3 multisig approval
- Trustline establishment requires lender KYC completion
- Escrow parameters are validated against bond indenture terms
- DvP cannot execute unless both sides are locked
- Attestation is automatic after successful settlement

---

## Workflow 3: Default Scenario Response (8 Steps)

Emergency response procedure for covenant breach or default events.

| Step | Action | Layer |
|------|--------|-------|
| 1 | Covenant breach detected | L3 |
| 2 | Alert sent to governance signers | L3 |
| 3 | 1-of-3 emergency freeze triggered | L5 |
| 4 | All trustlines frozen (XRPL) | L5 |
| 5 | Holder authorization revoked (Stellar) | L5 |
| 6 | Trading kill switch activated | L3 + L5 |
| 7 | Legal enforcement initiated | L1 |
| 8 | Collateral liquidation via custodian | L2 |

### Emergency Freeze Protocol

**Any single signer can freeze everything.**

This is the most critical security feature. If a breach is detected at 2 AM, the first signer to respond can:

1. Execute emergency freeze (1-of-3)
2. All XRPL trustlines become frozen
3. All Stellar authorizations are revoked
4. Trading kill switch activates
5. No tokens can move until governance resolves the situation

**Time to full freeze:** Seconds (not hours, not days).

---

## Cross-Layer Capabilities

Operations that span multiple architectural layers:

| ID | Capability | Layers | Status |
|----|-----------|--------|--------|
| CL.001 | End-to-end bond issuance (legal → on-chain) | L1 + L3 + L5 | Live |
| CL.002 | Atomic Delivery-vs-Payment | L2 + L3 + L5 | Live |
| CL.003 | Cross-chain DvP (XRPL ↔ Stellar) | L3 + L5 | Live |
| CL.004 | Proof-of-reserves attestation | L3 + L4 + L5 | Live |
| CL.005 | Borrowing base → on-chain certificate | L1 + L3 + L4 | Live |
| CL.006 | Lender onboarding (legal → trustline) | L1 + L2 + L5 | Live |
| CL.007 | Default scenario freeze | L1 + L5 | Live |
| CL.008 | Automated investor reporting | L3 + L4 | Live |
| CL.009 | Secondary market trading | L3 + L5 | Dry-Run |
| CL.010 | Redemption to fiat | L2 + L3 + L5 | Live |
| CL.011 | Real-time risk monitoring | L3 + L4 | Live |
| CL.012 | Term sheet ingestion to comparison | L1 + L3 | Live |
| CL.013 | Funding ceremony execution | L1–L5 | Live |
| CL.014 | Emergency operations (any signer) | L5 + L3 | Live |
