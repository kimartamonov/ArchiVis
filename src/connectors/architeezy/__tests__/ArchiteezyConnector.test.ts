import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ArchiteezyConnector } from '../ArchiteezyConnector';

function mockFetch(handler: (url: string) => { status: number; body?: unknown }) {
  return vi.fn((url: string) => {
    const result = handler(url);
    return Promise.resolve({
      ok: result.status >= 200 && result.status < 300,
      status: result.status,
      statusText: result.status === 200 ? 'OK' : result.status === 204 ? 'No Content' : 'Error',
      json: () => Promise.resolve(result.body),
    } as Response);
  });
}

describe('ArchiteezyConnector', () => {
  let connector: ArchiteezyConnector;

  beforeEach(() => {
    connector = new ArchiteezyConnector();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // -------------------------------------------------------------------------
  // connect()
  // -------------------------------------------------------------------------

  it('connect() with valid credentials resolves', async () => {
    vi.stubGlobal(
      'fetch',
      mockFetch(() => ({ status: 200, body: { name: 'Test User' } })),
    );
    await expect(
      connector.connect({ url: 'https://architeezy.com', token: 'valid-token' }),
    ).resolves.toBeUndefined();
  });

  it('connect() with anonymous access (204) resolves', async () => {
    vi.stubGlobal(
      'fetch',
      mockFetch(() => ({ status: 204 })),
    );
    await expect(
      connector.connect({ url: 'https://architeezy.com', token: '' }),
    ).resolves.toBeUndefined();
  });

  it('connect() with invalid token throws authentication error', async () => {
    vi.stubGlobal(
      'fetch',
      mockFetch(() => ({ status: 401, body: {} })),
    );
    await expect(
      connector.connect({ url: 'https://architeezy.com', token: 'bad-token' }),
    ).rejects.toThrow('Authentication failed');
  });

  it('connect() with unreachable URL throws network error', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.reject(new Error('fetch failed'))),
    );
    await expect(
      connector.connect({ url: 'https://unreachable.example.com', token: '' }),
    ).rejects.toThrow('Network error');
  });

  it('connect() with invalid URL format throws', async () => {
    await expect(connector.connect({ url: 'not-a-url', token: '' })).rejects.toThrow(
      'Invalid Architeezy URL',
    );
  });

  // -------------------------------------------------------------------------
  // listModels()
  // -------------------------------------------------------------------------

  it('listModels() returns models from paginated response', async () => {
    vi.stubGlobal(
      'fetch',
      mockFetch((url) => {
        if (url.includes('/api/users/current')) {
          return { status: 200, body: {} };
        }
        return {
          status: 200,
          body: {
            _embedded: {
              models: [
                { id: 'model-1', name: 'Model One' },
                { id: 'model-2', name: 'Model Two' },
              ],
            },
            page: { totalPages: 1 },
          },
        };
      }),
    );

    await connector.connect({ url: 'https://architeezy.com', token: 'tok' });
    const models = await connector.listModels();
    expect(models).toEqual([
      { id: 'model-1', name: 'Model One' },
      { id: 'model-2', name: 'Model Two' },
    ]);
  });

  // -------------------------------------------------------------------------
  // loadModel() — normalization
  // -------------------------------------------------------------------------

  const sampleApiResponse = {
    content: [
      {
        id: 'root-id',
        eClass: 'archimate:ArchimateModel',
        data: {
          name: 'Test Model',
          folders: [
            {
              id: 'folder-business',
              eClass: 'archimate:Folder',
              data: {
                name: 'Business',
                type: 'business',
                elements: [
                  {
                    id: 'el-1',
                    eClass: 'archimate:BusinessActor',
                    data: { name: 'Actor One', id: 'id-1' },
                  },
                  {
                    id: 'el-2',
                    eClass: 'archimate:BusinessProcess',
                    data: { name: 'Process One', id: 'id-2' },
                  },
                ],
                folders: [],
              },
            },
            {
              id: 'folder-relations',
              eClass: 'archimate:Folder',
              data: {
                name: 'Relations',
                type: 'relations',
                elements: [
                  {
                    id: 'rel-1',
                    eClass: 'archimate:ServingRelationship',
                    data: { id: 'id-r1', source: 'el-1', target: 'el-2' },
                  },
                  {
                    id: 'rel-2',
                    eClass: 'archimate:FlowRelationship',
                    data: { id: 'id-r2', source: 'el-1', target: 'el-missing' },
                  },
                ],
                folders: [],
              },
            },
            {
              id: 'folder-views',
              eClass: 'archimate:Folder',
              data: {
                name: 'Views',
                type: 'diagrams',
                elements: [
                  {
                    id: 'diag-1',
                    eClass: 'archimate:ArchimateDiagramModel',
                    data: {
                      name: 'Overview',
                      id: 'id-d1',
                      viewpoint: 'layered',
                      children: [
                        {
                          id: 'dmo-1',
                          eClass: 'archimate:DiagramModelArchimateObject',
                          data: { id: 'id-dmo1', archimateElement: 'el-1' },
                        },
                        {
                          id: 'dmo-2',
                          eClass: 'archimate:DiagramModelArchimateObject',
                          data: { id: 'id-dmo2', archimateElement: 'el-2' },
                        },
                      ],
                    },
                  },
                ],
                folders: [],
              },
            },
          ],
        },
      },
    ],
  };

  function setupLoadModelMock() {
    vi.stubGlobal(
      'fetch',
      mockFetch((url) => {
        if (url.includes('/api/users/current')) return { status: 200, body: {} };
        if (url.includes('/content')) return { status: 200, body: sampleApiResponse };
        // metadata
        return { status: 200, body: { name: 'Test Model' } };
      }),
    );
  }

  it('loadModel() returns correct element count', async () => {
    setupLoadModelMock();
    await connector.connect({ url: 'https://architeezy.com', token: 'tok' });
    const model = await connector.loadModel('scope/proj/ver/model');
    expect(model.elements.length).toBe(2);
  });

  it('loadModel() returns correct relationship count', async () => {
    setupLoadModelMock();
    await connector.connect({ url: 'https://architeezy.com', token: 'tok' });
    const model = await connector.loadModel('scope/proj/ver/model');
    expect(model.relationships.length).toBe(2);
  });

  it('loadModel() returns correct diagram count', async () => {
    setupLoadModelMock();
    await connector.connect({ url: 'https://architeezy.com', token: 'tok' });
    const model = await connector.loadModel('scope/proj/ver/model');
    expect(model.diagrams.length).toBe(1);
  });

  it('loadModel() strips archimate: prefix from types', async () => {
    setupLoadModelMock();
    await connector.connect({ url: 'https://architeezy.com', token: 'tok' });
    const model = await connector.loadModel('scope/proj/ver/model');
    expect(model.elements[0].type).toBe('BusinessActor');
    expect(model.relationships[0].type).toBe('ServingRelationship');
  });

  it('loadModel() populates diagramIds on elements', async () => {
    setupLoadModelMock();
    await connector.connect({ url: 'https://architeezy.com', token: 'tok' });
    const model = await connector.loadModel('scope/proj/ver/model');
    expect(model.elements[0].diagramIds).toContain('diag-1');
    expect(model.elements[1].diagramIds).toContain('diag-1');
  });

  it('loadModel() collects broken reference warnings', async () => {
    setupLoadModelMock();
    await connector.connect({ url: 'https://architeezy.com', token: 'tok' });
    const model = await connector.loadModel('scope/proj/ver/model');
    const brokenWarnings = model.warnings.filter((w) => w.type === 'broken_reference');
    expect(brokenWarnings.length).toBeGreaterThan(0);
    expect(brokenWarnings[0].message).toContain('el-missing');
  });

  it('loadModel() uses id as name when name is missing', async () => {
    vi.stubGlobal(
      'fetch',
      mockFetch((url) => {
        if (url.includes('/api/users/current')) return { status: 200, body: {} };
        if (url.includes('/content')) {
          return {
            status: 200,
            body: {
              content: [
                {
                  id: 'root',
                  eClass: 'archimate:ArchimateModel',
                  data: {
                    folders: [
                      {
                        id: 'f1',
                        data: {
                          elements: [
                            {
                              id: 'el-no-name',
                              eClass: 'archimate:ApplicationComponent',
                              data: { id: 'id-x' },
                            },
                          ],
                          folders: [],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          };
        }
        return { status: 200, body: { name: 'M' } };
      }),
    );
    await connector.connect({ url: 'https://architeezy.com', token: 'tok' });
    const model = await connector.loadModel('scope/proj/ver/model');
    expect(model.elements[0].name).toBe('el-no-name');
  });
});
