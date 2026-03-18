# M4-07: Write README and Project Documentation

## Metadata

| Field                | Value                                             |
|----------------------|---------------------------------------------------|
| **Issue ID**         | M4-07                                             |
| **Type**             | Docs                                              |
| **Status**           | Proposed                                          |
| **Milestone**        | M4 — Export and Release                           |
| **Capability Slice** | S-4 (Release preparation)                         |
| **Priority**         | P0                                                |
| **Sequence Order**   | 7                                                 |
| **Depends On**       | M4-05 (Export Validation)                         |
| **Unlocks**          | M4-08 (E2E Smoke Test)                            |
| **FR References**    | —                                                 |
| **AC References**    | —                                                 |
| **Decision Refs**    | D-7 (MIT license)                                 |
| **Demo Refs**        | —                                                 |
| **Risk Refs**        | R6 (bus factor 1)                                 |

## Goal

Write a comprehensive README that enables a new user to understand, install, and use ArchiLens in under 5 minutes. Create CONTRIBUTING.md for contributor guidance and LICENSE file with MIT license text. This completes the project's public-facing documentation for open-source release.

## Why Now

All features are implemented and validated (M1–M4-05). CI is green (M4-06). The project needs documentation before it can be publicly released. README is part of the MVP Definition of Done ("README < 5 min"). MIT license (Decision D-7) must be in place for open-source release. Good documentation also mitigates R6 (bus factor 1) by enabling others to understand and contribute to the project.

## User / System Outcome

A developer discovering ArchiLens on GitHub can read the README, understand what the tool does, install it, and run the demo in under 5 minutes. A potential contributor knows how to set up the development environment and submit changes. The MIT license clearly communicates usage rights.

## Scope

- `README.md` (project root):
  - Project name, tagline, and brief description.
  - CI status badge.
  - Feature list (graph visualization, impact analysis, quality metrics, GraphML/CSV export).
  - Screenshots or GIF of the app in action.
  - Quick Start:
    - Prerequisites (Node.js 20+).
    - `git clone`, `npm install`, `npm run dev`.
    - Open browser at `localhost:5173`.
  - Demo walkthrough (5-minute script):
    - Load demo dataset.
    - Explore graph.
    - Run impact analysis.
    - View table and quality metrics.
    - Export GraphML and CSV.
  - Tech stack: React, TypeScript, Vite, React Flow, Zustand, Vitest.
  - Known limitations.
  - License: MIT.
- `CONTRIBUTING.md`:
  - How to fork and clone.
  - Development setup.
  - Running tests.
  - PR guidelines.
  - Code style (ESLint config).
- `LICENSE`:
  - MIT license text with current year and project author.

## Out of Scope

- Full API documentation or JSDoc generation.
- Architecture decision records in README.
- Deployment/hosting guides.
- Internationalization of documentation.

## Preconditions

- M4-05: All features validated and working on demo dataset.
- M4-06: CI is green and badge URL is known.
- Screenshots or GIF of the app can be captured from the working application.
- Decision D-7: MIT license confirmed.

## Implementation Notes

- README structure should follow standard open-source conventions: description, badges, installation, usage, contributing, license.
- Keep Quick Start to 3 commands maximum: clone, install, run.
- Screenshots should be placed in a `docs/screenshots/` directory and referenced from README.
- GIF can be created with a screen recording tool (e.g., Peek, LICEcap) showing the 5-minute demo flow.
- Known limitations section should be honest: list what is not yet supported (e.g., no authentication, demo dataset only, etc.).
- MIT license year: use current year. Copyright holder: project author(s).

## Files and Artifacts Expected to Change

| Path                          | Change   |
|-------------------------------|----------|
| `README.md`                   | Create   |
| `CONTRIBUTING.md`             | Create   |
| `LICENSE`                     | Create   |
| `docs/screenshots/`          | Create   |

## Acceptance Criteria

- [ ] README.md exists in project root.
- [ ] A new user can follow README instructions and have the app running in < 5 minutes.
- [ ] Quick Start section has clear step-by-step instructions.
- [ ] Feature list accurately reflects implemented capabilities.
- [ ] Screenshots or GIF are included and display correctly on GitHub.
- [ ] Demo walkthrough covers the 5 key flows (load, graph, impact, table, export).
- [ ] Known limitations section is present and honest.
- [ ] Tech stack is listed.
- [ ] CONTRIBUTING.md exists with development setup and PR guidelines.
- [ ] LICENSE file exists with MIT license text.
- [ ] CI badge displays in README.

## Required Tests

### Functional

- Follow README Quick Start from scratch on a clean machine (or fresh clone) → app runs successfully.
- All links in README resolve correctly (no broken links).
- Screenshots/GIF render on GitHub.

### Smoke

- README renders correctly in GitHub Markdown preview.
- CONTRIBUTING.md renders correctly.
- LICENSE file is recognized by GitHub (shows license badge on repo).

### Regression

- No code changes in this issue — no regression risk to application behavior.

## Handoff to Next Issue

The project is fully documented for public consumption. README enables < 5 min onboarding. MIT license is in place. M4-08 (E2E Smoke Test) can be written against the stable, documented application. The project is ready for public-facing release preparation.

## Done Definition

- All acceptance criteria checked.
- README tested by following instructions from scratch.
- CONTRIBUTING.md and LICENSE present.
- Screenshots/GIF captured and rendering on GitHub.
- CI badge visible and green.
