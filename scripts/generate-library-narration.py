#!/usr/bin/env python3
"""
OPTKAS Global Intelligence Library — Narration Generator v1.20.0
Generates MP3 narration files for GIL entries using edge-tts.
Voice: en-US-AndrewNeural (matching platform standard)
Produces library-audio-manifest.json with SHA-256 script hashes.

Usage:
    pip install edge-tts
    python scripts/generate-library-narration.py

Output: public/audio/library/ directory

═══════════════════════════════════════════════════════════════════════════
TONE GOVERNANCE DIRECTIVE  (Psychological Control Layer — v1.17.0)
═══════════════════════════════════════════════════════════════════════════
All narration content MUST maintain the following register at all times:

    • CALM        — No urgency, no excitement, no time-pressure language.
    • FORMAL      — Institutional diction; no slang, colloquialisms, or
                    casual contractions.
    • CONTROLLED  — Measured pacing; every claim is bounded by its source
                    and scope.  No superlatives unless quoting a document.
    • CONSERVATIVE — Slightly restrained; prefer understatement over
                    promotion.  When in doubt, hedge rather than assert.

Forbidden patterns:
    ✗  "Amazing opportunity"  /  "Don't miss out"  /  "Act now"
    ✗  Enthusiasm inflation ("incredible", "revolutionary", "game-changing")
    ✗  Implied guarantees or projected returns
    ✗  Comparative claims against competitors
    ✗  Emotional appeals or fear-based motivation

Every script revision must be reviewed against these constraints before
re-generating audio.  Violations trigger re-certification under the
OPTKAS Governance Control Loop.
═══════════════════════════════════════════════════════════════════════════
"""

import asyncio
import os
import json
import hashlib
from datetime import datetime, timezone
import edge_tts

VOICE = "en-US-AndrewNeural"
OUTPUT_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "public", "audio", "library")
MANIFEST_PATH = os.path.join(OUTPUT_DIR, "library-audio-manifest.json")

