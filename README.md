# Cognitive Bias Arcade (Tomlinson psychology)

Single-page HTML/JS arcade for high school psychology students. Players complete 12 mini-games (2 each for Action Bias, Anchoring, Confirmation Bias, Sunk Cost Fallacy, Loss Aversion, Survivorship Bias), then review a mandatory learning debrief after every game.

## What this game teaches

- Biases show up in decisions, estimates, media evaluation, and planning.
- Every mini-game has two score layers:
  - Performance Points: `0-70`
  - Insight Points (debrief question): `0-30`
- Per-game max is `100`; total max is `1200`.

## Included mini-games

- A1 Crisis Dashboard
- A2 Timeout Fever
- B1 The Price Is... Stuck
- B2 First Offer Negotiation
- C1 Newsfeed Builder
- C2 Detective: Disconfirming Tests
- D1 Theme Park Day
- D2 Project Deadline Trap
- E1 Coin Flip Insurance
- E2 Endowment Auction
- F1 Startup Hall of Fame
- F2 Training Montage Myth

## Scoring and measurement

For every game, app stores:

- `performanceScore`
- `insightScore`
- `totalScore`
- `metrics` (bias-specific stats, e.g., confirmatory click ratio, anchor pull, intervention overuse)
- `susceptibility` (`0-100`)
- debrief answer correctness and timestamp

End screen includes:

- total score (`/1200`)
- bias susceptibility bars (0-100)
- top 2 biases that affected the player most
- 3 personalized debias tips
- shareable score code (score + completion time + checksum)

## Save data

Uses `localStorage` key: `cognitive_bias_arcade_v1`

Persists:

- total score
- games completed
- per-game results + metrics
- debrief answers
- completion timestamp

Use **Reset Progress** button in the header to clear saved state.

## Run locally

No build step and no backend required.

1. Open `index.html` directly in a modern browser, or
2. Serve this folder with a static server (recommended):

```bash
cd "/Users/austintomlinson/Documents/New project"
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Deploy on GitHub Pages

Repository is ready for Pages from the `main` branch root (`/`).

### If Pages can be enabled by CLI

```bash
gh api -X POST repos/<OWNER>/<REPO>/pages -f source[branch]=main -f source[path]=/
```

If Pages already exists, update source:

```bash
gh api -X PUT repos/<OWNER>/<REPO>/pages -f source[branch]=main -f source[path]=/
```

### Manual click-path (if CLI permissions block it)

1. Open GitHub repo.
2. Go to **Settings** -> **Pages**.
3. Under **Build and deployment**, set:
   - **Source**: Deploy from a branch
   - **Branch**: `main`
   - **Folder**: `/ (root)`
4. Save.
5. Wait for Pages build to finish in **Actions**.

## Live URL

- GitHub Pages URL: https://atomlinsonc.github.io/NBAowner/
