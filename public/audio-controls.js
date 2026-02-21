/* ============================================
   OPTKAS MANUAL — AUDIO-CONTROLS.JS
   TTS engine · MP3 upload · Per-section audio
   ============================================ */

(function () {
    'use strict';

    // --- DOM ---
    const ttsToggle = document.getElementById('ttsToggle');
    const ttsPanel = document.getElementById('ttsPanel');
    const ttsStatus = document.getElementById('ttsStatus');
    const voiceSelect = document.getElementById('voiceSelect');
    const rateSlider = document.getElementById('rateSlider');
    const rateValue = document.getElementById('rateValue');
    const mp3Upload = document.getElementById('mp3Upload');

    // --- State ---
    let synth = window.speechSynthesis || null;
    let currentUtterance = null;
    let chunks = [];
    let chunkIndex = 0;
    let isPaused = false;
    let isSpeaking = false;
    let mp3Audio = null;

    // --- Toggle TTS Panel ---
    if (ttsToggle && ttsPanel) {
        ttsToggle.addEventListener('click', function () {
            ttsPanel.classList.toggle('hidden');
            ttsToggle.classList.toggle('active');
        });
    }

    // --- Populate Voices ---
    function populateVoices() {
        if (!synth || !voiceSelect) return;
        const voices = synth.getVoices();
        voiceSelect.innerHTML = '';
        voices.forEach((voice, i) => {
            const opt = document.createElement('option');
            opt.value = i;
            opt.textContent = voice.name + ' (' + voice.lang + ')';
            if (voice.default) opt.selected = true;
            voiceSelect.appendChild(opt);
        });
    }

    if (synth) {
        populateVoices();
        if (synth.onvoiceschanged !== undefined) {
            synth.onvoiceschanged = populateVoices;
        }
    }

    // --- Rate slider ---
    if (rateSlider && rateValue) {
        rateSlider.addEventListener('input', function () {
            rateValue.textContent = this.value + 'x';
        });
    }

    // --- Text Chunker (2000 char max per utterance) ---
    function chunkText(text, maxLen) {
        maxLen = maxLen || 2000;
        const result = [];
        let remaining = text;
        while (remaining.length > 0) {
            if (remaining.length <= maxLen) {
                result.push(remaining);
                break;
            }
            let breakAt = remaining.lastIndexOf('. ', maxLen);
            if (breakAt === -1 || breakAt < maxLen * 0.5) {
                breakAt = remaining.lastIndexOf(' ', maxLen);
            }
            if (breakAt === -1) breakAt = maxLen;
            result.push(remaining.substring(0, breakAt + 1));
            remaining = remaining.substring(breakAt + 1).trim();
        }
        return result;
    }

    // --- Get Section Text ---
    function getSectionText(sectionId) {
        const section = document.getElementById(sectionId);
        if (!section) return '';
        return section.innerText || section.textContent || '';
    }

    // --- Speak Chunks ---
    function speakChunks() {
        if (!synth || chunkIndex >= chunks.length) {
            setStatus('Finished');
            isSpeaking = false;
            return;
        }

        const voices = synth.getVoices();
        const selectedVoice = voiceSelect ? voices[voiceSelect.value] : null;
        const rate = rateSlider ? parseFloat(rateSlider.value) : 1;

        const utterance = new SpeechSynthesisUtterance(chunks[chunkIndex]);
        if (selectedVoice) utterance.voice = selectedVoice;
        utterance.rate = rate;

        utterance.onend = function () {
            chunkIndex++;
            speakChunks();
        };

        utterance.onerror = function () {
            setStatus('Error');
            isSpeaking = false;
        };

        currentUtterance = utterance;
        synth.speak(utterance);
        isSpeaking = true;
        setStatus('Speaking... (' + (chunkIndex + 1) + '/' + chunks.length + ')');
    }

    // --- Status ---
    function setStatus(msg) {
        if (ttsStatus) ttsStatus.textContent = msg;
    }

    // --- Global Audio Controls ---
    const audioControls = {
        // Play all text from current active section
        play: function () {
            const activeSection = document.querySelector('.section.active');
            if (!activeSection) return;
            this.listenSection(activeSection.id);
        },

        // Listen to specific section
        listenSection: function (sectionId) {
            if (!synth) {
                setStatus('TTS not supported');
                return;
            }
            synth.cancel();
            isPaused = false;
            const text = getSectionText(sectionId);
            if (!text) {
                setStatus('No content');
                return;
            }
            chunks = chunkText(text);
            chunkIndex = 0;
            speakChunks();

            // Show panel
            if (ttsPanel) ttsPanel.classList.remove('hidden');
            if (ttsToggle) ttsToggle.classList.add('active');
        },

        // Pause
        pause: function () {
            if (synth && isSpeaking) {
                synth.pause();
                isPaused = true;
                setStatus('Paused');
            }
        },

        pauseSection: function () {
            this.pause();
        },

        // Resume
        resume: function () {
            if (synth && isPaused) {
                synth.resume();
                isPaused = false;
                setStatus('Resumed');
            }
        },

        // Stop
        stop: function () {
            if (synth) {
                synth.cancel();
                isSpeaking = false;
                isPaused = false;
                chunks = [];
                chunkIndex = 0;
                setStatus('Stopped');
            }
            if (mp3Audio) {
                mp3Audio.pause();
                mp3Audio.currentTime = 0;
            }
        },

        // Replay section
        replaySection: function (sectionId) {
            this.listenSection(sectionId);
        }
    };

    // --- TTS Panel Button Handlers ---
    const btnPlay = document.getElementById('ttsPlay');
    const btnPause = document.getElementById('ttsPause');
    const btnStop = document.getElementById('ttsStop');

    if (btnPlay) btnPlay.addEventListener('click', function () {
        if (isPaused) {
            audioControls.resume();
        } else {
            audioControls.play();
        }
    });
    if (btnPause) btnPause.addEventListener('click', function () { audioControls.pause(); });
    if (btnStop) btnStop.addEventListener('click', function () { audioControls.stop(); });

    // --- MP3 Upload ---
    if (mp3Upload) {
        mp3Upload.addEventListener('change', function (e) {
            const file = e.target.files[0];
            if (!file) return;

            // Stop any TTS
            if (synth) synth.cancel();

            const url = URL.createObjectURL(file);
            mp3Audio = new Audio(url);
            mp3Audio.play();
            setStatus('Playing: ' + file.name);

            mp3Audio.addEventListener('ended', function () {
                setStatus('Finished: ' + file.name);
                URL.revokeObjectURL(url);
            });
        });
    }

    // --- Expose Globally ---
    window.audioControls = audioControls;

})();