# ─── Narration Scripts ───
NARRATIONS = {
    # L1 — Core Terms
    "L1-01-digital-security": (
        "L1-01. Digital Security. "
        "A blockchain-native financial instrument representing fractional or whole ownership interest "
        "in an underlying asset, issued, transferred, and settled via distributed ledger technology. "
        "Subject to securities regulation in every jurisdiction where offered."
    ),
    "L1-02-tokenization": (
        "L1-02. Tokenization. "
        "The process of creating a digital representation of a real-world asset on a blockchain ledger. "
        "Tokenization does not alter the legal nature of the underlying asset. "
        "It is a delivery mechanism, not a new asset class."
    ),
    "L1-03-xrpl": (
        "L1-03. XRPL, the XRP Ledger. "
        "An open-source, permissionless distributed ledger using a federated consensus protocol. "
        "OPTKAS uses XRPL as the primary settlement and issuance layer for tokenized securities. "
        "XRPL is not operated or controlled by OPTKAS or FTH Trading."
    ),
    "L1-04-reg-d": (
        "L1-04. Reg D 506(c). "
        "A U.S. SEC exemption under Regulation D, Rule 506(c) that permits general solicitation "
        "of accredited investors for private placement offerings. Requires reasonable steps to "
        "verify accredited investor status. Does not constitute SEC registration or approval."
    ),
    "L1-05-accredited-investor": (
        "L1-05. Accredited Investor. "
        "An individual or entity meeting the financial thresholds defined in SEC Rule 501(a). "
        "For individuals: net worth exceeding one million dollars, excluding primary residence, "
        "or annual income exceeding two hundred thousand dollars. "
        "Verification is mandatory under 506(c)."
    ),
    "L1-06-trustline": (
        "L1-06. Trustline. "
        "An XRPL-native mechanism that creates a bilateral credit relationship between two accounts. "
        "A trustline must be established before a wallet can hold a non-XRP token. "
        "Trustlines are the XRPL equivalent of a broker account relationship — "
        "they are a prerequisite, not a guarantee of any asset transfer."
    ),
    "L1-07-issuer-address": (
        "L1-07. Issuer Address. "
        "The XRPL wallet address designated as the originator of a tokenized security. "
        "The issuer address is the canonical source of truth for supply, transfers, and settlement. "
        "Control must be governed by multi-signature authority and cold storage procedures."
    ),
    "L1-08-kyc-aml": (
        "L1-08. KYC/AML. "
        "Know Your Customer and Anti-Money Laundering compliance procedures required before any "
        "investor may participate in a tokenized securities offering. KYC verifies identity. "
        "AML screens against sanctions, PEP lists, and adverse media. "
        "Both are non-negotiable prerequisites to onboarding."
    ),
    "L1-09-transfer-agent": (
        "L1-09. Transfer Agent. "
        "A regulated entity responsible for maintaining official records of security ownership, "
        "processing transfers, and issuing or canceling certificates. In tokenized securities, "
        "the transfer agent maintains a parallel cap table that is the legal record of ownership, "
        "even when the blockchain serves as the operational record."
    ),
    "L1-10-custody": (
        "L1-10. Custody. "
        "The safekeeping and control of investor assets, both digital and traditional. "
        "Qualified custody under SEC rules requires specific licensing or third-party "
        "qualified custodian arrangements. Self-custody of digital securities by the issuer "
        "requires explicit written consent and risk acknowledgment."
    ),

    "L1-11-smart-contract": (
        "L1-11. Smart Contract. "
        "Self-executing code deployed on a blockchain that automates the enforcement of agreement terms. "
        "On XRPL, smart contract equivalents include Hooks and conditional escrows. "
        "Smart contracts do not replace legal contracts — they enforce programmatic conditions "
        "that mirror legal obligations."
    ),
    "L1-12-liquidity-pool": (
        "L1-12. Liquidity Pool. "
        "A smart contract or AMM mechanism holding reserves of two or more tokens to facilitate "
        "decentralized trading. XRPL's native AMM allows creating liquidity pools for token pairs. "
        "Liquidity pool participation is not equivalent to market making and does not guarantee "
        "price stability or exit liquidity."
    ),
    "L1-13-ppm": (
        "L1-13. Private Placement Memorandum, or PPM. "
        "The legal disclosure document provided to prospective investors in a private offering. "
        "The PPM describes the investment terms, risk factors, use of proceeds, management team, "
        "and legal structure. No investment may be accepted without the investor having received "
        "and acknowledged the PPM."
    ),

    # L2 — Jurisdictions
    "L2-01-united-states": (
        "L2-01. United States. "
        "Highly regulated. SEC has primary jurisdiction over securities. "
        "All digital securities are securities under the Howey test unless proven otherwise. "
        "OPTKAS structures all offerings under Reg D 506(c) with accredited investor verification."
    ),
    "L2-02-united-kingdom": (
        "L2-02. United Kingdom. "
        "FCA-regulated. Security tokens constitute specified investments requiring authorization. "
        "The cryptoasset promotions regime is now effective. "
        "Cannot market to retail consumers without FCA authorization."
    ),
    "L2-03-european-union": (
        "L2-03. European Union, MiCA framework. "
        "Markets in Crypto-Assets Regulation is now effective. Security tokens remain under MiFID II "
        "as financial instruments. Security token offerings require prospectus under the Prospectus Regulation."
    ),

    # L3 — Sales Guardrails
    "L3-01-no-guaranteed-returns": (
        "L3-01. No Guarantee of Returns. "
        "No person acting on behalf of OPTKAS or FTH Trading may guarantee, promise, imply, "
        "or suggest any specific return, yield, or profit from any tokenized security offering. "
        "Any violation triggers immediate sales certification suspension and compliance review."
    ),
    "L3-02-accredited-only": (
        "L3-02. Accredited Investors Only. "
        "Under 506(c), only accredited investors may invest. Verification is mandatory. "
        "Self-certification is insufficient. Third-party verification or professional letter required. "
        "Accepting a non-accredited investor is a material violation."
    ),
    "L3-03-no-sec-endorsement": (
        "L3-03. No SEC Endorsement Claims. "
        "Never state or imply that the SEC, any regulator, or any government agency has approved, "
        "endorsed, reviewed, or validated the offering, the token, or the platform. "
        "Violation triggers immediate certification suspension."
    ),

    # L2 — Jurisdictions (continued)
    "L2-04-singapore": (
        "L2-04. Singapore. "
        "MAS, the Monetary Authority of Singapore, regulates digital tokens that constitute capital markets products "
        "under the Securities and Futures Act. Digital token offerings of securities require prospectus unless exempt, "
        "such as small offerings under five million Singapore dollars, private placement to a maximum of fifty persons, "
        "or institutional investor only. Favorable regulatory clarity makes Singapore a priority jurisdiction for future expansion."
    ),
    "L2-05-switzerland": (
        "L2-05. Switzerland. "
        "FINMA classifies tokens into payment, utility, and asset tokens. The DLT Act of 2021 introduced "
        "ledger-based securities, known as Registerwertrechte, as a new legal form. Asset tokens offering securities "
        "require prospectus under FinSA. Switzerland's DLT Act provides one of the most developed legal frameworks "
        "for tokenized securities globally."
    ),
    "L2-06-uae": (
        "L2-06. United Arab Emirates. "
        "Multiple regulatory zones exist. DFSA in DIFC, FSRA in ADGM, and SCA onshore, each have separate frameworks. "
        "VARA, the Virtual Assets Regulatory Authority, specifically regulates virtual assets in Dubai. "
        "Each free zone has distinct application processes. OPTKAS is exploring ADGM and DIFC as potential operating bases "
        "for Middle East operations."
    ),
    "L2-07-japan": (
        "L2-07. Japan. "
        "The FSA, Financial Services Agency, regulates. Security tokens are classified as electronically recorded "
        "transferable rights under FIEA amendments from 2020. A Type I financial instruments business license is required. "
        "The Japan STO Association sets self-regulatory standards. High licensing requirements and foreign entities must "
        "establish Japan presence."
    ),
    "L2-08-canada": (
        "L2-08. Canada. "
        "CSA, the Canadian Securities Administrators, coordinates provincial regulators. Digital securities are securities "
        "under provincial securities legislation. Prospectus exemptions are available for accredited investors, minimum amount "
        "investments, and private issuers. Provincial registration is required in each province where investors reside. "
        "No single national regulator exists."
    ),
    "L2-09-australia": (
        "L2-09. Australia. "
        "ASIC regulates financial products including digital assets that are financial products under the Corporations Act 2001. "
        "Crypto-assets that are financial products require an AFS license. AUSTRAC handles AML and CTF registration. "
        "Design and distribution obligations require target market determinations for financial products."
    ),
    "L2-10-cayman-islands": (
        "L2-10. Cayman Islands. "
        "CIMA, the Cayman Islands Monetary Authority, oversees. The Virtual Asset Service Provider Act of 2020 requires "
        "VASP registration. Exempt funds and registered funds are commonly used for tokenized offerings. "
        "Economic substance requirements apply. OPTKAS considers Cayman Islands as a potential SPV domicile jurisdiction."
    ),

    # L3 — Sales Guardrails (continued)
    "L3-04-liquidity-disclaimers": (
        "L3-04. Liquidity Disclaimers. "
        "Liquidity is not guaranteed. Transfer restrictions apply. There may be no secondary market. "
        "You must affirmatively disclose illiquidity risk in every investor conversation. "
        "Failure to disclose illiquidity risk violates anti-fraud provisions and triggers mandatory retraining."
    ),
    "L3-05-total-loss-risk": (
        "L3-05. Total Loss Risk Disclosure. "
        "Every prospect must be told, clearly and without hedging, that total loss of investment is possible. "
        "This is not optional. Not a footnote. It is a primary disclosure. "
        "You should only invest money you can afford to lose entirely."
    ),
    "L3-06-no-bank-comparison": (
        "L3-06. No Comparison to Bank Products. "
        "Never compare tokenized securities to bank products such as savings accounts, CDs, or bonds. "
        "Never imply any form of deposit insurance, FDIC or SIPC protection, or guaranteed principal return. "
        "This is a private securities offering. It is not a bank account, a deposit, or insured by any government program."
    ),

    # L4 — Risk Intelligence
    "L4-01-market-risk": (
        "L4-01. Market Risk. "
        "The value of tokenized securities may decline due to market conditions, economic downturns, "
        "or changes in investor sentiment. Digital asset markets are particularly volatile. "
        "A decline exceeding twenty percent from last reported NAV triggers investor notification within 48 hours."
    ),
    "L4-02-liquidity-risk": (
        "L4-02. Liquidity Risk. "
        "Investors may be unable to sell or transfer their tokenized securities when desired. "
        "There may be no secondary market. Transfer restrictions under securities law "
        "may prevent sales for extended periods."
    ),
    "L4-03-regulatory-risk": (
        "L4-03. Regulatory Risk. "
        "Changes in securities law, cryptocurrency regulation, or enforcement priorities could restrict or prohibit "
        "the issuance, transfer, or holding of tokenized securities. Regulatory actions could force restructuring, "
        "asset freezes, or operational shutdown. Any enforcement action, subpoena, or formal inquiry triggers "
        "immediate Board notification and legal response protocol."
    ),
    "L4-04-technology-risk": (
        "L4-04. Technology and Smart Contract Risk. "
        "Bugs, exploits, or unintended behavior in smart contracts, XRPL Hooks, or AMM configurations "
        "could result in loss of tokens, unauthorized transfers, or frozen assets. Professional code audit "
        "before deployment, testnet validation, and multi-signature controls on all critical operations "
        "are required. Any unauthorized transaction triggers immediate freeze protocol."
    ),
    "L4-05-counterparty-risk": (
        "L4-05. Counterparty Risk. "
        "Failure of a counterparty such as a custodian, transfer agent, KYC provider, or legal counsel "
        "could impair operations, trap assets, or create regulatory exposure. Third-party insolvency "
        "could compromise investor assets in custody. Due diligence on all critical counterparties "
        "and contractual protection provisions are required."
    ),
    "L4-06-operational-risk": (
        "L4-06. Operational Risk. "
        "Internal process failures, human error, inadequate documentation, or lack of institutional knowledge "
        "could lead to investor harm, regulatory violations, or asset loss. Key-person dependency creates "
        "concentration risk. Documented SOPs, cross-training, and segregation of duties are essential mitigations. "
        "This Intelligence Library is itself a mitigation tool."
    ),

    # L5 — Update Log
    "L5-01-initial-build": (
        "L5-01. Initial Library Build, version one point zero. "
        "Initial deployment of the Global Intelligence Library as part of OPTKAS version 1.15.0. "
        "Established five core domains: L1 Core Terms with 13 entries, L2 Jurisdiction Intelligence with 10 entries, "
        "L3 Sales Guardrails with 6 entries, L4 Risk Intelligence with 6 entries, and L5 Update Log. "
        "Thirty-six total entries. All definitions reviewed by Legal counsel and approved by Head of Compliance."
    ),
}

