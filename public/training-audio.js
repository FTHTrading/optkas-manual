/* ============================================
   OPTKAS — TRAINING ACADEMY AUDIO.JS
   MP3 Narration Engine for 8 Training Modules
   Voice: en-US-AndrewNeural (Microsoft Edge Neural TTS)
   ============================================ */

(function () {
    'use strict';

    // --- MP3 Mapping (module ID → audio path) ---
    var AUDIO_MAP = {
        mod1: '../audio/training/mod1-what-is-xrpl.mp3',
        mod2: '../audio/training/mod2-core-features.mp3',
        mod3: '../audio/training/mod3-what-optkas-built.mp3',
        mod4: '../audio/training/mod4-beyond-the-bond.mp3',
        mod5: '../audio/training/mod5-offering-services.mp3',
        mod6: '../audio/training/mod6-using-the-ledger.mp3',
        mod7: '../audio/training/mod7-technical-deep-dive.mp3',
        mod8: '../audio/training/mod8-stellar-crosschain.mp3'
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
    var currentModule = null;
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
        // Notify training-app.js for auto-advance
        if (window.trainingAutoAdvance) {
            window.trainingAutoAdvance();
        }
    });

    audio.addEventListener('error', function () {
        setStatus('Audio unavailable');
        isPlaying = false;
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

    // --- Core Audio Controls API ---
    var audioControls = {

        play: function () {
            var activeSection = document.querySelector('.section.active');
            if (!activeSection) return;
            this.listenSection(activeSection.id);
        },

        listenSection: function (moduleId) {
            var src = AUDIO_MAP[moduleId];
            if (!src) {
                setStatus('No audio for this module');
                return;
            }

            // Same module paused → resume
            if (currentModule === moduleId && audio.paused && audio.currentTime > 0) {
                audio.play();
                isPlaying = true;
                setStatus('Playing: Module ' + moduleId.replace('mod', ''));
                if (ttsPanel) ttsPanel.classList.remove('hidden');
                if (ttsToggle) ttsToggle.classList.add('active');
                return;
            }

            // Load & play new module
            currentModule = moduleId;
            audio.src = src;
            audio.load();
            audio.play().catch(function () {
                setStatus('Click to enable audio');
            });
            isPlaying = true;
            setStatus('Playing: Module ' + moduleId.replace('mod', ''));

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
            }
        },

        resume: function () {
            if (audio.paused && audio.currentTime > 0) {
                audio.play();
                isPlaying = true;
                setStatus('Playing: Module ' + (currentModule ? currentModule.replace('mod', '') : ''));
            }
        },

        togglePlayPause: function (moduleId) {
            if (currentModule === moduleId && isPlaying) {
                this.pause();
            } else {
                this.listenSection(moduleId);
            }
        },

        stop: function () {
            audio.pause();
            audio.currentTime = 0;
            isPlaying = false;
            currentModule = null;
            setStatus('Stopped');
            if (progressFill) progressFill.style.width = '0%';
            if (timeDisplay) timeDisplay.textContent = '0:00 / 0:00';
        },

        replaySection: function (moduleId) {
            currentModule = null;
            this.listenSection(moduleId);
        },

        isCurrentlyPlaying: function () { return isPlaying; },
        getCurrentSection: function () { return currentModule; }
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
