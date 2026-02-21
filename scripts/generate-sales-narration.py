"""
OPTKAS Sales Academy — Neural Voice Narration Generator v1.16.0
Uses Microsoft Edge TTS (en-US-AndrewNeural) for institutional-quality voice.
Generates 10 lesson MP3s + 1 Claims Library narration.
Produces audio-manifest.json with SHA-256 script hashes for version control.
"""

import asyncio
import edge_tts
import os
import json
import hashlib
from datetime import datetime, timezone

VOICE = "en-US-AndrewNeural"
RATE = "+0%"
OUTPUT_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "audio")
MANIFEST_PATH = os.path.join(OUTPUT_DIR, "sales-audio-manifest.json")

LESSONS = [
    {
        "filename": "sales-lesson-01.mp3",
        "text": """
Welcome to Lesson One of the OPTKAS Sales Academy — Your Role and Authority.

This lesson establishes the single most important thing you need to understand before you ever speak to a prospect: what you are, and what you are not.

You are a Platform Solicitor. That is your legal classification. You are authorized to present verified facts about the OPTKAS platform, answer technical questions using approved materials, and facilitate the onboarding process for qualified participants.

You are NOT a financial advisor. You are NOT a broker-dealer. You are NOT an investment counselor. You do not make recommendations. You do not suggest allocations. You do not interpret legal documents. You do not predict returns.

Why does this matter? Because the difference between "solicitor" and "advisor" isn't a technicality — it's a legal boundary that determines whether the way you operate is lawful. Financial advisors carry fiduciary duties and regulatory requirements that you do not meet. Using investment advisor language exposes the entire platform to legal risk.

Here is the rule: Every prospect interaction begins with a clear statement that you are not a financial advisor and that the prospect should consult their own legal and financial counsel before making any decisions. Every time. No exceptions.

Let's talk about what you CAN do under your solicitor authority. You can describe the platform architecture using verified facts — things that are independently confirmable on-chain, in legal filings, or in public records. You can present the Proof Pack documents without editorializing. You can explain how the onboarding process works. You can answer technical questions about how the system functions. And you can direct questions you cannot answer to the appropriate team.

What you CANNOT do: You cannot recommend that anyone invest. You cannot say "I think you should" or "In my opinion, this is a good opportunity." You cannot interpret or paraphrase legal documents. You cannot modify agreement templates. You cannot discuss other clients' investments. And you cannot guarantee any outcome.

If a prospect asks "Should I invest?" — your answer is: "That's not a decision I can make for you. I can show you the evidence, the structure, and the risk disclosures, and you should make that decision with your own counsel."

This distinction isn't a limitation — it's your protection. It protects you, the client, and the platform.

That concludes Lesson One. Complete the quiz and sign the attestation to proceed.
"""
    },
    {
        "filename": "sales-lesson-02.mp3",
        "text": """
Lesson Two — Claims Policy and the Three Buckets Rule.

Every word you say during a prospect interaction falls into one of three buckets. Learn these. Live by them. They are your compliance framework.

Bucket One: Verified Facts. These are statements that can be independently confirmed right now, without asking us. Examples include: OPTKAS has nine mainnet accounts on the XRP Ledger. The platform has one hundred and thirty-four documented capabilities across five layers. The escrow system uses crypto-condition release. These are on-chain verifiable, documented in legal filings, or visible in public records. You can state these freely.

Bucket Two: Operational Processes. These are descriptions of how the platform operates. They describe current procedures, not outcomes. Examples: "Client onboarding follows an eight-step process." "Compliance screening is performed before account provisioning." "All interactions are logged with date, time, and compliance checkbox." These are true descriptions of how we work today. You can state these freely, but you must never imply that a process guarantees a specific outcome.

Bucket Three: Forward-Looking Disclosures. These are statements about future plans, timelines, or expected developments. Examples: "We aim to launch the primary offering by Q-three." "The BD registration pathway is being pursued." "The Stellar integration is planned for phase two." You CAN make these statements — but ONLY with risk disclosure attached. Every Bucket Three statement must include an acknowledgment that plans may change, timelines may shift, and outcomes are not guaranteed.

If you state a Bucket Three claim without the risk disclosure, that is a material misstatement. Your certification will be suspended. This is not a warning — it's a rule.

How do you test which bucket a statement falls into? Ask yourself: "Can someone verify this right now without asking us?" If yes — Bucket One. "Does this describe how we currently operate?" If yes — Bucket Two. "Does this describe something that hasn't happened yet?" If yes — Bucket Three, and you need a disclosure.

There is also a fourth category that is not a bucket — it's a wall. These are Forbidden Statements. They are never acceptable under any circumstances. We'll cover those in detail in the Claims Library section, but examples include: "Guaranteed returns." "Risk-free investment." "OPTKAS is SEC approved." "You can't lose money." Using any forbidden statement is an immediate disqualification trigger.

The Three Buckets Rule is not optional. It is the foundation of every compliant conversation you will have.

Complete the quiz and sign the attestation to proceed.
"""
    },
    {
        "filename": "sales-lesson-03.mp3",
        "text": """
Lesson Three — What OPTKAS Sells.

This lesson answers the most important product question: what exactly are you selling?

The answer: You are selling platform infrastructure and services. You are NOT selling investment returns.

Think of it this way: OPTKAS sells the highway, not the cars. The platform provides the rails — the settlement infrastructure, the custody architecture, the automation engines, the compliance controls, and the legal structure. What participants do on those rails is their decision, subject to the platform rules and the legal agreements.

Here is what OPTKAS actually provides. Layer one is the legal structure — the SPV, the operating agreement, the participation agreements, the custody framework. Layer two is custody and key management — multisig wallets, hardware security modules, defined signing thresholds. Layer three is automation — twenty-eight engines handling coupon calculations, escrow management, compliance checks, and settlement orchestration. Layer four is the settlement rails — XRPL and Stellar networks providing transparent, on-chain transaction finality. Layer five is governance and evidence — dual-chain anchoring, SHA-256 hash chains, audit trails, and real-time dashboards.

One hundred and thirty-four capabilities across these five layers. That is the product.

What about the bonds? OPTKAS facilitates a structured credit program that includes bond-like instruments. These instruments carry a stated coupon rate. But you must understand and communicate the distinction: a coupon rate is a contractual obligation of the issuer, not a guaranteed return to the investor. Coupon payments are subject to issuer performance and operational continuity. Past coupons paid do not guarantee future coupons.

Revenue comes from three sources. Onboarding fees — charged for account provisioning, compliance processing, and wallet setup. Platform service fees — ongoing charges for infrastructure access and maintenance. And AMM trading fees — earned from liquidity pool operations, not charged directly to participants.

Revenue does NOT come from investment returns. Revenue does NOT come from trading participants' funds. Revenue does NOT come from performance fees tied to bond outcomes.

When a prospect asks "What am I paying for?" — the answer is: "You're paying for access to institutional-grade infrastructure: the settlement rails, the custody framework, the automation engines, and the compliance controls that run the platform."

Complete the quiz and sign the attestation to proceed.
"""
    },
    {
        "filename": "sales-lesson-04.mp3",
        "text": """
Lesson Four — Proof Pack Mastery.

The Proof Pack is your most important tool. It is the definitive evidence package that supports every claim OPTKAS makes. In this lesson, you'll learn what's in it, how to use it, and what never to do with it.

The Proof Pack contains eight documents. P.P. dash zero one: the Participation Agreement — the legal contract between the participant and the SPV. P.P. dash zero two: the Risk Disclosure Statement — the complete list of material risks, including the possibility of total loss. P.P. dash zero three: the Solicitor Disclosure Form — the document that discloses YOUR compensation arrangement to the prospect. P.P. dash zero four: the Capability Matrix — the full list of one hundred and thirty-four platform capabilities across five layers. P.P. dash zero five: the Verification Engine Report — live, self-service, timestamped readiness scores across all verification domains. P.P. dash zero six: the XRPL Account Evidence — on-chain data showing funded accounts, trustlines, and transaction history. P.P. dash zero seven: the Legal Structure Summary — SPV documentation, operating agreement highlights, and jurisdiction details. And P.P. dash zero eight: the Fee Schedule — the complete breakdown of all fees: onboarding, platform service, and AMM.

Before every meeting, you must verify that you have the current version of every document. Old versions may contain outdated information. Using a superseded document is a compliance violation.

The rules for presenting Proof Pack documents are simple. Present them without editorializing. Do not paraphrase legal language. Do not skip sections you think are "boring" or "too detailed." Do not add your own commentary about what a clause "really means."

When a prospect asks about a legal clause, your response is: "I'd encourage you to review that with your legal counsel. I can point you to the relevant section, but I'm not qualified to interpret legal language."

After every Proof Pack delivery, you must log: what was shared, with whom, when, via what channel, and what questions were asked. This creates the compliance trail that protects everyone.

Complete the quiz and sign the attestation to proceed.
"""
    },
    {
        "filename": "sales-lesson-05.mp3",
        "text": """
Lesson Five — Client Onboarding Flow.

The onboarding process has eight steps. Every step is mandatory. No step can be skipped, reordered, or compressed. Here is the complete flow.

Step one: Initial Contact and Qualification. You make first contact with the prospect. You introduce yourself, state that you are not a financial advisor, and determine basic qualification — are they an accredited investor? Are they in a permitted jurisdiction? This is a screening step, not a sales pitch.

Step two: Proof Pack Delivery. You deliver the complete Proof Pack — all eight documents. You walk through the overview and ensure the prospect has access to every document. You do not summarize, skip, or prioritize certain documents over others.

Step three: Forty-Eight-Hour Cooling-Off Period. After Proof Pack delivery, you do not contact the prospect for a minimum of forty-eight hours. This is mandatory. During this period, the prospect reviews the documents, consults their own counsel, and considers whether to proceed. You may NOT call, email, text, or otherwise contact them during this period unless THEY initiate contact.

Step four: Risk Disclosure Walk-Through. After the cooling-off period, if the prospect wants to proceed, you schedule a formal risk disclosure session. You walk through the Risk Disclosure Statement, covering each of the seven material risk categories. The prospect must acknowledge each category.

Step five: Questions and Evidence Review. The prospect asks any remaining questions. You answer using verified facts and approved materials only. If you cannot answer a question, you escalate it to the appropriate team member and follow up with a documented response.

Step six: Agreement Execution. If the prospect decides to proceed, they sign the Participation Agreement and the Risk Acknowledgment. You provide the Solicitor Disclosure Form. All documents must be signed before any funds are collected or accounts are provisioned.

Step seven: Compliance Verification. The compliance team performs KYC and AML screening. This is not your responsibility — you do not perform compliance checks. You wait for compliance clearance before proceeding.

Step eight: Account Provisioning. Once compliance clears, the platform team sets up the participant's wallet, provisions trustlines, and configures their account access.

Complete the quiz and sign the attestation to proceed.
"""
    },
    {
        "filename": "sales-lesson-06.mp3",
        "text": """
Lesson Six — Legal Agreements.

In this lesson, you'll learn the legal documents that govern every participant relationship and how to handle them properly.

There are four critical documents. First, the Participation Agreement. This is the master legal contract between the participant and the SPV — OPTKAS One Main. It defines the terms of participation, the rights and obligations of both parties, fee structures, risk acknowledgments, and exit provisions. You present this document as-is. You never modify, annotate, or paraphrase any clause.

Second, the Risk Disclosure Statement. This document lists all material risks associated with participation. There are seven categories: Market Risk — the value of assets may fluctuate. Liquidity Risk — positions may be difficult to exit. Regulatory Risk — laws and regulations may change. Technology Risk — blockchain systems may experience failures. Counterparty Risk — other parties in the structure may default. Operational Risk — processes and systems may malfunction. And Total Loss Risk — participants could lose their entire investment.

Every risk category must be walked through with the prospect and individually acknowledged. Skipping any risk category is a compliance violation.

Third, the Solicitor Disclosure Form. This form discloses your compensation arrangement to the prospect. It specifies how you are paid, what your compensation is based on, and any potential conflicts of interest. This form must be provided BEFORE any agreement is signed. Not during. Not after. Before.

Fourth, KYC and AML Documentation. The compliance team collects and verifies identity documentation, source of funds declarations, and sanctions screening. This is handled by the compliance team, not by you.

Your responsibilities with legal documents are: Present them completely and without modification. Direct all interpretation questions to the prospect's legal counsel. Never use phrases like "This is standard language" or "Don't worry about this section." Ensure all documents are signed in the correct order. And log that all documents were delivered and acknowledged.

Complete the quiz and sign the attestation to proceed.
"""
    },
    {
        "filename": "sales-lesson-07.mp3",
        "text": """
Lesson Seven — Fee Structure.

Understanding and accurately communicating the fee structure is critical. This lesson covers every fee category, how to discuss them, and what is absolutely forbidden.

OPTKAS has three revenue categories. Category one: Onboarding Fees. These are charged for account provisioning, compliance processing, and initial wallet setup. They are one-time fees at the beginning of the participant's engagement. They cover the real cost of screening, provisioning, and configuring the participant's infrastructure access.

Category two: Platform Service Fees. These are ongoing fees for infrastructure access, system maintenance, and operational support. They are recurring and cover the continuous cost of running the settlement rails, automation engines, and custody framework that the participant uses.

Category three: AMM Trading Fees. These are earned by the platform from automated market maker operations. They are generated through liquidity pool activity and are part of the platform's revenue model, not charged directly to individual participants.

What you must never do when discussing fees: Never say "You'll make it back quickly." Never claim fees are "negligible" or "small compared to returns." Never suggest fee waivers or discounts. Never compare fees to competitor platforms. And never link fees to expected investment outcomes.

When a prospect asks "Why should I pay these fees?" — here is the approved response framework. Describe what the fees cover: "The onboarding fee covers compliance screening, KYC/AML processing, wallet provisioning, and trustline configuration." Describe the ongoing value: "Platform service fees cover the operation and maintenance of the settlement infrastructure, automation engines, and custody controls." Let them decide: "All fee details are in the Participation Agreement. I'd encourage you to review them before making any decision."

Where are fees disclosed? In the Fee Schedule — Proof Pack document P.P. dash zero eight — and in the Participation Agreement. Fees are always disclosed before any agreement is signed. There are no hidden fees.

Complete the quiz and sign the attestation to proceed.
"""
    },
    {
        "filename": "sales-lesson-08.mp3",
        "text": """
Lesson Eight — Compensation and Conduct.

This lesson covers how you are paid and the conduct standards that, if violated, result in immediate disqualification.

Your compensation has two components. First: Onboarding Fee Share. You receive a defined percentage of the onboarding fee for each participant you successfully bring through the full eight-step process. This is documented in your Solicitor Agreement.

Second: Platform Service Share. You receive an ongoing percentage of platform service fees generated by participants you onboarded. This creates alignment — your income is tied to the platform's ongoing operation, not to any investment outcome.

What your compensation is NEVER tied to: Investment performance. Bond coupon payments. Token price changes. Portfolio returns. Volume targets. There are no volume-based bonuses. There are no performance bonuses tied to how much capital participants deploy. There are no incentives for closing deals faster.

Why? Because linking solicitor compensation to investment outcomes creates a misaligned incentive structure. If you make more money when clients invest more, you're incentivized to minimize risk disclosures and maximize urgency. That's exactly what we prohibit.

Now, the conduct standards. There are six immediate disqualification triggers. First: Using any Forbidden Statement — F-01 through F-12. Second: Modifying or skipping steps in the onboarding process. Third: Contacting a prospect during the cooling-off period. Fourth: Failing to provide the Solicitor Disclosure Form before agreement signing. Fifth: Undisclosed referral fees or side arrangements. Sixth: Personal investment solicitation through your solicitor role.

Any single violation results in immediate certification suspension, investigation, and potential permanent disqualification. There are no warnings for these triggers.

Documentation requirements: Every client interaction must be logged with date, participants, topics discussed, materials shared, questions asked, and a compliance checkbox confirming all statements were within approved claims. This log is auditable.

Complete the quiz and sign the attestation to proceed.
"""
    },
    {
        "filename": "sales-lesson-09.mp3",
        "text": """
Lesson Nine — Risk Disclosures and the A.R.E. Objection Protocol.

This lesson covers the seven material risk categories you must disclose and the A.R.E. protocol for handling objections professionally and compliantly.

Every prospect must be informed of seven material risks before any agreement is signed. Risk one: Market Risk — the value of digital assets and instruments may fluctuate significantly. Risk two: Liquidity Risk — there may be limited ability to exit positions, especially in early stages. Risk three: Regulatory Risk — laws and regulations governing digital assets may change, potentially affecting operations. Risk four: Technology Risk — blockchain networks may experience bugs, forks, or outages that affect the platform. Risk five: Counterparty Risk — other parties in the capital structure may fail to meet their obligations. Risk six: Operational Risk — internal processes, people, or systems may experience errors or failures. Risk seven: Total Loss Risk — participants could lose their entire investment. This must be stated explicitly and without qualification.

You do not soften these disclosures. You do not say "but that's very unlikely." You do not skip risks that seem "obvious." You present each one clearly and confirm the prospect acknowledges it.

Now, the A.R.E. objection protocol. When a prospect raises a concern or objection, you follow three steps. A — Acknowledge. Validate their concern. "That's the most important question you can ask" or "That's a completely reasonable concern." R — Reframe. Redirect the conversation from opinion to evidence. "Let me show you exactly how the platform addresses that." E — Evidence. Present specific, verifiable evidence from the Proof Pack. Not opinions. Not comparisons. Evidence.

For example, if a prospect says "How do I know my money is safe?" — Acknowledge: "That's the most important question you can ask." Reframe: "Let me show you the custody architecture." Evidence: Walk them through the multisig structure, the key distribution, and the on-chain evidence showing segregated accounts.

What if you don't know the answer? Say exactly this: "I don't have that information documented. Let me get you a precise answer from the team." Then follow up with a documented, verified response. Never guess. Never speculate. Never make up an answer because you feel pressure to respond immediately.

Complete the quiz and sign the attestation to proceed.
"""
    },
    {
        "filename": "sales-claims-library.mp3",
        "text": """
Claims Library Overview.

The Claims Library is your reference guide for every statement you are authorized to make — and every statement that is absolutely prohibited. This library is organized into three categories: Approved Claims, Forbidden Statements, and Conditional Claims.

Approved Claims are statements you can make freely. They fall into two groups: Verified Platform Facts and Verified Structural Facts. Examples of approved platform facts include: OPTKAS operates one hundred and thirty-four documented capabilities across five layers. The platform settles on XRPL with three-to-five second finality. Nine mainnet accounts are funded and operational. Twenty-eight automation engines manage orchestration, compliance, and settlement.

Verified Structural facts include: OPTKAS One Main SPV is registered in Wyoming. Multisig custody requires three-of-five signing threshold. All escrow uses crypto-condition-based release. Over-collateralization target is two hundred and fifty percent.

Operational process claims you can make include: Client onboarding follows an eight-step process with mandatory cooling-off period. All interactions are logged with compliance checkboxes. Risk disclosure covers seven material categories walked through individually. Forty-eight hour minimum cooling period before agreement execution.

Forbidden Statements — these are prohibited under all circumstances. F-01: Guaranteed returns. F-02: Risk-free investment. F-03: OPTKAS is SEC approved. F-04: You can't lose money. F-05: This is a limited-time opportunity. F-06: Tokens will increase in value. F-07: Better than bank returns. F-08: We're fully regulated. F-09: Your money is FDIC insured. F-10: Similar to Blackstone or Goldman Sachs. F-11: I personally invest in this. F-12: Everyone is making money.

Using any of these twelve statements is an immediate disqualification trigger. There are no exceptions.

Conditional Claims require specific disclosures. For example: "The bond carries a five percent coupon rate" requires the disclosure: "Coupon payments are subject to issuer performance and do not constitute a guaranteed return." "We aim to launch by Q-three" requires: "Timelines are projections and may change based on regulatory, operational, or market conditions."

Reference this library before every client interaction.
"""
    }
]


