# 07 — Ledger Evidence (L4)

> **Key Principle:** Every significant action is hashed, timestamped, and permanently anchored. You don't need to trust the team — you verify the ledger.

## Layer Summary

| Attribute | Value |
|-----------|-------|
| Layer | L4 — Ledger Evidence |
| Capabilities | 10 |
| Status | All Live |

## Attestation NFTs (XLS-20)

OPTKAS mints non-transferable NFTs on XRPL as permanent proof markers:

- **Taxon 100** — reserved for attestation NFTs
- **Minted from:** Attestation wallet
- **Content:** SHA-256 hash of the attested document or reserve snapshot
- **Value:** Zero economic value — purely evidentiary
- **Transferability:** Non-transferable (proof anchor, not a tradeable asset)

Each attestation NFT is a cryptographic receipt proving that a specific document or state existed at a specific time. Third parties can independently verify by:

1. Retrieving the XRPL transaction ID
2. Extracting the SHA-256 hash from the memo field
3. Comparing against the claimed document
4. Confirming the timestamp matches

## Hash Anchoring

Documents are anchored using SHA-256 hashing:

```
Document → SHA-256 → Hash embedded in XRPL memo → Permanent record
```

This creates an unforgeable timestamp. The document can change — but the hash proves what the document said at the time of anchoring.

## Dual-Chain Redundancy

Every major attestation is published to both chains:

| Chain | Mechanism | Purpose |
|-------|-----------|---------|
| XRPL | Memo-embedded hash + NFT mint | Primary attestation |
| Stellar | manage_data operation | Redundant proof |

This dual-chain approach means:
- If one chain is temporarily unavailable, proof exists on the other
- Cross-chain proof pairs create stronger evidentiary support
- Third parties can verify on either chain

## Audit Trail Mechanics

The AuditEventStore engine maintains an append-only log of all significant events:

- Bond issuances
- Escrow creations and completions
- Token mints and burns
- Signer changes
- Freeze events
- Configuration changes
- Reserve attestation timestamps

This log is immutable — events can be added but never modified or deleted.

## Capability Register

| ID | Capability | Mechanism | Status |
|----|-----------|-----------|--------|
| L4.ATT.001 | Anchor SHA-256 document hashes on XRPL | Memo-embedded transactions | Live |
| L4.ATT.002 | Mint XLS-20 NFT reserve attestations | NFT minting (taxon 100) | Live |
| L4.ATT.003 | Publish reserve snapshots permanently | Hash + NFT combination | Live |
| L4.ATT.004 | Cross-publish hashes to Stellar | manage_data operation | Live |
| L4.ATT.005 | Timestamp settlement receipts | Transaction-embedded timestamps | Live |
| L4.ATT.006 | Create dual-chain proof pairs | XRPL + Stellar hash anchoring | Live |
| L4.ATT.007 | Maintain append-only audit event store | AuditEventStore engine | Live |
| L4.ATT.008 | Verify document integrity | Hash verification engine | Live |
| L4.ATT.009 | Generate proof-of-reserves reports | Reserve proof engine | Live |
| L4.ATT.010 | Enable third-party verification | Published XRPL transaction IDs | Live |

## Verification Walkthrough

When a lender asks "how do I verify your reserves?":

1. Navigate to the attestation record
2. Copy the XRPL transaction ID
3. Look it up on any XRPL explorer (e.g. xrpscan.com)
4. Extract the SHA-256 hash from the memo field
5. Compare against the reserve document you were given
6. The hash either matches or it doesn't — there is no middle ground
7. Optionally verify the Stellar proof pair for redundancy

This is not an auditor letter. This is cryptographic proof.
