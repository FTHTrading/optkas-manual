#!/usr/bin/env python3
"""
OPTKAS Global Intelligence Library — Narration Generator v1.15.0
Generates MP3 narration files for GIL entries using edge-tts.
Voice: en-US-AndrewNeural (matching platform standard)

Usage:
    pip install edge-tts
    python scripts/generate-library-narration.py

Output: public/audio/library/ directory
"""

import asyncio
import os
import edge_tts

VOICE = "en-US-AndrewNeural"
OUTPUT_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "public", "audio", "library")

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

    # L2 — Jurisdictions (selected key entries)
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
}


async def generate_all():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    total = len(NARRATIONS)
    done = 0

    for filename, text in NARRATIONS.items():
        outpath = os.path.join(OUTPUT_DIR, f"{filename}.mp3")
        if os.path.exists(outpath):
            print(f"  [SKIP] {filename}.mp3 already exists")
            done += 1
            continue

        print(f"  [{done+1}/{total}] Generating {filename}.mp3 ...")
        try:
            communicate = edge_tts.Communicate(text, VOICE)
            await communicate.save(outpath)
            done += 1
            print(f"  [OK] {filename}.mp3")
        except Exception as e:
            print(f"  [ERR] {filename}: {e}")

    print(f"\nDone. {done}/{total} files generated in {OUTPUT_DIR}")


if __name__ == "__main__":
    print("OPTKAS GIL Narration Generator v1.15.0")
    print(f"Voice: {VOICE}")
    print(f"Output: {OUTPUT_DIR}\n")
    asyncio.run(generate_all())
