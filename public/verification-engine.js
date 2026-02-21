/* ═══════════════════════════════════════════════════════════
   OPTKAS Institutional Verification Engine — v1.13.0
   Interactive scoring, state persistence, and real-time
   domain confidence calculation.
   ═══════════════════════════════════════════════════════════ */
(function () {
    'use strict';

    // ─── Claim Database ───
    const DOMAINS = {
        A: { name: 'Infrastructure', claims: ['A1','A2','A3','A4','A5','A6','A7','A8','A9'] },
        B: { name: 'XRPL Capabilities', claims: ['B1','B2','B3','B4','B5','B6','B7','B8'] },
        C: { name: 'Stellar Capabilities', claims: ['C1','C2','C3','C4','C5','C6'] },
        D: { name: 'Legal Structure', claims: ['D1','D2','D3','D4','D5','D6'] },
        E: { name: 'Operational Control', claims: ['E1','E2','E3','E4','E5','E6'] },
        F: { name: 'Security & Risk', claims: ['F1','F2','F3','F4','F5','F6'] }
    };

    // Note: F6 doesn't exist in the HTML but the domain has only 5 claims
    // We'll adjust at runtime based on what's actually in the DOM.

    const SCORE_VALUES = { green: 100, yellow: 60, red: 20 };
    const STORAGE_KEY = 'optkas_verification_state';

    // ─── State ───
    let state = loadState();

    // ─── Section Navigation ───
    const sectionOrder = ['overview', 'domA', 'domB', 'domC', 'domD', 'domE', 'domF'];

    window.navigateTo = function (sectionId) {
        // Hide all sections
        document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
        // Show target
        const target = document.getElementById(sectionId);
        if (target) target.classList.add('active');

        // Update nav
        document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
        const activeLink = document.querySelector(`.nav-link[data-section="${sectionId}"]`);
        if (activeLink) activeLink.classList.add('active');

        // Scroll to top
        const content = document.getElementById('content');
        if (content) content.scrollTop = 0;
    };

    // ─── Claim Toggle (expand/collapse) ───
    document.addEventListener('click', function (e) {
        const header = e.target.closest('.claim-header');
        if (!header) return;
        const block = header.closest('.claim-block');
        if (block) block.classList.toggle('expanded');
    });

    // ─── Update Claim Assessment ───
    window.updateClaim = function (claimId, value) {
        if (!value) {
            delete state.assessments[claimId];
        } else {
            state.assessments[claimId] = value;
        }
        saveState();
        renderSignal(claimId, value);
        recalculate();
    };

    // ─── Save Notes ───
    window.saveNotes = function (claimId, value) {
        if (!state.notes) state.notes = {};
        state.notes[claimId] = value;
        saveState();
    };

    // ─── Render Signal Dot ───
    function renderSignal(claimId, value) {
        const dot = document.getElementById('signal' + claimId);
        if (dot) {
            dot.className = 'claim-signal';
            if (value) dot.classList.add(value);
        }
        // Update claim block border
        const block = document.querySelector(`.claim-block[data-claim="${claimId}"]`);
        if (block) {
            block.classList.remove('assessed-green', 'assessed-yellow', 'assessed-red');
            if (value) block.classList.add('assessed-' + value);
        }
    }

    // ─── Recalculate All Scores ───
    function recalculate() {
        let totalScore = 0;
        let totalClaims = 0;
        let assessedClaims = 0;
        let domainScores = {};
        let allRedClaims = [];
        let allYellowClaims = [];

        for (const [domKey, domData] of Object.entries(DOMAINS)) {
            // Only count claims that actually exist in the DOM
            const existingClaims = domData.claims.filter(c =>
                document.querySelector(`.claim-block[data-claim="${c}"]`)
            );
            const domTotal = existingClaims.length;
            totalClaims += domTotal;

            let domScore = 0;
            let domAssessed = 0;

            for (const claimId of existingClaims) {
                const val = state.assessments[claimId];
                if (val) {
                    domAssessed++;
                    assessedClaims++;
                    domScore += SCORE_VALUES[val] || 0;
                    if (val === 'red') allRedClaims.push(claimId);
                    if (val === 'yellow') allYellowClaims.push(claimId);
                }
            }

            const domPct = domAssessed > 0 ? Math.round(domScore / domAssessed) : 0;
            domainScores[domKey] = { score: domPct, assessed: domAssessed, total: domTotal };

            // Update nav sidebar badge
            const navBadge = document.getElementById('navScore' + domKey);
            if (navBadge) {
                if (domAssessed > 0) {
                    navBadge.textContent = domPct;
                    navBadge.style.color = getScoreColor(domPct);
                    navBadge.style.background = getScoreBg(domPct);
                } else {
                    navBadge.textContent = '—';
                    navBadge.style.color = '';
                    navBadge.style.background = '';
                }
            }

            // Update dashboard domain cards
            updateDomainCard(domKey, domPct, domAssessed, domTotal);

            // Mark nav as complete if all claims assessed
            const navLink = document.querySelector(`.nav-link[data-section="dom${domKey}"]`);
            if (navLink) {
                if (domAssessed === domTotal && domTotal > 0) {
                    navLink.classList.add('completed');
                } else {
                    navLink.classList.remove('completed');
                }
            }
        }

        // Global score — weighted average of domain scores (only assessed domains)
        let globalScore = 0;
        let assessedDomains = 0;
        for (const ds of Object.values(domainScores)) {
            if (ds.assessed > 0) {
                globalScore += ds.score;
                assessedDomains++;
            }
        }
        globalScore = assessedDomains > 0 ? Math.round(globalScore / assessedDomains) : 0;

        // Update global score displays
        updateGlobalScore(globalScore);

        // Update progress bar
        const pFill = document.getElementById('progressFill');
        const pText = document.getElementById('progressText');
        if (pFill) pFill.style.width = (totalClaims > 0 ? (assessedClaims / totalClaims * 100) : 0) + '%';
        if (pText) pText.textContent = `${assessedClaims} / ${totalClaims} claims assessed`;

        // Update claims counts on dashboard
        for (const [domKey, ds] of Object.entries(domainScores)) {
            const claimsEl = document.getElementById('claims' + domKey);
            if (claimsEl) claimsEl.textContent = `${ds.assessed} / ${ds.total} claims`;
        }

        // Update vulnerability summary
        renderVulnSummary(allRedClaims, allYellowClaims, globalScore, assessedClaims);
    }

    // ─── Update Domain Card on Dashboard ───
    function updateDomainCard(domKey, score, assessed, total) {
        const fillEl = document.getElementById('dsrFill' + domKey);
        const textEl = document.getElementById('dsrText' + domKey);
        const signalEl = document.getElementById('signal' + domKey);

        if (fillEl) {
            const circumference = 2 * Math.PI * 34; // r=34
            const offset = assessed > 0 ? circumference * (1 - score / 100) : circumference;
            fillEl.style.strokeDashoffset = offset;
            fillEl.style.stroke = getScoreColor(score);
        }
        if (textEl) {
            textEl.textContent = assessed > 0 ? score : '—';
        }
        if (signalEl) {
            if (assessed === 0) signalEl.textContent = 'NOT ASSESSED';
            else if (score >= 90) signalEl.textContent = 'INSTITUTIONAL';
            else if (score >= 75) signalEl.textContent = 'AUDIT READY';
            else if (score >= 60) signalEl.textContent = 'PROGRESSING';
            else if (score >= 40) signalEl.textContent = 'DEVELOPING';
            else signalEl.textContent = 'EARLY STAGE';
            signalEl.style.color = assessed > 0 ? getScoreColor(score) : '';
        }
    }

    // ─── Update Global Score ───
    function updateGlobalScore(score) {
        // Top bar
        const globalEl = document.getElementById('globalScore');
        if (globalEl) {
            globalEl.textContent = score;
            globalEl.style.color = getScoreColor(score);
        }

        // Sidebar ring
        const ringFill = document.getElementById('scoreRingFill');
        const ringText = document.getElementById('scoreRingText');
        const gradeLabel = document.getElementById('scoreGradeLabel');

        if (ringFill) {
            const circumference = 2 * Math.PI * 52; // r=52
            const offset = circumference * (1 - score / 100);
            ringFill.style.strokeDashoffset = offset;
            ringFill.style.stroke = getScoreColor(score);
        }
        if (ringText) {
            ringText.textContent = score;
        }
        if (gradeLabel) {
            gradeLabel.textContent = getGrade(score);
            gradeLabel.style.color = getScoreColor(score);
        }
    }

    // ─── Vulnerability Summary ───
    function renderVulnSummary(reds, yellows, score, assessed) {
        const container = document.getElementById('vulnSummary');
        if (!container) return;

        if (assessed === 0) {
            container.innerHTML = `
                <div class="concept-card" style="border-left:4px solid var(--text-secondary);">
                    <p style="color:var(--text-secondary);">Complete at least one domain assessment to generate the credibility risk summary.</p>
                </div>`;
            return;
        }

        let html = '';

        if (reds.length > 0) {
            html += `<div class="vuln-card">
                <span class="vuln-signal signal-red"></span>
                <div class="vuln-text"><strong>${reds.length} Unverified Claim${reds.length > 1 ? 's' : ''}:</strong> ${reds.join(', ')} — These claims cannot be independently verified with available evidence. Institutional auditors will flag these.</div>
            </div>`;
        }

        if (yellows.length > 0) {
            html += `<div class="vuln-card">
                <span class="vuln-signal signal-yellow"></span>
                <div class="vuln-text"><strong>${yellows.length} Partially Verified Claim${yellows.length > 1 ? 's' : ''}:</strong> ${yellows.join(', ')} — Supporting evidence exists but gaps remain. Provide additional documentation to upgrade these to GREEN.</div>
            </div>`;
        }

        if (reds.length === 0 && yellows.length === 0) {
            html += `<div class="vuln-card">
                <span class="vuln-signal signal-green"></span>
                <div class="vuln-text"><strong>All assessed claims verified.</strong> Current readiness score: ${score}/100 (${getGrade(score)}). Continue assessing remaining domains.</div>
            </div>`;
        }

        // Overall assessment
        const totalAssessable = Object.values(DOMAINS).reduce((sum, d) =>
            sum + d.claims.filter(c => document.querySelector(`.claim-block[data-claim="${c}"]`)).length, 0);
        const pct = Math.round(assessed / totalAssessable * 100);

        html += `<div class="vuln-card">
            <span class="vuln-signal" style="background:var(--accent-amber);"></span>
            <div class="vuln-text"><strong>Coverage:</strong> ${assessed}/${totalAssessable} claims assessed (${pct}%). Readiness score: <strong style="color:${getScoreColor(score)};">${score}/100 — ${getGrade(score)}</strong></div>
        </div>`;

        container.innerHTML = html;
    }

    // ─── Helpers ───
    function getScoreColor(score) {
        if (score >= 80) return '#10b981';
        if (score >= 60) return '#f59e0b';
        return '#ef4444';
    }
    function getScoreBg(score) {
        if (score >= 80) return 'rgba(16,185,129,0.12)';
        if (score >= 60) return 'rgba(245,158,11,0.12)';
        return 'rgba(239,68,68,0.12)';
    }
    function getGrade(score) {
        if (score >= 90) return 'INSTITUTIONAL GRADE';
        if (score >= 75) return 'AUDIT READY';
        if (score >= 60) return 'PROGRESSING';
        if (score >= 40) return 'DEVELOPING';
        return 'EARLY STAGE';
    }

    // ─── Persistence ───
    function loadState() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                return { assessments: parsed.assessments || {}, notes: parsed.notes || {} };
            }
        } catch (e) { /* ignore */ }
        return { assessments: {}, notes: {} };
    }

    function saveState() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (e) { /* ignore */ }
    }

    // ─── Restore State on Load ───
    function restoreUI() {
        // Restore assessments
        for (const [claimId, value] of Object.entries(state.assessments)) {
            const select = document.querySelector(`.signal-select[data-claim="${claimId}"]`);
            if (select) select.value = value;
            renderSignal(claimId, value);
        }
        // Restore notes
        if (state.notes) {
            for (const [claimId, value] of Object.entries(state.notes)) {
                const input = document.querySelector(`.claim-notes[data-claim="${claimId}"]`);
                if (input) input.value = value;
            }
        }
        // Expand first claim block per visible section for discoverability
        document.querySelectorAll('.section').forEach(sec => {
            const first = sec.querySelector('.claim-block');
            if (first && !sec.querySelector('.claim-block.expanded')) {
                first.classList.add('expanded');
            }
        });
        recalculate();
    }

    // ─── Adjust domain F claims list based on actual DOM ───
    function adjustDomainClaims() {
        for (const [domKey, domData] of Object.entries(DOMAINS)) {
            domData.claims = domData.claims.filter(c =>
                document.querySelector(`.claim-block[data-claim="${c}"]`)
            );
        }
    }

    // ─── Init ───
    document.addEventListener('DOMContentLoaded', function () {
        adjustDomainClaims();
        restoreUI();

        // Nav click handlers
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                const section = this.getAttribute('data-section');
                if (section) navigateTo(section);
            });
        });
    });

})();
