// =============================================================================
// Connector Types — ArchiLens MVP
// Source: 08_System_Context_and_Architecture.md
// =============================================================================

import type { NormalizedModel } from '../engine/types';

/** Configuration for connecting to an Architeezy instance */
export interface ConnectorConfig {
  url: string;
  token: string;
  proxyUrl?: string;
}

/** Summary of a model (for model list) */
export interface ModelSummary {
  id: string;
  name: string;
}

/** Data connector interface — the contract every connector must implement */
export interface DataConnector {
  connect(config: ConnectorConfig): Promise<void>;
  listModels(): Promise<ModelSummary[]>;
  loadModel(id: string): Promise<NormalizedModel>;
}
