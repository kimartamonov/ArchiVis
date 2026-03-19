/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/ArchiVis/',
  plugins: [react()],
  test: {
    globals: true,
    environment: 'node',
    exclude: ['node_modules', 'tests/e2e/**'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.d.ts', 'src/main.tsx', 'src/App.tsx', 'src/vite-env.d.ts'],
      thresholds: {
        'src/engine/graph/buildGraph.ts': { lines: 80, branches: 80 },
        'src/engine/graph/calculateMetrics.ts': { lines: 80, branches: 80 },
        'src/engine/insight/impactAnalysis.ts': { lines: 80, branches: 80 },
      },
    },
  },
})
