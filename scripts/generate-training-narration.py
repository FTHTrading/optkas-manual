"""
OPTKAS Training Academy — Neural Voice Narration Generator
Uses Microsoft Edge TTS (en-US-AndrewNeural) for hyper-realistic voice.
Generates 8 teaching MP3s — one per module of the XRPL Training Academy.
"""

import asyncio
import edge_tts
import os

VOICE = "en-US-AndrewNeural"
RATE = "+0%"
OUTPUT_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "audio", "training")

# ─────────────────────────────────────────────────────────────
# TRAINING MODULE NARRATION SCRIPTS
# Each script teaches the module content as if a senior
# institutional advisor were explaining the XRP Ledger.
# ─────────────────────────────────────────────────────────────

MODULES = [
    {
        "filename": "mod1-what-is-xrpl.mp3",
        "text": """
Welcome to Module One of the XRPL Ledger Training Academy. In this module, you'll learn what the XRP Ledger is, where it came from, and why it matters.

The XRP Ledger — commonly called XRPL — is a decentralized, public blockchain created in twenty-twelve by David Schwartz, Jed McCaleb, and Arthur Britto. It was originally associated with the company Ripple Labs, but the XRP Ledger itself is open-source and operates independently of any single company.

Unlike Bitcoin, launched in two thousand nine, or Ethereum, launched in twenty fifteen, the XRPL was purpose-built from the start for value transfer and settlement — not for general-purpose computation or proof-of-work mining. Every design decision prioritized speed, low cost, and reliability for moving money.

How does consensus work? The XRPL does not use proof-of-work like Bitcoin or proof-of-stake like Ethereum. Instead, it uses a unique Federated Consensus mechanism based on a Unique Node List, or UNL. Each validator on the XRPL maintains a list of other trusted validators. To confirm a transaction, at least eighty percent of validators on the UNL must agree. This happens in three to five seconds — not minutes or hours.

There are no miners, no staking, and no energy waste. Transaction finality is deterministic, not probabilistic. The transaction cost is approximately two hundredths of a cent. The throughput is up to fifteen hundred transactions per second. And the ledger has closed over ninety million ledger versions since twenty twelve with zero downtime.

XRP is the native digital asset of the XRP Ledger. It serves three purposes. First, as a bridge currency — XRP can serve as an intermediary in cross-currency payments, converting USD to EUR through XRP in seconds. Second, as transaction fuel — every transaction burns a tiny amount of XRP, about one hundred thousandth of an XRP. This prevents spam and makes the supply mildly deflationary. Third, as an account reserve — each XRPL account must hold a minimum XRP balance, currently one XRP base plus two tenths of an XRP per ledger object. This prevents ledger bloat.

How does the XRPL compare to other blockchains? Bitcoin settles in about sixty minutes and costs one to fifty dollars per transaction. Ethereum settles in about twelve seconds plus finality delay and costs fifty cents to over a hundred dollars. The XRPL settles in three to five seconds and costs about two hundredths of a cent. The XRPL has a native built-in DEX, native escrow, native trustline-based tokens, native AMM pools via XLS-30, and native NFTs via XLS-20. Bitcoin and Ethereum require smart contracts or third-party solutions for most of these features.

The key takeaway: the XRPL's biggest advantage for institutional use is that features like token issuance, escrow, DEX, AMM, multi-signature, and NFTs are native to the protocol — not add-on smart contracts that can contain bugs. They are tested infrastructure that has been running for over a decade.
"""
    },
    {
        "filename": "mod2-core-features.mp3",
        "text": """
Module Two — Core XRPL Features.

In this module, you'll learn the native building blocks that make the XRP Ledger powerful for institutional applications.

First, trustlines and token issuance. On most blockchains, issuing a token requires deploying a smart contract. On the XRPL, anyone can issue a token using the native trustline system. A trustline is a bilateral agreement between two XRPL accounts. The receiving account declares: I trust this issuer to hold up to a certain amount of this currency. Until a trustline is established, you literally cannot receive a token from that issuer.

This is an opt-in model — no one can spam your account with unwanted tokens. Issuers have powerful controls: they can freeze individual trustlines or execute a global freeze. The DefaultRipple flag enables tokens to flow between holders without routing through the issuer. Issuers can set transfer fees on all token transfers. And each trustline requires a two-tenths XRP reserve deposit.

Why does this matter for OPTKAS? The platform uses trustlines to issue six custom tokens: OPTKAS, SOVBND, IMPERIA, GEMVLT, TERRAVL, and PETRO. Each bondholder must explicitly create a trustline before receiving tokens. The issuer can freeze any trustline instantly for compliance or default scenarios.

Second, the native DEX. The XRPL has a built-in order book exchange — a decentralized exchange — that has been running since twenty twelve. No smart contract needed. You place limit orders with OfferCreate, cancel with OfferCancel, and the system handles auto-bridging through XRP to find the best price across markets. Orders can fill partially, just like a traditional exchange. Anyone can trade any issued token against any other, including XRP.

Third, native escrow. The XRPL has the ability to lock funds on-chain with release conditions — no smart contract, no intermediary. There are three types. Time-based escrow uses EscrowCreate with a FinishAfter parameter — funds release automatically after a specified date. Condition-based escrow uses a cryptographic condition — funds release only when the fulfillment proof is provided. And cancellable escrow uses a CancelAfter deadline — if conditions aren't met in time, funds return to the creator.

Fourth, AMM pools. Since twenty twenty-four, the XRPL has native Automated Market Maker pools, similar to Uniswap but built into the protocol. You create pools with AMMCreate, add liquidity with AMMDeposit, and remove it with AMMWithdraw. The constant-product formula provides algorithmic pricing. LP token holders earn trading fees passively. Payments can auto-route through AMM pools for best pricing. And critically, the AMM and DEX orderbooks coexist — the system picks whichever offers the better price.

Fifth, native multi-signature accounts. The XRPL supports native multi-sig, requiring multiple parties to authorize a transaction. Using SignerListSet, you define which keys can sign and their weights. You set a quorum — the minimum weight required. OPTKAS uses flexible policies: two-of-three for transfers, three-of-three for configuration changes, and one-of-three for emergencies. The DisableMaster flag can remove the master key entirely so only multi-sig works. This prevents any single person from unilaterally moving funds — by protocol, not by policy.

Sixth, native NFTs using the XLS-20 standard. Since twenty twenty-two, the XRPL has native NFT support. NFTokenMint creates NFTs with metadata, transfer fees, and burn authority. NFTs can be grouped by taxon — OPTKAS uses taxon one hundred for attestation certificates. NFTs can also be traded on the native DEX marketplace. The platform uses NFTs for proof-of-reserves, attestation certificates, and access control.

Finally, additional native features include payment channels for off-ledger streaming, checks for deferred payments, deposit preauthorization for whitelist control, account deletion for recovering reserves, clawback for issuer compliance, tickets for pre-signing future transactions, and the emerging Hooks system for smart-contract-like logic.

These are all native protocol features — tested, proven, and running at scale.
"""
    },
    {
        "filename": "mod3-what-optkas-built.mp3",
        "text": """
Module Three — What OPTKAS Built on the Ledger.

This module covers the complete infrastructure — every account, token, pool, and engine.

Let's start with the nine mainnet accounts. OPTKAS operates six accounts on the XRP Ledger and three on the Stellar network. Each account has a specific, single-purpose role.

Account one is the Issuer on XRPL — the mint authority for all six IOUs. It has DefaultRipple turned on and cannot hold tokens itself, only issue them. Account two is the Treasury — it handles operational balance custody, requires destination tags, and holds four stablecoin trustlines. Account three is the Escrow account — it handles conditional fund locking with twenty-four hour timelocks and a ninety-day maximum hold period. Account four is the Attestation account — it mints evidence NFTs using the XLS-20 standard with taxon one hundred for attestation certificates.

Account five is the AMM Provider — it funds liquidity pools and is controlled by multi-signature. It manages six XRPL pools. Account six is the Trading account — it handles algorithmic DEX execution with a five percent circuit breaker and ten percent kill switch.

On the Stellar side: account seven is the Stellar Issuer with authorization required and clawback enabled. Account eight is the Stellar Distribution account — it handles settlement, LP provision, three AMM pools, and hash anchoring. Account nine is the Stellar Anchor — it provides the SEP-24 fiat bridge with integrated KYC and AML.

Now, the six XRPL tokens. These are issued as IOUs — trustline-based instruments. OPTKAS Primary is the bond claim receipt. SOVBND, or Sovereign Bond, is the sovereign claim tracker. IMPERIA is the asset-class claim. GEMVLT, or GemVault, handles vault participation. TERRAVL, or TerraVault, represents real estate claims. And PETRO is the energy asset claim. Each token has controlled transferability and freeze capability. On the Stellar side, OPTKAS-USD is the regulated asset with full clawback capability.

The nine AMM liquidity pools provide always-on trading. Six are on the XRPL — one for each token paired with XRP. Three are on Stellar — paired with XLM. These pools use the constant-product formula. Anyone can swap tokens twenty-four-seven. And liquidity providers earn passive trading fees.

The twenty-eight TypeScript engines are organized into eight categories. Bond engines handle the factory, accrual, coupon, and redemption. Issuance engines handle minting and burning. Settlement engines manage the settlement flow, escrow, and delivery-versus-payment. Vault engines handle the reserve vault, NAV calculation, share minting, and yield stripping. Risk engines run Monte Carlo VaR, stress tests, liquidity coverage ratio, and Herfindahl-Hirschman Index concentration analysis. Trading engines handle TWAP, VWAP, path optimization, and circuit breaking. Pipeline engines manage the deal pipeline, term sheet analysis, and waterfall distributions. And Evidence engines handle attestation, audit event storage, and hash verification.

Together, these twenty-eight engines, nine accounts, six tokens, and nine AMM pools form a complete institutional-grade settlement and control infrastructure — all operating on public ledger rails.
"""
    },
    {
        "filename": "mod4-beyond-the-bond.mp3",
        "text": """
Module Four — Beyond the Bond.

The five-hundred-million-dollar medium-term note program is the first product deployed on the OPTKAS infrastructure. But the infrastructure itself — the accounts, the engines, the trustline system, the AMM pools, the escrow mechanisms, and the attestation layer — can serve many other use cases without significant modification.

Think of it this way: OPTKAS built a settlement highway. The bond program is the first vehicle on that highway. But the infrastructure supports many more.

Let's walk through six use cases that the existing platform can serve right now.

First, real estate tokenization. You can fractionalize property ownership using XRPL trustlines. Each unit of a property becomes a transferable IOU. Settlement is atomic. Trustline freeze provides compliance controls for SEC regulations. The engines involved are: IssuanceEngine, ReserveVault, and AttestationEngine.

Second, invoice factoring and trade finance. Tokenize receivables as XRPL IOUs. Use escrow for conditional payment release on delivery confirmation. The attestation layer provides proof-of-delivery timestamps. This uses EscrowManager, SettlementEngine, and AuditEventStore.

Third, commodity receipts. Issue warehouse receipts for gold, oil, grain, or other commodities as XRPL tokens. Each token is backed by custodied physical assets. AMM pools provide instant liquidity. This uses IssuanceEngine, ReserveVault, and the AMM Provider.

Fourth, cross-border remittance. Use XRP as a bridge currency for instant settlement. Stellar's SEP-24 anchor provides fiat on and off ramps. Total settlement time is under ten seconds. This uses SettlementEngine, PathOptimizer, and the Stellar Anchor.

Fifth, fund administration. The complete NAV calculation, share minting, yield stripping, and investor reporting stack serves any fund structure. This uses ReserveVault, NAV, PortfolioManager, and ReportingEngine.

Sixth, audit and compliance infrastructure. Hash any document on-chain. Mint attestation NFTs as permanent proof. Cross-publish to Stellar for dual-chain verification. Third parties can verify independently. This uses AttestationEngine, HashVerifier, and AuditEventStore.

The most important thing to understand is that all of these use cases leverage existing infrastructure. The token issuance system is live and capable of supporting any tokenizable asset. Trustline-based distribution is live for controlled holder onboarding. Escrow-based settlement is live for any delivery-versus-payment scenario. The AMM liquidity pools are live for any token pair. Proof-of-reserves attestation is live for any custodied asset. Risk analytics are live for any portfolio. Multi-signature governance is live for any institutional account. And the cross-chain architecture between XRPL and Stellar is live for dual-ledger settlement.

The infrastructure is built. The question is simply: what do you put on it next?
"""
    },
    {
        "filename": "mod5-offering-services.mp3",
        "text": """
Module Five — Offering Services to Others.

OPTKAS has built institutional-grade infrastructure. This infrastructure can be offered as a service to other entities that need the same capabilities but don't want to build them from scratch.

Let's walk through six service offerings that the platform can support.

First, Token Issuance as a Service. The client brings an asset class, legal structure, and compliance framework. You provide token creation, trustline management, freeze controls, compliance flags, and AMM pool creation. Revenue comes from an issuance fee plus ongoing management fees. For example: a real estate fund wants to tokenize property shares. You create a new XRPL IOU, set up trustlines for their investors, and provide AMM liquidity.

Second, Escrow Settlement Services. The client brings two counterparties needing atomic settlement. You provide escrow creation, condition management, delivery-versus-payment execution, and settlement receipts. Revenue is a per-transaction settlement fee. For example: a private equity firm needs to sell a stake to a new LP. You manage the escrow — tokens release when payment clears, atomically.

Third, Risk Analytics Platform. The client brings a portfolio or fund needing risk reporting. You provide Monte Carlo Value-at-Risk, stress testing, borrowing base calculations, liquidity coverage ratio, and Herfindahl-Hirschman concentration analysis. Revenue is a monthly analytics subscription. For example: a family office with a fifty-million-dollar portfolio wants institutional-grade risk analytics.

Fourth, Proof and Attestation Services. The client brings documents, records, or data that needs permanent, verifiable proof. You provide SHA-256 hashing, XRPL memo anchoring, NFT attestation minting, and dual-chain publishing on both XRPL and Stellar. Revenue is a per-attestation fee plus an annual verification subscription. For example: an accounting firm wants immutable proof that audit reports were published on a specific date.

Fifth, Liquidity Provision. The client brings a token that needs market liquidity. You provide AMM pool creation, liquidity seeding, depth monitoring, and arbitrage correction. Revenue is an LP fee share plus a pool management fee. For example: a startup has issued a utility token on XRPL but no one can trade it. You create an AMM pool and provide initial liquidity.

Sixth, Deal Pipeline and Lender CRM. The client brings a capital raise or lending program. You provide a fourteen-stage lender CRM, term sheet ingestion and scoring, a Q and A portal, draw management, and waterfall distributions. Revenue is a platform fee plus a success fee on closes. For example: a mid-market company raising twenty-five million dollars needs to manage thirty lender conversations.

The revenue model spans eight streams. Token issuance generates setup fees plus annual management. Escrow and DvP settlement are per-transaction. Risk analytics are monthly subscriptions. Attestation and proof are per-document plus annual access. AMM liquidity earns LP fee shares plus management fees. Deal pipeline earns platform fees plus success fees. Bond coupon cashflows provide recurring yield. And trading spread and AMM fees generate passive market-making income.

The competitive moats are strong. Cryptographic proof is a higher standard than simply having a dashboard. Atomic T-plus-zero settlement eliminates counterparty risk. And operator-grade automation creates sticky, recurring value that clients cannot easily replicate.
"""
    },
    {
        "filename": "mod6-using-the-ledger.mp3",
        "text": """
Module Six — Using the Ledger, Practical Skills.

This module teaches you how to read accounts, verify transactions, and understand operations on the XRP Ledger.

Every XRPL account is fully public. You can inspect any account using a block explorer like livenet.xrpl.org or bithomp.com. When you look up an account, you can see its XRP balance, every trustline it has opted into with current balances, its complete transaction history, all account flags like RequireDestTag, DefaultRipple, and GlobalFreeze, its signer list showing the multi-sig configuration and weights, all NFTs minted by or held by the account, active escrow locks with amounts, conditions, and dates, and open DEX orders on the orderbook.

This is what verification means in practice. Every claim OPTKAS makes — that funds are in escrow, that an attestation was published, that tokens were minted — can be independently verified by anyone with an internet connection. This is not a trust exercise. It is a verification exercise.

Now, verifying transactions. Every XRPL transaction has a unique transaction hash — a sixty-four character hexadecimal string. This hash is your receipt. When you look at a transaction, you can see its type — Payment, OfferCreate, EscrowCreate, NFTokenMint, and so on. You see which account initiated it, the destination, the amount including currency and issuer for IOUs, the XRP fee burned, which ledger version included it, any attached memos — OPTKAS uses these for document hashes — and the result code. tesSUCCESS means the transaction was confirmed. Anything else means it failed.

Understanding reserves. The XRPL requires every account to hold a minimum XRP balance to prevent spam. The base reserve is one XRP just to activate an account. Then there's an owner reserve of two-tenths XRP per ledger object — per trustline, per escrow, per open offer, per NFT, per signer entry. So an account with five trustlines and three escrows needs one plus eight times two-tenths, which equals two point six XRP minimum. These reserve amounts are set by validator vote and have decreased over time historically.

Finally, common operations. Sending XRP uses a Payment transaction. Sending a token also uses Payment but routes through the trustline system. Setting up a trustline uses TrustSet. Placing a DEX order uses OfferCreate. Locking funds in escrow uses EscrowCreate. Releasing escrow uses EscrowFinish. Minting an NFT uses NFTokenMint. Creating an AMM pool uses AMMCreate. Freezing a trustline uses a modified TrustSet. And setting multi-sig uses SignerListSet.

Each of these operations is available to any funded account on the XRPL. They are native protocol transactions — not smart contract calls. This is the practical foundation for everything OPTKAS does on-chain.
"""
    },
    {
        "filename": "mod7-technical-deep-dive.mp3",
        "text": """
Module Seven — Technical Deep Dive.

This module covers the internal workings of the XRP Ledger: account flags, the amendment system, validators, and developer tools.

Every XRPL account has configurable flags set via AccountSet transactions. RequireDestTag requires all incoming payments to include a destination tag — OPTKAS uses this on Treasury and Trading accounts. DefaultRipple allows issued tokens to flow between holders directly — it's enabled on the Issuer account. GlobalFreeze freezes all trustlines issued by an account — this is the emergency control. DisableMaster disables the master key so only multi-sig works — this is planned for OPTKAS post-production. RequireAuth means the issuer must authorize each trustline holder — used on the Stellar side. And NoFreeze permanently gives up freeze authority — OPTKAS does not use this because freeze capability is needed for compliance.

The XRPL evolves through amendments — protocol upgrades voted on by validators. Key amendments include: AMM, or XLS-30, which enabled native automated market makers in twenty twenty-four. NFTokens, or XLS-20, which enabled native NFTs in twenty twenty-two. Clawback, which allows issuers to reclaim tokens for compliance. Checks for deferred payment instruments. DepositPreauth for whitelist-based deposit control. And Hooks, which are smart-contract-like logic currently under development. Amendments require at least eighty percent validator support for two continuous weeks before activating. This prevents hasty or contentious changes.

The XRPL mainnet runs approximately one hundred fifty or more validators globally. The default Unique Node List, published by the XRPL Foundation, contains about thirty-five trusted validators. These include universities, exchanges, financial institutions, and independent operators. Ripple operates about six of the thirty-five-plus default UNL validators — a minority with no veto power. Anyone can run a validator, but not everyone gets added to the default UNL.

Developer tools and SDKs. xrpl.js is the official JavaScript and TypeScript SDK — it handles signing, submitting, and subscribing to ledger events. xrpl-py is the Python SDK for scripting and automation. xrpl4j is the Java SDK for enterprise integration. rippled is the core C++ server software — you can run your own node. Clio is an optimized C++ API server for read queries. The XRPL Testnet provides a free test network. The XRPL Devnet offers pre-release feature testing. And the WebSocket and JSON-RPC APIs provide real-time subscription and request-response query capabilities.

OPTKAS uses xrpl.js for all on-chain interactions across its twenty-eight TypeScript engines. WebSocket subscriptions provide real-time monitoring of all nine accounts. And the pre-flight verification suite runs over seventy checks before any mainnet transaction.

Finally, pathfinding and auto-routing. The XRPL can automatically find the cheapest path to execute a payment across multiple currencies. If you want to send USD and the recipient wants EUR, the pathfinding engine checks multiple routes: USD to EUR direct, USD to XRP to EUR, or USD to GBP to EUR. It picks the path with the best exchange rate, possibly routing through AMM pools and DEX orderbooks simultaneously. And everything happens atomically — either the full payment succeeds or nothing moves.
"""
    },
    {
        "filename": "mod8-stellar-crosschain.mp3",
        "text": """
Module Eight — Stellar Network and Cross-Chain Strategy.

OPTKAS operates on both the XRP Ledger and the Stellar network. This is not redundancy — each ledger provides capabilities the other doesn't.

The XRPL is the primary settlement chain. It handles the six token IOUs, six AMM pools, native escrow, XLS-20 NFT attestations, and multi-signature governance. Stellar serves as the secondary chain, handling the one regulated asset, three AMM pools, fiat on and off ramps via SEP-24, clawback capability, and data anchoring through manage_data operations.

Why Stellar specifically? Stellar was designed for compliance-grade regulated assets. Its issuer controls are more granular than XRPL's. And critically, it provides the fiat bridge — the ability for users to deposit real dollars and receive digital tokens, or redeem tokens back to real dollars.

Let's talk about Stellar SEP Standards. SEP stands for Stellar Ecosystem Proposal — standards for how Stellar applications interoperate.

SEP-10, Web Authentication, provides cryptographic login. It proves you own a Stellar account without sharing your keys. SEP-24, Hosted Deposit and Withdrawal, is the fiat on and off ramp. Users deposit USD to receive OPTKAS-USD tokens, or redeem tokens for USD. KYC and AML are integrated directly into the flow. And SEP-31, Cross-Border Payments, enables direct fiat-to-fiat transfers via the Stellar network, with the network handling currency conversion.

The Stellar OPTKAS-USD asset is issued with three critical compliance flags. AUTH_REQUIRED means every holder must be explicitly approved by the issuer before they can hold the token. This enables KYC-gated access. AUTH_REVOCABLE means the issuer can revoke a holder's authorization at any time — this is the freeze equivalent on Stellar. And CLAWBACK means the issuer can reclaim tokens from a holder's account. The XRPL doesn't have this capability — clawback is Stellar-only. It's critical for regulatory compliance scenarios where tokens may need to be recalled.

Now, how the two chains work together. The cross-chain architecture has five key integration points.

Issuance: tokens are minted on XRPL as the primary and on Stellar as a mirror, simultaneously. Attestation: document hashes are published to both chains — via XRPL memos and Stellar manage_data operations. Proof pairs: every significant event produces a hash on XRPL and a matching hash on Stellar, creating dual-chain proof. Settlement: XRPL handles atomic delivery-versus-payment via escrow while Stellar provides the fiat bridge for on and off ramping. And in a default scenario: XRPL trustlines are frozen and Stellar authorizations are revoked simultaneously.

The final takeaway: the dual-chain architecture means that no single network failure can compromise the system. If the XRPL has issues, Stellar records remain. If Stellar has issues, XRPL records remain. This is not just redundancy — it's institutional-grade resilience.

Congratulations — you have completed all eight modules of the XRPL Ledger Training Academy. You now understand the ledger fundamentals, OPTKAS infrastructure, beyond-bond capabilities, service offerings, practical operations, technical architecture, and cross-chain strategy.
"""
    },
]


