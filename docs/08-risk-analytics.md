# 08 — Risk Analytics

## Overview

All risk metrics are computed in real-time via dedicated TypeScript engines. No spreadsheets. No manual calculations. No stale reports.

## Key Metrics

| Metric | Engine | Methodology | Frequency |
|--------|--------|-------------|-----------|
| Value at Risk (95%) | RiskAnalyticsEngine | 10,000 Monte Carlo simulations | Real-time |
| Value at Risk (99%) | RiskAnalyticsEngine | 10,000 Monte Carlo simulations | Real-time |
| Stress Test P&L | Stress Scenario Engine | Regulatory scenarios | On-demand |
| Liquidity Coverage Ratio | LCR Engine | Cash flow analysis | Daily |
| Concentration Index | HHI Engine | Herfindahl-Hirschman calculation | Real-time |
| Borrowing Base Ratio | BorrowingBaseEngine | Collateral valuation | Real-time |
| Over-Collateralization | Coverage Monitor | Asset/liability ratio | Real-time |
| NAV | ReserveVaultEngine | Multi-asset valuation | Real-time |
| P&L by Asset Class | PortfolioManager | Mark-to-market | Real-time |
| Slippage Monitoring | TradingEngine | Execution analytics | Real-time |

## Monte Carlo VaR

The RiskAnalyticsEngine runs 10,000 Monte Carlo simulations to compute Value at Risk at two confidence levels:

- **95% VaR:** The maximum expected loss over a defined period, 95% of the time
- **99% VaR:** The maximum expected loss over a defined period, 99% of the time

This is the same methodology used by Tier 1 banks and institutional risk managers.

## Stress Scenarios

The Stress Scenario Engine applies regulatory-standard stress tests:

- Interest rate shocks (parallel shifts, twists, butterflies)
- Credit spread widening
- Liquidity withdrawal scenarios
- Collateral devaluation stress
- Multi-factor combined scenarios

## Borrowing Base Certificates

Automated borrowing base certificates include:

- Eligible collateral inventory (by asset class)
- Haircut application per category
- Advance rate calculation
- Total borrowing capacity
- Current utilization
- Excess availability
- Covenant compliance summary

These certificates are generated programmatically and can be attested on-chain via the L4 evidence layer.

## Covenant Tracking

Active monitoring of all bond indenture covenants:

| Covenant Type | Monitoring |
|---------------|------------|
| Minimum collateral coverage | Real-time ratio tracking |
| Maximum concentration limits | HHI + per-asset thresholds |
| Reporting frequency requirements | Automated schedule compliance |
| Eligible collateral tests | Asset classification engine |
| Trigger events | Alert engine with escalation |

## Current Portfolio Metrics

| Metric | Value |
|--------|-------|
| NAV | $4.11M |
| Over-Collateralization | 250% |
| Reserve Ratio | 125% |
| Asset Classes | 8 |
| Monte Carlo Simulations | 10,000 |
| VaR Confidence Levels | 95% / 99% |
