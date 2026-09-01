/**
 * The Pixel Story — "Pixel's Brain Evolution" Continuity Engine
 * 
 * Renders an interactive, responsive continuity bar tracking Pixel's 18 evolutionary
 * upgrades across the curriculum, showing past unlocked tools, current chapter upgrade,
 * and future milestone previews.
 */
(function() {
  var BRAIN_UPGRADES = [
    {
      chapter: 1,
      slug: "01-meet-pixel",
      title: "Meet Pixel",
      upgradeName: "Single Dial (Weight & Threshold)",
      icon: "🎛️",
      ability: "Learns to turn a single knob to classify clues (Cookies vs Rocks)."
    },
    {
      chapter: 2,
      slug: "13-pixel-guesses-a-number",
      title: "Pixel Guesses a Number",
      upgradeName: "Best-Fit Ruler (Linear Regression)",
      icon: "📈",
      ability: "Estimates continuous bounce heights using lines of best fit."
    },
    {
      chapter: 3,
      slug: "02-pixel-takes-a-shot",
      title: "Pixel Takes a Shot",
      upgradeName: "Multi-Joint Arm (Backpropagation)",
      icon: "🦾",
      ability: "Works backwards from mistakes through multiple joints to hit targets."
    },
    {
      chapter: 4,
      slug: "03-pixel-learns-to-see",
      title: "Pixel Learns to See",
      upgradeName: "3×3 Glass Filter (CNN Vision)",
      icon: "👁️",
      ability: "Scans images patch-by-patch to detect edges and shapes."
    },
    {
      chapter: 5,
      slug: "04-pixel-reads-a-torn-up-book",
      title: "Pixel Reads a Torn-Up Book",
      upgradeName: "Word-Mask Decoder (Self-Supervised)",
      icon: "📖",
      ability: "Pretrains world grammar by guessing missing words in torn pages."
    },
    {
      chapter: 6,
      slug: "05-pixel-learns-to-listen-to-everyone",
      title: "Pixel Listens to Everyone",
      upgradeName: "Attention Spotlights (Transformers)",
      icon: "🔦",
      ability: "Shines attention beams across all words at once to resolve context."
    },
    {
      chapter: 7,
      slug: "06-pixel-becomes-a-know-it-all",
      title: "Pixel Becomes a Know-It-All",
      upgradeName: "Next-Word Quill (Autoregressive LLM)",
      icon: "✍️",
      ability: "Generates stories and poems token-by-token in a continuous loop."
    },
    {
      chapter: 8,
      slug: "14-pixel-opens-for-business",
      title: "Pixel Opens for Business",
      upgradeName: "Chef's Fork & Self-Play (RLHF & Synthetic Data)",
      icon: "👨‍🍳",
      ability: "Refines knowledge via human feedback and generates synthetic tests."
    },
    {
      chapter: 9,
      slug: "11-pixel-needs-a-bigger-brain",
      title: "Pixel Needs a Bigger Brain",
      upgradeName: "GPU Turbine & TinyML (Compute & Quantization)",
      icon: "⚡",
      ability: "Harnesses massive parallel GPU clusters and compresses weights for on-device AI."
    },
    {
      chapter: 10,
      slug: "07-pixel-embarrasses-itself",
      title: "Pixel Embarrasses Itself",
      upgradeName: "Thinking Scratchpad (Test-Time Compute)",
      icon: "💭",
      ability: "Generates private reasoning tokens and backtracks to eliminate hallucinations."
    },
    {
      chapter: 11,
      slug: "10-pixel-meets-a-robot-who-lies",
      title: "Pixel Meets a Robot Who Lies",
      upgradeName: "Safety Guardrails (Bias & Alignment)",
      icon: "🛡️",
      ability: "Detects hidden bias, passes red-teaming, and stays safe."
    },
    {
      chapter: 12,
      slug: "08-pixel-starts-watching",
      title: "Pixel Starts Watching",
      upgradeName: "Motion Projector (World Models / JEPA)",
      icon: "🎬",
      ability: "Learns common-sense physics by predicting video trajectories."
    },
    {
      chapter: 13,
      slug: "15-pixel-gets-to-work",
      title: "Pixel Gets to Work",
      upgradeName: "Action Toolbelt (Agentic AI)",
      icon: "🛠️",
      ability: "Runs autonomous Observe ➔ Act ➔ Inspect loops using external tools."
    },
    {
      chapter: 14,
      slug: "09-pixel-visits-the-hospital",
      title: "Pixel Visits the Hospital",
      upgradeName: "Medical Scanner (Applied AI)",
      icon: "🩺",
      ability: "Triages medical scans with human-in-the-loop accuracy."
    },
    {
      chapter: 15,
      slug: "16-pixel-learns-to-paint",
      title: "Pixel Learns to Paint",
      upgradeName: "Denoising Brush (Diffusion Models)",
      icon: "🎨",
      ability: "Sculpts high-definition art out of pure TV static step-by-step."
    },
    {
      chapter: 16,
      slug: "17-pixel-goes-to-the-library",
      title: "Pixel Goes to the Library",
      upgradeName: "Vector Index Card (RAG Embeddings)",
      icon: "📇",
      ability: "Retrieves fresh, factual open-book facts with zero hallucination."
    },
    {
      chapter: 17,
      slug: "18-pixel-sees-hears-and-speaks",
      title: "Pixel Sees, Hears & Speaks",
      upgradeName: "Omni-Sensory Array (Multimodal AI)",
      icon: "🎧",
      ability: "Processes voice tone, images, and speech seamlessly in real time."
    },
    {
      chapter: 18,
      slug: "12-what-pixel-means-for-you",
      title: "What Pixel Means for You",
      upgradeName: "Graduation Cap (AI Mastery)",
      icon: "🎓",
      ability: "Graduates into a full AI partner ready to co-create with humans."
    }
  ];

  window.PIXEL_BRAIN_UPGRADES = BRAIN_UPGRADES;

  var REAL_WORLD_CALLOUTS = [
    {
      chapter: 1,
      appName: "Email Spam Filters & Fraud Detection 🛡️",
      tags: ["Gmail Spam Filter", "Stripe Radar", "Credit Card Alerts"],
      desc: "Every time your email inbox sorts a suspicious message into the 'Spam' folder, or your bank flags an unusual transaction, a single artificial neuron is calculating weights on clues (like unfamiliar sender domains or odd dollar amounts) to make a split-second classification decision."
    },
    {
      chapter: 2,
      appName: "Uber Ride Estimates & Zillow Home Values 🚗",
      tags: ["Uber ETA", "Zillow Zestimate", "Weather Temperature"],
      desc: "When Uber predicts your driver will arrive in exactly 6 minutes, or Zillow estimates a home's market value, it uses linear regression to fit a mathematical line through millions of past data points (traffic, distance, square footage) to predict a continuous number."
    },
    {
      chapter: 3,
      appName: "AlphaZero & Robotics Motion Control 🦾",
      tags: ["DeepMind AlphaZero", "Stockfish Chess", "Robotics Arms"],
      desc: "When DeepMind's AlphaZero taught itself to master Chess and Go in just 4 hours, it played millions of games against itself. Whenever it lost, backpropagation calculated error gradients backward through multi-layer neural joints to adjust its strategy for the next game."
    },
    {
      chapter: 4,
      appName: "Apple FaceID, Google Lens & Tesla Vision 👁️",
      tags: ["Apple FaceID", "Google Lens", "Tesla Autopilot Vision"],
      desc: "When you unlock your iPhone with your face, search for a dog breed using Google Lens, or when a Tesla car detects stop signs in heavy rain, 2D convolutional filters are sliding across small pixel patches to extract edges and shapes in real-time."
    },
    {
      chapter: 5,
      appName: "Google Search Query Understanding (BERT) 🔍",
      tags: ["Google Search BERT", "Grammarly", "Smart Autocomplete"],
      desc: "When you type a confusing question into Google Search, the search engine uses BERT (trained by guessing masked words in torn pages) to understand the subtle intent and syntax behind your words, rather than just matching keyword strings."
    },
    {
      chapter: 6,
      appName: "ChatGPT, Claude, Gemini & DeepL Translator ⚡",
      tags: ["ChatGPT", "Claude", "Google Gemini", "DeepL Translate"],
      desc: "Before Transformers, translation tools translated word-by-word and lost the context. Self-attention spotlights allow modern AI like ChatGPT, Claude, and DeepL to connect words across paragraphs and translate complex idioms with human-level accuracy."
    },
    {
      chapter: 7,
      appName: "GitHub Copilot & Cursor Code Generation 💻",
      tags: ["GitHub Copilot", "Cursor IDE", "Gmail Smart Compose"],
      desc: "When GitHub Copilot writes the next 10 lines of code as you type, or Gmail suggests the rest of your sentence, it runs Pixel's autoregressive loop—predicting one token at a time and feeding it right back into the prompt in an continuous generation cycle."
    },
    {
      chapter: 8,
      appName: "AI Assistants & Synthetic Practice Data 👨‍🍳",
      tags: ["OpenAI RLHF", "Anthropic Constitutional AI", "Synthetic Self-Play"],
      desc: "When you ask an AI assistant for advice, RLHF is why it answers politely, avoids dangerous instructions, and formats answers cleanly. When human data runs out, models create synthetic practice exams to train further via self-play."
    },
    {
      chapter: 9,
      appName: "Apple Intelligence & On-Device TinyML 📱",
      tags: ["Apple Intelligence", "Gemini Nano", "NVIDIA H100 Clusters"],
      desc: "While giant models are trained in gigawatt GPU data centers, Quantization allows compressed 4-bit models to run directly on your smartphone (like Apple Intelligence or Google's Gemini Nano) without internet and with total privacy."
    },
    {
      chapter: 10,
      appName: "OpenAI o1/o3 & DeepSeek R1 Reasoning 💭",
      tags: ["OpenAI o1/o3", "DeepSeek R1", "Math & Code Solvers"],
      desc: "When solving advanced Olympiad math problems or debugging complex software code, reasoning models pause for 5–30 seconds. They generate hidden thinking tokens on a scratchpad and backtrack if they detect a logic error before speaking."
    },
    {
      chapter: 11,
      appName: "Adversarial Red-Teaming & Fair Lending AI 🛡️",
      tags: ["Adversarial Red-Teaming", "Fair Lending AI", "Llama Guard"],
      desc: "Tech companies hire 'Red Teams' of security researchers to deliberately try to trick AI into misbehaving. This guarantees hiring algorithms and bank-loan models don't discriminate against applicants based on postal codes or gender."
    },
    {
      chapter: 12,
      appName: "Waymo Self-Driving & Humanoid Robots 🎬",
      tags: ["Waymo Autonomous Driving", "V-JEPA Video AI", "Figure 02 Humanoid"],
      desc: "A self-driving Waymo vehicle or a Boston Dynamics robot can't just react to what is happening right now—it runs an internal World Model to simulate the next 3 seconds of physical motion to predict if a cyclist will swerve or a ball will bounce."
    },
    {
      chapter: 13,
      appName: "Autonomous Coding Agents (Claude Code, Devin) 🛠️",
      tags: ["Claude Code", "Devin Software Engineer", "Antigravity IDE"],
      desc: "Instead of just generating text, autonomous AI agents are equipped with real tools (browsers, terminal shells, code editors). They inspect bug tickets, write code, run automated tests, and iterate until the task is completely finished."
    },
    {
      chapter: 14,
      appName: "Hospital CT Triage & AlphaFold Drug Discovery 🩺",
      tags: ["DeepMind AlphaFold", "Radiology AI Triage", "Cancer Detection"],
      desc: "Hospitals use AI to scan thousands of patient X-rays every morning, immediately escalating suspected stroke or pneumonia scans to doctors. Meanwhile, DeepMind's AlphaFold has predicted 200 million protein structures to accelerate drug cures."
    },
    {
      chapter: 15,
      appName: "Midjourney, DALL-E 3 & OpenAI Sora Video 🎨",
      tags: ["Midjourney v6", "DALL-E 3", "OpenAI Sora", "Runway Gen-3"],
      desc: "Every image generated on Midjourney and photorealistic video created by Sora starts as a screen of pure static noise. Diffusion models gradually denoise the canvas step-by-step, sculpting lighting, anatomy, and fine textures."
    },
    {
      chapter: 16,
      appName: "Perplexity AI, NotebookLM & Vector Search 📇",
      tags: ["Perplexity AI", "Google NotebookLM", "Pinecone Vector DB"],
      desc: "When you search on Perplexity or upload a 500-page textbook to Google NotebookLM, it converts text into dense vector embeddings, retrieves the exact relevant paragraphs in milliseconds, and answers questions with verified citations."
    },
    {
      chapter: 17,
      appName: "ChatGPT Advanced Voice & Google Project Astra 🎧",
      tags: ["ChatGPT Advanced Voice", "Google Project Astra", "Meta Ray-Ban AI"],
      desc: "In ChatGPT's Advanced Voice Mode or Google Project Astra, there are no separate voice-to-text steps. The native Omni model hears pitch and emotional hesitation, sees through camera feeds, and responds with sub-300ms natural conversation."
    },
    {
      chapter: 18,
      appName: "Solo AI Startups & Creative Co-Pilots 🎓",
      tags: ["Solo AI Founders", "AI Creative Studios", "Human + AI Superpower"],
      desc: "With AI mastering every layer from single neurons to multimodal agents, a single curious student or creator can now design games, write full-stack software, and build businesses that used to require a 50-person engineering team."
    }
  ];

  window.PIXEL_REAL_WORLD = REAL_WORLD_CALLOUTS;

  function renderWildCallout(container) {
    var curCh = parseInt(container.getAttribute("data-chapter"), 10) || 1;
    var item = REAL_WORLD_CALLOUTS[curCh - 1] || REAL_WORLD_CALLOUTS[0];

    var tagsHtml = item.tags.map(function(t) {
      return '<span class="wild-tag">' + t + '</span>';
    }).join('');

    var html = '' +
      '<div class="spot-in-the-wild-card">' +
        '<div class="wild-header">' +
          '<div class="wild-eyebrow"><span class="wild-dot"></span> SPOT IT IN THE WILD</div>' +
          '<h3 class="wild-app-title">' + item.appName + '</h3>' +
        '</div>' +
        '<p class="wild-desc">' + item.desc + '</p>' +
        '<div class="wild-tags-row">' +
          tagsHtml +
        '</div>' +
      '</div>';

    container.innerHTML = html;
  }

  function renderChapterEvolution(container) {
    var curCh = parseInt(container.getAttribute("data-chapter"), 10) || 1;
    var curItem = BRAIN_UPGRADES[curCh - 1] || BRAIN_UPGRADES[0];
    var progressPct = Math.round((curCh / 18) * 100);

    var html = '' +
      '<div class="brain-evolution-card">' +
        '<div class="brain-evo-header">' +
          '<div class="brain-evo-title-wrap">' +
            '<span class="brain-evo-badge">🧠 Pixel\'s Brain · Level ' + curCh + ' of 18</span>' +
            '<span class="brain-evo-stat">' + progressPct + '% Evolved</span>' +
          '</div>' +
        '</div>' +

        '<div class="brain-progress-track">' +
          '<div class="brain-progress-fill" style="width: ' + progressPct + '%;"></div>' +
        '</div>' +

        '<!-- Active Upgrade Spotlight Callout -->' +
        '<div class="brain-active-upgrade">' +
          '<div class="upgrade-icon-box">' + curItem.icon + '</div>' +
          '<div class="upgrade-info">' +
            '<div class="upgrade-label">⚡ NEW BRAIN UPGRADE UNLOCKED IN THIS CHAPTER:</div>' +
            '<div class="upgrade-name">' + curItem.upgradeName + '</div>' +
            '<div class="upgrade-desc">' + curItem.ability + '</div>' +
          '</div>' +
        '</div>' +

        '<!-- Expandable / Scrollable 18-Node Timeline -->' +
        '<div class="brain-timeline-wrap open" id="brainTimelineWrap">' +
          '<div class="brain-timeline-scroll">';

    BRAIN_UPGRADES.forEach(function(item) {
      var isCurrent = item.chapter === curCh;
      var isUnlocked = item.chapter < curCh;
      var statusClass = isCurrent ? "current" : (isUnlocked ? "unlocked" : "locked");
      var href = "/ai-story/chapters/" + item.slug + "/";

      html += '' +
        '<a href="' + href + '" class="brain-node ' + statusClass + '" title="Chapter ' + item.chapter + ': ' + item.upgradeName + '">' +
          '<div class="node-icon-circle">' +
            '<span class="node-icon">' + item.icon + '</span>' +
            (isUnlocked ? '<span class="node-check">✓</span>' : '') +
            (isCurrent ? '<span class="node-pulse"></span>' : '') +
          '</div>' +
          '<div class="node-meta">' +
            '<span class="node-num">Ch ' + (item.chapter < 10 ? '0' + item.chapter : item.chapter) + '</span>' +
            '<span class="node-tool">' + item.upgradeName.split(' (')[0] + '</span>' +
          '</div>' +
        '</a>';
    });

    html += '' +
          '</div>' +
        '</div>' +
      '</div>';

    container.innerHTML = html;

    // Auto scroll current node into view since it is always open
    var timelineWrap = container.querySelector("#brainTimelineWrap");
    if (timelineWrap) {
      var activeNode = timelineWrap.querySelector(".brain-node.current");
      if (activeNode) {
        setTimeout(function() {
          activeNode.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
        }, 100);
      }
    }
  }

  function renderHomeShowcase(container) {
    var html = '' +
      '<div class="brain-home-showcase">' +
        '<div class="showcase-header">' +
          '<div class="showcase-title-wrap">' +
            '<span class="showcase-icon">🧠⚡</span>' +
            '<div>' +
              '<h3 class="showcase-title">Pixel\'s 18 Brain Evolution Milestones</h3>' +
              '<p class="showcase-subtitle">Watch Pixel start with a single knob in 1957 and gradually assemble 18 modular cognitive superpowers.</p>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="showcase-grid">';

    BRAIN_UPGRADES.forEach(function(item) {
      var href = "/ai-story/chapters/" + item.slug + "/";
      html += '' +
        '<a href="' + href + '" class="showcase-card">' +
          '<div class="showcase-card-top">' +
            '<span class="showcase-badge">Ch ' + (item.chapter < 10 ? '0' + item.chapter : item.chapter) + '</span>' +
            '<span class="showcase-emoji">' + item.icon + '</span>' +
          '</div>' +
          '<h4 class="showcase-card-name">' + item.upgradeName + '</h4>' +
          '<p class="showcase-card-desc">' + item.ability + '</p>' +
        '</a>';
    });

    html += '' +
        '</div>' +
      '</div>';

    container.innerHTML = html;
  }

  // Auto-run on DOM ready
  function init() {
    var chapterContainers = document.querySelectorAll("#pixelBrainEvolution, [data-brain-evolution]");
    chapterContainers.forEach(function(c) { renderChapterEvolution(c); });

    var wildContainers = document.querySelectorAll("#spotInTheWild, [data-spot-in-the-wild]");
    wildContainers.forEach(function(c) { renderWildCallout(c); });

    var homeShowcases = document.querySelectorAll("#pixelBrainHomeShowcase");
    homeShowcases.forEach(function(c) { renderHomeShowcase(c); });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
