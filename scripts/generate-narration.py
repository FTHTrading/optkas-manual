"""
OPTKAS Training Manual — Neural Voice Narration Generator
Uses Microsoft Edge TTS (en-US-AndrewNeural) for hyper-realistic voice.
Generates 12 teaching MP3s — one per section of the operating manual.
"""

import asyncio
import edge_tts
import os

VOICE = "en-US-AndrewNeural"
RATE = "+0%"
OUTPUT_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "audio")

# ─────────────────────────────────────────────────────────────
# TEACHING NARRATION SCRIPTS — Written to teach, not to read.
# Each script explains the concepts, purpose, and architecture
# as if a senior institutional advisor were briefing a board.
# ─────────────────────────────────────────────────────────────

SECTIONS = [
    {
        "filename": "01-executive-overview.mp3",
        "text": """
Welcome to the OPTKAS Institutional Operating Manual.

This training will walk you through the complete architecture of OPTKAS — an institutional-grade settlement and control infrastructure built on two public ledgers: the XRP Ledger and the Stellar network.

Before we begin, let's establish what this system is and what it is not.

OPTKAS is not a bank. It is not a broker-dealer. It's not a custodian or an exchange. It is infrastructure — settlement infrastructure — that internalizes functions traditionally performed by clearing agents, transfer agents, custodial escrow services, and audit verification providers. All of these functions are unified into a single, programmable, verifiable system.

The platform operates a five-hundred-million-dollar medium-term note program. The first tranche is ten million dollars, carrying a five percent coupon with a twenty-thirty maturity date. The legal entity is a Delaware Series LLC, governed by a bond indenture, with independent custody and multi-signature governance at the protocol level.

Here are the key numbers: The system has one hundred and thirty-four total capabilities. One hundred twenty-eight are live on mainnet. Five are in dry-run testing. One is planned. There are nine mainnet accounts — six on the XRP Ledger and three on Stellar. Twenty-eight TypeScript engines power the automation layer. And nine automated market maker pools provide continuous liquidity.

The architecture follows a strict hierarchy. Read it top-down: Law governs custody. Custody funds engines. Engines create evidence. Evidence settles on-chain. This ordering is not decorative — it is the control chain. No technology can override legal authority, and no engine can operate outside the boundaries set by law and custody.

Throughout this training, you will learn each of the seven layers in detail, from the legal framework at the top to the regulatory boundaries at the bottom. Let's begin.
"""
    },
    {
        "filename": "02-legal-control.mp3",
        "text": """
Layer One — Legal and Control Framework.

This is the foundation. Everything in the OPTKAS system is governed by this layer. The core principle is simple: law is always Layer One. No technology, no smart contract, no automation engine can override legal authority.

The legal structure is a Special Purpose Vehicle — FTH Trading LLC — organized as a Delaware Series LLC. This is a single-purpose entity created specifically to isolate the bond program from any other business activity. Delaware was chosen for its mature corporate law framework and the legal flexibility of the Series LLC structure, which allows the SPV to segregate assets and liabilities across different series.

The bond indenture governs a five-hundred-million-dollar medium-term note program. The first tranche of ten million dollars has been issued. The bonds carry a five percent annual coupon and mature in twenty-thirty. Crucially, the offering is structured under Regulation D, Rule 506(c), meaning only verified accredited investors may participate.

The SPV uses a registered transfer agent — Securities Transfer Corporation — which is registered with the Securities and Exchange Commission. This is important because the transfer agent provides an independent, regulated entity responsible for maintaining the official record of bondholders. This is not a self-managed spreadsheet — it is a legally authoritative registry.

Insurance coverage totals twenty-five point seven-five million dollars across four policy types: errors and omissions, directors and officers, cyber liability, and professional liability. This coverage exists as a backstop — it does not replace the structural controls, but it provides financial protection if those controls are ever tested.

The governance authority chain works as follows: the bond indenture sets the rules. Board resolutions authorize specific actions. The multisig policy translates those authorizations into on-chain execution permissions. And the ledger enforces those permissions. Each layer requires authorization from the layer above it. No one person, no one key, and no one decision can move assets unilaterally.

All ten capabilities in this layer are live on mainnet. They include SPV formation, the bond indenture itself, the registered transfer agent, Regulation D compliance, the insurance program, board governance, AML and KYC compliance, audit authority, dispute resolution, and the regulatory communication interface.
"""
    },
    {
        "filename": "03-custody-banking.mp3",
        "text": """
Layer Two — Custody and Banking.

The core principle of this layer is one-to-one backing. Every digital dollar on the platform has a corresponding physical dollar — or regulated stablecoin peg — held in a controlled account. Custody is on-ledger, one-to-one, and independently verifiable.

This matters because in traditional finance, custody is often opaque. You trust a custodian to hold your assets. In this system, custody is transparent by design — you can verify it yourself using public ledger explorers.

The system uses four approved stablecoin trustlines: Bitstamp USD on the XRP Ledger, GateHub USD on the XRP Ledger, Tether USD on the XRP Ledger, and Circle USDC on the Stellar network. These trustlines are the digital representation of fiat custody. Each one connects to a regulated stablecoin issuer that maintains one-to-one reserves.

Let me explain what a trustline is. On the XRP Ledger, you don't just "receive" a token. You first have to explicitly authorize a trust relationship with the issuer. This is called setting a trustline. It's a deliberate action — you are saying "I trust this issuer to hold my funds." The platform controls which trustlines are active, which issuers are approved, and what limits apply.

The custody layer has ten capabilities. These include stablecoin custody with one-to-one peg, XRPL native escrow lock using the EscrowCreate transaction, condition-verified escrow release using EscrowFinish, time-expired escrow cancellation using EscrowCancel, multi-issuer support across four trustline providers, continuous reserve monitoring, fiat on-ramp through banking integration, fiat off-ramp for stablecoin-to-bank redemption, on-demand custody auditing, and per-deal account segregation.

The escrow mechanics are especially important. XRPL escrow is not a smart contract — it is a native protocol feature. When funds are placed in escrow, they are held by the ledger itself, not by any person or entity. The escrow can be configured with time conditions, cryptographic conditions, or both. This means settlement can be made atomic — both sides clear simultaneously or neither does.

All ten capabilities in this layer are live on mainnet.
"""
    },
    {
        "filename": "04-settlement.mp3",
        "text": """
Settlement — the XRPL and Stellar Settlement Layer.

This is the core of what makes OPTKAS different from traditional infrastructure. Settlement is atomic. Both sides of a transaction clear simultaneously, or neither does. There is no counterparty risk window. No T-plus-one or T-plus-two delay. No clearing intermediary.

Let me first explain what the XRP Ledger is, because understanding the ledger is essential to understanding why this system works.

The XRP Ledger, or XRPL, is a public, decentralized blockchain network. It was created in twenty-twelve and has been running continuously ever since. Unlike many blockchain networks, the XRPL was designed specifically for financial transactions. It has native support for payments, escrow, trustlines, token issuance, decentralized exchange orders, and automated market maker pools — all built into the protocol itself. These are not smart contracts bolted on top. They are native features of the ledger.

The XRPL settles transactions in approximately three to five seconds. Transaction fees are a fraction of a cent. The network processes roughly fifteen hundred transactions per second. It uses a consensus mechanism called the Unique Node List — not proof-of-work or proof-of-stake. This means it does not require mining or staking, which keeps costs minimal and energy usage negligible.

Now, here's what the OPTKAS system has built on top of this ledger.

There are nineteen XRPL settlement capabilities. These include issuer account configuration with Default Ripple, Require Auth, and No Freeze flags set appropriately. Treasury account management with controlled trustlines. Time-based escrow and crypto-conditional escrow. Atomic delivery-versus-payment settlement, which combines escrow, conditions, and trustlines into a single settlement flow. Trustline authorization and creation. Direct payments, DEX order creation and cancellation, cross-currency payments with pathfinding, XLS-20 NFT minting for attestation, transaction monitoring via WebSocket, and automated sequence management.

The settlement sequence works like this: First, the buyer funds an escrow with stablecoin. Second, the seller deposits the asset into a conditional hold. Third, both sides satisfy their respective conditions. Fourth, the settlement executes atomically — meaning the asset and the payment swap simultaneously on the ledger. Fifth, receipts are minted as XLS-20 NFTs providing permanent proof of the transaction.

The system also operates nine automated market maker pools — six on the XRP Ledger and three on Stellar. These pools provide continuous liquidity without requiring a traditional market maker. The pools operate using the constant product market maker formula, meaning any participant can swap assets at market-determined prices, at any time, without needing a counterparty.

The multi-signature governance layer adds five more capabilities: signer configuration with three-of-five quorum, multi-sign transaction execution, signer rotation, quorum adjustment, and master key disable. This means no single key can authorize a transaction — multiple independent signers must agree.

On the Stellar side, there are nine additional capabilities. Stellar is used for the regulated asset — OPTKAS-USD — which has full issuer control including authorization required, authorization revocable, and clawback enabled. Clawback might sound aggressive, but on Stellar it's designed specifically for compliance-grade regulated assets where the issuer needs the ability to freeze or recall tokens in response to legal or regulatory requirements.

In total, this layer has forty-two capabilities. All are live on mainnet except one — the DisableMaster flag, which is planned for activation after the initial operating period.
"""
    },
    {
        "filename": "05-asset-issuance.mp3",
        "text": """
Asset Issuance — the Token Layer.

This layer defines every digital instrument that exists within the OPTKAS system. There are six XRPL-issued assets and one Stellar regulated asset.

It's critical to understand what these tokens represent. Tokens in the OPTKAS system are not cryptocurrencies. They are not speculative instruments. They are digital representations of legal agreements — claim receipts, settlement tools, evidence markers, and governance instruments. The token mirrors the law. The law governs ownership. The token is the mechanism through which that ownership is recorded and transferred on the ledger.

Let's walk through each one.

OPTKAS-MTN is the Medium-Term Note Token. This represents the primary bond claim receipt. When an investor participates in the bond program, they receive this token as proof of their position. It has freeze capability enabled — meaning the issuer can freeze the token in compliance scenarios — but no clawback.

OPTKAS-CR is the Claim Receipt. This represents a lender's specific claim on a funded position. It's not the asset itself — it's the receipt of participation. Think of it like a deposit slip at a bank, but on-chain and cryptographically verifiable.

OPTKAS-ST is the Settlement Token. This is used in delivery-versus-payment flows as the medium of atomic exchange. It moves through escrow during settlement. It is a functional instrument, not an investment.

OPTKAS-EV is the Evidence Marker. This anchors a SHA-256 hash of compliance or audit data to the ledger. It is not a financial instrument — it is a proof artifact. When you see an Evidence Marker, you know that a specific document, report, or data bundle has been hashed and permanently recorded.

OPTKAS-LP is the Liquidity Provider Token. This represents a provider's share in one of the automated market maker pools. OPTKAS-GOV is the Governance Token, used for internal governance functions.

On the Stellar network, OPTKAS-USD is the regulated asset. It has three critical flags: authorization required, which means the issuer must approve every holder. Authorization revocable, which means the issuer can revoke a holder's access. And clawback enabled, which allows the issuer to recall tokens for compliance reasons. Stellar's model was specifically designed for assets like this — where full issuer control is a feature, not a bug.

Each of these tokens has a specific purpose within the system architecture. None of them are designed for speculation. They are tools — infrastructure tools — that make settlement, proof, and governance programmable and verifiable.
"""
    },
    {
        "filename": "06-automation-engines.mp3",
        "text": """
Automation Engines — the Operational Brain.

Twenty-eight TypeScript engines across eight operational domains. This is the layer that makes the system work — day in, day out — without manual intervention.

The core principle is: engines don't decide — they execute. Every engine operates within boundaries set by Layer One — the law — and Layer Two — custody. No engine can exceed its authorization scope. Think of these engines as highly specialized workers that follow strict rules. They don't have opinions. They don't make judgment calls. They execute precisely what they are authorized to do.

Domain One is Bond Lifecycle. Five capabilities. The bond-lifecycle-engine handles tranche issuance, coupon scheduling, maturity processing, call and put management, and investor registry synchronization. When a new tranche is issued, this engine ensures the tokens are minted, the registry is updated, and the coupon schedule is set.

Domain Two is Issuance and Settlement. Five capabilities. This includes token minting, delivery-versus-payment orchestration, escrow management, receipt generation, and settlement verification. These engines are the ones that execute the atomic settlement sequences I described earlier.

Domain Three is Reserve Vault and Portfolio. Eight capabilities. This covers reserve allocation, collateral tracking, net asset value calculation, portfolio rebalancing, mark-to-market pricing, waterfall distribution, concentration limits, and reserve proof generation. The NAV engine, for example, continuously calculates the current value of the reserve portfolio — currently four point one-one million dollars.

Domain Four is Borrowing Base. Five capabilities. The borrowing base engine calculates how much can be drawn against the collateral pool, applies advance rates, screens for eligibility, generates certificates, and monitors covenant compliance. This is particularly important for institutional investors who need to know that the borrowing base is calculated consistently and transparently.

Domain Five is Risk Analytics. Six capabilities: Monte Carlo Value-at-Risk with ten thousand simulations, stress testing using both historical and hypothetical scenarios, scenario analysis, concentration risk measurement, liquidity risk assessment, and credit scoring.

Domain Six is Trading. Seven capabilities, of which four are currently in dry-run testing. The live capabilities include spot execution, AMM interaction, and order routing. Margin trading, leverage control, short selling, and derivatives pricing are in testing.

Domain Seven is Deal Pipeline and Lender Management with ten capabilities. Domain Eight is AI and Intelligence with three capabilities, including document analysis, anomaly detection, and predictive analytics — this last one is still in dry-run.

In total, this layer has forty-eight capabilities — forty-four live and four in dry-run testing. All engines are modular TypeScript applications that can be updated, tested, and deployed independently.
"""
    },
    {
        "filename": "07-ledger-evidence.mp3",
        "text": """
Ledger Evidence — the Proof Layer.

The core principle is simple: every significant action produces a permanent, tamper-proof record. Proof is not optional — it is architectural. If it happened, there is a hash on-chain that proves it.

This layer is sometimes called "the audit trail that auditors actually trust." Traditional audit trails live in databases that can be edited. Evidence in the OPTKAS system lives on public ledgers that cannot be changed after the fact. This is the difference between "we have logs" and "we have cryptographic proof."

Here's how the attestation architecture works.

Step one: when a material event occurs — a settlement, a fund movement, a compliance check — the system creates a data bundle containing all relevant details.

Step two: that data bundle is hashed using SHA-256, a cryptographic algorithm that produces a unique two hundred and fifty-six bit fingerprint of the data. If even one character in the data changes, the hash changes completely. This means you can verify that the data hasn't been tampered with by re-computing the hash and comparing it.

Step three: that hash is minted as an XLS-20 NFT on the XRP Ledger. The NFT's URI field contains the hash. XLS-20 is the XRPL's native NFT standard — it defines how non-fungible tokens are created, transferred, and burned on the ledger. Taxon one hundred is used for attestation NFTs specifically.

Step four: the same hash is also anchored on the Stellar network using a ManageData operation. This creates dual-chain redundancy — the proof exists on two independent public ledgers. Even if one network experienced issues, the proof survives on the other.

Step five: verification. Anyone can re-compute the SHA-256 hash of the original data and look it up on either ledger. If the hashes match, the data is authentic and unchanged.

This layer has ten capabilities: attestation minting, attestation burning for revocation, SHA-256 hash anchoring, dual-chain anchoring, verification service, audit bundle packaging, compliance proof generation, time-stamped evidence using ledger close time, chain-of-custody proof through sequential NFT trails, and data room integration for deal rooms.

All ten capabilities are live. The evidence layer is what transforms the OPTKAS system from "infrastructure with a dashboard" to "infrastructure with cryptographic proof." It's the difference between saying "trust us" and saying "verify it yourself."
"""
    },
    {
        "filename": "08-risk-analytics.mp3",
        "text": """
Risk and Analytics.

This section covers the quantitative risk framework that underpins the entire system. Three key numbers to know upfront: the current net asset value is four point one-one million dollars, the over-collateralization ratio is two hundred fifty percent, and the portfolio Value-at-Risk at the ninety-five percent confidence level is one point eight percent.

That over-collateralization number deserves attention. Two hundred fifty percent means that for every dollar of outstanding bonds, there are two dollars and fifty cents in collateral. This provides a substantial cushion against asset value decline.

The risk engine runs ten metrics continuously. Portfolio VaR uses Monte Carlo simulation with ten thousand scenarios, calculated daily. Stress loss testing runs weekly using both historical events — like the two thousand eight financial crisis — and hypothetical scenarios. Concentration risk is measured in real-time using the Herfindahl-Hirschman Index and single-name limits. Liquidity coverage uses thirty-day cash flow projections, calculated daily. Borrowing base is recalculated weekly using advance rates applied to eligible collateral.

The stress testing framework models five severity levels. Base case assumes normal conditions with zero impact. A rate rise of two hundred basis points would cause approximately five percent portfolio decline. A credit event would cause fifteen percent decline. A two thousand eight-level shock would cause forty percent decline. And an issuer default scenario models one hundred percent loss. Each scenario quantifies the impact in both portfolio value and spread widening.

These aren't theoretical models sitting in a spreadsheet. They're live engines that run continuously and feed their outputs into the governance and monitoring systems. When a threshold is breached, alerts fire automatically.
"""
    },
    {
        "filename": "09-operations-workflows.mp3",
        "text": """
Operations and Workflows — Cross-Layer Integration.

This section covers the critical workflows that span multiple layers. These workflows are where the architecture comes to life — where law, custody, automation, and settlement work together as a unified system.

The most important workflow is the Funding Ceremony. This is the ten-step process that executes every time a new investor comes into the system.

Step one: the lender's KYC, anti-money-laundering screening, and accreditation are verified — this is Layer One, the legal layer. Step two: the term sheet is scored by the AI analysis engine and approved by the credit committee — Layer Three, automation. Step three: a trustline is authorized for the lender's account on the XRP Ledger — Layer Five, settlement. Step four: an escrow is created with both time conditions and cryptographic conditions — Layer Two, custody. Step five: the lender funds the escrow with stablecoin. Step six: a claim receipt token, OPTKAS-CR, is minted — Layer Five. Step seven: the delivery-versus-payment settlement executes atomically. Step eight: an attestation NFT is minted with the SHA-256 hash of the transaction — Layer Four, evidence. Step nine: the borrowing base is recalculated to reflect the new collateral. Step ten: investor confirmation and receipt are delivered.

Notice how every step touches a different layer, but each layer trusts the layer below it and is governed by the layer above it. That's the architecture in action.

The second critical workflow is the Default Scenario — an eight-step protocol for when things go wrong. Step one: a covenant breach is detected automatically by the monitoring engine. Step two: all signers and the compliance officer are alerted. Step three: if warranted, an emergency freeze halts all operations in seconds. Step four: the borrowing base is recalculated. Step five: a collateral liquidation queue is established. Step six: investors are notified with a full attestation bundle proving what happened. Step seven: the recovery waterfall executes according to the bond indenture priority rules. Step eight: a post-mortem is conducted and a ledger evidence package is created.

The Emergency Freeze Protocol deserves special attention. Time to freeze is measured in seconds, not hours. The circuit breaker can trigger automatically when it detects threshold violations or unauthorized movement. The freeze operates at the ledger level. All signers are notified immediately. And — critically — while any signer can trigger a freeze, unfreezing requires a three-of-five multisig vote. This asymmetry is intentional: it's easy to stop, hard to restart.
"""
    },
    {
        "filename": "10-revenue-model.mp3",
        "text": """
Revenue Model.

The revenue model follows a simple principle: monetize rails, proof, and execution. The system stays in the lanes of infrastructure, verification, and settlement. It avoids securities language, direct custody of client funds, and yield promises.

There are five revenue lanes.

Lane one: Settlement-as-a-Service. This is the fastest to market. You're selling atomic delivery-versus-payment, escrow mechanics, and receipt generation. Revenue is twenty-five basis points to one percent per settlement transaction.

Lane two: Tokenization Fees. This includes issuance, distribution, and liquidity provision. Setup costs range from twenty-five thousand to two hundred fifty thousand dollars, plus an ongoing fee of ten to fifty basis points per year.

Lane three: Proof and Data Room. This sells SHA-verified data rooms and cryptographic attestation packages. Monthly revenue of five thousand to fifty thousand dollars. This is ready to sell now.

Lane four: Managed Operations — liquidity management, risk analytics, and borrowing base services. Monthly fees of ten thousand to one hundred thousand dollars. This is the enterprise tier.

Lane five: Sponsor Economics. This includes origination, servicing, and carry. Revenue is fifty basis points to two and a half percent of notional. This lane requires additional legal structuring.

The pricing is tiered. The Core tier is five thousand per month with a fifteen-thousand-dollar setup — it includes dashboards, audit logs, data room access, and attestation. Settlement adds ten thousand per month for DvP templates, escrow, and receipts at thirty-five basis points per transaction. Risk adds fifteen thousand per month for borrowing base, VaR, stress tests, and covenant monitoring. The Enterprise tier is two hundred fifty thousand per year with custom scope.

Three moats protect this revenue. First: irrefutable proof. Cryptographic evidence is a higher standard than "we have a dashboard." Second: atomic settlement. T-plus-zero with no counterparty risk window and no clearing agent. Third: operator-grade automation. Sticky, recurring value that clients cannot easily replicate.
"""
    },
    {
        "filename": "11-boundaries.mp3",
        "text": """
Boundaries and Regulatory Scope — Layer Seven.

This is arguably the most important section for compliance officers and legal teams. It defines — with precision — what OPTKAS is and what it is not.

OPTKAS is not a bank. It does not accept deposits. It does not lend to the public. It does not offer checking or savings accounts.

OPTKAS is not a broker-dealer. It does not execute trades on behalf of clients. It does not provide securities recommendations. It does not handle customer orders.

OPTKAS is not a custodian. It does not hold assets in omnibus accounts. Escrow is ledger-native and protocol-enforced. The qualified custodian is an independent third party.

OPTKAS is not an exchange. There is no public order book. There is no multilateral matching. The AMM pools are internal infrastructure, not a trading venue.

OPTKAS is not an investment advisor. It does not provide personalized investment advice. Risk analytics are internal tools, not client-facing recommendations.

OPTKAS is not a money transmitter. There is no transmission between third parties. Settlement is bilateral and structured — party A to party B, under a specific agreement.

OPTKAS is not a fund. There is no pooled investor capital. The SPV issues bonds backed by specific, identifiable collateral. Each investor's position is segregated.

OPTKAS is not a clearinghouse. There is no multilateral netting. Delivery-versus-payment is bilateral, atomic, and escrow-secured.

So what IS it? OPTKAS is institutional-grade settlement, evidence, and automation infrastructure operating on public ledger rails. It provides settlement, evidence, automation, compliance tools, and the infrastructure to connect them. It is a platform that other institutions can use to issue, settle, prove, and govern structured credit products — without needing to build the infrastructure themselves.

These boundaries are not arbitrary. They are deliberately constructed to define a regulatory perimeter that avoids triggering registration requirements under the Securities Exchange Act, the Investment Advisers Act, the Bank Holding Company Act, and state money transmitter statutes.
"""
    },
    {
        "filename": "12-credit-committee.mp3",
        "text": """
Credit Committee Narrative — Five Questions, Five Answers.

This final section is designed for institutional decision-makers. No jargon. No filler. Five questions that every credit committee asks, with five answers that can be independently verified.

Question one: Who controls the funds?

A purpose-built Special Purpose Vehicle — FTH Trading LLC — governed by a bond indenture with a registered transfer agent — Securities Transfer Corporation, which is SEC-registered. No individual can move funds unilaterally. Multisig governance requires three of five signers to approve any transaction. Emergency freeze can halt all operations in seconds. And twenty-five point seven-five million dollars in insurance provides financial backstop coverage.

Question two: Where are the assets?

On-ledger, individually identifiable, and independently verifiable. There are no omnibus accounts. No commingled custody. Stablecoin reserves sit in XRPL escrow accounts — verifiable in real-time using any XRPL explorer. Issued IOUs are recorded as trustlines — queryable directly from the ledger. Collateral evidence is stored as XLS-20 NFTs with SHA-256 hashes. Stellar instruments are registered as regulated assets and visible through the Horizon API.

Question three: How is settlement enforced?

Atomic delivery-versus-payment using the XRP Ledger's native escrow and conditional execution. The buyer funds an escrow with stablecoin. The seller deposits the asset into a conditional hold. Both sides satisfy their conditions. Settlement executes atomically — the asset and payment swap simultaneously. Receipts are minted as permanent NFT proof. This is T-plus-zero settlement. No counterparty risk window. No clearing intermediary.

Question four: What happens in default?

A defined, automated, multi-step protocol — not a panic call. Covenant breach is detected automatically. All signers and compliance are alerted. Emergency freeze halts operations in seconds. Borrowing base is recalculated. A collateral liquidation queue is established. Investors receive notification with a full attestation bundle. Recovery waterfall executes according to the indenture. And a post-mortem with complete ledger evidence is packaged.

Question five: What prevents unilateral movement?

Four independent controls. Multisig requires three of five separate key holders. Escrow conditions include time locks and cryptographic conditions that cannot be overridden — they are protocol-enforced. Trustline authorization means the issuer must approve every holder — unauthorized accounts physically cannot hold the tokens. And circuit breakers trigger automatic freezes on anomalies — no human delay, threshold-triggered.

The bottom line: no single person, no single key, and no single decision can move assets. This is not a policy. It is an architectural constraint enforced by the ledger itself.

Every answer above can be independently verified using public ledger explorers. This is not a trust exercise — it is a verification exercise.

This concludes the OPTKAS training manual.
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
    
    max_retries = 5
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
            print(f"  ✓ Saved ({size_kb:.0f} KB)")
            return True
        except Exception as e:
            print(f"  ✗ Error: {e}")
            if attempt < max_retries:
                wait = attempt * 8
                print(f"  Retrying in {wait}s...")
                await asyncio.sleep(wait)
    return False


async def generate_audio():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    failed = []
    for i, section in enumerate(SECTIONS, 1):
        ok = await generate_one(section, i, len(SECTIONS))
        if not ok:
            failed.append(section["filename"])
        # Longer delay between files to avoid rate limiting
        await asyncio.sleep(3)
    
    if failed:
        print(f"\n⚠ Failed: {', '.join(failed)}")
    else:
        print(f"\n✓ Done. {len(SECTIONS)} MP3 files generated in: {OUTPUT_DIR}")


if __name__ == "__main__":
    asyncio.run(generate_audio())
