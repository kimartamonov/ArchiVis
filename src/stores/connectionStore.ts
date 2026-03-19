import { create } from 'zustand';

const STORAGE_KEY_URL = 'archilens:url';
const STORAGE_KEY_TOKEN = 'archilens:token';

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

export interface ConnectionState {
  url: string;
  token: string;
  status: ConnectionStatus;
  error: string | null;
  setConnection: (url: string, token: string) => void;
  setStatus: (status: ConnectionStatus) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

function getStorage(type: 'local' | 'session'): Storage | null {
  try {
    return type === 'local' ? globalThis.localStorage : globalThis.sessionStorage;
  } catch {
    return null;
  }
}

function readStorage(type: 'local' | 'session', key: string): string {
  try {
    return getStorage(type)?.getItem(key) ?? '';
  } catch {
    return '';
  }
}

function writeStorage(type: 'local' | 'session', key: string, value: string): void {
  try {
    getStorage(type)?.setItem(key, value);
  } catch {
    // storage unavailable — silently ignore
  }
}

function removeStorage(type: 'local' | 'session', key: string): void {
  try {
    getStorage(type)?.removeItem(key);
  } catch {
    // storage unavailable — silently ignore
  }
}

const initialState = {
  url: readStorage('local', STORAGE_KEY_URL),
  token: readStorage('session', STORAGE_KEY_TOKEN),
  status: 'disconnected' as ConnectionStatus,
  error: null as string | null,
};

export const useConnectionStore = create<ConnectionState>((set) => ({
  ...initialState,

  setConnection: (url: string, token: string) => {
    writeStorage('local', STORAGE_KEY_URL, url);
    writeStorage('session', STORAGE_KEY_TOKEN, token);
    set({ url, token });
  },

  setStatus: (status: ConnectionStatus) => set({ status }),

  setError: (error: string | null) => set({ error, status: error ? 'error' : 'disconnected' }),

  reset: () => {
    removeStorage('local', STORAGE_KEY_URL);
    removeStorage('session', STORAGE_KEY_TOKEN);
    set({ url: '', token: '', status: 'disconnected', error: null });
  },
}));
