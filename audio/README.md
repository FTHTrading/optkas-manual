# Audio Narration Files

Place pre-recorded MP3 narration files here for each section.

## Expected Files

| File | Section | Duration (est.) |
|------|---------|-----------------|
| `01-executive-overview.mp3` | Executive Overview | ~5 min |
| `02-legal-control-layer.mp3` | Legal & Control | ~4 min |
| `03-custody-banking.mp3` | Custody & Banking | ~3 min |
| `04-xrpl-settlement.mp3` | XRPL Settlement | ~8 min |
| `05-asset-issuance.mp3` | Asset Issuance | ~4 min |
| `06-automation-engines.mp3` | Automation Engines | ~6 min |
| `07-ledger-evidence.mp3` | Ledger Evidence | ~3 min |
| `08-risk-analytics.mp3` | Risk Analytics | ~4 min |
| `09-operations-workflows.mp3` | Operations | ~5 min |
| `10-revenue-model.mp3` | Revenue Model | ~3 min |
| `11-boundaries.mp3` | Boundaries | ~3 min |
| `12-credit-committee.mp3` | Credit Committee | ~4 min |

## Recording Guidelines

- **Format:** MP3, 128kbps minimum, mono or stereo
- **Voice:** Professional, measured tone — institutional narration style
- **Pace:** ~150 words per minute
- **Fallback:** If no MP3 is present, the app uses Web Speech API (browser TTS)

## Upload via Web App

Users can also upload MP3 files directly through the TTS panel (bottom of the web app).
The upload input accepts any audio file and plays it through the built-in audio player.

> **Note:** MP3 files are excluded from git (see `.gitignore`). 
> Host them separately or add to releases as binary assets.
