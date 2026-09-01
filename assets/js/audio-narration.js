/**
 * The Pixel Story: Web Audio Synthesizer & Voice Narration Engine
 * Enhancement 7: Zero-dependency sound effects and browser-native voice narration.
 */

(function () {
  'use strict';

  // State
  var soundEnabled = localStorage.getItem('pixel_sfx_enabled') !== 'false';
  var isSpeaking = false;
  var audioCtx = null;

  // Initialize Audio Context on demand (handles browser autoplay policy)
  function getAudioContext() {
    if (!audioCtx) {
      var AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  // ---------- 🎵 Web Audio Synthesizer ----------
  var PixelAudio = {
    playClick: function () {
      if (!soundEnabled) return;
      try {
        var ctx = getAudioContext();
        if (!ctx) return;

        var osc = ctx.createOscillator();
        var gain = ctx.createGain();
        var now = ctx.currentTime;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(150, now + 0.04);

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.045);
      } catch (e) {}
    },

    playStep: function (stepIdx, totalSteps) {
      if (!soundEnabled) return;
      try {
        var ctx = getAudioContext();
        if (!ctx) return;

        totalSteps = totalSteps || 5;
        // Pentatonic scale frequencies [C5, D5, E5, G5, A5, C6]
        var scale = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50];
        var freq = scale[Math.min(stepIdx, scale.length - 1)] || 523.25;

        var osc = ctx.createOscillator();
        var gain = ctx.createGain();
        var now = ctx.currentTime;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.13);
      } catch (e) {}
    },

    playSuccess: function () {
      if (!soundEnabled) return;
      try {
        var ctx = getAudioContext();
        if (!ctx) return;

        var notes = [523.25, 659.25, 783.99, 1046.50]; // C - E - G - C arpeggio
        notes.forEach(function (freq, i) {
          var now = ctx.currentTime + i * 0.07;
          var osc = ctx.createOscillator();
          var gain = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now);

          gain.gain.setValueAtTime(0.12, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now);
          osc.stop(now + 0.3);
        });
      } catch (e) {}
    },

    playDing: function () {
      if (!soundEnabled) return;
      try {
        var ctx = getAudioContext();
        if (!ctx) return;

        var now = ctx.currentTime;
        var osc = ctx.createOscillator();
        var oscHarmonic = ctx.createOscillator();
        var gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(1174.66, now); // D6

        oscHarmonic.type = 'sine';
        oscHarmonic.frequency.setValueAtTime(2349.32, now); // D7

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

        osc.connect(gain);
        oscHarmonic.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        oscHarmonic.start(now);
        osc.stop(now + 0.52);
        oscHarmonic.stop(now + 0.52);
      } catch (e) {}
    }
  };

  window.PixelAudio = PixelAudio;

  // ---------- 🗣️ Web Speech API Narration ----------
  var PixelNarration = {
    stop: function () {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      isSpeaking = false;
      updateUI();
    },

    speakCurrentStep: function () {
      if (!('speechSynthesis' in window)) {
        alert('Voice narration is not supported in this browser.');
        return;
      }

      window.speechSynthesis.cancel();

      var titleEl = document.getElementById('stepTitle');
      var descEl = document.getElementById('stepDescription');
      var bubbleEl = document.getElementById('stageBubbleBadge');

      var textToSpeak = '';
      if (titleEl) textToSpeak += titleEl.textContent + '. ';
      if (descEl) textToSpeak += descEl.textContent + ' ';
      if (bubbleEl && bubbleEl.textContent.trim()) {
        textToSpeak += 'Pixel says: ' + bubbleEl.textContent.replace(/[\u{1F600}-\u{1F64F}|\u{1F300}-\u{1F5FF}|\u{1F680}-\u{1F6FF}|\u{2600}-\u{26FF}|\u{2700}-\u{27BF}]/gu, '');
      }

      if (!textToSpeak.trim()) return;

      var utterance = new SpeechSynthesisUtterance(textToSpeak.trim());
      utterance.rate = 0.96;
      utterance.pitch = 1.05;

      var voices = window.speechSynthesis.getVoices();
      var preferredVoice = voices.find(function (v) {
        return (v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Female')));
      }) || voices.find(function (v) {
        return v.lang.startsWith('en');
      });

      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onstart = function () {
        isSpeaking = true;
        updateUI();
      };

      utterance.onend = function () {
        isSpeaking = false;
        updateUI();
      };

      utterance.onerror = function () {
        isSpeaking = false;
        updateUI();
      };

      window.speechSynthesis.speak(utterance);
    }
  };

  window.PixelNarration = PixelNarration;

  // ---------- 🎛️ Floating Audio Controls UI ----------
  function injectAudioControls() {
    var storyCard = document.querySelector('.story-card');
    if (!storyCard) return;

    if (document.getElementById('pixelAudioControls')) return;

    var wrap = document.createElement('div');
    wrap.id = 'pixelAudioControls';
    wrap.className = 'audio-controls-pill';
    wrap.innerHTML = '' +
      '<button type="button" class="audio-btn" id="pixelSfxToggle" aria-label="Toggle Sound Effects" title="Toggle Sound Effects">' +
        '<span class="audio-icon" id="pixelSfxIcon">' + (soundEnabled ? '🔊' : '🔇') + '</span>' +
        '<span class="audio-label" id="pixelSfxLabel">' + (soundEnabled ? 'SFX On' : 'Muted') + '</span>' +
      '</button>' +
      '<div class="audio-divider"></div>' +
      '<button type="button" class="audio-btn" id="pixelNarrateBtn" aria-label="Read Step Aloud" title="Read Step Aloud">' +
        '<span class="audio-icon" id="pixelNarrateIcon">🎧</span>' +
        '<span class="audio-label" id="pixelNarrateLabel">Read Aloud</span>' +
        '<span class="audio-wave-anim" id="pixelAudioWave" style="display:none;">' +
          '<span></span><span></span><span></span>' +
        '</span>' +
      '</button>';

    var stage = storyCard.querySelector('.story-stage');
    if (stage) {
      stage.style.position = 'relative';
      stage.appendChild(wrap);
    }

    var sfxToggle = document.getElementById('pixelSfxToggle');
    if (sfxToggle) {
      sfxToggle.addEventListener('click', function (e) {
        e.stopPropagation();
        soundEnabled = !soundEnabled;
        localStorage.setItem('pixel_sfx_enabled', soundEnabled);
        if (soundEnabled) {
          PixelAudio.playDing();
        }
        updateUI();
      });
    }

    var narrateBtn = document.getElementById('pixelNarrateBtn');
    if (narrateBtn) {
      narrateBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        if (isSpeaking) {
          PixelNarration.stop();
        } else {
          PixelNarration.speakCurrentStep();
        }
      });
    }
  }

  function updateUI() {
    var sfxIcon = document.getElementById('pixelSfxIcon');
    var sfxLabel = document.getElementById('pixelSfxLabel');
    if (sfxIcon && sfxLabel) {
      sfxIcon.textContent = soundEnabled ? '🔊' : '🔇';
      sfxLabel.textContent = soundEnabled ? 'SFX On' : 'Muted';
    }

    var narrateBtn = document.getElementById('pixelNarrateBtn');
    var narrateIcon = document.getElementById('pixelNarrateIcon');
    var narrateLabel = document.getElementById('pixelNarrateLabel');
    var wave = document.getElementById('pixelAudioWave');

    if (narrateBtn && narrateIcon && narrateLabel && wave) {
      if (isSpeaking) {
        narrateBtn.classList.add('active');
        narrateIcon.textContent = '⏹️';
        narrateLabel.textContent = 'Stop';
        wave.style.display = 'inline-flex';
      } else {
        narrateBtn.classList.remove('active');
        narrateIcon.textContent = '🎧';
        narrateLabel.textContent = 'Read Aloud';
        wave.style.display = 'none';
      }
    }
  }

  // ---------- 🔗 Hook into Stepper Interactions ----------
  function hookStepperEvents() {
    var nextBtn = document.getElementById('nextStepBtn');
    var prevBtn = document.getElementById('prevStepBtn');
    var dots = document.querySelectorAll('.step-dot, .dot-btn');

    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        var stepCounter = document.getElementById('stepCounter');
        var isLast = false;
        var stepIdx = 0;
        if (stepCounter) {
          var match = stepCounter.textContent.match(/Step\s+(\d+)\s+of\s+(\d+)/i);
          if (match) {
            stepIdx = parseInt(match[1], 10);
            isLast = stepIdx >= parseInt(match[2], 10);
          }
        }

        if (isLast) {
          PixelAudio.playSuccess();
        } else {
          PixelAudio.playStep(stepIdx);
        }

        if (isSpeaking) {
          setTimeout(function () { PixelNarration.speakCurrentStep(); }, 150);
        }
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        PixelAudio.playClick();
        if (isSpeaking) {
          setTimeout(function () { PixelNarration.speakCurrentStep(); }, 150);
        }
      });
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        PixelAudio.playStep(i);
        if (isSpeaking) {
          setTimeout(function () { PixelNarration.speakCurrentStep(); }, 150);
        }
      });
    });
  }

  function init() {
    injectAudioControls();
    hookStepperEvents();

    if ('speechSynthesis' in window && window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = function () {};
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
