import type { NormalizedModel } from '../../engine/types';
import type { ConnectorConfig, DataConnector, ModelSummary } from '../types';

export class DemoConnector implements DataConnector {
  async connect(_config: ConnectorConfig): Promise<void> {
    // No-op for demo connector — no external connection needed
  }

  async listModels(): Promise<ModelSummary[]> {
    return [{ id: 'demo', name: 'Digital Bank' }];
  }

  async loadModel(_id: string): Promise<NormalizedModel> {
    const base = import.meta.env.BASE_URL ?? '/';
    const response = await fetch(`${base}digital-bank.json`);
    if (!response.ok) {
      throw new Error(`Failed to load demo dataset: ${response.status} ${response.statusText}`);
    }
    const model: NormalizedModel = await response.json();
    return model;
  }
}
