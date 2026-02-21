"""
OPTKAS Platform Operations Guide — Neural Voice Narration Generator
Uses Microsoft Edge TTS (en-US-AndrewNeural) for hyper-realistic voice.
Generates 10 MP3s — one per section of Platform Operations.
"""

import asyncio
import edge_tts
import os

VOICE = "en-US-AndrewNeural"
RATE = "+0%"
OUTPUT_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "audio", "ops")

# ─────────────────────────────────────────────────────────────
# PLATFORM OPERATIONS SECTION NARRATION SCRIPTS
# Each script narrates the section content as a senior operations
# advisor explaining the OPTKAS platform owner's capabilities.
# ─────────────────────────────────────────────────────────────

SECTIONS = [
    {
        "filename": "sec1-you-are-the-issuer.mp3",
        "text": """
Section One — Yes, You Are the Issuer.

This section is the most important thing you will learn in the entire Platform Operations Guide. You are the issuer. Not a middleman. Not a reseller. Not a white-label partner. You are the entity that mints, controls, and manages digital securities on the XRP Ledger and Stellar networks.

What does being the issuer actually mean? It means you have direct control over six powers that define the platform.

First, you can mint tokens. You create new digital securities by sending a Payment transaction from the Issuer account. Tokens come into existence the moment you send them. There is no approval queue. No third-party minting service. You decide what gets created and when.

Second, you can burn tokens. When bonds mature or tokens need to be recalled, you accept them back at the Issuer account. Tokens received by the Issuer are automatically destroyed — burned — reducing total supply. This is a native ledger feature, not an application layer trick.

Third, you can freeze accounts. You can freeze any individual holder's trustline to your tokens, preventing them from transacting. You can also trigger a global freeze that stops all trustline activity for all holders simultaneously. This is your compliance and emergency tool.

Fourth, you can approve holders. With the Require Auth flag enabled, no one can hold your tokens until you explicitly authorize their trustline. This is how you enforce KYC and AML — every holder is pre-approved by you.

Fifth, you can revoke and clawback. On Stellar, you can revoke a holder's authorization and actively clawback tokens from their account. On XRPL, you freeze their trustline. Either way, you maintain absolute control.

Sixth, you can set token economics. You define the coupon rate, maturity schedule, redemption terms, and distribution waterfall for every instrument.

Now — know the difference between three roles. The Issuer — that's you — creates, controls, and manages tokens. An Exchange provides a marketplace where people trade assets they don't issue. A Custodian holds assets on behalf of others without controlling the tokens themselves. OPTKAS makes you the issuer. You are not operating an exchange — the XRPL DEX and AMM pools are native to the ledger. And you work with a qualified custodian for fiat reserves — Securities Transfer Corporation and qualified banking partners.

This distinction matters for regulation, for liability, and for understanding your actual powers. You don't need an exchange license because you're not running an exchange. The ledger does the trading. You are the issuer of the assets that trade on it.
"""
    },
    {
        "filename": "sec2-running-the-dex.mp3",
        "text": """
Section Two — Running the DEX.

You don't run an exchange. You use native ones. This is a critical distinction. The XRPL has a built-in decentralized exchange — a native orderbook — that exists at the protocol level. It wasn't built by OPTKAS. It wasn't built by anyone. It's part of the ledger's DNA. Every token on the XRPL can be traded against every other token automatically.

Why does this matter? Because you don't need an exchange license. You don't need matching engine software. You don't need order management systems. The ledger handles all of that natively, running twenty-four hours a day, seven days a week, three hundred sixty-five days a year.

Two trading systems are available to you.

The first is the XRPL Native DEX — a fully decentralized orderbook. Anyone can place limit orders. Orders are matched automatically by the ledger. There are no intermediaries. Settlement is atomic — either both sides execute or neither does. This is the same technology as a traditional exchange orderbook, but it runs on a public ledger with no downtime.

The second is AMM Liquidity Pools — the XLS-30 standard. These are automated market makers where liquidity providers deposit equal value of two assets, and the pool uses a constant-product formula to price trades. Traders swap against the pool instead of waiting for a counterparty.

You operate nine liquidity pools across two chains. On XRPL: OPTKAS paired with XRP, SOVBND paired with XRP, IMPERIA paired with XRP, GEMVLT paired with XRP, TERRAVL paired with XRP, and PETRO paired with XRP. On Stellar: OPTKAS-USD paired with XLM, SOVBND-USD paired with XLM, and IMPERIA-USD paired with XLM.

What you earn from trading: AMM pools charge a trading fee on every swap — typically zero point three to one percent. As the liquidity provider, you earn a proportional share of every trading fee. This is passive income that accrues automatically. The XRPL DEX charges near-zero network fees — approximately two hundredths of a cent per transaction. Your revenue comes from the spread and the AMM fees, not from transaction processing.

The TradingEngine — one of your twenty-eight TypeScript automation engines — manages algorithmic trading across both systems. It routes orders between the DEX and AMM pools for best execution, manages slippage limits, and implements the five-percent circuit breaker and ten-percent kill switch for risk management.
"""
    },
    {
        "filename": "sec3-client-onboarding.mp3",
        "text": """
Section Three — Client Onboarding.

Every client follows the same structured journey — from initial discovery to fully active participation. There are no shortcuts and no exceptions. The process is designed to be thorough but efficient.

The ideal client journey has seven stages.

Stage one is Discovery and Education. Prospects encounter OPTKAS through the public website, the Training Academy, institutional referrals, or direct outreach. The Client Portal provides a self-guided education path covering all eight core topics. The AI Knowledge Assistant answers questions in real time.

Stage two is Initial Consultation. A direct conversation to understand the prospect's goals, risk tolerance, investment timeline, and which asset classes interest them. This is also where you assess whether they're a good fit for the platform.

Stage three is KYC and AML Verification. Government-issued ID verification, proof of address, sanctions screening, PEP — politically exposed person — checks, and source of funds documentation. This is non-negotiable. Every participant must be fully verified before any accounts are created.

Stage four is Legal Documentation. Execution of the Participation Agreement governed by the SPV — OPTKAS1-MAIN LLC. This agreement defines token mechanics, redemption rights, governance participation, coupon schedules, and all material terms.

Stage five is Wallet Setup. Configuration of XRPL and Stellar wallets. Trustline establishment to the OPTKAS issuer accounts. Multisig configuration if applicable. You handle this through the WalletEngine automation — managed wallets can be provisioned in under sixty seconds.

Stage six is Funding and First Transaction. Stablecoin integration setup, initial capital transfer, and execution of the first Delivery-versus-Payment transaction. The client sees the full process — escrow creation, atomic settlement, attestation NFT minting, and dual-chain proof.

Stage seven is Ongoing Access. Full platform access — trading, liquidity pools, reporting dashboards, investor reports, Training Academy, and the AI Assistant.

Client acquisition channels include the public website and GitHub Pages deployment, social media and content marketing, institutional referrals and partnerships, direct outreach to qualified investors, and the Training Academy as an education funnel. Every channel leads to the same onboarding process.
"""
    },
    {
        "filename": "sec4-wallet-provisioning.mp3",
        "text": """
Section Four — Wallet Provisioning.

Wallet provisioning is how you set up blockchain accounts for clients. OPTKAS supports two models — managed wallets and self-custody wallets. Each has trade-offs.

Managed wallets are accounts you create and administer on behalf of clients. The WalletEngine automation handles the entire process: account generation, XRP and XLM funding for reserves, trustline creation to all OPTKAS tokens, authorization approval, and key encryption and storage. A managed wallet can be fully operational in under sixty seconds.

The advantage of managed wallets is simplicity for the client — they don't need to understand blockchain key management. The disadvantage is that you hold custodial responsibility. Keys are generated using Node.js CSPRNG — cryptographically secure pseudo-random number generation — the same standard used by banks. All seed phrases are encrypted and stored in offline cold storage, never on-chain and never in source code.

Self-custody wallets are accounts the client creates and controls themselves. They generate their own keys, manage their own security, and sign their own transactions. You simply authorize their trustlines and they're ready to trade. This is the more common model for sophisticated institutional clients who want direct control.

Either way, every wallet requires trustlines before it can hold your tokens. On XRPL, a trustline is a bilateral credit relationship between a holder and the issuer. Creating a trustline reserves two-tenths XRP that is refundable when the trustline is removed. On Stellar, a trustline is similar — it reserves half an XLM.

With Require Auth enabled on your issuer account, creating a trustline alone is not enough. The holder must also be authorized by you — the issuer — before tokens can flow into their account. This is where your KYC enforcement happens at the protocol level.

The automated wallet setup flow runs like this: the WalletEngine generates an XRPL keypair, funds the account with the minimum twelve XRP reserve, creates trustlines for all six OPTKAS tokens, sends authorization transactions from the Issuer account, configures the default ripple flag, and confirms operational status. The entire sequence is logged with SHA-256 hashes for audit.
"""
    },
    {
        "filename": "sec5-token-issuance.mp3",
        "text": """
Section Five — Token Issuance.

Token issuance is the core act of your platform — creating digital securities and delivering them to investors. OPTKAS has six live IOUs on the XRPL mainnet, each representing a distinct asset class.

OPTKAS Primary — the flagship bond claim receipt backed by the five-hundred-million-dollar MTN program. SOVBND — the sovereign claim tracker for government-grade instruments. IMPERIA — the asset-class basket for diversified portfolio exposure. GEMVLT — vault participation tokens for certified precious stones. TERRAVL — real estate claim tokens for fractional property ownership. And PETRO — energy claim tokens for oil, gas, and energy contracts.

On Stellar, there is one regulated asset — OPTKAS-USD — issued with authorization required, authorization revocable, and clawback enabled.

Creating new tokens follows a defined process. First, you define the token parameters — currency code (up to three characters for standard IOUs, or a hex-encoded string for longer names), the issuer account, and the economic terms. Second, the BondFactory engine structures the instrument with coupon rate, maturity date, face value, and waterfall logic. Third, you send a Payment transaction from the Issuer account to the Treasury or directly to investors. The moment the Issuer sends tokens, they come into existence — this is how XRPL IOUs work. The Issuer's negative balance represents tokens in circulation.

Delivery-versus-Payment — DvP — is how tokens reach investors safely. The process is atomic. Step one: the escrow engine creates a conditional escrow holding the tokens. Step two: the investor's stablecoin payment is verified. Step three: both sides execute simultaneously — tokens transfer to the investor and payment transfers to the treasury. If either side fails, both revert. Zero counterparty risk.

Every issuance event generates three pieces of evidence: a SHA-256 document hash anchored on XRPL, the same hash published to Stellar via manage_data, and an XLS-20 NFT minted as a permanent attestation certificate. This triple evidence package makes every issuance independently verifiable on two public blockchains.

Supply management is straightforward. Minting increases supply — send from Issuer. Burning decreases supply — receive at Issuer. The current circulating supply is always verifiable by checking the Issuer account's obligations on the ledger.
"""
    },
    {
        "filename": "sec6-monitoring-control.mp3",
        "text": """
Section Six — Monitoring and Control.

Once your platform is live, continuous monitoring ensures everything operates within defined parameters. OPTKAS runs twenty-eight TypeScript automation engines that handle risk, compliance, trading, and evidence — around the clock.

Risk monitoring operates through the RiskEngine. It runs ten thousand Monte Carlo simulations continuously, modeling potential portfolio outcomes across stressed scenarios. It monitors collateral ratios — the value of reserves versus outstanding token obligations. It tracks Net Asset Value in real time. It calculates Value at Risk at the ninety-five and ninety-nine percent confidence levels. And it monitors concentration indexes — making sure no single holder or asset class represents a disproportionate risk.

Trading surveillance runs through the TradingEngine. It tracks AMM pool depth to ensure adequate liquidity. It monitors slippage — the difference between expected and actual execution price. It enforces the five-percent circuit breaker that pauses trading when losses approach concerning levels. And it triggers the ten-percent kill switch that halts all trading if losses exceed the maximum threshold.

Compliance monitoring is continuous. KYC status is tracked for every holder. Sanctions lists and PEP databases are checked regularly. Freeze actions are logged and ready for immediate deployment if needed. Every compliance event is hashed and anchored on-chain for audit.

The evidence and attestation layer — powered by the AttestationEngine — ensures every significant action leaves an immutable record. SHA-256 hashes are computed for every document, transaction receipt, and compliance report. These hashes are anchored on XRPL via memo transactions and on Stellar via manage_data operations. XLS-20 NFTs are minted as permanent proof certificates.

Reserve monitoring tracks the one-to-one relationship between tokens in circulation and fiat dollars in qualified custody. The ReserveEngine continuously verifies that every token is backed. If a discrepancy is detected, alerts fire to all governance signers and automated remediation begins.

Real-time dashboards give you visibility into all of these systems simultaneously — pool depth, trading volume, collateral ratios, NAV, slippage metrics, and compliance status. Everything is logged, everything is auditable, and everything runs automatically.
"""
    },
    {
        "filename": "sec7-systems-you-can-build.mp3",
        "text": """
Section Seven — Systems You Can Build.

OPTKAS is not limited to the six existing token types. The platform infrastructure supports building additional systems and instruments. Here are the major categories.

Bond programs are the foundation. You can structure fixed-rate bonds, floating-rate bonds linked to reference rates, zero-coupon bonds sold at discount, callable bonds that can be redeemed early, and convertible bonds that transform into other asset types. The BondFactory engine handles structuring, the PaymentEngine manages coupons, and the MaturityEngine handles redemption. Each bond program operates under the five-hundred-million-dollar MTN capacity.

Real estate tokenization allows fractional ownership of commercial and residential properties. Each property becomes a TERRAVL token series with its own economics. Rental income flows through the waterfall distribution. Property valuations are attested and anchored on-chain. Investors can trade their fractional shares on the AMM pools twenty-four-seven.

Precious gems and commodities are represented by GEMVLT tokens. Each gem or commodity lot is independently certified, with the certification document hashed and stored on-chain. Vault participation tokens give holders a claim on specific certified assets. The physical custody chain is documented from mine to vault to tokenization.

Energy contracts — oil, gas, and renewable energy claims — are represented by PETRO tokens. Production revenue flows through smart waterfall distributions. Energy price exposure is managed through the diversified portfolio approach.

Collateralized debt positions allow you to build a stablecoin-like system where users deposit collateral — whether XRP, other tokens, or tokenized real assets — and borrow against it. Similar to how MakerDAO's DAI system works, but using XRPL infrastructure with full legal backing.

Structured products combine multiple underlying assets into a single instrument. IMPERIA is the existing example — a basket providing diversified exposure. You can create additional baskets targeting specific risk profiles, geographic regions, or sector focuses.

Every new instrument you build follows the same operational pattern: legal structuring, token creation, evidence anchoring, reserve verification, and trading enablement. The twenty-eight automation engines handle it all.
"""
    },
    {
        "filename": "sec8-website-automation.mp3",
        "text": """
Section Eight — Website and Automation.

The OPTKAS platform runs on a fully deployed website infrastructure with complete automation for every operational function.

The website map includes six major pages. The Operating Manual — the institutional overview covering all twelve sections of platform capabilities. The Training Academy — a nine-module educational curriculum with neural voice narration. The Client Portal — a nine-section guided introduction for new clients. The Platform Operations Guide — the document you're listening to right now, covering all ten sections of operations. The Institutional Overview — the formal presentation of the platform for qualified investors. And the AI Knowledge Assistant — an intelligent chatbot trained on the complete platform knowledge base.

All pages are deployed via GitHub Pages from the FTH Trading repository. Updates are version-controlled through Git with semantic versioning. Each release is tagged and documented with a complete changelog.

The automation breakdown covers twenty-eight TypeScript engines organized by function.

Bond lifecycle engines include BondFactory for instrument structuring, PaymentEngine for coupon distribution, MaturityEngine for redemption processing, and WaterfallEngine for priority-based payment allocation.

Trading engines include TradingEngine for algorithmic DEX and AMM execution, LiquidityEngine for pool management and rebalancing, and RoutingEngine for best-execution path finding across DEX and AMM.

Evidence engines include AttestationEngine for SHA-256 hashing and proof anchoring, NFTEngine for XLS-20 attestation certificate minting, and AuditEngine for append-only event logging.

Risk engines include RiskEngine for Monte Carlo simulations and VaR calculations, ReserveEngine for one-to-one backing verification, and ComplianceEngine for KYC, AML, and sanctions monitoring.

Operations engines include WalletEngine for account provisioning and trustline management, EscrowEngine for conditional escrow creation and fulfillment, SettlementEngine for cross-chain atomic settlement, and DealPipelineEngine for investor lifecycle tracking.

Each engine operates independently with its own error handling, retry logic, and logging. All engines communicate through a shared event bus. Every action is logged with SHA-256 hashes for complete audit trail.
"""
    },
    {
        "filename": "sec9-revenue-growth.mp3",
        "text": """
Section Nine — Revenue and Growth.

OPTKAS generates revenue through six distinct streams, each tied to a specific infrastructure function.

Stream one: AMM Trading Fees. Every swap through your nine liquidity pools generates a trading fee — typically zero point three to one percent. As the primary liquidity provider, you earn the majority of these fees. Trading fees accrue automatically and continuously. Higher trading volume directly increases revenue.

Stream two: Bond Origination Fees. Each new bond issuance under the MTN program generates an origination fee. This covers the legal structuring, token creation, escrow setup, and attestation. As program capacity is five hundred million dollars, even modest issuance creates significant origination revenue.

Stream three: Custody and Administration Fees. Ongoing fees for managing investor accounts, processing coupon payments, handling redemptions, and maintaining compliance records. These are recurring and predictable.

Stream four: Platform Access Fees. Setup and onboarding fees for new participants — KYC processing, wallet provisioning, stablecoin integration, and initial training.

Stream five: Stablecoin and FX Margins. Small spreads on stablecoin conversions and foreign exchange operations. When clients move between fiat currencies or between different stablecoin types, margins are captured.

Stream six: Consulting and Custom Development. Custom instrument structuring, bespoke token economics, white-label deployment for institutional partners, and specialized integration services.

Growth levers for scaling the platform. Token variety — launching additional asset classes and creating new trading pairs grows the addressable market. Geographic expansion — adding new jurisdictions, new fiat currencies, and new anchor partnerships extends reach. Volume growth — more traders in AMM pools means more trading fees. Each new participant adds liquidity and generates revenue. Institutional partnerships — white-label arrangements where other firms use your infrastructure under their brand. Technology licensing — the automation engines and the attestation framework can be licensed to other issuers.

The key growth principle is that infrastructure costs are largely fixed while revenue scales with volume. Nine pools serving a hundred investors have the same infrastructure cost as nine pools serving ten thousand investors — but the revenue difference is enormous.
"""
    },
    {
        "filename": "sec10-full-capability-map.mp3",
        "text": """
Section Ten — Full Capability Map.

This final section maps all one hundred and thirty-four live OPTKAS capabilities organized by the five operational layers. This is the complete platform inventory.

Layer One — Legal and Compliance — includes twenty-two capabilities. SPV formation and governance. Bond indenture and MTN program. UCC-1 lien filings. Transfer agent engagement. CUSIP and ISIN registration. KYC and AML processing. Sanctions and PEP screening. Participation agreement execution. Compliance monitoring. Regulatory reporting. Freeze authority. Clawback rights. Authorization controls. Legal opinion documentation. Wyoming corporate maintenance. Annual compliance reviews. Investor register maintenance. Material event disclosure. Default protocol procedures. Waterfall priority enforcement. Insurance policy management. And regulatory correspondence.

Layer Two — Custody and Banking — includes eighteen capabilities. Qualified custodian relationship. One-to-one fiat reserve maintenance. Bank escrow accounts. FX operations. Fiat on-ramp via Stellar anchors. Fiat off-ramp via Stellar anchors. Multi-currency support. Wire transfer processing. Stablecoin conversions. Reserve verification. Reconciliation reporting. Segregated account management. Interest income management. Redemption payment processing. Coupon payment processing. Capital call processing. Distribution processing. And custody audit support.

Layer Three — Automation and Intelligence — includes thirty-two capabilities, powered by the twenty-eight TypeScript engines. Bond lifecycle management. Coupon calculation and distribution. Maturity processing. Waterfall allocation. Algorithmic trading. Liquidity pool management. Order routing optimization. Wallet provisioning. Trustline management. Escrow creation and fulfillment. Cross-chain settlement. Deal pipeline tracking. Risk analytics. Monte Carlo simulation. Reserve monitoring. Compliance screening. Attestation hashing. NFT minting. Audit event logging. Real-time dashboards. Alert generation. Portfolio analytics. NAV calculation. Slippage monitoring. Circuit breaker enforcement. Kill switch management. Investor reporting. Document generation. Search indexing. Version management. PDF generation. And AI knowledge assistance.

Layer Four — Evidence and Attestation — includes twenty-eight capabilities. SHA-256 document hashing. XRPL memo anchoring. Stellar manage_data publishing. XLS-20 NFT certificates. Dual-chain proof pairs. Append-only audit store. Transaction receipt archival. Compliance event logging. Reserve snapshot attestation. Issuance proof generation. Redemption proof generation. Coupon proof generation. Trading proof generation. Freeze event logging. Authorization event logging. KYC completion attestation. Document version tracking. Evidence chain verification. Public explorer integration. Proof retrieval API. Attestation search indexing. Hash validation tools. Cross-chain proof matching. Evidence export. Regulatory evidence packages. Investor evidence statements. Audit trail reconstruction. And forensic analysis support.

Layer Five — Settlement and Trading — includes thirty-four capabilities. XRPL mainnet account management. Stellar mainnet account management. Six XRPL IOU token operations. One Stellar regulated asset operation. Nine AMM pool management. XRPL DEX orderbook trading. Conditional escrow operations. Atomic Delivery-versus-Payment. Multisig transaction signing. Cross-chain settlement coordination. XRP bridge currency operations. Trustline authorization management. Global freeze capability. Individual freeze capability. Token minting operations. Token burning operations. Pool deposit operations. Pool withdrawal operations. LP token management. Slippage protection. Fee collection. Trade execution reporting. Settlement confirmation. Escrow fulfillment. Escrow cancellation. Account reserve management. Flag configuration. Signer list management. Regular key management. Payment channel operations. Check operations. NFT offer management. NFT transfer operations. And destination tag routing.

That is the complete OPTKAS platform — one hundred and thirty-four capabilities across five layers, all live, all operational, all monitored twenty-four-seven.
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


async def generate_ops_audio():
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
        print(f"\n-> Done. {len(SECTIONS)} ops MP3 files generated in: {OUTPUT_DIR}")


if __name__ == "__main__":
    asyncio.run(generate_ops_audio())
