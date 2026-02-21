/* ═══════════════════════════════════════════════════════════════
   OPTKAS — Platform Operations Guide  ·  Navigation & Progress
   v1.9.0
   ═══════════════════════════════════════════════════════════════ */
(function () {
    'use strict';

    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    const content  = document.getElementById('content');

    const sectionOrder = [
        'sec1','sec2','sec3','sec4','sec5',
        'sec6','sec7','sec8','sec9','sec10'
    ];

    const completedSections = new Set();

    /* ─── Navigate ─── */
    function navigateTo(sectionId) {
        // Remove active from all
        navLinks.forEach(l => l.classList.remove('active'));
        sections.forEach(s => s.classList.remove('active'));

        // Activate target
        const targetLink = document.querySelector(`.nav-link[data-section="${sectionId}"]`);
        const targetSection = document.getElementById(sectionId);
        if (targetLink) targetLink.classList.add('active');
        if (targetSection) targetSection.classList.add('active');

        // Scroll to top
        if (content) content.scrollTop = 0;
    }

    /* ─── Click handlers ─── */
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const sectionId = this.getAttribute('data-section');
            if (sectionId) navigateTo(sectionId);
        });
    });

    /* ─── Progress ─── */
    function updateProgress() {
        const total = sectionOrder.length;
        const done  = completedSections.size;
        const pct   = Math.round((done / total) * 100);

        const fill = document.querySelector('.training-progress-fill');
        const text = document.querySelector('.training-progress-text');
        if (fill) fill.style.width = pct + '%';
        if (text) text.textContent = `${done} / ${total} sections`;
    }

    function markSectionComplete(sectionId) {
        completedSections.add(sectionId);
        const link = document.querySelector(`.nav-link[data-section="${sectionId}"]`);
        if (link) link.classList.add('completed');
        updateProgress();
    }

    /* ─── Scroll-to-bottom detection → auto-complete ─── */
    if (content) {
        content.addEventListener('scroll', function () {
            const activeSection = document.querySelector('.section.active');
            if (!activeSection) return;

            const atBottom = content.scrollHeight - content.scrollTop - content.clientHeight < 60;
            if (atBottom) {
                const id = activeSection.id;
                if (!completedSections.has(id)) {
                    markSectionComplete(id);
                }
            }
        });
    }

    /* ─── Auto-advance convenience ─── */
    function opsAutoAdvance() {
        const activeSection = document.querySelector('.section.active');
        if (!activeSection) return;
        const idx = sectionOrder.indexOf(activeSection.id);
        if (idx >= 0 && idx < sectionOrder.length - 1) {
            navigateTo(sectionOrder[idx + 1]);
        }
    }

    /* ─── Default section ─── */
    navigateTo('sec1');

    /* ─── Expose globals ─── */
    window.navigateTo = navigateTo;
    window.markSectionComplete = markSectionComplete;
    window.opsAutoAdvance = opsAutoAdvance;
})();
