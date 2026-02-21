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

})();
