![CI](https://github.com/Mikadows/dartscorer/actions/workflows/deploy.yml/badge.svg?branch=main)

# 🎯 Dart Scorer

Dart Scorer is a small single-page React application for entering and tracking darts scores during casual play. It provides an interactive SVG dartboard for score entry, per-player turn history, bust/win handling, player elimination, and a simple home page to manage player profiles and start games.

## Features

- Interactive vector dartboard — click or tap to record hits (single, double, triple, bull)
- Full turn lifecycle — 3 darts per turn, bust handling, and win detection
- Player elimination — players removed when their score reaches zero; game-over modal when last player eliminated
- Home / roster UI — create player profiles, build a roster for the next game, persist player pool to `localStorage`
- Undo/redo for throws and turn history
- Deployable to GitHub Pages via GitHub Actions

## Quickstart

Prerequisites: Node.js 18+ and npm

1. Install dependencies

```bash
npm ci
```

2. Run the development server

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

3. Build for production

```bash
npm run build
```

The production build is emitted to the `dist` directory.

## Deployment (GitHub Pages)

This repository includes a GitHub Actions workflow at `.github/workflows/deploy.yml` that builds the app and publishes the `dist` output to the `gh-pages` branch. To enable CI deploys:

- Ensure the default branch is `main` (or update the workflow `on.push.branches` accordingly).
- Push to `main` to trigger the workflow, or run it manually from the Actions tab.
- The workflow uses the repository's `GITHUB_TOKEN` so no additional secrets are required.

After a successful run, the app is available from GitHub Pages for the `gh-pages` branch (repository settings → Pages).

## Contributing

Contributions are welcome. Suggested workflow:

1. Fork and create a feature branch
2. Run and verify locally with `npm run dev`
3. Open a pull request describing your change

Please keep commits focused and include tests where applicable.

## License

This project is provided without an explicit license. Add a `LICENSE` file if you want to grant permissions to others.

---

> ⚠ DISCLAIMER : This repo is 100% vide coded with copilot