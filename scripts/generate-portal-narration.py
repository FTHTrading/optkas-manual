"""
OPTKAS Client Portal — Neural Voice Narration Generator
Uses Microsoft Edge TTS (en-US-AndrewNeural) for hyper-realistic voice.
Generates 9 MP3s — one per section of the Client Portal.
"""

import asyncio
import edge_tts
import os

VOICE = "en-US-AndrewNeural"
RATE = "+0%"
OUTPUT_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "audio", "portal")

# ─────────────────────────────────────────────────────────────
# CLIENT PORTAL SECTION NARRATION SCRIPTS
# Each script narrates the section content as a professional
# institutional advisor explaining the OPTKAS platform.
# ─────────────────────────────────────────────────────────────

SECTIONS = [
    {
        "filename": "sec1-welcome-to-optkas.mp3",
        "text": """
Welcome to the OPTKAS Client Portal. Section One — Welcome to OPTKAS.

OPTKAS is a full-stack institutional digital securities platform that bridges traditional finance with blockchain settlement. It enables you to structure, issue, trade, and manage securities and real-world assets using the XRP Ledger and Stellar networks — all backed by real legal structure, qualified custody, and immutable on-chain proof.

This is not a concept or a prototype. OPTKAS operates one hundred and thirty-four live capabilities across five operational layers, with nine funded mainnet accounts, twenty-eight TypeScript automation engines, and over twelve hundred automated tests. Everything is built, deployed, and operational.

Why does OPTKAS exist? Three core reasons.

First, instant settlement. Traditional bond settlement takes two to five business days. OPTKAS settles in three to five seconds using on-chain escrow. Delivery versus Payment is atomic — both sides execute simultaneously or neither does.

Second, immutable proof. Every transaction, every attestation, every reserve snapshot is hashed using SHA-256 and permanently anchored on two public blockchains — XRPL and Stellar. No one can alter the record after the fact.

Third, real liquidity. Nine automated market maker pools provide twenty-four-seven trading. You don't need to find a counterparty — the pool is always ready to trade.

The legal foundation is the bedrock. OPTKAS operates through a Special Purpose Vehicle — OPTKAS1-MAIN LLC — incorporated in Wyoming. A five-hundred-million-dollar Medium-Term Note program provides the legal framework. UCC-1 lien filings with the Wyoming Secretary of State establish first-priority secured claims for token holders. A qualified transfer agent — Securities Transfer Corporation — maintains the official bondholder register.

The platform at a glance: one hundred and thirty-four capabilities, twenty-eight automation engines, nine funded mainnet accounts, six XRPL tokens, nine AMM liquidity pools, over twelve hundred automated tests, a twenty-five point seven-five million dollar insurance policy, and five hundred million dollars in MTN program capacity.
"""
    },
    {
        "filename": "sec2-how-the-system-works.mp3",
        "text": """
Section Two — How the System Works.

OPTKAS is organized into five operational layers. Each layer handles a distinct function. No layer operates in isolation — they work together to deliver end-to-end securities infrastructure.

Layer One is Legal and Compliance. This is the foundation. SPV structure, bond indenture, UCC filings, transfer agent, and regulatory framework. Law is always Layer One.

Layer Two is Custody and Banking. Qualified custodian holds all fiat reserves one-to-one. Bank escrow accounts, FX operations, and fiat on and off ramp via Stellar anchors.

Layer Three is Automation and Intelligence. Twenty-eight TypeScript engines handle everything from bond lifecycle management to risk analytics, trading, and deal pipeline orchestration.

Layer Four is Evidence and Attestation. SHA-256 document hashes anchored on two blockchains. XLS-20 NFT attestation certificates. Dual-chain proof pairs. Append-only audit event store.

Layer Five is Settlement and Trading. Nine funded mainnet accounts across XRPL and Stellar. Six XRPL tokens, one Stellar regulated asset, nine AMM pools, native escrow, and atomic delivery-versus-payment.

The nine mainnet accounts each serve a specific purpose. On XRPL: the Issuer mints all tokens, the Treasury holds operational balances, the Escrow account locks bond payments, the Attestation account mints proof NFTs, the AMM Provider funds liquidity pools, and the Trading account handles algorithmic DEX execution. On Stellar: the Issuer controls the regulated OPTKAS-USD asset, the Distribution account handles settlement and liquidity, and the Anchor provides the SEP-24 fiat bridge.

The bond lifecycle follows eight steps. First, legal parameters are defined. Second, the BondFactory engine creates the bond instrument. Third, tokens are minted on-chain. Fourth, tokens are distributed to investors via atomic DvP escrow. Fifth, coupon payments are calculated through waterfall logic. Sixth, attestation NFTs are minted as proof. Seventh, reserves are monitored continuously. And eighth, at maturity, tokens are redeemed and burned.
"""
    },
    {
        "filename": "sec3-use-cases-benefits.mp3",
        "text": """
Section Three — Use Cases and Benefits.

OPTKAS supports six distinct tokenized asset classes, each represented by a unique XRPL IOU with its own economic purpose.

OPTKAS Primary is the bond claim receipt — the flagship five-hundred-million-dollar MTN program. SOVBND, or Sovereign Bond, is the sovereign claim tracker for government-grade instruments. IMPERIA is the asset-class basket for diversified portfolio exposure. GEMVLT, or GemVault, provides vault participation for certified precious stones and gems. TERRAVL, or TerraVault, represents real estate claims for fractional property ownership. And PETRO is the energy claim for oil, gas, and energy contracts.

What can you do with OPTKAS? Nine key capabilities.

You can trade tokenized assets twenty-four-seven on nine AMM pools. You can provide liquidity and earn passive trading fees. You can use atomic delivery-versus-payment to eliminate counterparty risk. You can verify reserve backing independently using public blockchain explorers. You can access institutional-grade risk analytics including Monte Carlo simulations. You can settle cross-border in seconds using XRP as a bridge currency. You can tokenize real-world assets with full legal backing. You can access dual-chain proof for every transaction. And you can participate in a regulated securities program with qualified custody and insurance.

Who uses OPTKAS? Three primary audiences. Institutional investors seeking regulated digital securities with qualified custody. Asset owners wanting to tokenize real estate, commodities, or other physical assets. And financial professionals who need institutional-grade settlement infrastructure without building it from scratch.
"""
    },
    {
        "filename": "sec4-stablecoin-guide.mp3",
        "text": """
Section Four — Stablecoin Guide.

Stablecoins are digital assets pegged to a stable reference — typically the US Dollar. In the OPTKAS system, stablecoins serve as the settlement layer for all transactions. They enable you to move between fiat currency and digital assets seamlessly, settle trades in a stable denomination, and avoid the volatility of native cryptocurrencies like XRP or XLM.

OPTKAS integrates with four major stablecoin systems.

First, Bitstamp USD on the XRPL. Bitstamp is the most established gateway, operating since twenty-eleven. They issue USD IOUs on the XRPL backed by real USD in regulated bank accounts. Setup requires creating a Bitstamp account, completing KYC, depositing USD via bank wire, and the funds appear as Bitstamp USD in your XRPL wallet.

Second, GateHub USD on the XRPL. GateHub is the primary European gateway, EU-regulated with SEPA and SWIFT support. The process is the same — create an account, complete KYC, deposit funds. GateHub USD is a separate IOU from Bitstamp USD even though both represent dollars.

Third, USDT — Tether — which is the world's largest stablecoin at over eighty-three billion dollars in circulation. USDT is available on multiple chains. On the XRPL, it requires a trustline to the Tether issuer account. USDT provides the highest trading volume and deepest liquidity.

Fourth, USDC from Circle, which is the most regulated major stablecoin. It's fully backed by cash and US Treasuries with monthly third-party attestations. USDC is available on XRPL via the AMM ecosystem.

You can also build your own stablecoin using XRPL infrastructure — issue a custom USD-backed IOU from a controlled issuer account, with freeze and compliance controls. OPTKAS-USD on Stellar is exactly this: a custom stablecoin issued with authorization required, authorization revocable, and clawback enabled.

OPTKAS also supports debt stablecoins — generated through collateralized debt positions where you deposit collateral and borrow stablecoin against it, similar to how MakerDAO's DAI works but using XRPL infrastructure.

XRP itself serves as a bridge currency. It is the universal translator between all these stablecoin systems. Any XRPL IOU can be swapped for XRP instantly, and XRP can be swapped for any other IOU. This enables cross-stablecoin settlement without direct trading pairs.
"""
    },
    {
        "filename": "sec5-stellar-cross-chain.mp3",
        "text": """
Section Five — Stellar and Cross-Chain Architecture.

While the XRPL is the primary settlement chain for OPTKAS, the Stellar network provides capabilities that XRPL cannot. Together, they form a dual-chain architecture that gives clients the best of both worlds.

XRPL brings the native DEX orderbook, XLS-30 AMM pools, XLS-20 NFTs for attestation, native escrow with crypto-conditions, and six liquidity pools. Stellar brings regulated assets with authorization required, full clawback support, the SEP-24 fiat on and off ramp protocol, manage_data key-value storage for proof anchoring, and three additional AMM pools.

Stellar provides a regulated asset framework that gives issuers granular control over who can hold their tokens — critical for securities.

AUTH_REQUIRED means every holder must be individually approved before they can hold OPTKAS-USD tokens. This ensures full KYC and AML compliance. AUTH_REVOCABLE means authorization can be revoked at any time — if a holder fails compliance checks or a regulatory order is received. And CLAWBACK allows the issuer to actively reclaim tokens from a holder's account — essential for regulatory enforcement, court orders, and error recovery.

SEP-24 is the standardized way to move between USD in your bank account and tokens on the Stellar network. On the deposit side: the client authenticates via SEP-10, completes KYC verification, initiates a deposit, sends USD to the anchor's bank account, and receives equivalent stablecoin tokens. On the withdrawal side: the client sends tokens back to the anchor, the anchor burns the tokens to maintain one-to-one backing, and transfers equivalent USD to the client's bank.

OPTKAS operates three liquidity pools on Stellar: OPTKAS-USD paired with XLM, SOVBND-USD paired with XLM, and IMPERIA-USD paired with XLM.

The dual-chain proof architecture ensures that every significant action generates a SHA-256 document hash, which is anchored on XRPL via memo-embedded transactions and simultaneously published to Stellar via manage_data operations. An XLS-20 NFT is also minted on XRPL as a permanent attestation marker. The result: the same proof exists independently on two separate public blockchains. Verification is trivial. Falsification is impossible.

Cross-chain settlement works through the SettlementEngine, which coordinates atomic transfers between XRPL and Stellar. Funds are verified on the source chain, escrow is created, the corresponding issuance is prepared on the destination, and both sides execute atomically — either both succeed or both revert.
"""
    },
    {
        "filename": "sec6-fee-structure.mp3",
        "text": """
Section Six — Fee Structure.

OPTKAS fees are not arbitrary. Every fee exists for a specific reason: to fund the infrastructure that protects your assets, maintain the legal structure that gives your tokens their value, and ensure the system remains operational and secure.

Platform setup fees are one-time costs. SPV Formation and Legal Structure covers Wyoming SPV registration, corporate governance documents, bond indenture preparation, UCC-1 lien filing, CUSIP and ISIN registration, and engagement of the transfer agent. Without the legal structure, tokens have no legal standing.

Account Infrastructure covers deployment and configuration of nine mainnet accounts — six XRPL plus three Stellar — including multisig setup, flag configuration, trustline establishment, and initial XRP and XLM funding for reserves.

AMM Pool Seeding covers initial liquidity provision for all nine AMM pools. Pools require balanced initial deposits of both token sides to begin algorithmic pricing. This ensures your tokens are tradeable from day one.

KYC and AML Onboarding is a per-client fee covering identity verification, compliance screening, sanctions checks, PEP screening, and ongoing monitoring.

Ongoing infrastructure fees cover continuous operation. Custody and Banking covers qualified custodian fees for one-to-one USD reserve management and bank escrow maintenance. Insurance Premium covers the annual premium for the twenty-five point seven-five million dollar blanket crime, error, and omission policy. Engine Operations covers server infrastructure for twenty-eight TypeScript automation engines running twenty-four-seven. And Compliance and Reporting covers ongoing KYC monitoring, regulatory filings, investor reports, and attestation publishing.

Transaction fees are the smallest. XRPL transactions cost approximately two hundredths of a cent. Stellar transactions cost even less. AMM trading fees are typically zero point three to one percent per swap, and these go to liquidity providers. Trustline reserves — two-tenths XRP on XRPL and half an XLM on Stellar — are refundable deposits, not fees.

Where do your fees go? Thirty percent to Legal and Compliance. Twenty-five percent to Custody and Insurance. Twenty-five percent to Technology Infrastructure. And twenty percent to Operations and Development. Every fee supports the system that protects your investment. There are no hidden costs.
"""
    },
    {
        "filename": "sec7-security-infrastructure.mp3",
        "text": """
Section Seven — Security and Infrastructure.

No single person can move your assets. OPTKAS enforces multi-signature controls on all critical operations.

The two-of-three standard requires at least two out of three authorized signers for all normal transactions. No unilateral control. No single point of failure. The three-of-three configuration requires all three signers for system configuration changes — changing account settings, signer lists, or protocol parameters demands full consensus. And the one-of-three emergency rule means any single signer can freeze all operations instantly when speed is critical for asset protection.

OPTKAS has freeze and compliance controls at multiple levels. Individual trustline freeze on XRPL stops a single holder's ability to transact specific tokens. Global freeze on XRPL freezes all trustlines simultaneously — the nuclear option for existential threats. Authorization revocation on Stellar revokes a holder's ability to transact. Clawback on Stellar actively reclaims tokens from a holder's account. And the trading kill switch automatically halts trading if losses exceed ten percent, with a circuit breaker triggering at five percent.

Every freeze action is logged, hashed, and anchored on-chain — fully auditable.

Cryptographic security follows institutional standards. All keys are generated using Node.js CSPRNG — the same cryptographic standard used by banks. All seed phrases are stored in encrypted offline cold storage — never on-chain, never in repositories. The entire codebase operates on public addresses only — no private keys exist in source code. And over seventy automated pre-flight checks run before any on-chain transaction.

Testing and reliability metrics: over twelve hundred automated tests, ninety-seven point four percent on-chain success rate, seventy-plus pre-flight checks per transaction, ten thousand Monte Carlo simulations for continuous risk monitoring, and real-time dashboards tracking pool depth, collateral ratios, NAV, slippage, and concentration indexes.

Insurance protection: a twenty-five point seven-five million dollar blanket crime, error, and omission policy covers criminal activity, operational errors, and oversights. This level of coverage is extremely rare in the digital asset space.

In a default scenario, the automated response protocol activates: detection by automated monitoring, alerts to all governance signers, emergency freeze of all XRPL trustlines, Stellar authorization revocation, trading kill switch activation, legal enforcement per the bond indenture, orderly collateral liquidation by the qualified custodian, and distribution per the waterfall priority schedule. Every step is logged and anchored on-chain.
"""
    },
    {
        "filename": "sec8-getting-started.mp3",
        "text": """
Section Eight — Getting Started.

Getting started with OPTKAS follows a structured, professional onboarding process with seven steps.

Step one: Initial Consultation. We walk through your investment goals, risk tolerance, and which asset classes interest you. This is a conversation, not a sales pitch — we want to make sure OPTKAS is the right fit.

Step two: KYC and AML Verification. Identity verification, compliance screening, sanctions checks, and PEP screening. Required for all participants. Your data is not stored on-chain.

Step three: Participation Agreement. Execution of the agreement governed by the SPV. This defines your rights, token mechanics, redemption process, and governance participation.

Step four: Wallet Setup. Configuration of your XRPL and Stellar wallets. Establishment of trustlines to the OPTKAS issuer account. We provide guidance on wallet security and key management.

Step five: Stablecoin Integration. Setup of your preferred stablecoin integration — whether that's Bitstamp, GateHub, USDT, or USDC. Trustline creation and initial funding so you're ready to transact.

Step six: First Transaction. Execution of your first Delivery-versus-Payment transaction. You'll see the escrow creation, the atomic settlement, the attestation NFT minting, and the dual-chain proof — all in real time.

Step seven: Ongoing Access. Full access to trading, liquidity pools, reporting dashboards, investor reports, and the Training Academy. Your assets are monitored twenty-four-seven by the risk analytics engine.

What will you need? Government-issued ID and proof of address for KYC. An XRPL-compatible wallet — Xumm, also known as Xaman, is recommended — and optionally a Stellar wallet. And minimum XRP for account reserves — approximately twelve XRP — plus your investment capital in USD or a supported stablecoin.

Common questions: OPTKAS is not a bank — it doesn't accept deposits or lend directly. It's not an exchange — the DEX and AMM are native ledger features. A qualified third-party custodian keeps your money safe. Your tokens live on a public blockchain — as long as you maintain custody of your wallet keys, your tokens cannot be lost. You can cash out by selling on AMM pools for XRP or stablecoins, then converting to fiat. And the twenty-five point seven-five million dollar insurance policy provides protection if something goes wrong.
"""
    },
    {
        "filename": "sec9-full-system-review.mp3",
        "text": """
Section Nine — Full System Review.

Over eight sections, you've explored the full OPTKAS platform — from its legal foundation to its blockchain infrastructure, from stablecoin mechanics to cross-chain settlement. Here is everything distilled into one definitive recap.

OPTKAS is a full-stack institutional digital securities platform built on the XRP Ledger and Stellar networks. It operates one hundred and thirty-four live capabilities across five operational layers. Twenty-eight TypeScript engines automate everything from bond lifecycle management to risk analytics. Nine funded mainnet accounts — six on XRPL plus three on Stellar — handle issuance, treasury, escrow, attestation, AMM provision, trading, distribution, and fiat bridging.

The legal foundation: a Wyoming SPV — OPTKAS1-MAIN LLC. A five-hundred-million-dollar Medium-Term Note program. UCC-1 lien filings establishing first-priority secured claims. A master bond indenture defining all rights and obligations. And Securities Transfer Corporation as the independent transfer agent.

Six tokenized asset classes: OPTKAS for the bond program, SOVBND for sovereign instruments, IMPERIA for diversified portfolios, GEMVLT for precious stones, TERRAVL for real estate, and PETRO for energy contracts.

The dual-chain architecture: XRPL as the primary settlement chain with the native DEX, six AMM pools, escrow, and NFT attestations. Stellar as the regulated asset chain with authorization, clawback, SEP-24 fiat on and off ramp, and three additional AMM pools. Every significant action is hashed and anchored on both chains independently — dual-chain proof that makes verification trivial and falsification impossible.

Four stablecoin integrations provide fiat access: Bitstamp USD, GateHub USD, USDT, and USDC. Plus the ability to build custom stablecoins and use XRP as a universal bridge currency.

Nine liquidity pools provide always-on trading: six on XRPL pairing each token with XRP, and three on Stellar. Smart routing between AMM pools and the native DEX ensures best execution. Liquidity providers earn passive fees from every swap.

Security protections include multi-signature governance — two-of-three standard, three-of-three for configuration, one-of-three for emergencies. A twenty-five point seven-five million dollar insurance policy. Over twelve hundred automated tests. Seventy-plus pre-flight checks. Ten thousand Monte Carlo simulations. And a trading kill switch with circuit breaker.

Fee allocation is transparent: thirty percent to legal and compliance, twenty-five percent to custody and insurance, twenty-five percent to technology infrastructure, and twenty percent to operations and development.

Your onboarding path follows seven steps: consultation, KYC verification, participation agreement, wallet setup, stablecoin integration, first transaction, and ongoing access to the full platform.

This concludes the OPTKAS Client Portal. You now understand what the platform does, how it works, and how to participate. Your assets deserve institutional-grade infrastructure — and now you know exactly how it all works.
"""
    },
]