# ─── Entry ID to Audio File Mapping ───
# Maps HTML data-id (e.g., "L1-01") to narration key (e.g., "L1-01-digital-security")
ENTRY_ID_MAP = {
    "L1-01": "L1-01-digital-security",
    "L1-02": "L1-02-tokenization",
    "L1-03": "L1-03-xrpl",
    "L1-04": "L1-04-reg-d",
    "L1-05": "L1-05-accredited-investor",
    "L1-06": "L1-06-trustline",
    "L1-07": "L1-07-issuer-address",
    "L1-08": "L1-08-kyc-aml",
    "L1-09": "L1-09-transfer-agent",
    "L1-10": "L1-10-custody",
    "L1-11": "L1-11-smart-contract",
    "L1-12": "L1-12-liquidity-pool",
    "L1-13": "L1-13-ppm",
    "L2-01": "L2-01-united-states",
    "L2-02": "L2-02-united-kingdom",
    "L2-03": "L2-03-european-union",
    "L2-04": "L2-04-singapore",
    "L2-05": "L2-05-switzerland",
    "L2-06": "L2-06-uae",
    "L2-07": "L2-07-japan",
    "L2-08": "L2-08-canada",
    "L2-09": "L2-09-australia",
    "L2-10": "L2-10-cayman-islands",
    "L3-01": "L3-01-no-guaranteed-returns",
    "L3-02": "L3-02-accredited-only",
    "L3-03": "L3-03-no-sec-endorsement",
    "L3-04": "L3-04-liquidity-disclaimers",
    "L3-05": "L3-05-total-loss-risk",
    "L3-06": "L3-06-no-bank-comparison",
    "L4-01": "L4-01-market-risk",
    "L4-02": "L4-02-liquidity-risk",
    "L4-03": "L4-03-regulatory-risk",
    "L4-04": "L4-04-technology-risk",
    "L4-05": "L4-05-counterparty-risk",
    "L4-06": "L4-06-operational-risk",
    "L5-01": "L5-01-initial-build",
}


