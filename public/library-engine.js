/* ═══════════════════════════════════════════════════════════
   OPTKAS Global Intelligence Library Engine — v1.15.0
   Search, filter, review tracking, KCS scoring, audio,
   section navigation, and localStorage persistence.
   ═══════════════════════════════════════════════════════════ */
(function () {
    'use strict';

    const ENGINE_VERSION = '1.15.0';
    const STORAGE_KEY = 'optkas_library_state';
    const KCS_RING_CIRCUMFERENCE = 326.73;

    // ─── Domain Registry ───
    const DOMAINS = {
        L1: { name: 'Core Terms & Definitions', icon: '\uD83D\uDCD1' },
        L2: { name: 'Jurisdiction Intelligence', icon: '\uD83C\uDF0E' },
        L3: { name: 'Sales Guardrails', icon: '\uD83D\uDCA5' },
        L4: { name: 'Risk Intelligence', icon: '\u26A0' },
        L5: { name: 'Update Log', icon: '\uD83D\uDCC5' }
    };

    // ─── Section Navigation ───
    const sectionOrder = ['overview', 'domL1', 'domL2', 'domL3', 'domL4', 'domL5', 'governance'];
    let currentSection = 'overview';

    // ─── State ───
    let state = loadState();

    function loadState() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                return Object.assign({
                    reviewed: {},
                    expanded: {},
                    lastSection: 'overview',
                    version: ENGINE_VERSION
                }, parsed);
            }
        } catch (e) { /* ignore */ }
        return {
            reviewed: {},
            expanded: {},
            lastSection: 'overview',
            version: ENGINE_VERSION
        };
    }

    function saveState() {
        state.version = ENGINE_VERSION;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }

    // ─── Navigation ───
    window.navigateTo = function (sectionId) {
        document.querySelectorAll('.lib-section').forEach(s => s.classList.remove('active'));
        const target = document.getElementById('sec-' + sectionId);
        if (target) target.classList.add('active');
        currentSection = sectionId;
        state.lastSection = sectionId;
        saveState();

        // Update sidebar active
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.toggle('active', link.dataset.section === sectionId);
        });
    };

    // ─── Entry Toggle (expand/collapse) ───
    document.addEventListener('click', function (e) {
        const header = e.target.closest('.entry-header');
        if (!header) return;
        // Don't toggle if clicking review button
        if (e.target.closest('.btn-review')) return;

        const entry = header.closest('.lib-entry');
        if (!entry) return;
        const id = entry.dataset.id;
        entry.classList.toggle('expanded');
        state.expanded[id] = entry.classList.contains('expanded');
        saveState();
    });

    // ─── Review Toggle ───
    window.toggleReview = function (entryId) {
        const isReviewed = !state.reviewed[entryId];
        state.reviewed[entryId] = isReviewed;
        saveState();
        updateEntryUI(entryId);
        updateDashboard();
        updateKCSRing();
        updateKCSTable();
    };

    function updateEntryUI(entryId) {
        const entry = document.querySelector(`.lib-entry[data-id="${entryId}"]`);
        if (!entry) return;
        const btn = entry.querySelector('.btn-review');
        if (state.reviewed[entryId]) {
            entry.classList.add('reviewed');
            if (btn) {
                btn.innerHTML = '\u2705 Reviewed';
                btn.classList.add('is-reviewed');
            }
        } else {
            entry.classList.remove('reviewed');
            if (btn) {
                btn.innerHTML = '\u2B1C Mark Reviewed';
                btn.classList.remove('is-reviewed');
            }
        }
    }

    // ─── Discover all entry IDs from DOM ───
    function getAllEntryIds() {
        return Array.from(document.querySelectorAll('.lib-entry[data-id]')).map(el => el.dataset.id);
    }

    function getEntryIdsByDomain(domKey) {
        const section = document.getElementById('sec-dom' + domKey);
        if (!section) return [];
        return Array.from(section.querySelectorAll('.lib-entry[data-id]')).map(el => el.dataset.id);
    }

    // ─── KCS Calculation ───
    function calculateKCS() {
        const allIds = getAllEntryIds();
        const total = allIds.length;
        const reviewed = allIds.filter(id => state.reviewed[id]).length;
        return { total, reviewed, pct: total > 0 ? Math.round((reviewed / total) * 100) : 0 };
    }

    function calculateDomainKCS(domKey) {
        const ids = getEntryIdsByDomain(domKey);
        const total = ids.length;
        const reviewed = ids.filter(id => state.reviewed[id]).length;
        return { total, reviewed, pct: total > 0 ? Math.round((reviewed / total) * 100) : 0 };
    }

    // ─── Update KCS Ring ───
    function updateKCSRing() {
        const { pct } = calculateKCS();
        const fill = document.getElementById('kcsRingFill');
        const text = document.getElementById('kcsRingText');
        if (fill) {
            const offset = KCS_RING_CIRCUMFERENCE * (1 - pct / 100);
            fill.style.strokeDashoffset = offset;
            // Color coding
            if (pct >= 95) fill.style.stroke = '#10b981';
            else if (pct >= 80) fill.style.stroke = '#f59e0b';
            else fill.style.stroke = '#ef4444';
        }
        if (text) text.textContent = pct + '%';
    }

    // ─── Update Dashboard ───
    function updateDashboard() {
        const allIds = getAllEntryIds();

        // Domain counts in sidebar
        Object.keys(DOMAINS).forEach(d => {
            const el = document.getElementById('count' + d);
            if (el) {
                const ids = getEntryIdsByDomain(d);
                const reviewed = ids.filter(id => state.reviewed[id]).length;
                el.textContent = reviewed + '/' + ids.length;
            }
        });

        // Dashboard cards
        Object.keys(DOMAINS).forEach(d => {
            const el = document.getElementById('dash' + d);
            if (el) {
                const s = calculateDomainKCS(d);
                el.textContent = s.reviewed + ' / ' + s.total;
            }
        });

        // Total entries badge
        const totalEl = document.getElementById('totalEntries');
        if (totalEl) totalEl.textContent = allIds.length;

        // Governance summary
        const kcs = calculateKCS();
        const govTotal = document.getElementById('govTotal');
        const govReviewed = document.getElementById('govReviewed');
        const govPending = document.getElementById('govPending');
        const govKCS = document.getElementById('govKCS');
        if (govTotal) govTotal.textContent = kcs.total;
        if (govReviewed) govReviewed.textContent = kcs.reviewed;
        if (govPending) govPending.textContent = kcs.total - kcs.reviewed;
        if (govKCS) govKCS.textContent = kcs.pct + '%';
    }

    // ─── KCS Breakdown Table ───
    function updateKCSTable() {
        const tbody = document.getElementById('kcsTableBody');
        if (!tbody) return;
        tbody.innerHTML = '';
        let grandTotal = 0, grandReviewed = 0;

        Object.keys(DOMAINS).forEach(d => {
            const s = calculateDomainKCS(d);
            grandTotal += s.total;
            grandReviewed += s.reviewed;
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${DOMAINS[d].icon} ${d} \u2014 ${DOMAINS[d].name}</td>
                <td>${s.total}</td>
                <td>${s.reviewed}</td>
                <td>${s.pct}%</td>
            `;
            tbody.appendChild(tr);
        });

        const footTotal = document.getElementById('kcsFootTotal');
        const footReviewed = document.getElementById('kcsFootReviewed');
        const footScore = document.getElementById('kcsFootScore');
        if (footTotal) footTotal.textContent = grandTotal;
        if (footReviewed) footReviewed.textContent = grandReviewed;
        if (footScore) footScore.innerHTML = '<strong>' + (grandTotal > 0 ? Math.round((grandReviewed / grandTotal) * 100) : 0) + '%</strong>';
    }

    // ─── Search ───
    function initSearch() {
        const input = document.getElementById('librarySearch');
        if (!input) return;

        input.addEventListener('input', function () {
            const query = this.value.toLowerCase().trim();
            const entries = document.querySelectorAll('.lib-entry');

            entries.forEach(entry => {
                if (!query) {
                    entry.classList.remove('hidden');
                    return;
                }
                const text = entry.textContent.toLowerCase();
                entry.classList.toggle('hidden', !text.includes(query));
            });
        });
    }

    // ─── Filter ───
    function initFilter() {
        const select = document.getElementById('filterStatus');
        if (!select) return;

        select.addEventListener('change', function () {
            const val = this.value;
            const entries = document.querySelectorAll('.lib-entry');

            entries.forEach(entry => {
                const id = entry.dataset.id;
                const isReviewed = !!state.reviewed[id];
                if (val === 'all') entry.classList.remove('hidden');
                else if (val === 'reviewed') entry.classList.toggle('hidden', !isReviewed);
                else if (val === 'unreviewed') entry.classList.toggle('hidden', isReviewed);
            });
        });
    }

    // ─── Audio Toggle ───
    window.toggleAudio = function () {
        const panel = document.getElementById('audioPanel');
        if (panel) panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    };

    function initAudioToggle() {
        const btn = document.getElementById('ttsToggle');
        if (btn) btn.addEventListener('click', toggleAudio);
    }

    // ─── Restore UI State ───
    function restoreUI() {
        // Restore expanded entries
        getAllEntryIds().forEach(id => {
            if (state.expanded[id]) {
                const entry = document.querySelector(`.lib-entry[data-id="${id}"]`);
                if (entry) entry.classList.add('expanded');
            }
            updateEntryUI(id);
        });

        // Restore section
        if (state.lastSection && state.lastSection !== 'overview') {
            navigateTo(state.lastSection);
        }
    }

    // ─── Init ───
    document.addEventListener('DOMContentLoaded', function () {
        restoreUI();
        updateDashboard();
        updateKCSRing();
        updateKCSTable();
        initSearch();
        initFilter();
        initAudioToggle();

        console.log('[GIL] Global Intelligence Library Engine v' + ENGINE_VERSION + ' initialized.');
        console.log('[GIL] ' + getAllEntryIds().length + ' entries loaded across ' + Object.keys(DOMAINS).length + ' domains.');
    });

})();
