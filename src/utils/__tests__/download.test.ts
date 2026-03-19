// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { sanitizeFileName, downloadBlob } from '../download';

describe('sanitizeFileName', () => {
  it('removes special characters', () => {
    expect(sanitizeFileName('file<name>:test')).toBe('filenametest');
  });

  it('replaces spaces with underscores', () => {
    expect(sanitizeFileName('Payment Gateway')).toBe('Payment_Gateway');
  });

  it('limits length to 60 characters', () => {
    const long = 'a'.repeat(100);
    expect(sanitizeFileName(long).length).toBe(60);
  });

  it('returns "export" for empty input', () => {
    expect(sanitizeFileName('')).toBe('export');
  });

  it('handles Cyrillic characters', () => {
    expect(sanitizeFileName('Платёжный Шлюз')).toBe('Платёжный_Шлюз');
  });
});

describe('downloadBlob', () => {
  it('creates and clicks an anchor element', () => {
    const createObjectURL = vi.fn(() => 'blob:test');
    const revokeObjectURL = vi.fn();
    globalThis.URL.createObjectURL = createObjectURL;
    globalThis.URL.revokeObjectURL = revokeObjectURL;

    const clickSpy = vi.fn();
    const createElementOrig = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
      const el = createElementOrig(tag);
      if (tag === 'a') {
        el.click = clickSpy;
      }
      return el;
    });

    const blob = new Blob(['test'], { type: 'text/plain' });
    downloadBlob(blob, 'test.txt');

    expect(createObjectURL).toHaveBeenCalledWith(blob);
    expect(clickSpy).toHaveBeenCalledOnce();
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:test');

    vi.restoreAllMocks();
  });
});