async def generate_all():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    manifest = []

    for i, lesson in enumerate(LESSONS, 1):
        filepath = os.path.join(OUTPUT_DIR, lesson["filename"])

        # Compute script hash (SHA-256 of narration text)
        script_text = lesson["text"].strip()
        script_hash = hashlib.sha256(script_text.encode('utf-8')).hexdigest()

        if os.path.exists(filepath):
            print(f"  [SKIP] {lesson['filename']} already exists")
            # Compute content hash of existing file
            with open(filepath, 'rb') as f:
                content_hash = hashlib.sha256(f.read()).hexdigest()
            file_size = os.path.getsize(filepath)
        else:
            print(f"  [{i}/{len(LESSONS)}] Generating {lesson['filename']}...")
            communicate = edge_tts.Communicate(
                text=script_text,
                voice=VOICE,
                rate=RATE
            )
            await communicate.save(filepath)
            file_size = os.path.getsize(filepath)
            with open(filepath, 'rb') as f:
                content_hash = hashlib.sha256(f.read()).hexdigest()
            print(f"         ✓ {file_size / 1024:.0f} KB")

        manifest.append({
            "lesson": i,
            "filename": lesson["filename"],
            "scriptHash": script_hash,
            "contentHash": content_hash,
            "fileSizeBytes": file_size,
            "voice": VOICE,
            "rate": RATE,
            "generatedDate": datetime.now(timezone.utc).isoformat(),
            "version": "1.16.0"
        })

    # Write manifest
    with open(MANIFEST_PATH, 'w', encoding='utf-8') as f:
        json.dump({
            "generator": "OPTKAS Sales Academy Narration Generator",
            "version": "1.16.0",
            "voice": VOICE,
            "generatedAt": datetime.now(timezone.utc).isoformat(),
            "totalLessons": len(LESSONS),
            "entries": manifest
        }, f, indent=2)

    print(f"\n  ✅ Done — {len(LESSONS)} narrations in {OUTPUT_DIR}")
    print(f"  📋 Manifest written to {MANIFEST_PATH}")


if __name__ == "__main__":
    print("\n═══════════════════════════════════════════════════")
    print("  OPTKAS Sales Academy — Narration Generator")
    print("  Voice: en-US-AndrewNeural | Format: MP3")
    print("═══════════════════════════════════════════════════\n")
    asyncio.run(generate_all())
