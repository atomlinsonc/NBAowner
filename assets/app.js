(function () {
  const STORAGE_KEY = "cognitive_bias_arcade_v1";
  const TOTAL_GAMES = 12;
  const app = document.getElementById("app");
  const hudScore = document.getElementById("hudScore");
  const hudCompleted = document.getElementById("hudCompleted");
  const hudMode = document.getElementById("hudMode");
  const resetBtn = document.getElementById("resetBtn");

  const biasInfo = {
    action: {
      label: "Action Bias",
      definition:
        "Action bias is the urge to do something immediately, even when waiting for better evidence would be smarter.",
      why: "Fast action can feel safer than uncertainty, so your brain mistakes movement for control.",
      examples: [
        "School: You rewrite your whole study plan after one bad quiz instead of checking patterns first.",
        "Sports: A coach burns timeouts early because momentum feels scary, even when the lineup is fine."
      ],
      tip: "Pause for 10 seconds and ask: 'What evidence would make waiting the best move?'"
    },
    anchoring: {
      label: "Anchoring",
      definition:
        "Anchoring happens when the first number you see pulls your judgment, even if it is random or extreme.",
      why: "Brains love quick reference points, so first numbers become mental magnets.",
      examples: [
        "Money: A store shows a fake 'original price' so the sale feels amazing.",
        "School: You hear one classmate's test score first and then judge the whole exam by that anchor."
      ],
      tip: "Generate your own estimate before looking at any suggested number."
    },
    confirmation: {
      label: "Confirmation Bias",
      definition:
        "Confirmation bias is favoring information that supports your current belief while ignoring disconfirming evidence.",
      why: "Agreeing evidence feels fluent and rewarding, while conflicting evidence creates mental friction.",
      examples: [
        "Social media: You click posts that match your opinion and skip the rest.",
        "School: You choose sources that support your thesis and avoid sources that challenge it."
      ],
      tip: "Require at least one strong source that could prove you wrong before deciding."
    },
    sunk: {
      label: "Sunk Cost Fallacy",
      definition:
        "Sunk cost fallacy is continuing a plan mainly because you already spent time, effort, or money on it.",
      why: "Quitting feels like admitting loss, so your brain protects past effort instead of future outcomes.",
      examples: [
        "School: You keep grinding a weak project idea because you already spent all weekend on it.",
        "Money: You watch a terrible movie to the end because you paid for the ticket."
      ],
      tip: "Decide based on the next hour, not the last hour."
    },
    loss: {
      label: "Loss Aversion",
      definition:
        "Loss aversion means losses feel more painful than equivalent gains feel good, skewing your choices.",
      why: "Avoiding danger helped survival, so losses trigger stronger emotional alarms than gains.",
      examples: [
        "Investing: You hold a losing stock too long to avoid realizing a loss.",
        "Everyday life: You drive farther to save $5 but ignore earning $5 in a faster way."
      ],
      tip: "Reframe every choice as total expected value, not 'win vs lose' language."
    },
    survivorship: {
      label: "Survivorship Bias",
      definition:
        "Survivorship bias is focusing on visible winners while missing the many unseen failures.",
      why: "Success stories are loud and memorable; failure data is quiet and often hidden.",
      examples: [
        "Social media: You see creators who blew up, not the thousands who posted with no traction.",
        "Sports: You copy one superstar routine without seeing who did the same routine and never made varsity."
      ],
      tip: "Always ask: 'What does the full denominator look like, including failures?'"
    }
  };

  const games = [
    { id: "A1", bias: "action", title: "Crisis Dashboard", cabinetTone: "cab-a", run: runActionCrisis, debriefQ: {
      question: "When metrics are noisy and near normal, what is usually best first?",
      options: ["Monitor and gather another data point", "Intervene immediately", "Escalate to the whole company"],
      correct: 0
    } },
    { id: "A2", bias: "action", title: "Timeout Fever", cabinetTone: "cab-b", run: runActionTimeout, debriefQ: {
      question: "What sign suggests action bias in coaching?",
      options: ["Intervening every run against your team", "Using context before deciding", "Saving one timeout for late game"],
      correct: 0
    } },
    { id: "B1", bias: "anchoring", title: "The Price Is... Stuck", cabinetTone: "cab-c", run: runAnchoringPrice, debriefQ: {
      question: "Best way to reduce anchoring when estimating value?",
      options: ["Write your estimate before seeing suggested prices", "Use the first number you hear", "Average all random numbers"],
      correct: 0
    } },
    { id: "B2", bias: "anchoring", title: "First Offer Negotiation", cabinetTone: "cab-a", run: runAnchoringNegotiation, debriefQ: {
      question: "In negotiation, why does the first offer matter?",
      options: ["It can set the reference range for later offers", "It guarantees the final price", "It only matters in sports trades"],
      correct: 0
    } },
    { id: "C1", bias: "confirmation", title: "Newsfeed Builder", cabinetTone: "cab-b", run: runConfirmationNewsfeed, debriefQ: {
      question: "Which search strategy improves claim accuracy?",
      options: ["Open both supporting and opposing high-quality evidence", "Open only evidence that agrees with you", "Trust recommendation labels"],
      correct: 0
    } },
    { id: "C2", bias: "confirmation", title: "Detective: Disconfirming Tests", cabinetTone: "cab-c", run: runConfirmationDetective, debriefQ: {
      question: "A disconfirming test is one that...",
      options: ["Could prove your favorite suspect wrong", "Only confirms your suspect", "Costs the fewest investigation points"],
      correct: 0
    } },
    { id: "D1", bias: "sunk", title: "Theme Park Day", cabinetTone: "cab-a", run: runSunkThemePark, debriefQ: {
      question: "Sunk costs should be treated as...",
      options: ["Past costs that should not control future decisions", "Reasons to double down", "A sign you must finish"],
      correct: 0
    } },
    { id: "D2", bias: "sunk", title: "Project Deadline Trap", cabinetTone: "cab-b", run: runSunkProject, debriefQ: {
      question: "If a plan keeps failing and time is short, best move is usually...",
      options: ["Pivot to a higher-probability path", "Keep fixing because you already worked hard", "Ignore help to stay independent"],
      correct: 0
    } },
    { id: "E1", bias: "loss", title: "Coin Flip Insurance", cabinetTone: "cab-c", run: runLossCoinFlip, debriefQ: {
      question: "Loss aversion often causes people to...",
      options: ["Overweight avoiding losses relative to equal gains", "Treat gains and losses equally", "Ignore framing entirely"],
      correct: 0
    } },
    { id: "E2", bias: "loss", title: "Endowment Auction", cabinetTone: "cab-a", run: runLossEndowment, debriefQ: {
      question: "If your sell price is much higher than your buy price for the same item, that shows...",
      options: ["An endowment effect gap", "Perfect rational pricing", "No loss aversion"],
      correct: 0
    } },
    { id: "F1", bias: "survivorship", title: "Startup Hall of Fame", cabinetTone: "cab-b", run: runSurvivorshipStartup, debriefQ: {
      question: "Before copying winner stories, what should you check?",
      options: ["The failure pool and base rates", "Only the top success clips", "How confident founders sound"],
      correct: 0
    } },
    { id: "F2", bias: "survivorship", title: "Training Montage Myth", cabinetTone: "cab-c", run: runSurvivorshipMontage, debriefQ: {
      question: "A smart plan choice should be based on...",
      options: ["Full dataset including who failed", "Most viral story", "Most intense routine"],
      correct: 0
    } }
  ];

  const state = loadState();

  resetBtn.addEventListener("click", () => {
    if (window.confirm("Reset all Cognitive Bias Arcade progress? This cannot be undone.")) {
      Object.assign(state, freshState());
      saveState();
      renderHome();
    }
  });

  renderHome();

  function freshState() {
    return {
      results: {},
      totalScore: 0,
      completedCount: 0,
      completedGameIds: [],
      lastMode: "Arcade Floor",
      completedAt: null
    };
  }

  function loadState() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      if (!parsed || typeof parsed !== "object") {
        return freshState();
      }
      const merged = Object.assign(freshState(), parsed);
      recalcState(merged);
      return merged;
    } catch (err) {
      return freshState();
    }
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    syncHud();
  }

  function recalcState(target) {
    const ids = Object.keys(target.results || {});
    target.completedGameIds = ids;
    target.completedCount = ids.length;
    target.totalScore = ids.reduce((sum, id) => sum + (target.results[id].totalScore || 0), 0);
    if (target.completedCount < TOTAL_GAMES) {
      target.completedAt = null;
    }
  }

  function syncHud() {
    hudScore.textContent = Math.max(0, Math.round(state.totalScore));
    hudCompleted.textContent = `${state.completedCount}/${TOTAL_GAMES}`;
    hudMode.textContent = state.lastMode;
  }

  function getGame(id) {
    return games.find((g) => g.id === id);
  }

  function renderHome() {
    state.lastMode = "Arcade Floor";
    syncHud();
    const grouped = {};
    for (const g of games) {
      if (!grouped[g.bias]) grouped[g.bias] = [];
      grouped[g.bias].push(g);
    }

    const groups = Object.keys(grouped)
      .map((biasKey) => {
        const info = biasInfo[biasKey];
        const cabinets = grouped[biasKey]
          .map((g) => {
            const done = state.results[g.id];
            return `
              <article class="card cabinet ${g.cabinetTone}">
                <h4>${g.id}. ${g.title}</h4>
                <p>${info.definition}</p>
                <div class="row">
                  <span class="points-chip">${done ? `Score: ${done.totalScore}/100` : "Not played"}</span>
                  <button class="btn btn-secondary" data-action="start" data-game="${g.id}">${done ? "Replay" : "Play"}</button>
                </div>
              </article>
            `;
          })
          .join("");
        return `
          <section class="bias-group">
            <h3>${info.label}</h3>
            <div class="grid two">${cabinets}</div>
          </section>
        `;
      })
      .join("");

    const canFinish = state.completedCount === TOTAL_GAMES;
    app.innerHTML = `
      <section class="card">
        <h2>Arcade Cabinets</h2>
        <p>Play all 12 cabinets. Each game gives <strong>Performance Points (0-70)</strong>. Then complete a required debrief for <strong>Insight Points (0-30)</strong>.</p>
        <div class="progress" aria-hidden="true"><span style="width:${(state.completedCount / TOTAL_GAMES) * 100}%"></span></div>
      </section>
      <hr />
      ${groups}
      <section class="card">
        <h3>Finish Line</h3>
        <p>When all 12 are done, unlock your full bias profile, top 2 susceptibility flags, and personalized tips.</p>
        <button class="btn ${canFinish ? "" : "btn-ghost"}" data-action="end" ${canFinish ? "" : "disabled"}>View Final Results</button>
      </section>
    `;

    app.querySelectorAll("[data-action='start']").forEach((btn) => {
      btn.addEventListener("click", () => {
        const game = getGame(btn.getAttribute("data-game"));
        game.run(game);
      });
    });

    const endBtn = app.querySelector("[data-action='end']");
    if (endBtn) {
      endBtn.addEventListener("click", renderEndScreen);
    }

    app.focus();
  }

  function finishGame(game, payload) {
    const performanceScore = clamp(Math.round(payload.performanceScore), 0, 70);
    renderDebrief(game, payload, performanceScore);
  }

  function renderDebrief(game, payload, performanceScore) {
    state.lastMode = `Debrief ${game.id}`;
    syncHud();

    const info = biasInfo[game.bias];
    const q = game.debriefQ;

    app.innerHTML = `
      <section class="card">
        <h2>Learning Debrief: ${game.title}</h2>
        <div class="statline">
          <span class="pill">Bias: ${info.label}</span>
          <span class="pill">Performance Points: ${performanceScore}/70</span>
        </div>
        <p><strong>Definition:</strong> ${info.definition}</p>
        <p><strong>Your recap:</strong> ${payload.summary}</p>
        <p><strong>Why brains do this:</strong> ${info.why}</p>
        <p><strong>Real-world examples:</strong></p>
        <ul>
          <li>${info.examples[0]}</li>
          <li>${info.examples[1]}</li>
        </ul>
        <p><strong>Debias tip:</strong> ${info.tip}</p>
        <hr />
        <h3>Check for understanding (required)</h3>
        <p>${q.question}</p>
        <form id="debriefForm" class="choice-list" aria-label="Debrief question">
          ${q.options
            .map(
              (option, idx) => `
                <label class="choice"><input type="radio" name="debriefAnswer" value="${idx}" /> ${option}</label>
              `
            )
            .join("")}
          <button class="btn" type="submit">Submit Debrief and Continue</button>
        </form>
        <p id="debriefWarn" class="note bad" aria-live="polite"></p>
      </section>
    `;

    const form = document.getElementById("debriefForm");
    const warn = document.getElementById("debriefWarn");

    form.addEventListener("submit", (ev) => {
      ev.preventDefault();
      const chosen = form.querySelector("input[name='debriefAnswer']:checked");
      if (!chosen) {
        warn.textContent = "Choose an answer before continuing.";
        return;
      }
      const selected = Number(chosen.value);
      const correct = selected === q.correct;
      const insightScore = correct ? 30 : 10;
      const totalScore = clamp(performanceScore + insightScore, 0, 100);

      state.results[game.id] = {
        gameId: game.id,
        gameTitle: game.title,
        bias: game.bias,
        performanceScore,
        insightScore,
        totalScore,
        metrics: payload.metrics,
        summary: payload.summary,
        susceptibility: clamp(Math.round(payload.susceptibility), 0, 100),
        debriefAnswer: selected,
        debriefCorrect: correct,
        timestamp: Date.now()
      };

      recalcState(state);
      if (state.completedCount === TOTAL_GAMES && !state.completedAt) {
        state.completedAt = Date.now();
      }
      saveState();

      if (state.completedCount === TOTAL_GAMES) {
        renderEndScreen();
      } else {
        renderHome();
      }
    });

    app.focus();
  }

  function renderEndScreen() {
    state.lastMode = "Final Results";
    syncHud();

    const profile = buildBiasProfile();
    const sorted = Object.entries(profile).sort((a, b) => b[1] - a[1]);
    const top2 = sorted.slice(0, 2);
    const tips = top2.map(([bias]) => biasInfo[bias].tip);
    const scoreCode = generateScoreCode(state.totalScore, state.completedAt || Date.now());
    const completedDate = new Date(state.completedAt || Date.now()).toLocaleString();

    const bars = Object.entries(profile)
      .map(([bias, value]) => {
        const label = biasInfo[bias].label;
        return `
          <div class="bar" role="img" aria-label="${label} susceptibility ${value} out of 100">
            <span>${label}</span>
            <div class="track"><div class="fill" style="width:${value}%"></div></div>
            <strong>${value}</strong>
          </div>
        `;
      })
      .join("");

    const topList = top2.map(([bias, value]) => `<li>${biasInfo[bias].label} (${value}/100 susceptibility)</li>`).join("");
    const tipsList = tips.map((tip) => `<li>${tip}</li>`).join("");

    app.innerHTML = `
      <section class="card">
        <h2>Arcade Complete</h2>
        <p class="kicker">Tomlinson psychology</p>
        <p>Your total is based on all 12 games: performance decisions + debrief insight checks.</p>
        <h3 style="font-size:2.2rem;margin:6px 0;">${Math.round(state.totalScore)} / 1200</h3>
        <p>Completed: ${completedDate}</p>
      </section>
      <hr />
      <section class="card">
        <h3>Bias Profile (higher = more susceptible today)</h3>
        ${bars}
      </section>
      <section class="card">
        <h3>Top 2 Biases That Got You Today</h3>
        <ol>${topList}</ol>
        <h4>Personalized Tips</h4>
        <ol>${tipsList}</ol>
      </section>
      <section class="card">
        <h3>Shareable Score Code</h3>
        <p><strong>${scoreCode}</strong></p>
        <p class="note">Take a screenshot of this page and your score code to share with your class.</p>
        <div class="row">
          <button class="btn" id="backArcade" type="button">Back to Arcade</button>
        </div>
      </section>
    `;

    document.getElementById("backArcade").addEventListener("click", renderHome);
    app.focus();
  }

  function buildBiasProfile() {
    const profile = {
      action: 50,
      anchoring: 50,
      confirmation: 50,
      sunk: 50,
      loss: 50,
      survivorship: 50
    };

    Object.keys(profile).forEach((biasKey) => {
      const values = Object.values(state.results)
        .filter((r) => r.bias === biasKey)
        .map((r) => r.susceptibility);
      if (values.length) {
        profile[biasKey] = Math.round(values.reduce((a, b) => a + b, 0) / values.length);
      }
    });

    return profile;
  }

  function generateScoreCode(score, timestamp) {
    const scorePart = Number(score).toString(36).toUpperCase().padStart(3, "0");
    const timePart = Math.floor(timestamp / 1000).toString(36).toUpperCase().slice(-5).padStart(5, "0");
    const raw = `${scorePart}${timePart}`;
    let checksum = 0;
    for (const ch of raw) checksum += ch.charCodeAt(0);
    const checkPart = (checksum % (36 * 36)).toString(36).toUpperCase().padStart(2, "0");
    return `${raw}${checkPart}`;
  }

  function renderRoundShell(title, subtitle, round, totalRounds, bodyHtml) {
    const pct = Math.round((round / totalRounds) * 100);
    app.innerHTML = `
      <section class="card">
        <h2>${title}</h2>
        <p>${subtitle}</p>
        <div class="statline">
          <span class="pill">Round ${round}/${totalRounds}</span>
        </div>
        <div class="progress" aria-hidden="true"><span style="width:${pct}%"></span></div>
      </section>
      <section class="card">${bodyHtml}</section>
    `;
    app.focus();
  }

  function runActionCrisis(game) {
    state.lastMode = `${game.id} ${game.title}`;
    syncHud();

    const rounds = [
      { metric: "API response time +4ms", context: "No outage reports. Last 2 checks were normal.", optimal: "monitor" },
      { metric: "Error rate +2.1%", context: "Spike happened once this week and self-corrected.", optimal: "monitor" },
      { metric: "Checkout failures +18%", context: "Spike persists across two intervals.", optimal: "intervene" },
      { metric: "CPU load +5%", context: "Traffic surge from lunch period expected.", optimal: "monitor" },
      { metric: "Database timeout +15%", context: "Correlated with new release and growing.", optimal: "intervene" },
      { metric: "Support tickets flat", context: "Dashboard wiggles but customer impact is low.", optimal: "monitor" },
      { metric: "Cart drops +11%", context: "Two intervals worsening with real customer complaints.", optimal: "intervene" },
      { metric: "Revenue minute-by-minute noisy", context: "Variance within normal weekly range.", optimal: "monitor" }
    ];

    let i = 0;
    let correct = 0;
    let interventions = 0;
    let unnecessary = 0;

    const render = () => {
      const r = rounds[i];
      renderRoundShell(game.title, "Intervene only when evidence shows true deterioration.", i + 1, rounds.length, `
        <h3>Noisy Metric: ${r.metric}</h3>
        <p>${r.context}</p>
        <div class="choice-list">
          <button class="choice" data-choice="intervene">Intervene (restart/reroute now)</button>
          <button class="choice" data-choice="monitor">Monitor (collect more data)</button>
        </div>
      `);

      app.querySelectorAll("[data-choice]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const choice = btn.getAttribute("data-choice");
          if (choice === "intervene") interventions += 1;
          if (choice === r.optimal) correct += 1;
          if (choice === "intervene" && r.optimal === "monitor") unnecessary += 1;
          i += 1;
          if (i < rounds.length) render();
          else {
            const performance = (correct / rounds.length) * 70;
            finishGame(game, {
              performanceScore: performance,
              susceptibility: (unnecessary / rounds.length) * 100,
              metrics: {
                correctDecisions: correct,
                interventionCount: interventions,
                unnecessaryInterventions: unnecessary
              },
              summary: `You intervened ${interventions} times across ${rounds.length} rounds. ${unnecessary} interventions happened during noise-only moments. Correct decisions: ${correct}/${rounds.length}.`
            });
          }
        });
      });
    };

    render();
  }

  function runActionTimeout(game) {
    state.lastMode = `${game.id} ${game.title}`;
    syncHud();

    const rounds = [
      { run: "Opponents on 6-0 run", fatigue: "Low", foul: "No trouble", optimal: "let" },
      { run: "Opponents on 9-0 run", fatigue: "High for starters", foul: "No trouble", optimal: "sub" },
      { run: "Opponents on 5-0 run", fatigue: "Moderate", foul: "Two starters at 4 fouls", optimal: "timeout" },
      { run: "Opponents on 4-0 run", fatigue: "Low", foul: "No trouble", optimal: "let" },
      { run: "Opponents on 8-0 run", fatigue: "High + sloppy turnovers", foul: "No trouble", optimal: "timeout" },
      { run: "Opponents on 7-0 run", fatigue: "Low", foul: "Bench mismatch", optimal: "sub" }
    ];

    let i = 0;
    let correct = 0;
    let overActions = 0;
    let totalActions = 0;

    const render = () => {
      const r = rounds[i];
      renderRoundShell(game.title, "Use context, not panic, to decide interventions.", i + 1, rounds.length, `
        <h3>${r.run}</h3>
        <p>Fatigue: ${r.fatigue}. Foul trouble: ${r.foul}.</p>
        <div class="choice-list">
          <button class="choice" data-choice="timeout">Call Timeout</button>
          <button class="choice" data-choice="sub">Make Substitution</button>
          <button class="choice" data-choice="let">Let them play through</button>
        </div>
      `);

      app.querySelectorAll("[data-choice]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const choice = btn.getAttribute("data-choice");
          if (choice !== "let") totalActions += 1;
          if (choice === r.optimal) correct += 1;
          if (choice !== "let" && r.optimal === "let") overActions += 1;
          i += 1;
          if (i < rounds.length) render();
          else {
            finishGame(game, {
              performanceScore: (correct / rounds.length) * 70,
              susceptibility: ((overActions + Math.max(0, totalActions - 3)) / rounds.length) * 100,
              metrics: {
                correctDecisions: correct,
                interventionsUsed: totalActions,
                overusedInterventions: overActions
              },
              summary: `You used interventions ${totalActions} times, with ${overActions} likely panic interventions. You matched the strongest option in ${correct}/${rounds.length} moments.`
            });
          }
        });
      });
    };

    render();
  }

  function runAnchoringPrice(game) {
    state.lastMode = `${game.id} ${game.title}`;
    syncHud();

    const items = [
      { name: "Used graphing calculator", trueValue: 62 },
      { name: "Vintage basketball jersey", trueValue: 95 },
      { name: "Noise-canceling earbuds", trueValue: 78 },
      { name: "Skateboard deck", trueValue: 55 },
      { name: "Gaming keyboard", trueValue: 88 }
    ];

    let i = 0;
    const estimates = [];

    const render = () => {
      const item = items[i];
      const dir = Math.random() > 0.5 ? 1 : -1;
      const anchor = Math.round(item.trueValue + dir * (item.trueValue * (0.3 + Math.random() * 0.45)));

      renderRoundShell(game.title, "Estimate value while ignoring suggested anchors.", i + 1, items.length, `
        <h3>${item.name}</h3>
        <p><strong>Suggested price anchor:</strong> $${anchor}</p>
        <label for="estInput">Your estimate ($)</label>
        <input id="estInput" type="number" min="1" step="1" />
        <p class="note">Try to anchor on your own reasoning, not the suggested price.</p>
        <button class="btn" id="submitEstimate" type="button">Lock Estimate</button>
        <p id="warn" class="note bad" aria-live="polite"></p>
      `);

      document.getElementById("submitEstimate").addEventListener("click", () => {
        const value = Number(document.getElementById("estInput").value);
        if (!value || value <= 0) {
          document.getElementById("warn").textContent = "Enter a valid estimate first.";
          return;
        }
        estimates.push({
          trueValue: item.trueValue,
          anchor,
          estimate: value
        });
        i += 1;
        if (i < items.length) render();
        else {
          const avgErrorPct = avg(estimates.map((e) => Math.min(1.5, Math.abs(e.estimate - e.trueValue) / e.trueValue)));
          const anchorPull = avg(
            estimates.map((e) => {
              const gap = Math.max(1, Math.abs(e.anchor - e.trueValue));
              return 1 - Math.min(1, Math.abs(e.estimate - e.anchor) / gap);
            })
          );
          finishGame(game, {
            performanceScore: Math.max(0, (1 - avgErrorPct) * 70),
            susceptibility: anchorPull * 100,
            metrics: {
              averageErrorPct: round2(avgErrorPct * 100),
              anchorPullPct: round2(anchorPull * 100)
            },
            summary: `Your average estimate error was ${round2(avgErrorPct * 100)}%. Anchor pull was ${round2(anchorPull * 100)}%, meaning your guesses often drifted toward suggested prices.`
          });
        }
      });
    };

    render();
  }

  function runAnchoringNegotiation(game) {
    state.lastMode = `${game.id} ${game.title}`;
    syncHud();

    const rounds = [
      { case: "Part-time job hourly pay", fair: 18, mode: "respond", opponent: 14 },
      { case: "Used bike sale price", fair: 220, mode: "youStart" },
      { case: "Tutoring package (4 sessions)", fair: 120, mode: "respond", opponent: 165 },
      { case: "Class event catering bid", fair: 360, mode: "youStart" }
    ];

    let i = 0;
    let closeness = [];
    let anchorPulls = [];

    const render = () => {
      const r = rounds[i];
      const modeText = r.mode === "respond"
        ? `<p>Opponent opens at <strong>$${r.opponent}</strong>.</p>`
        : "<p>You get to set the first offer.</p>";

      renderRoundShell(game.title, "Notice how first numbers shape final deals.", i + 1, rounds.length, `
        <h3>${r.case}</h3>
        ${modeText}
        <label for="offerInput">Your offer ($)</label>
        <input id="offerInput" type="number" min="1" step="1" />
        <button id="submitOffer" class="btn" type="button">Submit Offer</button>
        <p id="warn" class="note bad" aria-live="polite"></p>
      `);

      document.getElementById("submitOffer").addEventListener("click", () => {
        const offer = Number(document.getElementById("offerInput").value);
        if (!offer || offer <= 0) {
          document.getElementById("warn").textContent = "Enter a valid offer first.";
          return;
        }

        const deal = r.mode === "respond" ? (offer + r.opponent) / 2 : (offer * 0.65 + r.fair * 0.35);
        closeness.push(Math.min(1.5, Math.abs(deal - r.fair) / r.fair));

        if (r.mode === "respond") {
          const gap = Math.max(1, Math.abs(r.opponent - r.fair));
          const pull = 1 - Math.min(1, Math.abs(offer - r.opponent) / gap);
          anchorPulls.push(pull);
        } else {
          const strategic = 1 - Math.min(1, Math.abs(offer - r.fair) / r.fair);
          anchorPulls.push(1 - strategic * 0.5);
        }

        i += 1;
        if (i < rounds.length) render();
        else {
          const avgClose = avg(closeness);
          const avgPull = avg(anchorPulls);
          finishGame(game, {
            performanceScore: Math.max(0, (1 - avgClose) * 70),
            susceptibility: avgPull * 100,
            metrics: {
              averageDealErrorPct: round2(avgClose * 100),
              anchorPullPct: round2(avgPull * 100)
            },
            summary: `Your negotiated deals were off fair value by ${round2(avgClose * 100)}% on average. Anchor pull measured ${round2(avgPull * 100)}%, showing first-number influence on your offers.`
          });
        }
      });
    };

    render();
  }

  function runConfirmationNewsfeed(game) {
    state.lastMode = `${game.id} ${game.title}`;
    syncHud();

    const claimTruth = false;
    const cards = [
      { title: "Peer-reviewed stat summary", side: "against", quality: 3 },
      { title: "Viral clip from influencer", side: "for", quality: 1 },
      { title: "Local school pilot data", side: "against", quality: 2 },
      { title: "Opinion thread with no sources", side: "for", quality: 1 },
      { title: "Meta-analysis snippet", side: "against", quality: 3 },
      { title: "Anecdote from one student", side: "for", quality: 1 },
      { title: "Neutral methods explainer", side: "neutral", quality: 2 },
      { title: "Dataset replication report", side: "against", quality: 3 }
    ];

    let lean = null;
    const opened = [];

    const renderLean = () => {
      app.innerHTML = `
        <section class="card">
          <h2>${game.title}</h2>
          <p>Claim: <strong>"Students learn better with zero breaks during study sessions."</strong></p>
          <p>Choose your initial lean, then investigate evidence cards (max 5).</p>
          <div class="choice-list">
            <button class="choice" data-lean="true">Likely True</button>
            <button class="choice" data-lean="false">Likely False</button>
          </div>
        </section>
      `;
      app.querySelectorAll("[data-lean]").forEach((btn) => {
        btn.addEventListener("click", () => {
          lean = btn.getAttribute("data-lean") === "true";
          renderCards();
        });
      });
      app.focus();
    };

    const renderCards = () => {
      const left = 5 - opened.length;
      const cardHtml = cards
        .map((card, idx) => {
          const isOpen = opened.includes(idx);
          const rec = lean === null ? false : ((lean ? "for" : "against") === card.side);
          return `
            <article class="card">
              <h4>${card.title}</h4>
              <p class="note">${rec ? "Recommended for you" : "Also available"}</p>
              ${isOpen ? `<p>Direction: <strong>${card.side}</strong>, quality ${card.quality}/3</p>` : `<button class="btn btn-secondary" data-open="${idx}" ${left <= 0 ? "disabled" : ""}>Open card</button>`}
            </article>
          `;
        })
        .join("");

      app.innerHTML = `
        <section class="card">
          <h2>${game.title}</h2>
          <p>Cards opened: ${opened.length}/5</p>
          <div class="grid two">${cardHtml}</div>
          <hr />
          <p>Final judgment:</p>
          <div class="row">
            <button class="btn" data-final="true">Claim is True</button>
            <button class="btn btn-secondary" data-final="false">Claim is False</button>
          </div>
        </section>
      `;

      app.querySelectorAll("[data-open]").forEach((btn) => {
        btn.addEventListener("click", () => {
          if (opened.length >= 5) return;
          opened.push(Number(btn.getAttribute("data-open")));
          renderCards();
        });
      });

      app.querySelectorAll("[data-final]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const final = btn.getAttribute("data-final") === "true";
          const openedCards = opened.map((idx) => cards[idx]);
          const directional = openedCards.filter((c) => c.side !== "neutral");
          const confirmClicks = directional.filter((c) => (lean ? c.side === "for" : c.side === "against")).length;
          const confirmRatio = directional.length ? confirmClicks / directional.length : 1;
          const antiBiasBalance = directional.length ? 1 - Math.abs(0.5 - confirmRatio) * 2 : 0;
          const accuracy = final === claimTruth ? 1 : 0;

          finishGame(game, {
            performanceScore: accuracy * 40 + antiBiasBalance * 30,
            susceptibility: confirmRatio * 100,
            metrics: {
              openedCards: opened.length,
              confirmatoryClickRatio: round2(confirmRatio * 100),
              finalAccuracy: accuracy
            },
            summary: `You opened ${opened.length} evidence cards. Confirmatory click ratio was ${round2(confirmRatio * 100)}%. Your final verdict was ${accuracy ? "correct" : "incorrect"}.`
          });
        });
      });

      app.focus();
    };

    renderLean();
  }

  function runConfirmationDetective(game) {
    state.lastMode = `${game.id} ${game.title}`;
    syncHud();

    const suspects = ["Alex", "Blair", "Casey"];
    const culprit = "Blair";
    const tests = [
      { label: "Check Alex keycard logs", target: "Alex", disconfirmFor: "Alex" },
      { label: "Check Blair alibi timestamps", target: "Blair", disconfirmFor: "Blair" },
      { label: "Search Casey locker", target: "Casey", disconfirmFor: "Casey" },
      { label: "Cross-check camera blind spots", target: "Blair", disconfirmFor: "Blair" },
      { label: "Interview witness who doubts Alex", target: "Alex", disconfirmFor: "Alex" }
    ];

    let initial = null;
    const pickedTests = [];

    const chooseInitial = () => {
      app.innerHTML = `
        <section class="card">
          <h2>${game.title}</h2>
          <p>Pick your initial suspect, then run 3 tests. Strong players choose tests that could disprove their own hypothesis.</p>
          <div class="choice-list">
            ${suspects.map((s) => `<button class="choice" data-suspect="${s}">${s}</button>`).join("")}
          </div>
        </section>
      `;
      app.querySelectorAll("[data-suspect]").forEach((btn) => {
        btn.addEventListener("click", () => {
          initial = btn.getAttribute("data-suspect");
          pickTests();
        });
      });
      app.focus();
    };

    const pickTests = () => {
      const left = 3 - pickedTests.length;
      app.innerHTML = `
        <section class="card">
          <h2>${game.title}</h2>
          <p>Initial suspect: <strong>${initial}</strong>. Investigation points left: ${left}</p>
          <div class="grid two">
            ${tests
              .map((t, idx) => {
                const chosen = pickedTests.includes(idx);
                return `<article class="card"><h4>${t.label}</h4>${chosen ? "<p class='good'>Selected</p>" : `<button class='btn btn-secondary' data-test='${idx}' ${left <= 0 ? "disabled" : ""}>Run test</button>`}</article>`;
              })
              .join("")}
          </div>
          <hr />
          <p>Final suspect:</p>
          <div class="row">${suspects.map((s) => `<button class="btn" data-final="${s}">${s}</button>`).join("")}</div>
        </section>
      `;

      app.querySelectorAll("[data-test]").forEach((btn) => {
        btn.addEventListener("click", () => {
          if (pickedTests.length >= 3) return;
          pickedTests.push(Number(btn.getAttribute("data-test")));
          pickTests();
        });
      });

      app.querySelectorAll("[data-final]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const final = btn.getAttribute("data-final");
          const selected = pickedTests.map((idx) => tests[idx]);
          const disconfirm = selected.filter((t) => t.disconfirmFor === initial).length;
          const confirm = selected.length - disconfirm;
          const disconfirmRatio = selected.length ? disconfirm / selected.length : 0;
          const accuracy = final === culprit ? 1 : 0;

          finishGame(game, {
            performanceScore: accuracy * 35 + disconfirmRatio * 35,
            susceptibility: (confirm / Math.max(1, selected.length)) * 100,
            metrics: {
              initialSuspect: initial,
              finalSuspect: final,
              disconfirmingTests: disconfirm,
              confirmatoryTests: confirm
            },
            summary: `You started with ${initial}, ran ${selected.length} tests, and chose ${disconfirm} disconfirming tests. Final suspect: ${final} (${accuracy ? "correct" : "incorrect"}).`
          });
        });
      });

      app.focus();
    };

    chooseInitial();
  }

  function runSunkThemePark(game) {
    state.lastMode = `${game.id} ${game.title}`;
    syncHud();

    const rounds = [
      { status: "Rain starts. Wait times average 55 minutes.", utilityStay: -8, utilityLeave: +2, utilityDouble: -12 },
      { status: "Main ride closes for maintenance.", utilityStay: -10, utilityLeave: +4, utilityDouble: -15 },
      { status: "Storm warning and crowds surge.", utilityStay: -14, utilityLeave: +6, utilityDouble: -18 },
      { status: "Only two short rides remain open.", utilityStay: -6, utilityLeave: +5, utilityDouble: -11 }
    ];

    let i = 0;
    let satisfaction = 0;
    let bestPossible = 0;
    let sunkChoices = 0;

    const render = () => {
      const r = rounds[i];
      bestPossible += Math.max(r.utilityStay, r.utilityLeave, r.utilityDouble);
      renderRoundShell(game.title, "Focus on future payoff, not money already spent.", i + 1, rounds.length, `
        <h3>${r.status}</h3>
        <p>You already spent $80 on tickets. What now?</p>
        <div class="choice-list">
          <button class="choice" data-choice="stay">Stay and wait it out</button>
          <button class="choice" data-choice="leave">Leave and salvage your day elsewhere</button>
          <button class="choice" data-choice="double">Double-down: buy fast-pass add-on</button>
        </div>
      `);

      app.querySelectorAll("[data-choice]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const choice = btn.getAttribute("data-choice");
          if (choice === "stay") satisfaction += r.utilityStay;
          if (choice === "leave") satisfaction += r.utilityLeave;
          if (choice === "double") satisfaction += r.utilityDouble;
          if (choice !== "leave" && r.utilityLeave >= r.utilityStay) sunkChoices += 1;
          i += 1;
          if (i < rounds.length) render();
          else {
            const ratio = bestPossible <= 0 ? 0 : satisfaction / bestPossible;
            finishGame(game, {
              performanceScore: clamp((ratio + 0.2) * 70, 0, 70),
              susceptibility: (sunkChoices / rounds.length) * 100,
              metrics: {
                daySatisfaction: satisfaction,
                bestCounterfactual: bestPossible,
                sunkChoices
              },
              summary: `Your final day satisfaction score was ${satisfaction}. Best counterfactual path was ${bestPossible}. You made ${sunkChoices} sunk-cost style choices when leaving had better future value.`
            });
          }
        });
      });
    };

    render();
  }

  function runSunkProject(game) {
    state.lastMode = `${game.id} ${game.title}`;
    syncHud();

    const rounds = [
      { time: 5, successKeep: 0.35, successPivot: 0.75, optimal: "pivot" },
      { time: 4, successKeep: 0.45, successPivot: 0.72, optimal: "help" },
      { time: 3, successKeep: 0.3, successPivot: 0.68, optimal: "pivot" },
      { time: 2, successKeep: 0.25, successPivot: 0.62, optimal: "help" },
      { time: 1, successKeep: 0.2, successPivot: 0.58, optimal: "pivot" }
    ];

    let i = 0;
    let correct = 0;
    let sunkKeep = 0;

    const render = () => {
      const r = rounds[i];
      renderRoundShell(game.title, "Choose based on remaining time and chance of success.", i + 1, rounds.length, `
        <h3>Hours left: ${r.time}</h3>
        <p>Current project success chance: ${Math.round(r.successKeep * 100)}%. Pivot project chance: ${Math.round(r.successPivot * 100)}%.</p>
        <div class="choice-list">
          <button class="choice" data-choice="keep">Keep fixing current project</button>
          <button class="choice" data-choice="pivot">Pivot to simpler project</button>
          <button class="choice" data-choice="help">Ask for help and simplify scope</button>
        </div>
      `);

      app.querySelectorAll("[data-choice]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const choice = btn.getAttribute("data-choice");
          if (choice === r.optimal) correct += 1;
          if (choice === "keep" && r.successKeep < r.successPivot) sunkKeep += 1;
          i += 1;
          if (i < rounds.length) render();
          else {
            finishGame(game, {
              performanceScore: (correct / rounds.length) * 70,
              susceptibility: (sunkKeep / rounds.length) * 100,
              metrics: {
                rationalChoices: correct,
                keptFailingPathCount: sunkKeep
              },
              summary: `You made ${correct}/${rounds.length} high-probability decisions. You stayed on the weaker path ${sunkKeep} times when pivot/help gave better odds.`
            });
          }
        });
      });
    };

    render();
  }

  function runLossCoinFlip(game) {
    state.lastMode = `${game.id} ${game.title}`;
    syncHud();

    const rounds = [
      { pair: 1, frame: "gain", safe: "+$40 guaranteed", risky: "50% +$80, 50% +$0" },
      { pair: 1, frame: "loss", safe: "-$40 guaranteed", risky: "50% -$80, 50% -$0" },
      { pair: 2, frame: "gain", safe: "+$30 guaranteed", risky: "50% +$60, 50% +$0" },
      { pair: 2, frame: "loss", safe: "-$30 guaranteed", risky: "50% -$60, 50% -$0" },
      { pair: 3, frame: "gain", safe: "+$25 guaranteed", risky: "50% +$50, 50% +$0" },
      { pair: 3, frame: "loss", safe: "-$25 guaranteed", risky: "50% -$50, 50% -$0" }
    ];

    let i = 0;
    const picks = [];

    const render = () => {
      const r = rounds[i];
      renderRoundShell(game.title, "Equivalent expected values, different frames.", i + 1, rounds.length, `
        <h3>Frame: ${r.frame.toUpperCase()}</h3>
        <p>Choose one:</p>
        <div class="choice-list">
          <button class="choice" data-choice="safe">A) ${r.safe}</button>
          <button class="choice" data-choice="risky">B) ${r.risky}</button>
        </div>
      `);

      app.querySelectorAll("[data-choice]").forEach((btn) => {
        btn.addEventListener("click", () => {
          picks.push({ pair: r.pair, frame: r.frame, choice: btn.getAttribute("data-choice") });
          i += 1;
          if (i < rounds.length) render();
          else {
            let switches = 0;
            [1, 2, 3].forEach((p) => {
              const g = picks.find((x) => x.pair === p && x.frame === "gain");
              const l = picks.find((x) => x.pair === p && x.frame === "loss");
              if (g && l && g.choice !== l.choice) switches += 1;
            });
            const consistency = 1 - switches / 3;
            finishGame(game, {
              performanceScore: consistency * 70,
              susceptibility: (switches / 3) * 100,
              metrics: {
                frameSwitches: switches,
                consistencyPct: round2(consistency * 100)
              },
              summary: `You switched choices between gain and loss framing in ${switches} of 3 matched pairs. More switching means framing changed your risk behavior.`
            });
          }
        });
      });
    };

    render();
  }

  function runLossEndowment(game) {
    state.lastMode = `${game.id} ${game.title}`;
    syncHud();

    const items = [
      { name: "Limited sneaker pass", market: 75 },
      { name: "Concert lawn ticket", market: 55 },
      { name: "Retro game cartridge", market: 65 }
    ];

    let i = 0;
    const gaps = [];

    const renderSell = () => {
      const item = items[i];
      renderRoundShell(game.title, "Compare what you demand to sell vs would pay to buy.", i + 1, items.length, `
        <h3>${item.name}</h3>
        <p>You currently own this item.</p>
        <label for="sellInput">Minimum sell price (WTA)</label>
        <input id="sellInput" type="number" min="1" />
        <label for="buyInput">Maximum buy price if you did NOT own it (WTP)</label>
        <input id="buyInput" type="number" min="1" />
        <button class="btn" id="submitGap">Submit Prices</button>
        <p id="warn" class="note bad"></p>
      `);

      document.getElementById("submitGap").addEventListener("click", () => {
        const sell = Number(document.getElementById("sellInput").value);
        const buy = Number(document.getElementById("buyInput").value);
        if (!sell || !buy) {
          document.getElementById("warn").textContent = "Enter both prices to continue.";
          return;
        }
        gaps.push({
          item: item.name,
          market: item.market,
          sell,
          buy,
          gap: Math.abs(sell - buy) / item.market
        });
        i += 1;
        if (i < items.length) renderSell();
        else {
          const avgGap = avg(gaps.map((g) => g.gap));
          finishGame(game, {
            performanceScore: Math.max(0, (1 - avgGap) * 70),
            susceptibility: Math.min(100, avgGap * 120),
            metrics: {
              averageWTAvsWTPGapPct: round2(avgGap * 100),
              avgWTA: round2(avg(gaps.map((g) => g.sell))),
              avgWTP: round2(avg(gaps.map((g) => g.buy)))
            },
            summary: `Your average sell-vs-buy gap was ${round2(avgGap * 100)}% of market value. Larger WTA-WTP gaps suggest stronger endowment-driven loss aversion.`
          });
        }
      });
    };

    renderSell();
  }

  function runSurvivorshipStartup(game) {
    state.lastMode = `${game.id} ${game.title}`;
    syncHud();

    const winners = [
      { name: "NoteSpark", projectedReturn: 2.1, sector: "Study apps" },
      { name: "FitBurst", projectedReturn: 1.6, sector: "Fitness" },
      { name: "QuickCart", projectedReturn: 2.4, sector: "Delivery" },
      { name: "ClassLoop", projectedReturn: 1.8, sector: "EdTech" }
    ];

    const graveyard = [
      { sector: "Study apps", failed: 87, total: 100 },
      { sector: "Fitness", failed: 80, total: 100 },
      { sector: "Delivery", failed: 94, total: 100 },
      { sector: "EdTech", failed: 72, total: 100 }
    ];

    let opened = false;
    const picks = [];

    const render = () => {
      const graveHtml = opened
        ? `<div class="card"><h4>Graveyard Dataset (failure pool)</h4>${graveyard
            .map((g) => `<p>${g.sector}: ${g.failed}/${g.total} failed</p>`)
            .join("")}</div>`
        : "";

      app.innerHTML = `
        <section class="card">
          <h2>${game.title}</h2>
          <p>You can invest in two startup stories. If you only look at winners, you may miss base rates.</p>
          <button class="btn btn-secondary" id="openGrave">Show the graveyard dataset</button>
          ${graveHtml}
          <hr />
          <div class="grid two">
            ${winners
              .map((w, idx) => {
                const chosen = picks.includes(idx);
                return `<article class="card"><h4>${w.name}</h4><p>Sector: ${w.sector}</p><p>Winner story return: x${w.projectedReturn}</p>${chosen ? "<p class='good'>Chosen</p>" : `<button class='btn' data-pick='${idx}' ${picks.length >= 2 ? "disabled" : ""}>Invest</button>`}</article>`;
              })
              .join("")}
          </div>
          <button class="btn" id="finishInvest" ${picks.length === 2 ? "" : "disabled"}>Finalize Portfolio</button>
        </section>
      `;

      document.getElementById("openGrave").addEventListener("click", () => {
        opened = true;
        render();
      });

      app.querySelectorAll("[data-pick]").forEach((btn) => {
        btn.addEventListener("click", () => {
          if (picks.length >= 2) return;
          picks.push(Number(btn.getAttribute("data-pick")));
          render();
        });
      });

      const finish = document.getElementById("finishInvest");
      finish.addEventListener("click", () => {
        const chosen = picks.map((idx) => winners[idx]);
        const expected = chosen.reduce((sum, c) => {
          const g = graveyard.find((x) => x.sector === c.sector);
          const surviveRate = 1 - g.failed / g.total;
          return sum + surviveRate * c.projectedReturn;
        }, 0);
        const normalized = Math.min(1, expected / 1.2);
        const baseRateBonus = opened ? 0.15 : 0;

        finishGame(game, {
          performanceScore: clamp((normalized + baseRateBonus) * 70, 0, 70),
          susceptibility: opened ? 35 : 90,
          metrics: {
            openedGraveyardDataset: opened,
            picks: chosen.map((c) => c.name),
            expectedPortfolioScore: round2(expected)
          },
          summary: `You invested in ${chosen.map((c) => c.name).join(" and ")}. You ${opened ? "did" : "did not"} open failure-pool data before picking. Expected portfolio score: ${round2(expected)}.`
        });
      });

      app.focus();
    };

    render();
  }

  function runSurvivorshipMontage(game) {
    state.lastMode = `${game.id} ${game.title}`;
    syncHud();

    const plans = [
      { name: "4am grind montage", successRate: 0.07, note: "Viral winners mostly had private coaching." },
      { name: "Balanced plan + feedback loop", successRate: 0.42, note: "Less flashy, higher consistency." },
      { name: "All-in hustle challenge", successRate: 0.11, note: "Many burn out by week 3." }
    ];

    let opened = false;
    let chosen = null;

    const render = () => {
      const dataset = opened
        ? `<div class="card"><h4>Full Dataset</h4>${plans
            .map((p) => `<p>${p.name}: ${(p.successRate * 100).toFixed(0)}% success. ${p.note}</p>`)
            .join("")}</div>`
        : "";

      app.innerHTML = `
        <section class="card">
          <h2>${game.title}</h2>
          <p>Viral stories show dramatic success plans. Choose a plan after checking complete outcomes.</p>
          <button class="btn btn-secondary" id="openDataset">Open full dataset</button>
          ${dataset}
          <hr />
          <div class="choice-list">
            ${plans.map((p, idx) => `<button class="choice" data-plan="${idx}">${p.name}</button>`).join("")}
          </div>
          <p id="pickLine" class="note">${chosen === null ? "No plan selected yet." : `Selected: ${plans[chosen].name}`}</p>
          <button class="btn" id="lockPlan" ${chosen === null ? "disabled" : ""}>Lock Plan</button>
        </section>
      `;

      document.getElementById("openDataset").addEventListener("click", () => {
        opened = true;
        render();
      });

      app.querySelectorAll("[data-plan]").forEach((btn) => {
        btn.addEventListener("click", () => {
          chosen = Number(btn.getAttribute("data-plan"));
          render();
        });
      });

      document.getElementById("lockPlan").addEventListener("click", () => {
        const picked = plans[chosen];
        const perf = clamp((picked.successRate + (opened ? 0.2 : 0)) * 100, 0, 70);
        let susceptibility = opened ? 40 : 88;
        susceptibility += chosen === 0 || chosen === 2 ? 10 : -10;
        finishGame(game, {
          performanceScore: clamp(perf, 0, 70),
          susceptibility: clamp(susceptibility, 0, 100),
          metrics: {
            openedFullDataset: opened,
            chosenPlan: picked.name,
            baseRateUsed: opened
          },
          summary: `You chose "${picked.name}" (${Math.round(picked.successRate * 100)}% base-rate success). You ${opened ? "used" : "did not use"} the full dataset before deciding.`
        });
      });

      app.focus();
    };

    render();
  }

  function clamp(n, min, max) {
    return Math.min(max, Math.max(min, n));
  }

  function avg(arr) {
    if (!arr.length) return 0;
    return arr.reduce((a, b) => a + b, 0) / arr.length;
  }

  function round2(n) {
    return Math.round(n * 100) / 100;
  }
})();
