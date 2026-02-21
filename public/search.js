/* ============================================
   OPTKAS MANUAL — SEARCH.JS
   Global search · Ctrl+K · Capability registry
   ============================================ */

(function () {
    'use strict';

    const searchInput = document.getElementById('globalSearch');
    const searchResults = document.getElementById('searchResults');
    let registry = [];
    let debounceTimer = null;

    // --- Build Capability Registry ---
    function buildRegistry() {
        registry = [];

        // 1. Scan capability tables
        document.querySelectorAll('.capability-table table').forEach(table => {
            const section = table.closest('.section');
            const sectionId = section ? section.id : '';
            const rows = table.querySelectorAll('tbody tr');
            rows.forEach(row => {
                const cells = row.querySelectorAll('td');
                if (cells.length >= 3) {
                    registry.push({
                        id: cells[0].textContent.trim(),
                        name: cells[1].textContent.trim(),
                        detail: cells.length >= 4 ? cells[2].textContent.trim() : '',
                        status: cells[cells.length - 1].textContent.trim(),
                        section: sectionId,
                        type: 'capability'
                    });
                }
            });
        });

        // 2. Scan asset cards
        document.querySelectorAll('.asset-card').forEach(card => {
            const section = card.closest('.section');
            const sectionId = section ? section.id : '';
            const symbol = card.querySelector('.asset-symbol');
            const desc = card.querySelector('.asset-desc');
            if (symbol) {
                registry.push({
                    id: symbol.textContent.trim(),
                    name: desc ? desc.textContent.trim() : symbol.textContent.trim(),
                    detail: 'XRPL IOU Asset',
                    status: '✅ Live',
                    section: sectionId,
                    type: 'asset'
                });
            }
        });

        // 3. Scan token type cards
        document.querySelectorAll('.token-type-card').forEach(card => {
            const section = card.closest('.section');
            const sectionId = section ? section.id : '';
            const h3 = card.querySelector('h3');
            const example = card.querySelector('.token-example');
            if (h3) {
                registry.push({
                    id: example ? example.textContent.trim() : '',
                    name: h3.textContent.trim(),
                    detail: 'Token Type',
                    status: '✅ Live',
                    section: sectionId,
                    type: 'token'
                });
            }
        });

        // 4. Scan overview cards
        document.querySelectorAll('.overview-card').forEach(card => {
            const section = card.closest('.section');
            const sectionId = section ? section.id : '';
            const label = card.querySelector('.card-label');
            const num = card.querySelector('.card-number');
            if (label) {
                registry.push({
                    id: num ? num.textContent.trim() : '',
                    name: label.textContent.trim(),
                    detail: 'Platform Metric',
                    status: '',
                    section: sectionId,
                    type: 'metric'
                });
            }
        });
    }

    // --- Escape HTML ---
    function escapeHtml(str) {
        const div = document.createElement('div');
        div.appendChild(document.createTextNode(str));
        return div.innerHTML;
    }

    // --- Highlight match ---
    function highlightMatch(text, query) {
        if (!query) return escapeHtml(text);
        const escaped = escapeHtml(text);
        const regex = new RegExp('(' + query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
        return escaped.replace(regex, '<mark>$1</mark>');
    }

    // --- Search ---
    function performSearch(query) {
        if (!query || query.length < 2) {
            searchResults.classList.add('hidden');
            searchResults.innerHTML = '';
            return;
        }

        const lower = query.toLowerCase();
        const matches = registry.filter(item =>
            item.id.toLowerCase().includes(lower) ||
            item.name.toLowerCase().includes(lower) ||
            item.detail.toLowerCase().includes(lower)
        ).slice(0, 20);

        if (matches.length === 0) {
            searchResults.innerHTML = '<div class="search-result-item"><span class="search-result-name">No results found</span></div>';
            searchResults.classList.remove('hidden');
            return;
        }

        searchResults.innerHTML = matches.map(item => `
            <div class="search-result-item" onclick="navigateTo('${item.section}')">
                <div class="search-result-id">${highlightMatch(item.id, query)}</div>
                <div class="search-result-name">${highlightMatch(item.name, query)}</div>
                <div class="search-result-layer">${escapeHtml(item.detail)} ${item.status ? '· ' + escapeHtml(item.status) : ''}</div>
            </div>
        `).join('');
        searchResults.classList.remove('hidden');
    }

    // --- Debounced Input ---
    if (searchInput) {
        searchInput.addEventListener('input', function () {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                performSearch(this.value.trim());
            }, 150);
        });

        searchInput.addEventListener('focus', function () {
            if (this.value.trim().length >= 2) {
                performSearch(this.value.trim());
            }
        });
    }

    // --- Ctrl+K Shortcut ---
    document.addEventListener('keydown', function (e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            if (searchInput) {
                searchInput.focus();
                searchInput.select();
            }
        }
        if (e.key === 'Escape') {
            if (searchResults) searchResults.classList.add('hidden');
            if (searchInput) searchInput.blur();
        }
    });

    // --- Close on outside click ---
    document.addEventListener('click', function (e) {
        if (searchResults && !e.target.closest('.search-container')) {
            searchResults.classList.add('hidden');
        }
    });

    // --- Initialize ---
    document.addEventListener('DOMContentLoaded', buildRegistry);
    // Also build immediately if DOM is already loaded
    if (document.readyState !== 'loading') {
        buildRegistry();
    }

})();
