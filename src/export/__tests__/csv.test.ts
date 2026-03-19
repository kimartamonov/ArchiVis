import { describe, it, expect } from 'vitest';
import { generateCSV } from '../csv';
import type { GraphNode } from '../../engine/types';
import { makeElement } from '../../engine/graph/__tests__/fixtures';

function makeNode(
  id: string,
  name: string,
  type: string,
  degree: number = 2,
  isOrphan: boolean = false,
  diagramIds: string[] = ['d1'],
): GraphNode {
  return {
    element: makeElement(id, name, type, diagramIds),
    degree,
    inDegree: 1,
    outDegree: 1,
    diagramsCount: diagramIds.length,
    isOrphan,
  };
}

describe('generateCSV', () => {
  const nodeA = makeNode('pg', 'Payment Gateway', 'ApplicationComponent', 8);
  const nodeB = makeNode('ps', 'Payment Service', 'ApplicationService', 4, true, []);

  it('starts with UTF-8 BOM', () => {
    const csv = generateCSV([nodeA]);
    expect(csv.charCodeAt(0)).toBe(0xFEFF);
  });

  it('has correct header row', () => {
    const csv = generateCSV([nodeA]);
    const firstLine = csv.replace('\uFEFF', '').split('\n')[0];
    expect(firstLine).toBe('id,name,type,layer,degree,in_degree,out_degree,diagrams_count,is_orphan');
  });

  it('produces correct number of rows (header + data)', () => {
    const csv = generateCSV([nodeA, nodeB]);
    const lines = csv.replace('\uFEFF', '').split('\n');
    expect(lines.length).toBe(3); // header + 2 data rows
  });

  it('data row has correct values', () => {
    const csv = generateCSV([nodeA]);
    const lines = csv.replace('\uFEFF', '').split('\n');
    const row = lines[1];
    expect(row).toBe('pg,Payment Gateway,ApplicationComponent,Application,8,1,1,1,false');
  });

  it('is_orphan renders as true/false', () => {
    const csv = generateCSV([nodeA, nodeB]);
    const lines = csv.replace('\uFEFF', '').split('\n');
    expect(lines[1]).toContain(',false');
    expect(lines[2]).toContain(',true');
  });

  it('escapes values containing commas', () => {
    const node = makeNode('x', 'Risk, Return & Analysis', 'ApplicationComponent');
    const csv = generateCSV([node]);
    const lines = csv.replace('\uFEFF', '').split('\n');
    expect(lines[1]).toContain('"Risk, Return & Analysis"');
  });

  it('escapes values containing double quotes', () => {
    const node = makeNode('x', 'The "Gateway" Service', 'ApplicationComponent');
    const csv = generateCSV([node]);
    const lines = csv.replace('\uFEFF', '').split('\n');
    expect(lines[1]).toContain('"The ""Gateway"" Service"');
  });

  it('escapes values containing newlines', () => {
    const node = makeNode('x', 'Line1\nLine2', 'ApplicationComponent');
    const csv = generateCSV([node]);
    // The field should be wrapped in quotes
    expect(csv).toContain('"Line1\nLine2"');
  });

  it('handles empty input — BOM + header only', () => {
    const csv = generateCSV([]);
    expect(csv.charCodeAt(0)).toBe(0xFEFF);
    const lines = csv.replace('\uFEFF', '').split('\n');
    expect(lines.length).toBe(1);
    expect(lines[0]).toContain('id,name');
  });

  it('handles single node without crash', () => {
    const csv = generateCSV([nodeA]);
    const lines = csv.replace('\uFEFF', '').split('\n');
    expect(lines.length).toBe(2);
  });

  it('layer is computed correctly from element type', () => {
    const techNode = makeNode('n1', 'Web Server', 'Node', 3);
    const csv = generateCSV([techNode]);
    const lines = csv.replace('\uFEFF', '').split('\n');
    expect(lines[1]).toContain(',Technology,');
  });
});
