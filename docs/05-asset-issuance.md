# 05 — Asset Issuance

## XRPL IOUs (6 Tokens)

All XRPL tokens are issued as IOUs from a single Issuer account with DefaultRipple enabled. No smart contracts. No ERC-20 wrappers.

| Symbol | Description | Freeze | Clawback |
|--------|------------|--------|----------|
| OPTKAS | Primary bond claim receipt | Yes | No |
| SOVBND | Sovereign bond claim tracker | Yes | No |
| IMPERIA | Asset-class claim | Yes | No |
| GEMVLT | Vault participation | Yes | No |
| TERRAVL | Real estate claim | Yes | No |
| PETRO | Energy asset claim | Yes | No |

### Flag Configuration

- **Freeze: Yes** — Issuer can freeze individual trustlines or execute a global freeze
- **Clawback: No** — Tokens cannot be forcibly removed from holder wallets. This is a deliberate compliance choice: freeze stops movement, but does not confiscate. Legal recovery happens through courts, not code.

### Why No Clawback on XRPL

Clawback on XRPL is an irrevocable account flag. Once enabled, it cannot be disabled. OPTKAS deliberately chose NOT to enable clawback because:

1. Freeze provides sufficient compliance control (stops all movement)
2. Clawback creates legal liability (confiscation without due process)
3. Institutional investors prefer freeze-only models
4. Legal enforcement handles recovery — blockchain handles mechanics

## Functional Token Types

### 1. Claim Receipt (e.g. OPTKAS.BOND)
- Represents a legal claim under the bond indenture
- Has economic value
- Transfer is controlled via trustline authorization
- Backed by real assets in qualified custody

### 2. Settlement Token (e.g. OPTKAS.ESCROW)
- DvP execution instrument
- 1:1 USD-backed
- Burnable on redemption
- Used in escrow workflows

### 3. Evidence Marker (e.g. OPTKAS.ATTEST)
- Proof-only NFT (XLS-20)
- No economic value
- Non-transferable
- Cryptographic notary function
- Used for reserve attestations, document hashing, audit trails

## Stellar Regulated Asset

| Parameter | Value |
|-----------|-------|
| Symbol | OPTKAS-USD |
| Type | Regulated USD stablecoin |
| Compliance | SEP-24 anchor |
| Flags | AUTH_REQUIRED · AUTH_REVOCABLE · CLAWBACK |

### Stellar Flag Explanation

Unlike XRPL, Stellar's clawback capability is appropriate for the regulated asset because:

- OPTKAS-USD is specifically a regulated stablecoin (not a bond claim)
- AUTH_REQUIRED ensures only authorized holders
- AUTH_REVOCABLE allows instant compliance enforcement
- Clawback is expected by regulators for stablecoin compliance
- The Stellar side is a mirror chain, not the primary settlement layer

## AMM Pool Pairings

### XRPL (6 pools)
| Pool | Status |
|------|--------|
| OPTKAS / XRP | Live |
| SOVBND / XRP | Live |
| IMPERIA / XRP | Live |
| GEMVLT / XRP | Live |
| TERRAVL / XRP | Live |
| PETRO / XRP | Live |

### Stellar (3 pools)
| Pool | Status |
|------|--------|
| OPTKAS-USD / XLM | Live |
| SOVBND-USD / XLM | Live |
| IMPERIA-USD / XLM | Live |
