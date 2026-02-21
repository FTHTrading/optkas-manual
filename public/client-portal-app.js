/* ============================================
   OPTKAS — CLIENT PORTAL APP.JS
   Navigation · Progress · Section Completion
   ============================================ */

(function () {
    'use strict';

    // --- DOM References ---
    var navLinks = document.querySelectorAll('.nav-link');
    var sections = document.querySelectorAll('.section');
    var content  = document.querySelector('.content');

    // --- Section Order ---
    var sectionOrder = ['sec1', 'sec2', 'sec3', 'sec4', 'sec5', 'sec6', 'sec7', 'sec8'];
    var completedSections = new Set();

    // --- Navigation ---
    function navigateTo(sectionId) {
        navLinks.forEach(function (link) { link.classList.remove('active'); });
        sections.forEach(function (sec) { sec.classList.remove('active'); });

        var targetLink = document.querySelector('.nav-link[data-section="' + sectionId + '"]');
        var targetSection = document.getElementById(sectionId);

        if (targetLink) targetLink.classList.add('active');
        if (targetSection) targetSection.classList.add('active');

        if (content) content.scrollTop = 0;
    }

    // --- Nav Link Click Handlers ---
    navLinks.forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            var sectionId = this.getAttribute('data-section');
            navigateTo(sectionId);
        });
    });

    // --- Progress Tracking ---
    function updateProgress() {
        var fill = document.querySelector('.training-progress-fill');
        var text = document.querySelector('.training-progress-text');
        if (!fill || !text) return;
        var pct = Math.round((completedSections.size / sectionOrder.length) * 100);
        fill.style.width = pct + '%';
        text.textContent = completedSections.size + ' / ' + sectionOrder.length + ' sections';
    }

    function markSectionComplete(sectionId) {
        completedSections.add(sectionId);
        var link = document.querySelector('.nav-link[data-section="' + sectionId + '"]');
        if (link) link.classList.add('completed');
        updateProgress();
    }

    // --- Scroll-to-bottom detection → mark complete ---
    if (content) {
        content.addEventListener('scroll', function () {
            var activeSection = document.querySelector('.section.active');
            if (!activeSection) return;

            var scrollBottom = content.scrollTop + content.clientHeight;
            var threshold = content.scrollHeight - 80;

            if (scrollBottom >= threshold) {
                markSectionComplete(activeSection.id);
            }
        });
    }

    // --- Auto-advance to next section ---
    window.portalAutoAdvance = function () {
        var activeSection = document.querySelector('.section.active');
        if (!activeSection) return;

        var currentId = activeSection.id;
        markSectionComplete(currentId);

        var idx = sectionOrder.indexOf(currentId);
        if (idx < sectionOrder.length - 1) {
            navigateTo(sectionOrder[idx + 1]);
        }
    };

    // --- Default: start on Section 1 ---
    navigateTo('sec1');

    // --- Expose Globals ---
    window.navigateTo = navigateTo;
    window.markSectionComplete = markSectionComplete;

})();
