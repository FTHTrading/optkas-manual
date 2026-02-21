# 11 — Boundaries & Regulatory Scope

> **Core principle:** Know what this platform is — and what it is NOT. Every capability boundary was designed to avoid regulatory tripwires while maximizing institutional utility.

---

## What OPTKAS Is

OPTKAS is a **sovereign settlement, evidence, and automation infrastructure** operating on public ledger rails (XRPL + Stellar). It enables:

- Programmable escrow and atomic settlement
- Cryptographic proof-of-reserves and proof-of-collateral
- Automated borrowing base computation and covenant monitoring
- Tokenized evidence and receipt issuance
- Institutional-grade risk analytics and portfolio management

---

## What OPTKAS Is NOT

| Boundary | Explanation |
|----------|-------------|
| ❌ **Not a bank** | Does not accept deposits, does not lend, does not issue checking/savings products. Custody is 1:1 stablecoin escrow on-ledger. |
| ❌ **Not a broker-dealer** | Does not execute trades on behalf of clients. Trading engines operate within the SPV's own accounts for its own portfolio. |
| ❌ **Not a custodian** | Does not hold client assets. Escrow is ledger-native (XRPL conditions), not omnibus. Each escrow is individually verifiable on-chain. |
| ❌ **Not an exchange** | Does not operate an order book for third parties. AMM pools provide liquidity for issued instruments within the platform's own ecosystem. |
| ❌ **Not an investment advisor** | Does not provide personalized investment advice. Risk analytics are internal portfolio tools, not client recommendations. |
| ❌ **Not a money transmitter** | Does not transmit money between parties as a service. Settlement occurs between defined counterparties within structured transactions. |
| ❌ **Not a fund** | Does not pool investor capital for investment returns. The SPV issues bonds backed by specific collateral — not commingled fund interests. |
| ❌ **Not a clearinghouse** | Does not guarantee settlement between unrelated parties. DvP is bilateral, atomic, and escrow-secured — not multilateral netting. |

---

## Regulatory Positioning

### Securities Law
- Bond issuance under **Reg D 506(c)** — accredited investors only
- Transfer Agent: **Securities Transfer Corporation** (SEC-registered)
- No public offering, no general solicitation beyond 506(c) parameters

### Commodity / Derivatives
- No commodity futures, no swaps, no derivatives
- Trading engines execute spot transactions only
- AMM pools provide spot liquidity — no leverage, no margin

### Banking Regulation
- No deposit-taking, no lending to third parties
- SPV borrows against its own collateral (bond indenture)
- Stablecoin custody is pass-through, not depository

### AML / KYC
- All counterparties are known, identified, and documented
- Transactions occur within permissioned trustline infrastructure
- Full audit trail anchored to public ledger (immutable)

---

## The Critical Distinction

> OPTKAS provides **infrastructure and evidence**. It does not provide **financial products to the public**.

Every capability in the 134-capability register was designed with this boundary in mind. When a capability approaches a regulatory boundary, the platform either:

1. **Restricts it to dry-run mode** (e.g., margin trading, leverage)
2. **Limits it to internal SPV operations** (e.g., trading engines)
3. **Requires legal review before activation** (e.g., new asset issuance)

This is not accidental. It is architectural.
