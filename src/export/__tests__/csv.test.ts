import { describe, it, expect } from 'vitest';
import { generateCSV } from '../csv';
import {
  makeExportNode,
  NODE_PG,
  NODE_PS,
  NODE_SPECIAL,
  NODE_CYRILLIC,
  NODE_EMPTY_NAME,
  NODE_ZERO_DEGREE,
} from './fixtures';

function lines(csv: string): string[] {
  return csv.replace('\uFEFF', '').split('\n');
}

describe('generateCSV', () => {
  // ---- BOM & Header ----

  it('starts with UTF-8 BOM', () => {
    const csv = generateCSV([NODE_PG]);
    expect(csv.charCodeAt(0)).toBe(0xFEFF);
  });

  it('has correct header row', () => {
    const header = lines(generateCSV([NODE_PG]))[0];
    expect(header).toBe('id,name,type,layer,degree,in_degree,out_degree,diagrams_count,is_orphan');
  });

  // ---- Row count ----

  it('produces correct number of rows (header + data)', () => {
    expect(lines(generateCSV([NODE_PG, NODE_PS])).length).toBe(3);
  });

  it('empty input → BOM + header only', () => {
    const csv = generateCSV([]);
    expect(csv.charCodeAt(0)).toBe(0xFEFF);
    expect(lines(csv).length).toBe(1);
  });

  it('single node → 2 lines', () => {
    expect(lines(generateCSV([NODE_PG])).length).toBe(2);
  });

  // ---- Data values ----

  it('data row has correct values', () => {
    const row = lines(generateCSV([NODE_PG]))[1];
    expect(row).toBe('pg,Payment Gateway,ApplicationComponent,Application,8,3,5,1,false');
  });

  it('is_orphan renders as true/false', () => {
    const csv = generateCSV([NODE_PG, NODE_PS]);
    const rows = lines(csv);
    expect(rows[1]).toContain(',false');
    expect(rows[2]).toContain(',true');
  });

  it('layer is computed correctly from element type', () => {
    const techNode = makeExportNode('n1', 'Web Server', 'Node', { degree: 3 });
    const row = lines(generateCSV([techNode]))[1];
    expect(row).toContain(',Technology,');
  });

  // ---- CSV escaping ----

  it('escapes values containing commas', () => {
    const node = makeExportNode('x', 'Risk, Return & Analysis', 'ApplicationComponent');
    const row = lines(generateCSV([node]))[1];
    expect(row).toContain('"Risk, Return & Analysis"');
  });

  it('escapes values containing double quotes', () => {
    const node = makeExportNode('x', 'The "Gateway" Service', 'ApplicationComponent');
    const row = lines(generateCSV([node]))[1];
    expect(row).toContain('"The ""Gateway"" Service"');
  });

  it('escapes values containing newlines', () => {
    const node = makeExportNode('x', 'Line1\nLine2', 'ApplicationComponent');
    const csv = generateCSV([node]);
    expect(csv).toContain('"Line1\nLine2"');
  });

  // ---- Encoding (Cyrillic) ----

  it('preserves Cyrillic characters', () => {
    const csv = generateCSV([NODE_CYRILLIC]);
    const row = lines(csv)[1];
    expect(row).toContain('Платёжный Шлюз');
  });

  // ---- Edge cases ----

  it('handles node with empty name', () => {
    const row = lines(generateCSV([NODE_EMPTY_NAME]))[1];
    expect(row.startsWith('empty,')).toBe(true);
    // name field is empty but row is still valid
    expect(row.split(',').length).toBeGreaterThanOrEqual(9);
  });

  it('handles zero-degree orphan node', () => {
    const row = lines(generateCSV([NODE_ZERO_DEGREE]))[1];
    expect(row).toContain(',0,0,0,0,true');
  });

  it('handles node with special characters without data loss', () => {
    const row = lines(generateCSV([NODE_SPECIAL]))[1];
    // Name contains & < > " — commas trigger quoting, quotes get doubled
    expect(row).toContain('&');
    expect(row).toContain('<');
    expect(row).toContain('>');
  });
});