async def generate_one(module, index, total):
    filepath = os.path.join(OUTPUT_DIR, module["filename"])

    # Skip if already generated and > 10KB
    if os.path.exists(filepath) and os.path.getsize(filepath) > 10240:
        size_kb = os.path.getsize(filepath) / 1024
        print(f"[{index}/{total}] SKIP (exists): {module['filename']} ({size_kb:.0f} KB)")
        return True

    max_retries = 5
    for attempt in range(1, max_retries + 1):
        try:
            print(f"[{index}/{total}] Generating: {module['filename']} (attempt {attempt})...")
            communicate = edge_tts.Communicate(
                text=module["text"].strip(),
                voice=VOICE,
                rate=RATE
            )
            await communicate.save(filepath)
            size_kb = os.path.getsize(filepath) / 1024
            print(f"  -> Saved ({size_kb:.0f} KB)")
            return True
        except Exception as e:
            print(f"  x Error: {e}")
            if attempt < max_retries:
                wait = attempt * 8
                print(f"  Retrying in {wait}s...")
                await asyncio.sleep(wait)
    return False


async def generate_training_audio():
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    failed = []
    for i, module in enumerate(MODULES, 1):
        ok = await generate_one(module, i, len(MODULES))
        if not ok:
            failed.append(module["filename"])
        await asyncio.sleep(3)

    if failed:
        print(f"\n!! Failed: {', '.join(failed)}")
    else:
        print(f"\n-> Done. {len(MODULES)} training MP3 files generated in: {OUTPUT_DIR}")


if __name__ == "__main__":
    asyncio.run(generate_training_audio())
