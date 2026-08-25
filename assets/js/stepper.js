/* ---------- The Pixel Story: shared step-sequence engine ----------
 * See ai-story-design-guidelines.md §6.
 *
 * Every chapter page defines a FRAMES array and a small applyFrame(frame, index)
 * function that only touches that chapter's *own* SVG parts (ball position,
 * gap fill, arc widths, pupil-adjacent decor, etc). This file owns everything
 * that's identical across all chapters:
 *   - autoplay timer / prev-next / dot navigation / loop-back-to-start
 *   - the "Step X of N" label, the play/pause label, dot active states
 *   - toggling the standard <g id="ov1".."ovN" class="decor"> speech-bubble
 *     overlays on/off based on frame.ov (a frame with ov: null or an
 *     unmatched id just leaves every bubble hidden — see Chapter 9's step 4)
 *   - moving the shared #facePupil circle based on frame.pupilX (when a
 *     frame provides it)
 *   - wiring vocab ".step-ref" buttons to jump to a step and scroll the
 *     strip into view
 *   - respecting prefers-reduced-motion
 *
 * Usage (from a chapter's inline <script>):
 *   window.PixelStepper({ frames: FRAMES, applyFrame: applyFrame });
 */
(function () {
  window.PixelStepper = function PixelStepper(config) {
    var frames = config.frames || [];
    var autoMs = config.autoMs || 2600;
    var applyFrame = config.applyFrame || function () {};
    var els = config.elements || {};

    var idx = 0;
    var playing = true;
    var timer = null;

    var captionText = els.captionText || document.getElementById("captionText");
    var stepLabel = els.stepLabel || document.getElementById("stepLabel");
    var playLabel = els.playLabel || document.getElementById("playLabel");
    var dotsWrap = els.dotsWrap || document.getElementById("dots");
    var playPauseBtn = els.playPauseBtn || document.getElementById("playPauseBtn");
    var prevBtn = els.prevBtn || document.getElementById("prevBtn");
    var nextBtn = els.nextBtn || document.getElementById("nextBtn");
    var stripEl = els.stripEl || document.querySelector(".strip");
    var pupil = document.getElementById("facePupil");

    // Discover any <g id="ov1".."ovN"> overlay bubbles present on this page.
    var ovEls = {};
    Array.prototype.forEach.call(document.querySelectorAll('[id^="ov"]'), function (el) {
      if (/^ov\d+$/.test(el.id)) ovEls[el.id] = el;
    });

    for (var i = 0; i < frames.length; i++) {
      (function (i) {
        var d = document.createElement("button");
        d.type = "button";
        d.className = "dot-btn";
        d.setAttribute("aria-label", "Go to step " + (i + 1));
        d.addEventListener("click", function () { goTo(i, true); });
        dotsWrap.appendChild(d);
      })(i);
    }
    var dotEls = dotsWrap.querySelectorAll(".dot-btn");

    function render() {
      var f = frames[idx];

      if (pupil && f.pupilX !== undefined) {
        pupil.setAttribute("cx", f.pupilX);
      }
      Object.keys(ovEls).forEach(function (id) {
        ovEls[id].classList.toggle("show", id === f.ov);
      });

      applyFrame(f, idx);

      captionText.textContent = f.caption;
      stepLabel.textContent = "Step " + (idx + 1) + " of " + frames.length;
      dotEls.forEach(function (d, i) { d.classList.toggle("active", i === idx); });
      playLabel.textContent = playing ? "▶ playing" : "⏸ paused";
    }

    function goTo(next, manual) {
      idx = ((next % frames.length) + frames.length) % frames.length;
      render();
      if (manual) restartTimer();
    }

    function tick() { goTo(idx + 1, false); }

    function restartTimer() {
      if (timer) clearInterval(timer);
      if (playing) timer = setInterval(tick, autoMs);
    }

    playPauseBtn.addEventListener("click", function () {
      playing = !playing;
      playPauseBtn.textContent = playing ? "⏸ Pause" : "▶ Play";
      render();
      restartTimer();
    });
    prevBtn.addEventListener("click", function () { goTo(idx - 1, true); });
    nextBtn.addEventListener("click", function () { goTo(idx + 1, true); });

    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.querySelectorAll(".step-ref").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var step = parseInt(btn.getAttribute("data-step"), 10);
        if (!step) return;
        playing = false;
        playPauseBtn.textContent = "▶ Play";
        goTo(step - 1, true);
        if (stripEl) stripEl.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      });
    });

    // Support deep links like /chapters/01-meet-pixel/#step-4 (used by the
    // glossary page): jump straight to that step, paused, on page load.
    var hashMatch = /^#step-(\d+)$/.exec(window.location.hash);
    if (hashMatch) {
      var wantedStep = parseInt(hashMatch[1], 10);
      if (wantedStep >= 1 && wantedStep <= frames.length) {
        playing = false;
        playPauseBtn.textContent = "▶ Play";
        idx = wantedStep - 1;
        if (stripEl) stripEl.scrollIntoView({ behavior: "auto", block: "start" });
      }
    }

    render();
    restartTimer();

    return { goTo: goTo };
  };
})();