async def generate_one(section, index, total):
    filepath = os.path.join(OUTPUT_DIR, section["filename"])

    # Skip if already generated and > 10KB
    if os.path.exists(filepath) and os.path.getsize(filepath) > 10240:
        size_kb = os.path.getsize(filepath) / 1024
        print(f"[{index}/{total}] SKIP (exists): {section['filename']} ({size_kb:.0f} KB)")
        return True

    # Remove 0-byte leftovers from previous failed runs
    if os.path.exists(filepath) and os.path.getsize(filepath) == 0:
        os.remove(filepath)

    max_retries = 8
    for attempt in range(1, max_retries + 1):
        try:
            print(f"[{index}/{total}] Generating: {section['filename']} (attempt {attempt})...")
            communicate = edge_tts.Communicate(
                text=section["text"].strip(),
                voice=VOICE,
                rate=RATE
            )
            await communicate.save(filepath)
            size_kb = os.path.getsize(filepath) / 1024
            if size_kb < 1:
                print(f"  x Generated file too small ({size_kb:.0f} KB), retrying...")
                os.remove(filepath)
                continue
            print(f"  -> Saved ({size_kb:.0f} KB)")
            return True
        except (asyncio.CancelledError, KeyboardInterrupt):
            print(f"  x Cancelled")
            raise
        except Exception as e:
            err_msg = str(e)[:80]
            print(f"  x Error: {err_msg}")
            # Clean up partial files
            if os.path.exists(filepath) and os.path.getsize(filepath) == 0:
                os.remove(filepath)
            if attempt < max_retries:
                wait = min(attempt * 10, 60)
                print(f"  Retrying in {wait}s...")
                try:
                    await asyncio.sleep(wait)
                except asyncio.CancelledError:
                    raise
    return False


async def generate_portal_audio():
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    failed = []
    for i, section in enumerate(SECTIONS, 1):
        ok = await generate_one(section, i, len(SECTIONS))
        if not ok:
            failed.append(section["filename"])
        try:
            await asyncio.sleep(5)
        except asyncio.CancelledError:
            break

    if failed:
        print(f"\n!! Failed: {', '.join(failed)}")
    else:
        print(f"\n-> Done. {len(SECTIONS)} portal MP3 files generated in: {OUTPUT_DIR}")


if __name__ == "__main__":
    asyncio.run(generate_portal_audio())
