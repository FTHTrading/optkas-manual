/* ============================================
   OPTKAS MANUAL — AUDIO-CONTROLS.JS
   MP3 Narration Engine · Pre-generated Neural Voice
   Voice: en-US-AndrewNeural (Microsoft Edge Neural TTS)
   ============================================ */

(function () {
    'use strict';

    // --- MP3 Mapping (section ID → audio path) ---
    var AUDIO_MAP = {
        executive:  '../audio/01-executive-overview.mp3',
        legal:      '../audio/02-legal-control.mp3',
        custody:    '../audio/03-custody-banking.mp3',
        settlement: '../audio/04-settlement.mp3',
        assets:     '../audio/05-asset-issuance.mp3',
        automation: '../audio/06-automation-engines.mp3',
        evidence:   '../audio/07-ledger-evidence.mp3',
        risk:       '../audio/08-risk-analytics.mp3',
        workflows:  '../audio/09-operations-workflows.mp3',
        revenue:    '../audio/10-revenue-model.mp3',
        boundaries: '../audio/11-boundaries.mp3',
        committee:  '../audio/12-credit-committee.mp3'
    };

    // --- DOM ---
    var ttsToggle    = document.getElementById('ttsToggle');
    var ttsPanel     = document.getElementById('ttsPanel');
    var ttsStatus    = document.getElementById('ttsStatus');
    var progressBar  = document.getElementById('audioProgressBar');
    var progressFill = document.getElementById('audioProgressFill');
    var timeDisplay  = document.getElementById('audioTimeDisplay');

    // --- State ---
    var audio = new Audio();
    var currentSection = null;
    var isPlaying = false;

    audio.preload = 'auto';

    // --- Format mm:ss ---
    function fmtTime(s) {
        if (!s || isNaN(s)) return '0:00';
        var m = Math.floor(s / 60);
        var sec = Math.floor(s % 60);
        return m + ':' + (sec < 10 ? '0' : '') + sec;
    }

    // --- Update progress bar & time ---
    function updateProgress() {
        if (!audio.duration) return;
        var pct = (audio.currentTime / audio.duration) * 100;
        if (progressFill) progressFill.style.width = pct + '%';
        if (timeDisplay) timeDisplay.textContent = fmtTime(audio.currentTime) + ' / ' + fmtTime(audio.duration);
    }

    audio.addEventListener('timeupdate', updateProgress);

    audio.addEventListener('ended', function () {
        isPlaying = false;
        setStatus('Finished');
        updateSectionButtons();
        // Notify training mode for auto-advance
        if (window.trainingAutoAdvance) {
            window.trainingAutoAdvance();
        }
    });

    audio.addEventListener('error', function () {
        setStatus('Audio unavailable');
        isPlaying = false;
        updateSectionButtons();
    });

    // --- Seek via progress bar click ---
    if (progressBar) {
        progressBar.addEventListener('click', function (e) {
            if (!audio.duration) return;
            var rect = this.getBoundingClientRect();
            var pct = (e.clientX - rect.left) / rect.width;
            audio.currentTime = pct * audio.duration;
        });
    }

    // --- Toggle audio panel visibility ---
    if (ttsToggle && ttsPanel) {
        ttsToggle.addEventListener('click', function () {
            ttsPanel.classList.toggle('hidden');
            ttsToggle.classList.toggle('active');
        });
    }

    // --- Status text ---
    function setStatus(msg) {
        if (ttsStatus) ttsStatus.textContent = msg;
    }

    // --- Update per-section play/pause button visibility ---
    function updateSectionButtons() {
        document.querySelectorAll('.audio-section-controls').forEach(function (ctrl) {
            var sid = ctrl.getAttribute('data-section');
            var playBtn  = ctrl.querySelector('.audio-btn-play');
            var pauseBtn = ctrl.querySelector('.audio-btn-pause');

            if (sid === currentSection && isPlaying) {
                if (playBtn)  playBtn.style.display = 'none';
                if (pauseBtn) pauseBtn.style.display = '';
            } else {
                if (playBtn)  playBtn.style.display = '';
                if (pauseBtn) pauseBtn.style.display = 'none';
            }
        });
    }

    // --- Core Audio Controls API ---
    var audioControls = {

        play: function () {
            var activeSection = document.querySelector('.section.active');
            if (!activeSection) return;
            this.listenSection(activeSection.id);
        },

        listenSection: function (sectionId) {
            var src = AUDIO_MAP[sectionId];
            if (!src) {
                setStatus('No audio for this section');
                return;
            }

            // Same section paused → resume
            if (currentSection === sectionId && audio.paused && audio.currentTime > 0) {
                audio.play();
                isPlaying = true;
                setStatus('Playing: ' + sectionId);
                updateSectionButtons();
                if (ttsPanel) ttsPanel.classList.remove('hidden');
                if (ttsToggle) ttsToggle.classList.add('active');
                return;
            }

            // Load & play new section
            currentSection = sectionId;
            audio.src = src;
            audio.load();
            audio.play().catch(function () {
                setStatus('Click to enable audio');
            });
            isPlaying = true;
            setStatus('Playing: ' + sectionId);
            updateSectionButtons();

            if (progressFill) progressFill.style.width = '0%';
            if (timeDisplay) timeDisplay.textContent = '0:00 / 0:00';

            if (ttsPanel) ttsPanel.classList.remove('hidden');
            if (ttsToggle) ttsToggle.classList.add('active');
        },

        pause: function () {
            if (!audio.paused) {
                audio.pause();
                isPlaying = false;
                setStatus('Paused');
                updateSectionButtons();
            }
        },

        pauseSection: function () {
            this.pause();
        },

        resume: function () {
            if (audio.paused && audio.currentTime > 0) {
                audio.play();
                isPlaying = true;
                setStatus('Playing: ' + currentSection);
                updateSectionButtons();
            }
        },

        togglePlayPause: function (sectionId) {
            if (currentSection === sectionId && isPlaying) {
                this.pause();
            } else {
                this.listenSection(sectionId);
            }
        },

        stop: function () {
            audio.pause();
            audio.currentTime = 0;
            isPlaying = false;
            currentSection = null;
            setStatus('Stopped');
            updateSectionButtons();
            if (progressFill) progressFill.style.width = '0%';
            if (timeDisplay) timeDisplay.textContent = '0:00 / 0:00';
        },

        replaySection: function (sectionId) {
            currentSection = null;
            this.listenSection(sectionId);
        },

        isCurrentlyPlaying: function () { return isPlaying; },
        getCurrentSection: function () { return currentSection; }
    };

    // --- Bottom panel button handlers ---
    var btnPlay  = document.getElementById('ttsPlay');
    var btnPause = document.getElementById('ttsPause');
    var btnStop  = document.getElementById('ttsStop');

    if (btnPlay) btnPlay.addEventListener('click', function () {
        if (audio.paused && audio.currentTime > 0) {
            audioControls.resume();
        } else {
            audioControls.play();
        }
    });
    if (btnPause) btnPause.addEventListener('click', function () { audioControls.pause(); });
    if (btnStop)  btnStop.addEventListener('click', function ()  { audioControls.stop(); });

    // --- Expose globally ---
    window.audioControls = audioControls;

})();
