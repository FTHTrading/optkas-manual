/* ============================================
   OPTKAS — TRAINING ACADEMY APP.JS
   Navigation · Progress · Module Completion
   ============================================ */

(function () {
    'use strict';

    // --- DOM References ---
    var navLinks = document.querySelectorAll('.nav-link');
    var sections = document.querySelectorAll('.section');
    var content  = document.querySelector('.content');

    // --- Module Order ---
    var moduleOrder = ['mod1', 'mod2', 'mod3', 'mod4', 'mod5', 'mod6', 'mod7', 'mod8', 'mod9'];
    var completedModules = new Set();

    // --- Navigation ---
    function navigateTo(moduleId) {
        navLinks.forEach(function (link) { link.classList.remove('active'); });
        sections.forEach(function (sec) { sec.classList.remove('active'); });

        var targetLink = document.querySelector('.nav-link[data-section="' + moduleId + '"]');
        var targetSection = document.getElementById(moduleId);

        if (targetLink) targetLink.classList.add('active');
        if (targetSection) targetSection.classList.add('active');

        if (content) content.scrollTop = 0;
    }

    // --- Nav Link Click Handlers ---
    navLinks.forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            var moduleId = this.getAttribute('data-section');
            navigateTo(moduleId);
        });
    });

    // --- Progress Tracking ---
    function updateProgress() {
        var fill = document.querySelector('.training-progress-fill');
        var text = document.querySelector('.training-progress-text');
        if (!fill || !text) return;
        var pct = Math.round((completedModules.size / moduleOrder.length) * 100);
        fill.style.width = pct + '%';
        text.textContent = completedModules.size + ' / ' + moduleOrder.length + ' modules';
    }

    function markModuleComplete(moduleId) {
        completedModules.add(moduleId);
        var link = document.querySelector('.nav-link[data-section="' + moduleId + '"]');
        if (link) link.classList.add('completed');
        updateProgress();
    }

    // --- Scroll‑to‑bottom detection → mark complete ---
    if (content) {
        content.addEventListener('scroll', function () {
            var activeSection = document.querySelector('.section.active');
            if (!activeSection) return;

            var scrollBottom = content.scrollTop + content.clientHeight;
            var threshold = content.scrollHeight - 80;

            if (scrollBottom >= threshold) {
                markModuleComplete(activeSection.id);
            }
        });
    }

    // --- Auto‑advance (called by training-audio.js when MP3 ends) ---
    window.trainingAutoAdvance = function () {
        var activeSection = document.querySelector('.section.active');
        if (!activeSection) return;

        var currentId = activeSection.id;
        markModuleComplete(currentId);

        var idx = moduleOrder.indexOf(currentId);
        if (idx < moduleOrder.length - 1) {
            var nextId = moduleOrder[idx + 1];
            navigateTo(nextId);

            // Auto‑play next module audio after short delay
            setTimeout(function () {
                if (window.audioControls && window.audioControls.listenSection) {
                    window.audioControls.listenSection(nextId);
                }
            }, 1200);
        }
    };

    // --- Default: start on Module 1 ---
    navigateTo('mod1');

    // --- Expose Globals ---
    window.navigateTo = navigateTo;
    window.markModuleComplete = markModuleComplete;

})();
