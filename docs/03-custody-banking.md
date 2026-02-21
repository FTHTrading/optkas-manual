# 03 — Custody & Banking (L2)

> **Key Principle:** All tokens and IOUs are backed by real assets held in qualified custody. This is not a fractional system.

## Layer Summary

| Attribute | Value |
|-----------|-------|
| Layer | L2 — Custody & Banking |
| Capabilities | 10 |
| Status | All Live |

## Escrow & Custody Architecture

OPTKAS maintains 1:1 USD collateral backing through a qualified custodian (Securities Transfer Corporation). The custody model ensures:

- Physical and digital assets are held separately from operational funds
- Client funds are never commingled with platform operational capital
- Redemption can only occur through authorized governance channels

## Stablecoin Trustlines

The Treasury account maintains trustlines to four major USD stablecoin issuers on XRPL:

| Issuer | Trustline | Purpose |
|--------|-----------|---------|
| Bitstamp | USD.Bitstamp | Primary fiat rail |
| GateHub | USD.GateHub | Secondary liquidity |
| Tether | USD.Tether | Market depth |
| Circle | USD.Circle | Institutional grade |

These trustlines enable immediate USD-equivalent settlement without fiat wire delays.

## Fiat Controls

- **Destination tag enforcement:** RequireDestTag flag prevents untagged deposits
- **Fund segregation:** Separate wallet architecture isolates client vs. operational funds
- **FX operations:** Integrated FX provider for cross-currency settlement
- **SEP-24 anchor:** Stellar-side fiat on/off-ramp with KYC/AML compliance

## Banking Integration

The platform connects to traditional banking through:

1. Bank escrow accounts for fiat custody
2. Wire transfer infrastructure for redemptions
3. Compliance screening service for institutional KYC/AML
4. Controlled redemption workflows via custodian

## Capability Register

| ID | Capability | Mechanism | Status |
|----|-----------|-----------|--------|
| L2.CUS.001 | Hold USD collateral 1:1 | Qualified custodian (Securities Transfer Corp) | Live |
| L2.CUS.002 | Maintain bank escrow accounts | Traditional banking escrow | Live |
| L2.CUS.003 | Execute FX operations | FX provider integration | Live |
| L2.CUS.004 | Process fiat on/off-ramp | SEP-24 anchor (Stellar) | Live |
| L2.CUS.005 | Execute controlled redemptions | Fiat settlement via custodian | Live |
| L2.CUS.006 | Maintain USD stablecoin trustlines | Bitstamp, GateHub, Tether, Circle | Live |
| L2.CUS.007 | Enforce destination tag requirements | RequireDestTag flag | Live |
| L2.CUS.008 | Manage treasury cash positions | Treasury account balance management | Live |
| L2.CUS.009 | Process institutional KYC/AML | Compliance screening service | Live |
| L2.CUS.010 | Segregate client vs operational funds | Separate wallet architecture | Live |
