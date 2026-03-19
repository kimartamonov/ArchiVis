import { makeElement, makeRelationship, makeModel } from '../../graph/__tests__/fixtures';
import { buildGraph } from '../../graph/buildGraph';
import { calculateMetrics } from '../../graph/calculateMetrics';
import type { AnalysisGraph, NormalizedModel } from '../../types';

/** Linear chain: A → B → C → D */
export function buildChainGraph(): { graph: AnalysisGraph; model: NormalizedModel } {
  const model = makeModel(
    [
      makeElement('a', 'A', 'ApplicationComponent', ['d1']),
      makeElement('b', 'B', 'ApplicationService', ['d1']),
      makeElement('c', 'C', 'BusinessProcess', ['d1']),
      makeElement('d', 'D', 'Node', ['d1']),
    ],
    [
      makeRelationship('r1', 'a', 'b'),
      makeRelationship('r2', 'b', 'c'),
      makeRelationship('r3', 'c', 'd'),
    ],
    [{ id: 'd1', name: 'Overview', elementIds: ['a', 'b', 'c', 'd'] }],
  );
  const { graph } = buildGraph(model);
  calculateMetrics(graph);
  return { graph, model };
}

/** Diamond: A → B, A → C, B → D, C → D */
export function buildDiamondGraph(): { graph: AnalysisGraph; model: NormalizedModel } {
  const model = makeModel(
    [
      makeElement('a', 'A', 'ApplicationComponent', ['d1']),
      makeElement('b', 'B', 'BusinessProcess', ['d1']),
      makeElement('c', 'C', 'ApplicationService', ['d1']),
      makeElement('d', 'D', 'Node', []),
    ],
    [
      makeRelationship('r1', 'a', 'b'),
      makeRelationship('r2', 'a', 'c'),
      makeRelationship('r3', 'b', 'd'),
      makeRelationship('r4', 'c', 'd'),
    ],
    [{ id: 'd1', name: 'Diamond View', elementIds: ['a', 'b', 'c'] }],
  );
  const { graph } = buildGraph(model);
  calculateMetrics(graph);
  return { graph, model };
}

/** Star: center → spoke1, spoke2, spoke3, spoke4, spoke5 */
export function buildStarGraph(): { graph: AnalysisGraph; model: NormalizedModel } {
  const model = makeModel(
    [
      makeElement('center', 'Hub', 'ApplicationComponent', ['d1', 'd2']),
      makeElement('s1', 'Spoke 1', 'BusinessProcess', ['d1']),
      makeElement('s2', 'Spoke 2', 'ApplicationService', ['d1']),
      makeElement('s3', 'Spoke 3', 'Node', []),
      makeElement('s4', 'Spoke 4', 'Goal', ['d2']),
      makeElement('s5', 'Spoke 5', 'WorkPackage', []),
    ],
    [
      makeRelationship('r1', 'center', 's1'),
      makeRelationship('r2', 'center', 's2'),
      makeRelationship('r3', 'center', 's3'),
      makeRelationship('r4', 'center', 's4'),
      makeRelationship('r5', 'center', 's5'),
    ],
    [
      { id: 'd1', name: 'Main View', elementIds: ['center', 's1', 's2'] },
      { id: 'd2', name: 'Goals View', elementIds: ['center', 's4'] },
    ],
  );
  const { graph } = buildGraph(model);
  calculateMetrics(graph);
  return { graph, model };
}

/** Cycle: A → B → C → A */
export function buildCycleGraph(): { graph: AnalysisGraph; model: NormalizedModel } {
  const model = makeModel(
    [
      makeElement('a', 'A', 'ApplicationComponent', ['d1']),
      makeElement('b', 'B', 'ApplicationComponent', ['d1']),
      makeElement('c', 'C', 'ApplicationComponent', ['d1']),
    ],
    [
      makeRelationship('r1', 'a', 'b'),
      makeRelationship('r2', 'b', 'c'),
      makeRelationship('r3', 'c', 'a'),
    ],
    [{ id: 'd1', name: 'Cycle View', elementIds: ['a', 'b', 'c'] }],
  );
  const { graph } = buildGraph(model);
  calculateMetrics(graph);
  return { graph, model };
}
