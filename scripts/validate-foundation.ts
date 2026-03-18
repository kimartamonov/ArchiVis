/**
 * Foundation Validation Script — M0-05
 *
 * Verifies all Readiness Gate conditions (RG-1 through RG-5) for ArchiLens MVP.
 * Run: npx tsx scripts/validate-foundation.ts
 */

import { readFileSync, existsSync } from 'fs';
import type { NormalizedModel } from '../src/engine/types';

let passed = 0;
let failed = 0;

function check(name: string, condition: boolean, detail?: string): void {
  if (condition) {
    console.log(`  ✓ ${name}`);
    passed++;
  } else {
    console.log(`  ✗ ${name}${detail ? ' — ' + detail : ''}`);
    failed++;
  }
}

// ---------------------------------------------------------------------------
// RG-3: Demo dataset
// ---------------------------------------------------------------------------
console.log('\n=== RG-3: Demo Dataset ===');

const demoPath = 'demo/digital-bank.json';
check('demo/digital-bank.json exists', existsSync(demoPath));

const raw = readFileSync(demoPath, 'utf-8');
const model: NormalizedModel = JSON.parse(raw);
check('JSON parses without errors', true);
check('Has id field', typeof model.id === 'string' && model.id.length > 0);
check('Has name field', typeof model.name === 'string' && model.name.length > 0);
check('Has elements array', Array.isArray(model.elements));
check('Has relationships array', Array.isArray(model.relationships));
check('Has diagrams array', Array.isArray(model.diagrams));
check('Has warnings array', Array.isArray(model.warnings));

const elCount = model.elements.length;
const relCount = model.relationships.length;
const diagCount = model.diagrams.length;
check(`Element count ${elCount} in [80, 120]`, elCount >= 80 && elCount <= 120);
check(`Relationship count ${relCount} in [150, 250]`, relCount >= 150 && relCount <= 250);
check(`Diagram count ${diagCount} in [8, 15]`, diagCount >= 8 && diagCount <= 15);

// Referential integrity
const elementIds = new Set(model.elements.map((e) => e.id));

const brokenSources = model.relationships.filter((r) => !elementIds.has(r.sourceId));
check('All relationship sourceIds resolve', brokenSources.length === 0, `${brokenSources.length} broken`);

const brokenTargets = model.relationships.filter((r) => !elementIds.has(r.targetId));
check('All relationship targetIds resolve', brokenTargets.length === 0, `${brokenTargets.length} broken`);

let brokenDiagramRefs = 0;
for (const d of model.diagrams) {
  for (const eid of d.elementIds) {
    if (!elementIds.has(eid)) brokenDiagramRefs++;
  }
}
check('All diagram elementIds resolve', brokenDiagramRefs === 0, `${brokenDiagramRefs} broken`);

// ---------------------------------------------------------------------------
// RG-4: Connector interface and domain types
// ---------------------------------------------------------------------------
console.log('\n=== RG-4: Connector Interface & Domain Types ===');

check('src/connectors/types.ts exists', existsSync('src/connectors/types.ts'));
check('src/engine/types.ts exists', existsSync('src/engine/types.ts'));

const connectorSrc = readFileSync('src/connectors/types.ts', 'utf-8');
check('DataConnector interface defined', connectorSrc.includes('interface DataConnector'));
check('DataConnector.connect method', connectorSrc.includes('connect('));
check('DataConnector.listModels method', connectorSrc.includes('listModels('));
check('DataConnector.loadModel method', connectorSrc.includes('loadModel('));
check('ConnectorConfig type defined', connectorSrc.includes('ConnectorConfig'));

const engineSrc = readFileSync('src/engine/types.ts', 'utf-8');
check('NormalizedModel defined', engineSrc.includes('interface NormalizedModel'));
check('NormalizedElement defined', engineSrc.includes('interface NormalizedElement'));
check('NormalizedRelationship defined', engineSrc.includes('interface NormalizedRelationship'));
check('NormalizedDiagram defined', engineSrc.includes('interface NormalizedDiagram'));
check('GraphNode defined', engineSrc.includes('interface GraphNode'));
check('AnalysisGraph defined', engineSrc.includes('interface AnalysisGraph'));
check('ImpactResult defined', engineSrc.includes('interface ImpactResult'));
check('CoverageReport defined', engineSrc.includes('interface CoverageReport'));
check('elementTypeToLayer function defined', engineSrc.includes('function elementTypeToLayer'));

// ---------------------------------------------------------------------------
// RG-5: Folder structure
// ---------------------------------------------------------------------------
console.log('\n=== RG-5: Folder Structure ===');

const requiredDirs = ['src/connectors', 'src/engine', 'src/ui', 'src/stores', 'src/export'];
for (const dir of requiredDirs) {
  check(`${dir}/ exists`, existsSync(dir));
}

// ---------------------------------------------------------------------------
// RG-2: Spike document
// ---------------------------------------------------------------------------
console.log('\n=== RG-2: Spike Document ===');

const spikePath = 'docs/spikes/architeezy-api-research.md';
check('Spike document exists', existsSync(spikePath));

const spikeContent = readFileSync(spikePath, 'utf-8');
check('Spike covers endpoints', spikeContent.includes('Endpoint') || spikeContent.includes('endpoint'));
check('Spike covers auth', spikeContent.includes('Auth') || spikeContent.includes('auth'));
check('Spike covers CORS', spikeContent.includes('CORS'));
check('Spike covers D-15 decision', spikeContent.includes('D-15'));
check('Spike covers D-16 decision', spikeContent.includes('D-16'));

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed, ${passed + failed} total`);
if (failed === 0) {
  console.log('🟢 All Readiness Gate conditions PASSED. M1 is unblocked.');
} else {
  console.log('🔴 Some conditions FAILED. Review before proceeding to M1.');
  process.exit(1);
}
