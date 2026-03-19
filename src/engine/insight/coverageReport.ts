import type { AnalysisGraph, CoverageReport, LayerSummary, BrokenReference, Layer } from '../types';
import { elementTypeToLayer } from '../types';

/**
 * Computes a CoverageReport from an AnalysisGraph.
 *
 * - orphanCount/orphanPercent: nodes where isOrphan === true
 * - layerDistribution: element count per ArchiMate layer
 * - brokenReferences: passed through from build warnings
 */
export function buildCoverageReport(
  graph: AnalysisGraph,
  warnings: BrokenReference[] = [],
): CoverageReport {
  const totalElements = graph.nodes.size;

  if (totalElements === 0) {
    return {
      totalElements: 0,
      orphanCount: 0,
      orphanPercent: 0,
      orphanElements: [],
      layerDistribution: [],
      brokenReferences: warnings,
    };
  }

  const orphanElements = [];
  const layerCounts = new Map<Layer, number>();

  for (const node of graph.nodes.values()) {
    if (node.isOrphan) {
      orphanElements.push(node.element);
    }

    const layer = elementTypeToLayer(node.element.type);
    layerCounts.set(layer, (layerCounts.get(layer) ?? 0) + 1);
  }

  const orphanCount = orphanElements.length;
  const orphanPercent = Math.round((orphanCount / totalElements) * 1000) / 10;

  const layerDistribution: LayerSummary[] = Array.from(layerCounts.entries())
    .map(([layer, count]) => ({ layer, count }))
    .sort((a, b) => b.count - a.count);

  return {
    totalElements,
    orphanCount,
    orphanPercent,
    orphanElements,
    layerDistribution,
    brokenReferences: warnings,
  };
}
