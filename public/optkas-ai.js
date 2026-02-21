/* ============================================
   OPTKAS — AI KNOWLEDGE ASSISTANT
   Embedded Q&A engine for Training Academy
   Keyword-matched, dual-depth (Simple / Deep)
   ============================================ */

(function () {
    'use strict';

    // ─── KNOWLEDGE BASE ───────────────────────────────────────
    // Each entry: keywords (match), question (display), simple (beginner), deep (institutional)
    var KB = [

        // ───── MINTING & TOKEN CREATION ─────
        {
            keywords: ['mint', 'create token', 'issue token', 'how are tokens made', 'token creation', 'issue iou', 'minting process', 'how to mint'],
            question: 'How does OPTKAS mint / create tokens?',
            simple: 'Think of minting like printing a stock certificate — but digital and on a public ledger.\n\n' +
                '1. The **Issuer Account** (Account #1) is the only account that can create new tokens\n' +
                '2. The issuer sends a "Payment" transaction — this is the mint\n' +
                '3. The token goes to the **Treasury Account** (Account #2) for safekeeping\n' +
                '4. Before anyone else can receive the token, they must set up a **trustline** — like saying "I agree to accept this type of token"\n\n' +
                '**Real-world analogy:** The Issuer is the mint (like the U.S. Mint), the Treasury is the vault, and the trustline is your bank account that can hold that currency.',
            deep: '**Issuance Mechanics (XRPL Native):**\n\n' +
                '• The Issuer account has `DefaultRipple` enabled — allowing tokens to flow between holders without routing through the issuer\n' +
                '• Minting = a standard `Payment` transaction from the Issuer to the Treasury\n' +
                '• The Issuer account cannot hold its own tokens (XRPL design rule)\n' +
                '• 6 IOUs are minted: OPTKAS, SOVBND, IMPERIA, GEMVLT, TERRAVL, PETRO\n' +
                '• Each token maps to an asset class: bonds, sovereign claims, vault shares, gems, real estate, energy\n' +
                '• The Issuer can freeze any individual trustline or trigger a Global Freeze for compliance\n' +
                '• On Stellar, issuance uses `AUTH_REQUIRED` + `AUTH_REVOCABLE` + `CLAWBACK` flags\n' +
                '• IssuanceEngine (TypeScript) orchestrates: validates tranche terms → calls Payment → records event → triggers attestation\n\n' +
                '**Capability IDs:** L3.ISS.001 (XRPL mint), L3.ISS.002 (Stellar mint), L5.XRP.001 (IOU issuance)'
        },
        {
            keywords: ['real estate', 'property', 'terravl', 'terravault', 'tokenize property', 'property token', 'real estate token'],
            question: 'How does real estate tokenization work?',
            simple: 'Imagine you own a building worth $1 million. Instead of selling the whole thing, you break it into 10,000 digital tokens — each worth $100.\n\n' +
                '**Step-by-step:**\n' +
                '1. The property is appraised and legally documented\n' +
                '2. OPTKAS mints **TERRAVL** tokens — each one represents a fraction of the property\n' +
                '3. Investors set up a trustline to receive TERRAVL\n' +
                '4. Tokens are distributed to investors via escrow (Delivery vs. Payment)\n' +
                '5. An AMM liquidity pool (TERRAVL / XRP) is created so investors can trade their shares anytime\n\n' +
                '**Result:** Property ownership is fractional, tradeable 24/7, and settlement takes 3-5 seconds instead of 30-60 days.',
            deep: '**TERRAVL Token Flow:**\n\n' +
                '• Legal: Property placed into SPV under Wyoming law, UCC lien filed (L1.LEG.004)\n' +
                '• Custody: 1:1 asset backing verified by custodian (L2.CUS.001)\n' +
                '• Mint: IssuanceEngine mints TERRAVL on XRPL Issuer → Treasury (L3.ISS.001)\n' +
                '• Distribution: Holders set TrustSet for TERRAVL, receive via DvP escrow (L5.XRP.007)\n' +
                '• Liquidity: AMMCreate establishes TERRAVL/XRP pool (L5.AMM.001)\n' +
                '• Evidence: AttestationEngine mints XLS-20 NFT proving the issuance (L4.ATT.002)\n' +
                '• Freeze capability remains with issuer for regulatory compliance (L5.XRP.008)\n' +
                '• ReserveVault tracks NAV in real-time (L3.RVT.001), rebalances if needed\n' +
                '• On Stellar, OPTKAS-USD mirror provides fiat-denominated liquidity with CLAWBACK'
        },
        {
            keywords: ['gem', 'gemvlt', 'gemvault', 'precious', 'diamond', 'gems', 'precious stone', 'gem token'],
            question: 'How do gems / precious stones get tokenized?',
            simple: 'Gems work just like real estate tokenization, but the underlying asset is a vault of certified precious stones.\n\n' +
                '**Step-by-step:**\n' +
                '1. Gems are appraised, certified (GIA etc.), and placed in a qualified vault\n' +
                '2. OPTKAS mints **GEMVLT** tokens — each represents a share of the gem vault\n' +
                '3. Investors set up a trustline for GEMVLT\n' +
                '4. Tokens are distributed via atomic DvP (investor sends payment, receives GEMVLT simultaneously)\n' +
                '5. A GEMVLT / XRP liquidity pool lets investors trade their vault shares 24/7\n\n' +
                '**Key benefit:** You can own a fraction of a $5M emerald collection without physically holding anything. The blockchain records your claim permanently.',
            deep: '**GEMVLT Architecture:**\n\n' +
                '• Asset custody: Physical gems in qualified custodian vault (L2.CUS.001)\n' +
                '• Legal structure: Gem collection held by SPV, UCC lien secures holders (L1.LEG.004)\n' +
                '• Token: GEMVLT IOU — Controlled transfer, Freezable, no XRPL clawback\n' +
                '• Mint: Issuer → Treasury via IssuanceEngine (L5.XRP.001)\n' +
                '• Pool: AMMCreate for GEMVLT/XRP (L5.AMM.001), AMMDeposit seeds initial liquidity\n' +
                '• Valuation: ReserveVault engine calculates real-time NAV based on gem market data (L3.RVT.001)\n' +
                '• Proof: AttestationEngine mints NFT with SHA-256 hash of appraisal + vault receipt (L4.ATT.002)\n' +
                '• Risk: MonteCarloVaR runs 10,000 simulations on gem price volatility (L3.RSK.002)\n' +
                '• The gem-backed tokens can also be used as collateral in the bond program\'s borrowing base'
        },

        // ───── AMM / LIQUIDITY POOLS ─────
        {
            keywords: ['amm', 'liquidity pool', 'lp', 'pool', 'how pool work', 'automated market maker', 'create pool', 'amm pool', 'liquidity'],
            question: 'How do AMM liquidity pools work?',
            simple: 'An AMM pool is like a **vending machine for tokens**. Instead of finding a buyer/seller, you trade against the pool itself.\n\n' +
                '**How it works:**\n' +
                '1. Someone deposits two tokens into a "pool" — say 1,000 OPTKAS and 10,000 XRP\n' +
                '2. The pool uses a math formula to set the price: Token A × Token B = Constant\n' +
                '3. When you want to buy OPTKAS, you send XRP to the pool and get OPTKAS back\n' +
                '4. The price adjusts automatically based on supply/demand\n' +
                '5. The person who deposited tokens earns a small fee on every trade\n\n' +
                '**Simple analogy:** Imagine a seesaw. One side is XRP, the other is OPTKAS. When someone adds weight (buys) on one side, the price of the other side goes up.\n\n' +
                'OPTKAS operates **9 pools** — 6 on XRPL and 3 on Stellar.',
            deep: '**XLS-30 AMM Protocol (XRPL Native):**\n\n' +
                '• **Constant Product Market Maker (CPMM):** x × y = k\n' +
                '   - x = reserve of Token A, y = reserve of Token B, k = constant\n' +
                '   - Price = y/x for Token A in terms of Token B\n' +
                '• **AMMCreate:** Establishes a new pool with initial deposit of both assets\n' +
                '   - Automatically generates LP tokens representing the provider\'s share\n' +
                '   - Pool gets a unique AMM account on the ledger\n' +
                '• **AMMDeposit:** Add liquidity (single-sided or dual-asset)\n' +
                '   - Single-sided deposit: Add only one asset (pool auto-rebalances)\n' +
                '   - Dual-asset: Add both in current ratio\n' +
                '• **AMMWithdraw:** Remove liquidity by burning LP tokens\n' +
                '• **AMMVote:** LP holders vote on the trading fee (0.001% – 1%)\n' +
                '• **AMMBid:** Auction for a reduced-fee trading slot (24h window)\n' +
                '• **AMM + DEX Coexistence:** XRPL routes payments through whichever gives the better price — AMM pool or DEX orderbook\n' +
                '• **Arbitrage:** If AMM price diverges from DEX, arbitrageurs correct it automatically\n\n' +
                '**OPTKAS Pools (9 total):**\n' +
                '• XRPL (6): OPTKAS/XRP, SOVBND/XRP, IMPERIA/XRP, GEMVLT/XRP, TERRAVL/XRP, PETRO/XRP\n' +
                '• Stellar (3): OPTKAS-USD/XLM, SOVBND-USD/XLM, IMPERIA-USD/XLM\n\n' +
                '**Capability IDs:** L5.AMM.001–L5.AMM.009'
        },
        {
            keywords: ['lp token', 'lp tokens', 'what is lp', 'liquidity provider', 'pool token', 'pool share'],
            question: 'What are LP tokens?',
            simple: 'When you deposit tokens into a liquidity pool, the pool gives you **LP tokens** in return. Think of them as a **receipt** proving you contributed.\n\n' +
                '• You deposit 100 GEMVLT + 1,000 XRP into the pool\n' +
                '• The pool gives you LP tokens (like shares in the pool)\n' +
                '• While your tokens sit in the pool, traders pay fees — your share of fees grows\n' +
                '• When you want your tokens back, you "burn" (return) your LP tokens\n' +
                '• You get back your original tokens PLUS the fees earned\n\n' +
                '**Simple analogy:** LP tokens are like a coat check ticket. You hand over your coat (tokens), get a ticket (LP token), and when you return the ticket, you get your coat back — plus a tip.',
            deep: '**LP Token Mechanics (XLS-30):**\n\n' +
                '• LP tokens are auto-generated by the AMM account on pool creation\n' +
                '• They are standard XRPL IOUs issued by the AMM account itself\n' +
                '• LP token value = proportional share of total pool reserves\n' +
                '• Formula: LP_share = (your_LP_tokens / total_LP_supply) × pool_reserves\n' +
                '• Fees accumulate by increasing the pool reserves (k grows), making each LP token worth more\n' +
                '• LP tokens are transferable — they can be traded on the DEX or used as collateral\n' +
                '• AMMWithdraw burns LP tokens and returns proportional reserves\n' +
                '• Single-asset withdrawal is possible (receive only one token, pool auto-sells the other)\n' +
                '• Impermanent loss applies: if token prices diverge significantly, LP holders may have less than if they just held\n\n' +
                '**Capability ID:** AMM-06 (LP Token Management)'
        },
        {
            keywords: ['create pool', 'make pool', 'set up pool', 'ammcreate', 'how to create', 'start pool', 'pool creation', 'new pool'],
            question: 'How do you create a new liquidity pool?',
            simple: 'Creating a pool is actually simple — it takes one transaction:\n\n' +
                '**Step-by-step:**\n' +
                '1. You need two tokens — like TERRAVL and XRP\n' +
                '2. You decide how much of each to deposit initially (e.g., 10,000 TERRAVL + 50,000 XRP)\n' +
                '3. You send an **AMMCreate** transaction to the XRPL\n' +
                '4. The ledger creates a brand-new pool account automatically\n' +
                '5. You receive LP tokens representing your 100% ownership of this new pool\n' +
                '6. Now anyone on the XRPL can trade TERRAVL ↔ XRP through your pool!\n\n' +
                '**Cost:** Just the normal XRPL transaction fee (~$0.0002) plus the XRP reserve for the new account.\n\n' +
                '**Who controls it?** Nobody — and everybody. The pool runs on math, not human decisions. The AMM Provider account (#5) manages OPTKAS pools under multisig governance.',
            deep: '**AMMCreate Transaction Details:**\n\n' +
                '```\n' +
                '{\n' +
                '  "TransactionType": "AMMCreate",\n' +
                '  "Account": "<AMM Provider Account>",\n' +
                '  "Amount": { "currency": "TERRAVL", "issuer": "<Issuer>", "value": "10000" },\n' +
                '  "Amount2": "50000000000",  // 50,000 XRP in drops\n' +
                '  "TradingFee": 500          // 0.5% fee (in basis points / 100)\n' +
                '}\n' +
                '```\n\n' +
                '**What happens on-chain:**\n' +
                '1. XRPL creates a new AMM account (no master key, protocol-controlled)\n' +
                '2. Both assets are transferred to the AMM account\n' +
                '3. LP tokens are minted: √(Amount × Amount2) = initial LP supply\n' +
                '4. LP tokens sent to the creator\n' +
                '5. Pool is immediately tradeable by anyone on the network\n\n' +
                '**OPTKAS process:** The AMM Provider account (#5) is used, controlled by 2-of-3 multisig (L5.MSG.001). Pool creation requires governance approval.\n\n' +
                '**Capability ID:** L5.AMM.001, AMM-01'
        },

        // ───── MINT → POOL → TRADE FLOW ─────
        {
            keywords: ['mint to pool', 'mint and pool', 'full flow', 'end to end', 'mint pool trade', 'whole process', 'complete flow', 'step by step'],
            question: 'What is the full Mint → Pool → Trade flow?',
            simple: 'Here\'s the complete journey of a tokenized asset — from nothing to tradeable:\n\n' +
                '**Phase 1 — MINT (Create the token)**\n' +
                '① Legal: Asset documented, SPV filings done\n' +
                '② Custody: Asset placed with qualified custodian\n' +
                '③ Mint: Issuer creates tokens → sends to Treasury\n\n' +
                '**Phase 2 — POOL (Make it tradeable)**\n' +
                '④ The AMM Provider takes tokens from Treasury\n' +
                '⑤ AMM Provider deposits tokens + XRP into a new pool (AMMCreate)\n' +
                '⑥ LP tokens are received — proving pool ownership\n\n' +
                '**Phase 3 — TRADE (People can buy/sell)**\n' +
                '⑦ Anyone with a trustline can now swap XRP for the token\n' +
                '⑧ Price adjusts automatically based on supply/demand\n' +
                '⑨ LP providers earn fees on every trade\n\n' +
                '**Phase 4 — PROOF**\n' +
                '⑩ Every step is recorded on-chain and an attestation NFT is minted as permanent proof\n\n' +
                '**Time:** The entire process can complete in under 30 seconds on-chain.',
            deep: '**Institutional Mint → Pool → Trade Pipeline:**\n\n' +
                '**LAYER 1 (Legal):**\n' +
                '• SPV formation → Bond indenture execution → UCC filings (L1.LEG.001–004)\n' +
                '• Transfer agent registration with Securities Transfer Corp (L1.LEG.005)\n\n' +
                '**LAYER 2 (Custody):**\n' +
                '• 1:1 collateral deposited with custodian (L2.CUS.001)\n' +
                '• Banking escrow accounts established (L2.CUS.002)\n\n' +
                '**LAYER 5 (Settlement):**\n' +
                '• Issuer Account: Payment tx mints tokens → Treasury (L5.XRP.001)\n' +
                '• Treasury → AMM Provider: Internal transfer under multisig (L5.MSG.001)\n' +
                '• AMM Provider: AMMCreate with token + XRP pair (L5.AMM.001)\n' +
                '• LP tokens auto-generated and held by AMM Provider account\n\n' +
                '**LAYER 3 (Automation):**\n' +
                '• IssuanceEngine validates tranche terms before mint (L3.ISS.001)\n' +
                '• ReserveVault updates NAV after issuance (L3.RVT.001)\n' +
                '• RiskAnalyticsEngine runs Monte Carlo VaR (L3.RSK.002)\n\n' +
                '**LAYER 4 (Evidence):**\n' +
                '• AttestationEngine mints XLS-20 NFT with SHA-256 hash (L4.ATT.002)\n' +
                '• AuditEventStore logs all events (L4.AUD.001)\n\n' +
                '**Post-creation:** Pool is monitored by L5.AMM.006 (depth/pricing), arbitrage correction via L5.AMM.009, and PathOptimizer routes trades through AMM vs DEX (L3.TRD.007)'
        },

        // ───── TRUSTLINES ─────
        {
            keywords: ['trustline', 'trust line', 'how trustline', 'what is trustline', 'set trustline', 'opt in'],
            question: 'What is a trustline and why do I need one?',
            simple: 'A trustline is like **opening an account** with a specific token issuer. You\'re saying: "I agree to hold tokens from this issuer."\n\n' +
                '**Why it exists:** On the XRPL, nobody can send you a token you haven\'t agreed to receive. This prevents spam and gives you control.\n\n' +
                '**How to set one up:**\n' +
                '1. Submit a `TrustSet` transaction\n' +
                '2. Specify which token and issuer you trust\n' +
                '3. Set a maximum amount (optional)\n' +
                '4. Pay a small 0.2 XRP reserve deposit\n' +
                '5. You can now receive that token!\n\n' +
                '**Analogy:** It\'s like opening a specific currency account at a bank. You can\'t receive Euros until your bank sets up a Euro account for you.',
            deep: '**TrustSet Transaction (XRPL):**\n\n' +
                '• `TrustSet` with `LimitAmount` specifying currency code, issuer, and max value\n' +
                '• Reserve: 0.2 XRP per trustline (owner reserve increment)\n' +
                '• `DefaultRipple` on the issuer enables peer-to-peer token transfers\n' +
                '• Issuer Freeze: `TrustSet` with Freeze flag locks individual trustlines (L5.XRP.008)\n' +
                '• `GlobalFreeze`: Emergency halt on all transfers (L5.XRP.009)\n' +
                '• Transfer fees: Issuer can charge a % on all transfers\n' +
                '• OPTKAS uses 6 trustlines: OPTKAS, SOVBND, IMPERIA, GEMVLT, TERRAVL, PETRO\n' +
                '• Stellar equivalent: Holder must `changeTrust` with AUTH_REQUIRED approval from issuer\n\n' +
                '**Capability IDs:** L5.XRP.002 (trustline opt-in), L5.XRP.019 (reserve enforcement)'
        },

        // ───── DVP / ESCROW ─────
        {
            keywords: ['dvp', 'delivery vs payment', 'delivery versus payment', 'atomic swap', 'escrow', 'settlement', 'how settlement'],
            question: 'How does Delivery vs. Payment (DvP) settlement work?',
            simple: 'DvP means **both sides of a trade happen at exactly the same time**. The buyer gets the token AND the seller gets the payment simultaneously — or neither side gets anything.\n\n' +
                '**How OPTKAS does it:**\n' +
                '1. The seller locks their tokens in an XRPL escrow\n' +
                '2. The buyer locks their payment (XRP or stablecoin) in another escrow\n' +
                '3. Both escrows have the same cryptographic condition\n' +
                '4. When the condition is fulfilled, BOTH release simultaneously\n' +
                '5. If anything goes wrong, both escrows cancel and everything returns\n\n' +
                '**Why this matters:** In traditional finance, settlement takes 1-3 days (T+1 to T+3) and requires a clearing agent. OPTKAS settles in 3-5 seconds with no intermediary.',
            deep: '**Atomic DvP via Dual Escrow (XRPL):**\n\n' +
                '• Two `EscrowCreate` transactions with matching `Condition` (SHA-256 hash)\n' +
                '• `FinishAfter` sets the earliest release time (24h timelock for review)\n' +
                '• `CancelAfter` sets expiry (90d max hold)\n' +
                '• `EscrowFinish` with `Fulfillment` (preimage) releases both atomically\n' +
                '• If conditions aren\'t met: `EscrowCancel` returns funds after `CancelAfter`\n' +
                '• Settlement is cryptographic — no human can alter conditions once escrow is live\n' +
                '• Multisig (2-of-3) controls the fulfillment key distribution\n\n' +
                '**Workflow:** L5.XRP.004 (create) → L5.XRP.005 (finish) → L4.ATT.002 (attestation NFT)\n\n' +
                '**Capability IDs:** L5.XRP.003-006 (escrow), L5.XRP.007 (DvP), L3.SET.001 (engine)'
        },

        // ───── MULTISIG ─────
        {
            keywords: ['multisig', 'multi sig', 'multi-sig', 'signature', 'who controls', 'governance', '2 of 3', 'two of three', 'signer'],
            question: 'How does multi-signature governance work?',
            simple: 'Multi-sig means **more than one person must approve** a transaction for it to go through. Nobody can act alone.\n\n' +
                '**OPTKAS uses a 2-of-3 model:**\n' +
                '• 3 authorized signers are configured on the account\n' +
                '• Any transaction needs 2 of the 3 to sign\n' +
                '• Configuration changes (like adding/removing signers) need all 3\n' +
                '• In an emergency, 1 signer can freeze everything immediately\n\n' +
                '**Analogy:** It\'s like a safe deposit box that needs two keys. The bank has one key and you have one key — neither can open it alone.',
            deep: '**Multi-Signature Architecture (XRPL):**\n\n' +
                '• `SignerListSet` configures 3 signers with weights\n' +
                '• Standard ops: Quorum = 2 (2-of-3 required)\n' +
                '• Config changes: Quorum = 3 (3-of-3, unanimous)\n' +
                '• Emergency freeze: Weight 1 signer can trigger GlobalFreeze (1-of-3)\n' +
                '• `DisableMaster`: Master key removed — only multisig works (L5.XRP.017, Planned)\n' +
                '• Signer rotation via `SignerListSet` update (L5.MSG.004)\n' +
                '• Each signer submits a `SignerBlob` independently; they\'re combined and submitted\n\n' +
                '**Capability IDs:** L5.MSG.001–005'
        },

        // ───── XRPL BASICS ─────
        {
            keywords: ['what is xrpl', 'xrp ledger', 'what is xrp', 'xrpl explained', 'what is the ledger', 'blockchain', 'how xrpl works'],
            question: 'What is the XRP Ledger?',
            simple: 'The XRP Ledger (XRPL) is a **public blockchain** purpose-built for moving money and value quickly.\n\n' +
                '**Key facts:**\n' +
                '• Created in 2012 by David Schwartz, Jed McCaleb, and Arthur Britto\n' +
                '• Settles transactions in 3-5 seconds (Bitcoin takes ~60 minutes)\n' +
                '• Costs ~$0.0002 per transaction (Ethereum can cost $1-100+)\n' +
                '• Has a built-in exchange (DEX), escrow, AMM pools, multi-sig, and NFTs — no smart contracts needed\n' +
                '• Over 90 million ledger versions closed since 2012 with zero downtime\n\n' +
                '**Why OPTKAS chose it:** Everything OPTKAS needs (tokens, escrow, pools, governance) is built into the protocol itself. No fragile smart contracts.',
            deep: '**XRPL Technical Architecture:**\n\n' +
                '• Consensus: Federated Consensus via Unique Node List (UNL) — 80% agreement threshold\n' +
                '• Finality: Deterministic (not probabilistic like Bitcoin)\n' +
                '• Throughput: ~1,500 TPS\n' +
                '• Native features: Trustlines, DEX orderbooks, XLS-30 AMM, XLS-20 NFTs, Escrow, Multi-sig, Pathfinding\n' +
                '• Account model (not UTXO): Each account is a ledger object with properties\n' +
                '• Reserve system: 1 XRP base + 0.2 XRP per owned object (prevents ledger bloat)\n' +
                '• Amendments: Protocol upgrades via validator voting (2 weeks supermajority)\n' +
                '• hooks (emerging): Smart contract-like logic at the protocol level'
        },

        // ───── BOND PROGRAM ─────
        {
            keywords: ['bond', 'mtn', 'medium term', 'coupon', '$500m', '500 million', 'note', 'bond program', 'sovbnd'],
            question: 'What is the OPTKAS bond program?',
            simple: 'OPTKAS operates a **$500 million Medium-Term Note (MTN) program** — basically a way for the company to borrow money from investors in a structured way.\n\n' +
                '**The basics:**\n' +
                '• Total program size: $500M\n' +
                '• First tranche: $10M (50 secured notes)\n' +
                '• Interest rate: 5% annual coupon\n' +
                '• Maturity: 2030\n' +
                '• Each bond is represented as an OPTKAS token on the XRPL\n' +
                '• Settlement is atomic (3-5 seconds, no clearing agent)\n\n' +
                '**Think of it like this:** Instead of going to a bank for a loan, OPTKAS issues digital bonds directly to investors, and the blockchain handles settlement, record-keeping, and proof.',
            deep: '**MTN Program Architecture:**\n\n' +
                '• Legal: OPTKAS1-MAIN SPV (Wyoming) — Series LLC structure (L1.LEG.001)\n' +
                '• Indenture: 5% coupon, 2030 maturity, UCC-secured (L1.LEG.002-004)\n' +
                '• Transfer Agent: Securities Transfer Corporation (L1.LEG.005)\n' +
                '• Insurance: $25.75M blanket coverage (L1.LEG.007)\n' +
                '• Token: OPTKAS IOU on XRPL — represents bond claim receipt\n' +
                '• Lifecycle: BondFactory → Accrual → Coupon → Redemption engines (L3.BND)\n' +
                '• Settlement: Atomic DvP via dual escrow (L5.XRP.007)\n' +
                '• Custody: 1:1 USD backing at qualified custodian (L2.CUS.001)\n' +
                '• Monitoring: BorrowingBase engine tracks collateral ratio (L3.NWD.006)\n' +
                '• Evidence: Every tranche gets an attestation NFT (L4.ATT.002)'
        },

        // ───── ACCOUNTS ─────
        {
            keywords: ['account', 'accounts', '9 accounts', 'how many accounts', 'issuer', 'treasury', 'wallet', 'which account'],
            question: 'What are the 9 OPTKAS mainnet accounts?',
            simple: 'OPTKAS uses **9 separate accounts** — each with one specific job. Think of them as departments in a company:\n\n' +
                '**XRPL Accounts (6):**\n' +
                '1. **Issuer** — Creates (mints) all tokens\n' +
                '2. **Treasury** — Holds operational funds\n' +
                '3. **Escrow** — Locks funds for conditional release\n' +
                '4. **Attestation** — Mints proof-of-execution NFTs\n' +
                '5. **AMM Provider** — Manages liquidity pools\n' +
                '6. **Trading** — Executes algorithmic trading\n\n' +
                '**Stellar Accounts (3):**\n' +
                '7. **Stellar Issuer** — Creates regulated assets on Stellar\n' +
                '8. **Stellar Distribution** — Settlement + liquidity pools\n' +
                '9. **Stellar Anchor** — Fiat on/off-ramp (SEP-24)\n\n' +
                'No account does everything — this is **separation of duties** for security.',
            deep: '**Account Architecture Details:**\n\n' +
                '• **Issuer** (XRPL): DefaultRipple ON, cannot hold own tokens. Mints 6 IOUs. Multisig-controlled.\n' +
                '• **Treasury**: RequireDestTag, holds 4 stablecoin trustlines (Bitstamp.USD, GateHub.USD, Tether, Circle)\n' +
                '• **Escrow**: 24h timelock, 90d max hold. Handles DvP conditional releases.\n' +
                '• **Attestation**: XLS-20 NFT minting, taxon 100. Proof-only (non-economic).\n' +
                '• **AMM Provider**: Multisig-controlled (2-of-3). Manages 6 XRPL pools.\n' +
                '• **Trading**: Circuit breaker at 5%, kill switch at 10%. Algorithmic execution (TWAP, VWAP).\n' +
                '• **Stellar Issuer**: AUTH_REQUIRED, AUTH_REVOCABLE, CLAWBACK enabled.\n' +
                '• **Stellar Distribution**: 3 AMM pools, manage_data hash anchoring.\n' +
                '• **Stellar Anchor**: SEP-24 fiat bridge, SEP-10 authentication.\n\n' +
                '**All accounts subject to multisig governance (L5.MSG.001)**'
        },

        // ───── ENGINES ─────
        {
            keywords: ['engine', 'engines', 'typescript', '28 engines', 'automation', 'what engines', 'how engines work'],
            question: 'What are the 28 TypeScript engines?',
            simple: 'The engines are **28 software programs** that run behind the scenes. Each one handles a specific job — like workers in a factory.\n\n' +
                '**Categories:**\n' +
                '• **Bond engines** (4) — Create bonds, calculate interest, pay coupons, handle redemption\n' +
                '• **Issuance engines** (3) — Mint new tokens, burn retired tokens\n' +
                '• **Settlement engines** (3) — Handle escrow, DvP, atomic swaps\n' +
                '• **Vault engines** (4) — Manage reserves, calculate NAV, mint shares, strip yields\n' +
                '• **Risk engines** (4) — Run simulations, stress tests, check ratios\n' +
                '• **Trading engines** (4) — Execute trades at optimal prices, circuit breakers\n' +
                '• **Pipeline engines** (3) — Manage deals, analyze terms, calculate waterfalls\n' +
                '• **Evidence engines** (3) — Create proofs, store audits, verify hashes\n\n' +
                'They\'re all written in TypeScript and run as modular packages — like LEGO blocks that work together.',
            deep: '**Engine Architecture (Layer 3):**\n\n' +
                '• **L3.BND:** BondFactory (state machine), AccrualEngine, CouponEngine, RedemptionEngine\n' +
                '• **L3.ISS:** IssuanceEngine (XRPL + Stellar paths), MintEngine, BurnEngine\n' +
                '• **L3.SET:** SettlementEngine, EscrowManager, DvP coordinator\n' +
                '• **L3.RVT:** ReserveVault, NAV calculator, ShareMint, YieldStrip\n' +
                '• **L3.RSK:** MonteCarloVaR (10K sims), StressTest, LCR, HHI concentration\n' +
                '• **L3.TRD:** TWAP, VWAP, PathOptimizer (AMM vs DEX), CircuitBreaker (5%/10%)\n' +
                '• **L3.DPL:** DealPipeline (14-stage CRM), TermSheetAnalyzer, WaterfallEngine\n' +
                '• **L3.EVD:** AttestationEngine, AuditEventStore, HashVerifier\n\n' +
                '**Total capabilities in Layer 3:** 48 (all Live)\n' +
                '**Pre-flight checks:** 70+, covering all engine outputs before on-chain submission'
        },

        // ───── NFT / ATTESTATION ─────
        {
            keywords: ['nft', 'attestation', 'proof', 'evidence', 'hash', 'xls-20', 'nft mint', 'certificate'],
            question: 'How does the attestation / NFT proof system work?',
            simple: 'Every important event in OPTKAS gets a **permanent digital certificate** — an NFT minted on the blockchain.\n\n' +
                '**When something happens** (like a bond issuance or a reserve verification):\n' +
                '1. The system takes the data and creates a unique fingerprint (SHA-256 hash)\n' +
                '2. That hash is embedded in an XLS-20 NFT\n' +
                '3. The NFT is minted on the XRPL — permanently and immutably\n' +
                '4. The same hash is also anchored on Stellar for dual-chain proof\n\n' +
                '**Why this matters:** Anyone can independently verify that the event happened, when it happened, and that the data hasn\'t been tampered with. No trust required — the math proves it.',
            deep: '**Layer 4 — Evidence Architecture:**\n\n' +
                '• **AttestationEngine** (L4.ATT.001–005): SHA-256 hash computation → NFTokenMint → taxon 100\n' +
                '• **AuditEventStore** (L4.AUD.001–005): Immutable event logging, timestamping, categorization\n' +
                '• **HashVerifier** (L4.VER.001–005): Cross-reference published hash vs. source document\n' +
                '• NFTs are minted from the Attestation Account (#4) — dedicated for evidence only\n' +
                '• Stellar mirror: `manage_data` anchors the same SHA-256 hash on the Stellar ledger\n' +
                '• Dual-chain attestation = tampering would require compromising both networks simultaneously\n\n' +
                '**Total Layer 4 capabilities:** 10 (all Live)\n' +
                '**Capability IDs:** L4.ATT.001–005, L4.AUD.001–005, L4.VER.001–005'
        },

        // ───── STELLAR / CROSS-CHAIN ─────
        {
            keywords: ['stellar', 'cross chain', 'cross-chain', 'dual', 'dual chain', 'xlm', 'sep-24', 'sep24', 'anchor', 'fiat ramp'],
            question: 'How does the Stellar / cross-chain system work?',
            simple: 'OPTKAS doesn\'t just use one blockchain — it uses **two**: XRPL and Stellar together.\n\n' +
                '**XRPL** is the primary settlement chain — all tokens, escrow, and AMM pools live here.\n' +
                '**Stellar** provides:\n' +
                '• Regulated assets (can clawback tokens for compliance)\n' +
                '• 3 additional AMM pools\n' +
                '• Fiat on/off-ramp via SEP-24 (connect bank accounts)\n' +
                '• Backup proof — same hashes anchored on both chains\n\n' +
                '**Why two chains?** If one goes down, the other has a record. It\'s like keeping a copy of your important documents in two different safes.',
            deep: '**Dual-Chain Architecture:**\n\n' +
                '• **XRPL (Primary):** 6 accounts, 6 IOUs, 6 AMM pools, 19+ settlement capabilities\n' +
                '• **Stellar (Mirror):** 3 accounts, 1 regulated asset (OPTKAS-USD), 3 AMM pools\n' +
                '• **Stellar Compliance Flags:** AUTH_REQUIRED + AUTH_REVOCABLE + CLAWBACK (L5.STL.001-004)\n' +
                '• **SEP-24:** Fiat deposit/withdrawal hosted at Anchor account (L5.STL.006)\n' +
                '• **SEP-10:** Web authentication standard for KYC/AML integration (L5.STL.009)\n' +
                '• **Hash Anchoring:** `manage_data` on Stellar Distribution account mirrors XRPL attestation hashes (L5.STL.008)\n' +
                '• **Cross-chain consistency:** HashVerifier compares XRPL NFT hash vs. Stellar manage_data hash\n\n' +
                '**Total Stellar capabilities:** 9 (all Live)\n' +
                '**Capability IDs:** L5.STL.001–009'
        },

        // ───── RISK ─────
        {
            keywords: ['risk', 'var', 'monte carlo', 'stress test', 'analytics', 'lcr', 'hhi', 'risk management'],
            question: 'How does risk management work?',
            simple: 'OPTKAS has a team of **risk engines** that constantly monitor the health of the system:\n\n' +
                '• **Value at Risk (VaR)** — "How much could we lose in a bad day?" Runs 10,000 simulations\n' +
                '• **Stress Tests** — "What happens if the market crashes 40%?" Tests extreme scenarios\n' +
                '• **Liquidity Coverage** — "Do we have enough cash to cover obligations?" Checks daily\n' +
                '• **Concentration Index** — "Are we too exposed to one asset?" Measures diversification\n' +
                '• **Borrowing Base** — "Is our collateral still worth more than our debt?" Monitors in real-time\n\n' +
                '**Think of it like a car dashboard:** Speed, fuel, temperature, oil pressure — all monitored continuously. If something goes wrong, alarms go off.',
            deep: '**Risk & Analytics Engine Suite (Layer 3):**\n\n' +
                '• **MonteCarloVaR** (L3.RSK.002): 10,000 random simulations, 95% and 99% confidence levels\n' +
                '• **StressTest** (L3.RSK.003): Regulatory scenarios (market crash, liquidity freeze, FX shock)\n' +
                '• **LCR Engine** (L3.RSK.004): HQLA / 30-day net outflows ratio\n' +
                '• **HHI Engine** (L3.RSK.005): Herfindahl-Hirschman concentration index\n' +
                '• **BorrowingBase** (L3.NWD.006): Collateral valuation / outstanding debt ratio\n' +
                '• **Coverage Monitor** (L3.NWD.007): Over-collateralization threshold monitoring\n' +
                '• **NAV Engine** (L3.RVT.001): Multi-asset net asset value calculation\n' +
                '• **Slippage Monitor** (L3.TRD): Execution quality tracking per trade\n\n' +
                '**Test coverage:** 1,213+ tests, 70+ pre-flight checks, 97.4% on-chain success rate'
        },

        // ───── REVENUE MODEL ─────
        {
            keywords: ['revenue', 'fees', 'how make money', 'business model', 'income', 'earn', 'trading fee', 'service fee'],
            question: 'How does OPTKAS make money?',
            simple: 'OPTKAS earns revenue from **multiple streams** — it\'s not just one thing:\n\n' +
                '1. **Interest spread** — The bond pays 5% but the platform earns incrementally on management\n' +
                '2. **AMM trading fees** — Every swap through a pool pays a small fee to LP providers\n' +
                '3. **Issuance fees** — Fees for tokenizing new assets (real estate, gems, etc.)\n' +
                '4. **Infrastructure licensing** — Other companies can use the settlement highway\n' +
                '5. **Fund management** — NAV calculation, reporting, share minting services\n' +
                '6. **Attestation services** — Permanent on-chain proof for third parties\n\n' +
                '**Key insight:** The infrastructure is the product. The bond is just the first customer.',
            deep: '**Revenue Architecture:**\n\n' +
                '• **Bond spread:** 5% coupon vs. management yield → spread income\n' +
                '• **AMM fees:** 0.5% default trading fee across 9 pools → passive income from LP positions\n' +
                '• **Issuance:** Per-token minting fee for third-party tokenizations\n' +
                '• **Infrastructure:** SaaS model for settlement-as-a-service\n' +
                '• **Vault management:** AUM-based fee on ReserveVault NAV\n' +
                '• **Attestation:** Per-NFT proof minting for external clients\n' +
                '• **Trading:** Bid-ask spread capture via TWAP/VWAP execution\n' +
                '• **Data services:** Analytics, risk metrics, reporting feeds\n\n' +
                '**Competitive moats:** 9 live pools, 28 production engines, dual-chain settlement, 134 live capabilities'
        },

        // ───── PETRO / ENERGY ─────
        {
            keywords: ['petro', 'energy', 'oil', 'gas', 'commodity', 'petro token', 'energy asset'],
            question: 'How do energy / commodity tokens work?',
            simple: 'The **PETRO** token represents claims on energy assets — like oil, gas, or energy contracts.\n\n' +
                '**How it works:**\n' +
                '1. Energy assets (oil futures, gas contracts, solar credits) are documented and custodied\n' +
                '2. OPTKAS mints PETRO tokens — each representing a share of the energy portfolio\n' +
                '3. The PETRO / XRP AMM pool provides instant tradability\n' +
                '4. Attestation NFTs prove the underlying custody\n\n' +
                '**Same infrastructure, different asset:** The exact same accounts, engines, and pools that handle bonds also handle energy assets. Nothing new needs to be built.',
            deep: '**PETRO Token Architecture:**\n\n' +
                '• Token: PETRO IOU — Controlled transfer, Freezable on XRPL\n' +
                '• Mint: Issuer → Treasury via IssuanceEngine (L3.ISS.001)\n' +
                '• Pool: PETRO/XRP AMM pool (L5.AMM.001)\n' +
                '• Custody: Energy contracts/certificates held by qualified custodian (L2.CUS.001)\n' +
                '• Valuation: ReserveVault NAV based on commodity spot/futures pricing (L3.RVT.001)\n' +
                '• Risk: MonteCarloVaR for commodity volatility (L3.RSK.002)\n' +
                '• Proof: AttestationEngine mints NFT per issuance tranche (L4.ATT.002)'
        },

        // ───── IMPERIA ─────
        {
            keywords: ['imperia', 'asset class', 'imperia token', 'diversified'],
            question: 'What is the IMPERIA token?',
            simple: 'IMPERIA is a **diversified asset-class claim** — it\'s like an index fund token that represents exposure to multiple asset types in the OPTKAS ecosystem.\n\n' +
                '• It can represent a basket of different holdings (bonds + real estate + gems)\n' +
                '• Traded via the IMPERIA / XRP AMM pool\n' +
                '• Same controls: trustline-gated, freezable, multisig-governed',
            deep: '**IMPERIA Token:**\n\n' +
                '• IOU: IMPERIA — controlled transfer, freezable (XRPL)\n' +
                '• Purpose: Asset-class claim across diversified holdings\n' +
                '• Pool: IMPERIA/XRP (XRPL), IMPERIA-USD/XLM (Stellar)\n' +
                '• NAV tracked by ReserveVault (L3.RVT.001) based on constituent asset valuations\n' +
                '• Stellar mirror: IMPERIA-USD with AUTH_REQUIRED + CLAWBACK'
        },

        // ───── CAPABILITIES / STATS ─────
        {
            keywords: ['capability', 'how many', 'total', 'stats', 'statistics', 'numbers', 'overview', 'summary'],
            question: 'What are the overall platform stats?',
            simple: 'Here\'s the OPTKAS platform by the numbers:\n\n' +
                '• **134 total capabilities** — 128 Live, 5 Dry-Run, 1 Planned\n' +
                '• **9 mainnet accounts** — 6 XRPL + 3 Stellar\n' +
                '• **6 tokens (IOUs)** on XRPL + 1 regulated asset on Stellar\n' +
                '• **9 AMM liquidity pools** — 6 XRPL + 3 Stellar\n' +
                '• **28 TypeScript engines** across 8 business domains\n' +
                '• **$500M bond program** — $10M first tranche, 5% coupon, 2030 maturity\n' +
                '• **97.4% on-chain success rate** — 1,213+ tests, 70+ pre-flight checks\n' +
                '• **3-5 second settlement** — compared to T+1 to T+3 in traditional finance',
            deep: '**Platform Capability Matrix:**\n\n' +
                '| Layer | Capabilities | Status |\n' +
                '|-------|-------------|--------|\n' +
                '| L1 Legal & Control | 10 | All Live |\n' +
                '| L2 Custody & Banking | 10 | All Live |\n' +
                '| L3 Automation | 48 | All Live |\n' +
                '| L4 Evidence | 10 | All Live |\n' +
                '| L5 Settlement | 42 | 41 Live, 1 Planned |\n' +
                '| Security | 12 | All Live |\n' +
                '| Wallet & Ops | 7 | All Live |\n\n' +
                '**Total: 134 capabilities (128 Live, 5 Dry-Run, 1 Planned)**'
        },

        // ───── SLIPPAGE / PRICING ─────
        {
            keywords: ['slippage', 'price impact', 'pricing', 'how price set', 'swap cost', 'trading cost'],
            question: 'How does pricing and slippage work in the pools?',
            simple: 'When you trade through an AMM pool, the **price changes based on how much you buy**.\n\n' +
                '**Small trade = tiny price impact:**\n' +
                'Buying 10 OPTKAS from a pool with 100,000 OPTKAS barely moves the price.\n\n' +
                '**Big trade = noticeable price impact (slippage):**\n' +
                'Buying 10,000 OPTKAS from the same pool would significantly push the price up.\n\n' +
                '**The formula:** Token A × Token B = Constant. When you remove Token A, you must add more Token B, and the exchange rate shifts.\n\n' +
                '**OPTKAS solution:** The PathOptimizer engine splits large trades across AMM pools AND the DEX orderbook to minimize slippage.',
            deep: '**CPMM Slippage Mechanics:**\n\n' +
                '• Formula: x × y = k (constant product)\n' +
                '• Price impact = (trade_size / pool_reserve)² approximately\n' +
                '• Example: 1% of pool → ~2% price impact; 10% of pool → ~20% impact\n' +
                '• XRPL auto-routes: Checks AMM price vs. DEX orderbook, takes better price\n' +
                '• PathOptimizer (L3.TRD.007): Splits orders across venues for best execution\n' +
                '• CircuitBreaker (L3.TRD): Halts at 5% deviation, kill switch at 10%\n' +
                '• AMMBid: Traders can bid for a reduced-fee auction slot (24h)\n' +
                '• Slippage monitoring: Real-time execution analytics (L3.TRD slippage monitor)'
        },

        // ───── SECURITY ─────
        {
            keywords: ['security', 'safe', 'hack', 'protection', 'freeze', 'global freeze', 'emergency'],
            question: 'How is the system secured?',
            simple: 'OPTKAS has **multiple layers of security** — like a bank vault with many locks:\n\n' +
                '1. **Multi-signature** — No one person can move funds (2-of-3 required)\n' +
                '2. **Trustline freeze** — Issuer can freeze any token instantly\n' +
                '3. **Global freeze** — Emergency halt on ALL transfers (1-of-3 can trigger)\n' +
                '4. **Circuit breaker** — Auto-stops trading if prices move 5%+\n' +
                '5. **Kill switch** — Full trading halt if prices move 10%+\n' +
                '6. **Pre-flight checks** — 70+ automated validations before any transaction\n' +
                '7. **Dual-chain** — Records on both XRPL and Stellar\n' +
                '8. **1,213+ tests** — 97.4% on-chain success rate',
            deep: '**Security Architecture:**\n\n' +
                '• **Multisig:** 2-of-3 standard, 3-of-3 config, 1-of-3 emergency (L5.MSG.001-003)\n' +
                '• **Master Key Disable:** Planned — removes single-key risk entirely (L5.XRP.017)\n' +
                '• **RequireDestTag:** Prevents misdirected payments (SEC.008)\n' +
                '• **Freeze controls:** Individual trustline freeze (L5.XRP.008), GlobalFreeze (L5.XRP.009)\n' +
                '• **Stellar compliance:** AUTH_REQUIRED + REVOCABLE + CLAWBACK (L5.STL.001-004)\n' +
                '• **Trading safeguards:** CircuitBreaker (5%), KillSwitch (10%) via L3.TRD\n' +
                '• **Pre-flight suite:** 70+ checks on every transaction before submission (SEC.011)\n' +
                '• **Test coverage:** 1,213+ tests, 97.4% on-chain success (SEC.012)\n' +
                '• **Insurance:** $25.75M blanket policy (L1.LEG.007)'
        },

        // ───── WHAT IT CANNOT DO ─────
        {
            keywords: ['cannot', 'limitation', 'what can\'t', 'boundary', 'boundaries', 'not do', 'limit'],
            question: 'What can the system NOT do?',
            simple: 'OPTKAS is powerful, but there are things it **cannot replace:**\n\n' +
                '✗ Cannot replace bond indenture law — legal documents still matter\n' +
                '✗ Cannot enforce legal recovery — courts handle disputes\n' +
                '✗ Cannot eliminate default risk — borrowers can still default\n' +
                '✗ Cannot replace regulatory oversight — SEC/FINRA rules still apply\n' +
                '✗ Cannot create investor demand — the market decides\n' +
                '✗ Cannot define legal ownership alone — tokens mirror law, they don\'t replace it\n' +
                '✗ Cannot self-enforce default — requires governance decision\n\n' +
                '**Key principle:** The blockchain is a tool that makes things faster, cheaper, and more transparent. It doesn\'t replace the law.',
            deep: '**System Boundaries (Layer 7):**\n\n' +
                '• Legal ownership defined by indenture, not by token balance\n' +
                '• Court enforcement remains off-chain — blockchain records support but don\'t replace litigation\n' +
                '• Default risk is economic, not technical — multisig can freeze but can\'t recover losses\n' +
                '• Regulatory framework is external — OPTKAS operates within it, doesn\'t override it\n' +
                '• Investor demand is market-driven — infrastructure provides access, not demand\n' +
                '• Token ≠ ownership — token mirrors legal claim documented in indenture\n' +
                '• Default enforcement requires governance vote → freeze → legal process\n\n' +
                '**Critical principle:** Smart execution ≠ smart contracts. The system executes what the law authorizes.'
        }
    ];

    // ─── WELCOME MESSAGES ──────────────────────────────────────
    var WELCOME = {
        simple: "Hi! I'm the OPTKAS Knowledge Assistant. Ask me anything about the platform — I'll explain it in simple, everyday language. Try asking:\n\n" +
            "• \"How does minting work?\"\n" +
            "• \"What is a liquidity pool?\"\n" +
            "• \"How does real estate tokenization work?\"\n" +
            "• \"What is the full mint → pool → trade flow?\"\n" +
            "• \"How is the system secured?\"",
        deep: "OPTKAS Knowledge Assistant — Institutional Mode. Query any capability, mechanism, or architectural detail. I reference capability IDs from the full 134-capability ledger.\n\n" +
            "Examples:\n" +
            "• \"AMMCreate transaction details\"\n" +
            "• \"Dual-escrow DvP mechanics\"\n" +
            "• \"Layer 5 AMM capabilities\"\n" +
            "• \"Full mint → pool → trade pipeline\""
    };

    // ─── SEARCH / MATCHING ─────────────────────────────────────
    function scoreMatch(query, entry) {
        var q = query.toLowerCase().replace(/[?.,!]/g, '');
        var words = q.split(/\s+/);
        var score = 0;

        for (var k = 0; k < entry.keywords.length; k++) {
            var kw = entry.keywords[k].toLowerCase();
            // Exact keyword match
            if (q.indexOf(kw) !== -1) {
                score += 10 + kw.length; // longer keyword matches = higher score
            }
            // Individual word matches
            for (var w = 0; w < words.length; w++) {
                if (words[w].length > 2 && kw.indexOf(words[w]) !== -1) {
                    score += 3;
                }
            }
        }
        // Bonus for question match
        var questionLower = entry.question.toLowerCase();
        for (var w2 = 0; w2 < words.length; w2++) {
            if (words[w2].length > 2 && questionLower.indexOf(words[w2]) !== -1) {
                score += 2;
            }
        }
        return score;
    }

    function findBestMatch(query) {
        var bestScore = 0;
        var bestEntry = null;
        var secondBest = null;

        for (var i = 0; i < KB.length; i++) {
            var score = scoreMatch(query, KB[i]);
            if (score > bestScore) {
                secondBest = bestEntry;
                bestScore = score;
                bestEntry = KB[i];
            } else if (score > 0 && (!secondBest || score > scoreMatch(query, secondBest))) {
                secondBest = KB[i];
            }
        }

        return { best: bestEntry, second: secondBest, score: bestScore };
    }

    // ─── STATE ─────────────────────────────────────────────────
    var currentMode = 'simple'; // 'simple' or 'deep'
    var chatHistory = [];
    var isOpen = false;

    // ─── RENDER ────────────────────────────────────────────────
    function formatMessage(text) {
        // Convert markdown-like formatting to HTML
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
            .replace(/^([•▸①-⑩✗✓])/gm, '<span class="ai-bullet">$1</span>')
            .replace(/\n/g, '<br>')
            .replace(/\|(.+?)\|/g, function (match) {
                // Simple table detection
                return '<span class="ai-table-row">' + match + '</span>';
            });
    }

    function renderChat() {
        var messagesEl = document.getElementById('ai-messages');
        if (!messagesEl) return;

        var html = '';
        for (var i = 0; i < chatHistory.length; i++) {
            var msg = chatHistory[i];
            html += '<div class="ai-msg ai-msg-' + msg.role + '">';
            if (msg.role === 'user') {
                html += '<div class="ai-msg-avatar">You</div>';
                html += '<div class="ai-msg-text">' + escapeHtml(msg.text) + '</div>';
            } else {
                html += '<div class="ai-msg-avatar">AI</div>';
                html += '<div class="ai-msg-text">' + formatMessage(msg.text) + '</div>';
                if (msg.related) {
                    html += '<div class="ai-related">Related: <a href="#" onclick="askQuestion(\'' +
                        escapeHtml(msg.related).replace(/'/g, "\\'") + '\'); return false;">' +
                        escapeHtml(msg.related) + '</a></div>';
                }
            }
            html += '</div>';
        }

        messagesEl.innerHTML = html;
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function escapeHtml(text) {
        var div = document.createElement('div');
        div.appendChild(document.createTextNode(text));
        return div.innerHTML;
    }

    // ─── ASK QUESTION ──────────────────────────────────────────
    function askQuestion(query) {
        if (!query || !query.trim()) return;

        // Add user message
        chatHistory.push({ role: 'user', text: query.trim() });

        // Find answer
        var result = findBestMatch(query);

        if (result.best && result.score >= 5) {
            var answer = currentMode === 'simple' ? result.best.simple : result.best.deep;
            var msg = { role: 'assistant', text: answer };
            if (result.second) {
                msg.related = result.second.question;
            }
            chatHistory.push(msg);
        } else {
            chatHistory.push({
                role: 'assistant',
                text: 'I don\'t have a specific answer for that query. Try asking about:\n\n' +
                    '• **Minting** — How tokens are created\n' +
                    '• **Liquidity pools** — How AMM pools work\n' +
                    '• **Real estate / gems** — Tokenization process\n' +
                    '• **Full flow** — Mint → Pool → Trade pipeline\n' +
                    '• **Trustlines** — How token access works\n' +
                    '• **DvP / escrow** — Settlement mechanics\n' +
                    '• **Accounts** — The 9 mainnet accounts\n' +
                    '• **Engines** — The 28 TypeScript engines\n' +
                    '• **Security** — Multi-sig, freeze, circuit breakers\n' +
                    '• **Risk** — VaR, stress tests, analytics\n' +
                    '• **Stellar** — Cross-chain architecture\n' +
                    '• **Revenue** — Business model\n' +
                    '• **Bonds** — The $500M MTN program\n' +
                    '• **Boundaries** — What the system cannot do'
            });
        }

        renderChat();

        // Clear input
        var inputEl = document.getElementById('ai-input');
        if (inputEl) inputEl.value = '';
    }

    // ─── TOGGLE MODE ───────────────────────────────────────────
    function toggleMode() {
        currentMode = currentMode === 'simple' ? 'deep' : 'simple';
        var modeBtn = document.getElementById('ai-mode-btn');
        if (modeBtn) {
            modeBtn.textContent = currentMode === 'simple' ? '🟢 Simple Mode' : '🔵 Deep Dive Mode';
            modeBtn.className = 'ai-mode-btn ai-mode-' + currentMode;
        }
    }

    // ─── TOGGLE PANEL ──────────────────────────────────────────
    function togglePanel() {
        isOpen = !isOpen;
        var panel = document.getElementById('ai-panel');
        var fab = document.getElementById('ai-fab');
        if (panel) panel.classList.toggle('ai-open', isOpen);
        if (fab) fab.classList.toggle('ai-fab-active', isOpen);

        if (isOpen && chatHistory.length === 0) {
            chatHistory.push({
                role: 'assistant',
                text: currentMode === 'simple' ? WELCOME.simple : WELCOME.deep
            });
            renderChat();
        }
    }

    // ─── SUGGESTED QUESTIONS ───────────────────────────────────
    function askSuggested(text) {
        askQuestion(text);
    }

    // ─── CREATE DOM ────────────────────────────────────────────
    function createUI() {
        // Floating Action Button
        var fab = document.createElement('button');
        fab.id = 'ai-fab';
        fab.className = 'ai-fab';
        fab.innerHTML = '<span class="ai-fab-icon">🤖</span><span class="ai-fab-label">Ask AI</span>';
        fab.onclick = togglePanel;
        document.body.appendChild(fab);

        // Chat Panel
        var panel = document.createElement('div');
        panel.id = 'ai-panel';
        panel.className = 'ai-panel';
        panel.innerHTML =
            '<div class="ai-header">' +
                '<div class="ai-header-left">' +
                    '<span class="ai-header-icon">🤖</span>' +
                    '<span class="ai-header-title">OPTKAS Knowledge AI</span>' +
                '</div>' +
                '<div class="ai-header-right">' +
                    '<button id="ai-mode-btn" class="ai-mode-btn ai-mode-simple" onclick="toggleMode()">🟢 Simple Mode</button>' +
                    '<button class="ai-close-btn" onclick="togglePanel()">✕</button>' +
                '</div>' +
            '</div>' +
            '<div class="ai-suggestions">' +
                '<button class="ai-suggestion" onclick="askSuggested(\'How does minting work?\')">🪙 How minting works</button>' +
                '<button class="ai-suggestion" onclick="askSuggested(\'How do liquidity pools work?\')">💧 Liquidity pools</button>' +
                '<button class="ai-suggestion" onclick="askSuggested(\'How does real estate tokenization work?\')">🏠 Real estate</button>' +
                '<button class="ai-suggestion" onclick="askSuggested(\'What is the full mint to pool to trade flow?\')">🔄 Full flow</button>' +
                '<button class="ai-suggestion" onclick="askSuggested(\'How do gems get tokenized?\')">💎 Gems</button>' +
                '<button class="ai-suggestion" onclick="askSuggested(\'What are LP tokens?\')">🎫 LP tokens</button>' +
            '</div>' +
            '<div id="ai-messages" class="ai-messages"></div>' +
            '<div class="ai-input-area">' +
                '<input type="text" id="ai-input" class="ai-input" placeholder="Ask anything about OPTKAS..." />' +
                '<button id="ai-send" class="ai-send" onclick="askQuestion(document.getElementById(\'ai-input\').value)">→</button>' +
            '</div>';
        document.body.appendChild(panel);

        // Enter key handler
        setTimeout(function () {
            var input = document.getElementById('ai-input');
            if (input) {
                input.addEventListener('keydown', function (e) {
                    if (e.key === 'Enter') {
                        askQuestion(input.value);
                    }
                });
            }
        }, 100);
    }

    // ─── INIT ──────────────────────────────────────────────────
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createUI);
    } else {
        createUI();
    }

    // ─── EXPOSE GLOBALS ────────────────────────────────────────
    window.askQuestion = askQuestion;
    window.askSuggested = askSuggested;
    window.toggleMode = toggleMode;
    window.togglePanel = togglePanel;

})();
