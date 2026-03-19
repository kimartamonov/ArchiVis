import { describe, it, expect } from 'vitest';
import { applyNodeHighlighting, applyEdgeHighlighting } from '../applyHighlighting';
import type { Node as RFNode, Edge as RFEdge } from '@xyflow/react';

function makeNodes(): RFNode[] {
  return [
    { id: 'a', position: { x: 0, y: 0 }, data: {}, style: { background: '#B5FFFF', opacity: 1 } },
    { id: 'b', position: { x: 0, y: 0 }, data: {}, style: { background: '#FFFFB5', opacity: 1 } },
    { id: 'c', position: { x: 0, y: 0 }, data: {}, style: { background: '#B5FFB5', opacity: 1 } },
  ];
}

function makeEdges(): RFEdge[] {
  return [
    { id: 'e1', source: 'a', target: 'b' },
    { id: 'e2', source: 'b', target: 'c' },
  ];
}

describe('applyNodeHighlighting', () => {
  it('returns original nodes when highlightIds is null', () => {
    const nodes = makeNodes();
    const result = applyNodeHighlighting(nodes, null, null);
    expect(result).toBe(nodes);
  });

  it('returns original nodes when highlightIds is empty', () => {
    const nodes = makeNodes();
    const result = applyNodeHighlighting(nodes, new Set(), null);
    expect(result).toBe(nodes);
  });

  it('dims non-affected nodes', () => {
    const result = applyNodeHighlighting(makeNodes(), new Set(['b']), 'a');
    const nodeC = result.find((n) => n.id === 'c')!;
    expect((nodeC.style as { opacity: number }).opacity).toBe(0.2);
  });

  it('highlights affected nodes with accent border', () => {
    const result = applyNodeHighlighting(makeNodes(), new Set(['b']), 'a');
    const nodeB = result.find((n) => n.id === 'b')!;
    expect((nodeB.style as { border: string }).border).toContain('#aa3bff');
    expect((nodeB.style as { opacity: number }).opacity).toBe(1);
  });

  it('gives source node distinct treatment (thicker border + glow)', () => {
    const result = applyNodeHighlighting(makeNodes(), new Set(['b']), 'a');
    const nodeA = result.find((n) => n.id === 'a')!;
    expect((nodeA.style as { border: string }).border).toContain('3px');
    expect((nodeA.style as { boxShadow: string }).boxShadow).toBeTruthy();
  });
});

describe('applyEdgeHighlighting', () => {
  it('returns original edges when highlightIds is null', () => {
    const edges = makeEdges();
    const result = applyEdgeHighlighting(edges, null, null);
    expect(result).toBe(edges);
  });

  it('highlights edges between affected nodes', () => {
    const result = applyEdgeHighlighting(makeEdges(), new Set(['b']), 'a');
    const e1 = result.find((e) => e.id === 'e1')!;
    expect((e1.style as { opacity: number }).opacity).toBe(1);
    expect((e1.style as { strokeWidth: number }).strokeWidth).toBe(2);
  });

  it('dims edges where target is not affected', () => {
    const result = applyEdgeHighlighting(makeEdges(), new Set(['b']), 'a');
    const e2 = result.find((e) => e.id === 'e2')!;
    // b→c: b is affected, c is not → dimmed
    expect((e2.style as { opacity: number }).opacity).toBe(0.1);
  });
});
