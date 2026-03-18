import { describe, it, expect, vi, beforeEach } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { DemoConnector } from '../DemoConnector';
import type { NormalizedModel } from '../../../engine/types';

const demoJson: NormalizedModel = JSON.parse(
  readFileSync(resolve(__dirname, '../../../../demo/digital-bank.json'), 'utf-8'),
);

describe('DemoConnector', () => {
  let connector: DemoConnector;

  beforeEach(() => {
    connector = new DemoConnector();
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(demoJson),
      }),
    );
  });

  it('connect() resolves without error', async () => {
    await expect(connector.connect({ url: '', token: '' })).resolves.toBeUndefined();
  });

  it('listModels() returns exactly one model entry', async () => {
    const models = await connector.listModels();
    expect(models).toEqual([{ id: 'demo', name: 'Digital Bank' }]);
  });

  it('loadModel("demo") returns a valid NormalizedModel', async () => {
    const model = await connector.loadModel('demo');
    expect(model.id).toBe('model-digital-bank-001');
    expect(model.name).toBe('Digital Bank Architecture');
    expect(Array.isArray(model.elements)).toBe(true);
    expect(Array.isArray(model.relationships)).toBe(true);
    expect(Array.isArray(model.diagrams)).toBe(true);
    expect(Array.isArray(model.warnings)).toBe(true);
  });

  it('loadModel returns correct element count', async () => {
    const model = await connector.loadModel('demo');
    expect(model.elements.length).toBe(102);
  });

  it('loadModel returns correct relationship count', async () => {
    const model = await connector.loadModel('demo');
    expect(model.relationships.length).toBe(160);
  });

  it('loadModel returns correct diagram count', async () => {
    const model = await connector.loadModel('demo');
    expect(model.diagrams.length).toBe(10);
  });
});
