import type { NormalizedModel } from '../../engine/types';
import type { ConnectorConfig, DataConnector, ModelSummary } from '../types';
import { normalizeModelContent } from './normalize';

export class ArchiteezyConnector implements DataConnector {
  private baseUrl = '';
  private headers: Record<string, string> = {};

  async connect(config: ConnectorConfig): Promise<void> {
    // Validate URL format
    let url: URL;
    try {
      url = new URL(config.url);
    } catch {
      throw new Error(`Invalid Architeezy URL: ${config.url}`);
    }

    this.baseUrl = url.origin;
    this.headers = {
      Accept: 'application/json',
    };
    if (config.token) {
      this.headers['Authorization'] = `Bearer ${config.token}`;
    }

    // Test connectivity by checking current user endpoint
    const testUrl = config.proxyUrl
      ? `${config.proxyUrl}/${this.baseUrl}/api/users/current`
      : `${this.baseUrl}/api/users/current`;

    const response = await this.fetchWithError(testUrl);

    // 204 = anonymous (valid for public projects), 200 = authenticated
    if (response.status !== 200 && response.status !== 204) {
      if (response.status === 401 || response.status === 403) {
        throw new Error(`Authentication failed: ${response.status} ${response.statusText}`);
      }
      throw new Error(`Connection failed: ${response.status} ${response.statusText}`);
    }
  }

  async listModels(): Promise<ModelSummary[]> {
    const results: ModelSummary[] = [];
    let page = 0;
    let totalPages = 1;

    while (page < totalPages) {
      const url = `${this.baseUrl}/api/models?page=${page}&size=100&sort=name,asc`;
      const response = await this.fetchWithError(url);
      const data = await response.json();

      // Spring Data paginated response
      const models = data._embedded?.models ?? data.content ?? [];
      for (const m of models) {
        if (m.id && m.name) {
          results.push({ id: m.id, name: m.name });
        }
      }

      totalPages = data.page?.totalPages ?? data.totalPages ?? 1;
      page++;
    }

    return results;
  }

  async loadModel(id: string): Promise<NormalizedModel> {
    // The id can be a UUID or a slug path (scope/project/version/model)
    const contentUrl = id.includes('/')
      ? `${this.baseUrl}/api/models/${id}/content?format=json`
      : `${this.baseUrl}/api/models/${id}/content?format=json`;

    const response = await this.fetchWithError(contentUrl);
    const raw = await response.json();

    // Try to get model name from a metadata call (best effort)
    let modelName = 'Model';
    try {
      const metaUrl = id.includes('/')
        ? `${this.baseUrl}/api/models/${id}`
        : `${this.baseUrl}/api/models/${id}`;
      const metaResponse = await fetch(metaUrl, { headers: this.headers });
      if (metaResponse.ok) {
        const meta = await metaResponse.json();
        modelName = meta.name ?? modelName;
      }
    } catch {
      // Metadata fetch is best-effort; continue with default name
    }

    return normalizeModelContent(id, modelName, raw);
  }

  private async fetchWithError(url: string): Promise<Response> {
    let response: Response;
    try {
      response = await fetch(url, { headers: this.headers });
    } catch (err) {
      throw new Error(
        `Network error connecting to Architeezy: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
    if (!response.ok && response.status !== 204) {
      if (response.status === 401 || response.status === 403) {
        throw new Error(`Authentication failed: ${response.status} ${response.statusText}`);
      }
      throw new Error(`Architeezy API error: ${response.status} ${response.statusText}`);
    }
    return response;
  }
}
