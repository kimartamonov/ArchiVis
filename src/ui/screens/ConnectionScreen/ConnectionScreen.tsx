import { useState, useRef } from 'react';
import { useConnectionStore } from '../../../stores/connectionStore';
import { useModelStore } from '../../../stores/modelStore';
import { useUIStore } from '../../../stores/uiStore';
import { DemoConnector } from '../../../connectors/demo/DemoConnector';
import { ArchiteezyConnector } from '../../../connectors/architeezy/ArchiteezyConnector';
import type { DataConnector } from '../../../connectors/types';

export function ConnectionScreen() {
  const { url, token, status, error, setConnection, setStatus, setError, reset } =
    useConnectionStore();
  const { models, setModels, setCurrentModel, setLoading: setModelLoading } = useModelStore();
  const { setScreen } = useUIStore();

  const [urlInput, setUrlInput] = useState(url);
  const [tokenInput, setTokenInput] = useState(token);
  const [selectedModelId, setSelectedModelId] = useState('');
  const [modelLoading, setModelLoadingLocal] = useState(false);
  const connectorRef = useRef<DataConnector | null>(null);

  const isConnecting = status === 'connecting';
  const isConnected = status === 'connected';

  async function handleConnect() {
    if (!urlInput.trim()) {
      setError('Please enter an Architeezy server URL');
      return;
    }

    setError(null);
    setConnection(urlInput.trim(), tokenInput);
    setStatus('connecting');

    const connector = new ArchiteezyConnector();
    connectorRef.current = connector;

    try {
      await connector.connect({ url: urlInput.trim(), token: tokenInput });
      const modelList = await connector.listModels();
      setModels(modelList);
      setStatus('connected');
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      const isCors =
        err instanceof TypeError && (message.includes('fetch') || message.includes('network'));
      if (isCors) {
        setError(
          `Network error — this may be a CORS issue. Ensure the Architeezy server allows requests from this origin, or configure a CORS proxy.`,
        );
      } else {
        setError(message);
      }
    }
  }

  async function handleLoadDemo() {
    setModelLoading(true);
    setModelLoadingLocal(true);
    setError(null);

    try {
      const connector = new DemoConnector();
      const model = await connector.loadModel('demo');
      setCurrentModel(model);
      setScreen('graph');
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setModelLoading(false);
      setModelLoadingLocal(false);
    }
  }

  async function handleOpenModel() {
    if (!selectedModelId || !connectorRef.current) return;

    setModelLoading(true);
    setModelLoadingLocal(true);
    setError(null);

    try {
      const model = await connectorRef.current.loadModel(selectedModelId);
      setCurrentModel(model);
      setScreen('graph');
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setModelLoading(false);
      setModelLoadingLocal(false);
    }
  }

  function handleDisconnect() {
    reset();
    useModelStore.getState().reset();
    connectorRef.current = null;
    setSelectedModelId('');
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>ArchiLens</h1>
      <p style={styles.subtitle}>ArchiMate Model Analysis Tool</p>

      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Connect to Architeezy</h2>

        <div style={styles.field}>
          <label htmlFor="url-input" style={styles.label}>
            Server URL
          </label>
          <input
            id="url-input"
            type="text"
            placeholder="https://your-architeezy-server.com"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            disabled={isConnecting || isConnected}
            style={styles.input}
          />
        </div>

        <div style={styles.field}>
          <label htmlFor="token-input" style={styles.label}>
            API Token
          </label>
          <input
            id="token-input"
            type="password"
            placeholder="Enter API token (optional for public projects)"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            disabled={isConnecting || isConnected}
            style={styles.input}
          />
        </div>

        {!isConnected ? (
          <button
            onClick={handleConnect}
            disabled={isConnecting || modelLoading}
            style={{
              ...styles.button,
              ...styles.buttonPrimary,
              opacity: isConnecting || modelLoading ? 0.6 : 1,
            }}
          >
            {isConnecting ? 'Connecting…' : 'Connect'}
          </button>
        ) : (
          <div>
            <div style={styles.field}>
              <label htmlFor="model-select" style={styles.label}>
                Select Model
              </label>
              <select
                id="model-select"
                value={selectedModelId}
                onChange={(e) => setSelectedModelId(e.target.value)}
                disabled={modelLoading}
                style={styles.input}
              >
                <option value="">— Choose a model —</option>
                {models.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.buttonRow}>
              <button
                onClick={handleOpenModel}
                disabled={!selectedModelId || modelLoading}
                style={{
                  ...styles.button,
                  ...styles.buttonPrimary,
                  opacity: !selectedModelId || modelLoading ? 0.6 : 1,
                }}
              >
                {modelLoading ? 'Loading…' : 'Open Model'}
              </button>
              <button onClick={handleDisconnect} style={{ ...styles.button, ...styles.buttonGhost }}>
                Disconnect
              </button>
            </div>
          </div>
        )}

        {error && (
          <div style={styles.error} role="alert">
            {error}
          </div>
        )}
      </div>

      <div style={styles.divider}>
        <span style={styles.dividerText}>or</span>
      </div>

      <button
        onClick={handleLoadDemo}
        disabled={isConnecting || modelLoading}
        style={{
          ...styles.button,
          ...styles.buttonDemo,
          opacity: isConnecting || modelLoading ? 0.6 : 1,
        }}
      >
        {modelLoading && !isConnected ? 'Loading Demo…' : 'Load Demo Dataset'}
      </button>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: 480,
    margin: '0 auto',
    padding: '3rem 1.5rem',
  },
  title: {
    fontSize: 42,
    margin: '0 0 0.25rem',
  },
  subtitle: {
    color: 'var(--text)',
    marginBottom: '2rem',
  },
  card: {
    border: '1px solid var(--border)',
    borderRadius: 12,
    padding: '1.5rem',
    textAlign: 'left' as const,
  },
  cardTitle: {
    fontSize: 20,
    margin: '0 0 1rem',
  },
  field: {
    marginBottom: '0.75rem',
  },
  label: {
    display: 'block',
    fontSize: 14,
    fontWeight: 500,
    color: 'var(--text-h)',
    marginBottom: 4,
  },
  input: {
    width: '100%',
    padding: '0.5rem 0.75rem',
    fontSize: 16,
    border: '1px solid var(--border)',
    borderRadius: 6,
    background: 'var(--bg)',
    color: 'var(--text-h)',
    boxSizing: 'border-box' as const,
    fontFamily: 'var(--sans)',
  },
  button: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.6rem 1.25rem',
    fontSize: 16,
    fontWeight: 500,
    borderRadius: 8,
    cursor: 'pointer',
    border: 'none',
    fontFamily: 'var(--sans)',
    transition: 'opacity 0.15s',
  },
  buttonPrimary: {
    width: '100%',
    background: 'var(--accent)',
    color: '#fff',
    marginTop: '0.5rem',
  },
  buttonDemo: {
    width: '100%',
    maxWidth: 480,
    background: 'var(--accent-bg)',
    color: 'var(--accent)',
    border: '1px solid var(--accent-border)',
  },
  buttonGhost: {
    background: 'transparent',
    color: 'var(--text)',
    border: '1px solid var(--border)',
    flex: 1,
  },
  buttonRow: {
    display: 'flex',
    gap: '0.5rem',
    marginTop: '0.5rem',
  },
  error: {
    marginTop: '0.75rem',
    padding: '0.75rem',
    borderRadius: 8,
    background: 'rgba(220, 38, 38, 0.1)',
    color: '#dc2626',
    fontSize: 14,
    lineHeight: 1.4,
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    margin: '1.5rem 0',
    color: 'var(--text)',
    fontSize: 14,
  },
  dividerText: {
    flex: 1,
    textAlign: 'center' as const,
  },
};
