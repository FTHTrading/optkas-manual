/* ============================================
   OPTKAS MANUAL — APP.JS
   Navigation · Accordion · Layer bar handlers
   ============================================ */

(function () {
    'use strict';

    // --- DOM References ---
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    const content = document.querySelector('.content');

    // --- Navigation ---
    function navigateTo(sectionId) {
        // Deactivate all
        navLinks.forEach(link => link.classList.remove('active'));
        sections.forEach(sec => sec.classList.remove('active'));

        // Activate target
        const targetLink = document.querySelector(`.nav-link[data-section="${sectionId}"]`);
        const targetSection = document.getElementById(sectionId);

        if (targetLink) targetLink.classList.add('active');
        if (targetSection) targetSection.classList.add('active');

        // Scroll content to top
        if (content) content.scrollTop = 0;
    }

    // --- Nav Link Click Handlers ---
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const sectionId = this.getAttribute('data-section');
            navigateTo(sectionId);
        });
    });

    // --- Accordion (Subsection Toggle) ---
    function toggleSubsection(el) {
        const parent = el.closest('.subsection');
        if (parent) {
            parent.classList.toggle('open');
        }
    }

    // --- Layer Bar Click Handlers ---
    document.querySelectorAll('.layer-bar').forEach(bar => {
        bar.addEventListener('click', function () {
            const target = this.getAttribute('data-target');
            if (target) navigateTo(target);
        });
    });

    // --- Default Section ---
    navigateTo('executive');

    // --- Expose Globals ---
    window.navigateTo = navigateTo;
    window.toggleSubsection = toggleSubsection;

    // =============================================
    //  TRAINING MODE
    //  Auto-scroll · Narration · Progress · Checks
    // =============================================

    const sectionOrder = [
        'executive', 'legal', 'custody', 'settlement', 'assets',
        'automation', 'evidence', 'risk', 'workflows', 'revenue',
        'boundaries', 'committee'
    ];
    const completedSections = new Set();
    let trainingActive = false;
    let autoScrollTimer = null;

    // --- Progress helpers ---
    function updateProgress() {
        const fill = document.querySelector('.training-progress-fill');
        const text = document.querySelector('.training-progress-text');
        if (!fill || !text) return;
        const pct = Math.round((completedSections.size / sectionOrder.length) * 100);
        fill.style.width = pct + '%';
        text.textContent = completedSections.size + ' / ' + sectionOrder.length + ' sections';
    }

    function markSectionComplete(sectionId) {
        completedSections.add(sectionId);
        const link = document.querySelector('.nav-link[data-section="' + sectionId + '"]');
        if (link) link.classList.add('completed');
        updateProgress();
    }

    // --- Toggle Training Mode ---
    function toggleTrainingMode() {
        trainingActive = !trainingActive;
        const btn = document.getElementById('training-toggle');
        const progress = document.querySelector('.training-progress');
        const indicator = document.querySelector('.auto-scroll-indicator');

        if (btn) btn.classList.toggle('active', trainingActive);
        if (progress) progress.classList.toggle('visible', trainingActive);

        if (trainingActive) {
            // Start from current section
            if (indicator) { indicator.classList.add('visible'); }
            startAutoScroll();
        } else {
            stopAutoScroll();
            if (indicator) { indicator.classList.remove('visible'); }
        }
    }

    // --- Auto-scroll through sections ---
    function startAutoScroll() {
        stopAutoScroll();
        if (!trainingActive) return;

        const currentSection = document.querySelector('.section.active');
        if (!currentSection) return;
        const currentId = currentSection.id;

        // Trigger narration if audio controls available
        if (window.audioControls && window.audioControls.listenSection) {
            window.audioControls.listenSection(currentId);
        }

        // Set up auto-advance callback (called when MP3 ends)
        window.trainingAutoAdvance = function () {
            if (!trainingActive) return;
            markSectionComplete(currentId);

            const currentIdx = sectionOrder.indexOf(currentId);
            if (currentIdx < sectionOrder.length - 1) {
                const nextId = sectionOrder[currentIdx + 1];
                navigateTo(nextId);
                // Small delay then start next section
                autoScrollTimer = setTimeout(function () {
                    startAutoScroll();
                }, 1500);
            } else {
                // All sections complete
                markSectionComplete(currentId);
                trainingActive = false;
                const btn = document.getElementById('training-toggle');
                if (btn) btn.classList.remove('active');
                const indicator = document.querySelector('.auto-scroll-indicator');
                if (indicator) indicator.classList.remove('visible');
                window.trainingAutoAdvance = null;
            }
        };

        // Fallback: if audio doesn't play, advance after 30 seconds
        autoScrollTimer = setTimeout(function () {
            if (window.trainingAutoAdvance) {
                window.trainingAutoAdvance();
            }
        }, 120000); // 2 min max fallback
    }

    function stopAutoScroll() {
        if (autoScrollTimer) {
            clearTimeout(autoScrollTimer);
            autoScrollTimer = null;
        }
    }

    // --- Expose Training Globals ---
    window.toggleTrainingMode = toggleTrainingMode;
    window.markSectionComplete = markSectionComplete;

})();
