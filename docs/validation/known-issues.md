# Known Issues — ArchiLens v0.1.0

No blocker issues. The following are documented for post-MVP backlog.

## P1 (Should fix)

| ID | Description | Mitigation |
|----|-------------|------------|
| KI-1 | Architeezy connector requires running server — untested in CI | Demo dataset provides full functionality without server |
| KI-2 | Chunk size > 500kB (React Flow + elkjs) | Code splitting can be added post-MVP |
| KI-3 | Sidebar CSS warning (borderLeft vs borderLeftColor) | Cosmetic only, no functional impact |

## P2 (Nice to have)

| ID | Description |
|----|-------------|
| KI-4 | No URL deep linking — screen state not reflected in URL |
| KI-5 | No back navigation — forward-only transitions |
| KI-6 | GraphML exports impact subgraph only, not full model |
| KI-7 | No authentication persistence across sessions |
| KI-8 | E2E test not yet in CI pipeline (documented for integration) |