async def generate_all():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    total = len(NARRATIONS)
    done = 0
    manifest = []

    for filename, text in NARRATIONS.items():
        outpath = os.path.join(OUTPUT_DIR, f"{filename}.mp3")

        # Compute script hash
        script_hash = hashlib.sha256(text.encode('utf-8')).hexdigest()

        if os.path.exists(outpath):
            print(f"  [SKIP] {filename}.mp3 already exists")
            with open(outpath, 'rb') as f:
                content_hash = hashlib.sha256(f.read()).hexdigest()
            file_size = os.path.getsize(outpath)
            done += 1
        else:
            print(f"  [{done+1}/{total}] Generating {filename}.mp3 ...")
            try:
                communicate = edge_tts.Communicate(text, VOICE)
                await communicate.save(outpath)
                done += 1
                with open(outpath, 'rb') as f:
                    content_hash = hashlib.sha256(f.read()).hexdigest()
                file_size = os.path.getsize(outpath)
                print(f"  [OK] {filename}.mp3")
            except Exception as e:
                print(f"  [ERR] {filename}: {e}")
                content_hash = "ERROR"
                file_size = 0

        manifest.append({
            "entryId": filename,
            "filename": f"{filename}.mp3",
            "scriptHash": script_hash,
            "contentHash": content_hash,
            "fileSizeBytes": file_size,
            "voice": VOICE,
            "generatedDate": datetime.now(timezone.utc).isoformat(),
            "version": "1.20.0"
        })

    # Write manifest
    with open(MANIFEST_PATH, 'w', encoding='utf-8') as f:
        json.dump({
            "generator": "OPTKAS GIL Narration Generator",
            "version": "1.20.0",
            "voice": VOICE,
            "generatedAt": datetime.now(timezone.utc).isoformat(),
            "totalEntries": total,
            "entries": manifest,
            "entryIdMap": ENTRY_ID_MAP
        }, f, indent=2)

    print(f"\nDone. {done}/{total} files generated in {OUTPUT_DIR}")
    print(f"📋 Manifest written to {MANIFEST_PATH}")


if __name__ == "__main__":
    print("OPTKAS GIL Narration Generator v1.20.0")
    print(f"Voice: {VOICE}")
    print(f"Output: {OUTPUT_DIR}\n")
    asyncio.run(generate_all())
