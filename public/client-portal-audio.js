/* ═══════════════════════════════════════════════════════════════
   OPTKAS — Client Portal  ·  Neural Voice Audio Engine
   v1.11.0  ·  MP3-based narration  ·  en-US-AndrewNeural
   ═══════════════════════════════════════════════════════════════ */
(function () {
    'use strict';

    /* ─── Audio Map: Section ID → MP3 path ─── */
    const AUDIO_MAP = {
        sec1: '../audio/portal/sec1-welcome-to-optkas.mp3',
        sec2: '../audio/portal/sec2-how-the-system-works.mp3',
        sec3: '../audio/portal/sec3-use-cases-benefits.mp3',
        sec4: '../audio/portal/sec4-stablecoin-guide.mp3',
        sec5: '../audio/portal/sec5-stellar-cross-chain.mp3',
        sec6: '../audio/portal/sec6-fee-structure.mp3',
        sec7: '../audio/portal/sec7-security-infrastructure.mp3',
        sec8: '../audio/portal/sec8-getting-started.mp3',
        sec9: '../audio/portal/sec9-full-system-review.mp3'
    };

    /* ─── DOM refs ─── */
    const ttsToggle     = document.getElementById('ttsToggle');
    const ttsPanel      = document.getElementById('ttsPanel');
    const ttsStatus     = document.getElementById('ttsStatus');
    const progressBar   = document.getElementById('audioProgressBar');
    const progressFill  = document.getElementById('audioProgressFill');
    const timeDisplay   = document.getElementById('audioTimeDisplay');

    /* ─── Audio state ─── */
    const audio = new Audio();
    audio.preload = 'auto';
    let currentSection = null;

    /* ─── Helpers ─── */
    function fmtTime(s) {
        if (!s || isNaN(s)) return '0:00';
        const m = Math.floor(s / 60);
        const sec = Math.floor(s % 60);
        return m + ':' + (sec < 10 ? '0' : '') + sec;
    }

    function updateProgress() {
        if (!audio.duration) return;
        const pct = (audio.currentTime / audio.duration) * 100;
        if (progressFill) progressFill.style.width = pct + '%';
        if (timeDisplay) timeDisplay.textContent = fmtTime(audio.currentTime) + ' / ' + fmtTime(audio.duration);
    }

    /* ─── Audio events ─── */
    audio.addEventListener('timeupdate', updateProgress);

    audio.addEventListener('ended', function () {
        if (ttsStatus) ttsStatus.textContent = 'Completed';
        if (typeof window.portalAutoAdvance === 'function') {
            window.portalAutoAdvance();
        }
    });

    audio.addEventListener('error', function () {
        if (ttsStatus) ttsStatus.textContent = 'Audio unavailable';
    });

    /* ─── Progress bar seek ─── */
    if (progressBar) {
        progressBar.addEventListener('click', function (e) {
            if (!audio.duration) return;
            const rect = progressBar.getBoundingClientRect();
            const pct = (e.clientX - rect.left) / rect.width;
            audio.currentTime = pct * audio.duration;
        });
    }

    /* ─── Toggle panel ─── */
    if (ttsToggle) {
        ttsToggle.addEventListener('click', function () {
            if (ttsPanel) ttsPanel.classList.toggle('hidden');
        });
    }

    /* ─── Audio Controls API ─── */
    const audioControls = {
        play: function () {
            const active = document.querySelector('.section.active');
            if (active) this.listenSection(active.id);
        },

        listenSection: function (sectionId) {
            const src = AUDIO_MAP[sectionId];
            if (!src) {
                if (ttsStatus) ttsStatus.textContent = 'No audio for this section';
                return;
            }
            currentSection = sectionId;
            audio.src = src;
            audio.play().catch(function () {
                if (ttsStatus) ttsStatus.textContent = 'Click play to start';
            });
            if (ttsPanel) ttsPanel.classList.remove('hidden');
            if (ttsStatus) ttsStatus.textContent = 'Playing — ' + sectionId.replace('sec', 'Section ');
        },

        pause: function () {
            audio.pause();
            if (ttsStatus) ttsStatus.textContent = 'Paused';
        },

        resume: function () {
            audio.play().catch(function () {});
            if (ttsStatus) ttsStatus.textContent = 'Playing';
        },

        togglePlayPause: function (sectionId) {
            if (currentSection === sectionId && !audio.paused) {
                this.pause();
            } else if (currentSection === sectionId && audio.paused) {
                this.resume();
            } else {
                this.listenSection(sectionId);
            }
        },

        stop: function () {
            audio.pause();
            audio.currentTime = 0;
            if (ttsStatus) ttsStatus.textContent = 'Stopped';
            if (progressFill) progressFill.style.width = '0%';
            if (timeDisplay) timeDisplay.textContent = '0:00 / 0:00';
        },

        replaySection: function (sectionId) {
            this.listenSection(sectionId);
        },

        isCurrentlyPlaying: function () {
            return !audio.paused;
        },

        getCurrentSection: function () {
            return currentSection;
        }
    };

    /* ─── Bottom panel button handlers ─── */
    const ttsPlay  = document.getElementById('ttsPlay');
    const ttsPause = document.getElementById('ttsPause');
    const ttsStop  = document.getElementById('ttsStop');

    if (ttsPlay)  ttsPlay.addEventListener('click', function () {
        if (audio.paused && currentSection) audioControls.resume();
        else audioControls.play();
    });
    if (ttsPause) ttsPause.addEventListener('click', function () { audioControls.pause(); });
    if (ttsStop)  ttsStop.addEventListener('click', function ()  { audioControls.stop(); });

    /* ─── Expose globally ─── */
    window.audioControls = audioControls;
})();
