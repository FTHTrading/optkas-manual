# PP-07 — Legal Structure Summary

**OPTKAS1-MAIN SPV — Legal Structure, Governance & Jurisdiction**

**Document Reference:** PP-07  
**Version:** 1.0  
**Last Updated:** February 2026  
**Classification:** PROOF PACK DOCUMENT — Participant Reference

---

## PURPOSE

This document provides a summary of the OPTKAS legal structure, including SPV formation, governance framework, jurisdictional basis, and operating agreement highlights. This is a reference document provided as part of the Proof Pack (PP-07).

**IMPORTANT:** This summary does not replace legal counsel review. Participants should consult their own attorneys for legal interpretation of any structures, agreements, or provisions described herein.

---

## SPV STRUCTURE

| Parameter | Detail |
|-----------|--------|
| Entity Name | OPTKAS1-MAIN SPV |
| Entity Type | Special Purpose Vehicle (SPV) |
| Jurisdiction | State of Wyoming, USA |
| Purpose | Operate institutional-grade settlement, evidence, and automation infrastructure |
| Structural Design | Asset-isolating SPV — separates bond program assets from parent entity |

### Why Wyoming

Wyoming was selected as the most favorable U.S. jurisdiction for digital asset entities based on:

- Clear DAO/token legal frameworks enacted into state law
- Favorable SPV provisions under Wyoming business law
- Recognized legal precedent for digital asset entities
- No state corporate income tax
- Strong asset protection provisions
- Progressive blockchain-specific legislation (Special Purpose Depository Institution framework)

### Asset Isolation

The SPV structure provides:

- Structural separation of bond program assets from the parent entity
- Creditor protection for bondholders
- Operational clarity for compliance and regulatory purposes
- Ring-fenced liabilities — SPV obligations do not extend to the parent entity (and vice versa)

---

## BOND PROGRAM STRUCTURE

| Parameter | Detail |
|-----------|--------|
| Program Type | Medium-Term Note Program |
| Program Size | $500M authorized |
| First Tranche | $10M |
| Note Count (First Tranche) | 50 secured notes |
| Coupon Rate | 5% per annum (contractual obligation of issuer) |
| Maturity | 2030 |
| Security | UCC lien filings on designated collateral |
| Over-Collateralization Target | 250% |
| Offering Exemption | Regulation D Rule 506(c) — accredited investors only |
| CUSIP/ISIN | Assigned for first tranche |

### Security Interest

- UCC lien filings perfected under applicable state law
- Collateral designated and described in the Bond Indenture
- Security interest provides bondholders with priority claim on designated assets
- Over-collateralization target of 250% (policy objective, not guarantee)

### Coupon Disclosure

**The stated 5% coupon rate is a contractual obligation of the Issuer, not a guaranteed return to the investor.** Coupon payments are subject to:

- Issuer operational performance and continuity
- Availability of funds within the SPV
- Compliance with Bond Indenture covenants
- No guarantee that past coupon payments predict future payments

---

## TRANSFER AGENT

| Parameter | Detail |
|-----------|--------|
| Name | Securities Transfer Corporation |
| Registration | SEC-registered transfer agent |
| Role | Official bondholder registry |
| Compliance | SEC record-keeping requirements |
| Function | Independent verification of ownership records |

### Transfer Agent Services

- Maintaining the official register of all bondholders
- Recording transfers, issuances, and redemptions
- Providing ownership verification for compliance and audit purposes
- Independent third-party record keeping separate from the Issuer

---

## INSURANCE

| Parameter | Detail |
|-----------|--------|
| Policy Type | Blanket insurance policy |
| Coverage Amount | $25.75M |
| Coverage Areas | Operational risks, cyber risks, fidelity risks |
| Purpose | Institutional credibility for lender-side due diligence |

**Disclosure:** Insurance coverage is a risk mitigation measure. It does not guarantee against all losses and may be insufficient in certain adverse scenarios.

---

## GOVERNANCE FRAMEWORK

### Operating Agreement

The SPV governance structure is defined by the Operating Agreement, which establishes:

- Member rights and obligations
- Voting procedures for material decisions
- Distribution waterfall and priority of payments
- Dissolution and wind-down procedures
- Reporting requirements to members

### Board Resolutions

Material actions require formal board resolutions, including:

- Issuance of new note tranches
- Modification of bond indenture terms
- Changes to custody arrangements
- Entry into material contracts
- Changes to fee structures

### Participation Agreements

Each participant executes an individual Participation Agreement (PP-01) that defines:

- Terms of participation
- Rights and obligations of both parties
- Fee structures applicable to the participant
- Risk acknowledgments
- Transfer restrictions
- Exit provisions

### Credit Agreements

Off-chain credit agreements provide:

- Jurisdictional law enforcement (Wyoming)
- Defined remedies and dispute resolution
- Compliance covenants and reporting obligations
- Event-of-default definitions and consequences

---

## REGULATORY POSITIONING

### Securities Law Compliance

| Parameter | Detail |
|-----------|--------|
| Offering Exemption | Reg D Rule 506(c) |
| Investor Qualification | Accredited investors only (Rule 501(a)) |
| General Solicitation | Only within 506(c) parameters |
| Transfer Restrictions | Per Regulation D and applicable state law |
| Transfer Agent | SEC-registered (Securities Transfer Corporation) |

### What OPTKAS Is

- Institutional-grade settlement, evidence, and automation infrastructure
- Operates on public ledger rails (XRPL + Stellar)
- Provides programmable escrow and atomic settlement
- Provides cryptographic proof-of-reserves and proof-of-collateral
- 134 documented capabilities across 5 operational layers

### What OPTKAS Is NOT

| Boundary | Explanation |
|----------|-------------|
| Not a bank | No deposits, no lending, no checking/savings products |
| Not a broker-dealer | No trade execution on behalf of clients |
| Not a custodian | No omnibus custody; escrow is ledger-native and individually verifiable |
| Not an exchange | No order book for third parties |
| Not an investment advisor | No personalized investment advice |
| Not a money transmitter | No money transmission between unrelated parties |
| Not a fund | No pooled investment capital for returns |
| Not a clearinghouse | No multilateral netting or settlement guarantees |

---

## PLATFORM LAYER ARCHITECTURE

| Layer | Name | Capabilities | Description |
|-------|------|-------------|-------------|
| L1 | Legal & Control | 10 | SPV structure, bond indenture, governance, agreements |
| L2 | Custody & Key Management | — | Multisig wallets (3-of-5), HSMs, signing thresholds |
| L3 | Automation & Engines | 28 engines | Coupon calculation, escrow management, compliance, settlement orchestration |
| L4 | Evidence & Analytics | — | Dual-chain anchoring, SHA-256 hash chains, audit trails, dashboards |
| L5 | Settlement & Ledger | — | XRPL + Stellar, 3-5 second finality, 9 funded mainnet accounts |
| **Total** | | **134** | **Documented capabilities across all layers** |

---

## CRITICAL LEGAL DISTINCTION

> **Tokens do not create legal ownership — they mirror it.**

If a dispute arises, courts enforce the Bond Indenture, not the blockchain state. The blockchain provides evidence and settlement mechanics. Law provides authority and enforceability.

This distinction is critical for institutional credibility. OPTKAS explicitly separates:

- **Legal authority** (Layer 1 — Bond Indenture, Operating Agreement, Participation Agreements)
- **Settlement mechanics** (Layer 5 — XRPL/Stellar on-chain execution)

---

*This document is a template. It does not constitute legal advice. This summary should be reviewed and customized by qualified legal counsel. Participants should consult their own attorneys for legal interpretation.*
