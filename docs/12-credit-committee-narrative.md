# 12 — Credit Committee Narrative

> **Purpose:** A five-minute walkthrough for institutional decision-makers. No jargon. No filler. Five questions, five answers, with verifiable evidence.

---

## The Five Questions Every Credit Committee Asks

### 1. Who Controls the Funds?

**Answer:** A purpose-built SPV (OPTKAS1-MAIN SPV, Wyoming) governed by a bond indenture with a registered Transfer Agent (Securities Transfer Corporation, SEC-registered).

- **No individual** can move funds unilaterally
- **Multisig governance** requires 2-of-3 signers for any on-chain transaction
- **Emergency freeze** can halt all operations in seconds — not hours
- **Insurance:** $25.75M coverage across E&O, D&O, cyber, and professional liability

**Verifiable:** Signer weights and thresholds are published on-ledger. Anyone with an XRPL explorer can verify the multisig configuration in real time.

---

### 2. Where Are the Assets?

**Answer:** On-ledger, individually identifiable, and independently verifiable.

| Asset Type | Location | Verification |
|-----------|----------|-------------|
| Stablecoin reserves | XRPL escrow accounts | XRPL explorer — real-time balance |
| Issued IOUs | XRPL trustlines | Trustline query — outstanding supply |
| Collateral evidence | XLS-20 NFTs (taxon 100) | NFT query — SHA-256 hash + metadata |
| Stellar instruments | Stellar regulated asset | Horizon API — balance + flags |

- No omnibus accounts
- No commingled custody
- Each position is individually traceable to a specific ledger entry

---

### 3. How Is Settlement Enforced?

**Answer:** Atomic Delivery-versus-Payment (DvP) using XRPL's native escrow and conditional execution.

**The sequence:**
1. Buyer funds escrow with stablecoin
2. Seller deposits asset into conditional hold
3. Both sides satisfy conditions (time lock OR cryptographic condition)
4. Settlement executes atomically — both sides clear or neither does
5. Receipts are minted as XLS-20 NFTs with SHA-256 hash of deal terms

**Key property:** There is no counterparty risk window. Settlement is not T+1 or T+2. It is T+0, atomic, and irreversible once conditions are met.

---

### 4. What Happens in Default?

**Answer:** A defined, automated, multi-step protocol — not a panic call.

| Step | Action | Timeline |
|------|--------|----------|
| 1 | Covenant breach detected by monitoring engine | Automatic |
| 2 | Alert to all signers + compliance officer | Immediate |
| 3 | Emergency freeze (if warranted) | Seconds |
| 4 | Borrowing base recalculation | < 1 hour |
| 5 | Collateral liquidation queue (if required) | Per indenture terms |
| 6 | Investor notification with attestation bundle | Same day |
| 7 | Recovery waterfall execution | Per bond indenture |
| 8 | Post-mortem + ledger evidence package | 48 hours |

**Key property:** Every step produces a verifiable ledger entry. The recovery process is auditable after the fact — not reconstructed from emails and spreadsheets.

---

### 5. What Prevents Unilateral Movement?

**Answer:** Four interlocking controls, each independently verifiable.

| Control | Mechanism | Bypass Difficulty |
|---------|-----------|------------------|
| **Multisig** | 2-of-3 signers required for any transaction | Requires compromise of 2 separate key holders |
| **Escrow conditions** | Time locks + cryptographic conditions on-ledger | Cannot be overridden — enforced by XRPL protocol |
| **Trustline authorization** | Issuer must authorize each trustline holder | Unauthorized accounts cannot hold or receive tokens |
| **Circuit breakers** | Automatic freeze on anomalous activity | Triggers on threshold violations — no human delay |

**The bottom line:** No single person, no single key, and no single decision can move assets. This is not a policy — it is an architectural constraint enforced by the ledger itself.

---

## Summary for the Committee

| Question | One-Line Answer |
|----------|----------------|
| Who controls funds? | SPV + multisig + registered transfer agent |
| Where are assets? | On-ledger, individually verifiable, no omnibus |
| How is settlement enforced? | Atomic DvP — T+0, no counterparty risk window |
| What happens in default? | Automated 8-step protocol with full evidence trail |
| What prevents unilateral movement? | Multisig + escrow + trustlines + circuit breakers |

> **Final note:** Every answer above can be independently verified using public ledger explorers. This is not a trust exercise — it is a verification exercise.
