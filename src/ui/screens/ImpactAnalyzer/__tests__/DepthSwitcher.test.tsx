// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DepthSwitcher } from '../DepthSwitcher';
import { useAnalysisStore } from '../../../../stores/analysisStore';

// Storage mocks
const storageMock = {
  getItem: vi.fn(() => null), setItem: vi.fn(), removeItem: vi.fn(), clear: vi.fn(),
  get length() { return 0; }, key: vi.fn(() => null),
};
if (!globalThis.localStorage) Object.defineProperty(globalThis, 'localStorage', { value: storageMock, writable: true });
if (!globalThis.sessionStorage) Object.defineProperty(globalThis, 'sessionStorage', { value: storageMock, writable: true });

describe('DepthSwitcher', () => {
  beforeEach(() => {
    useAnalysisStore.getState().reset();
  });

  it('renders three depth buttons', () => {
    render(<DepthSwitcher />);
    expect(screen.getByRole('button', { name: '1' })).toBeTruthy();
    expect(screen.getByRole('button', { name: '2' })).toBeTruthy();
    expect(screen.getByRole('button', { name: '3' })).toBeTruthy();
  });

  it('default depth is 1 (aria-pressed)', () => {
    render(<DepthSwitcher />);
    expect(screen.getByRole('button', { name: '1' }).getAttribute('aria-pressed')).toBe('true');
    expect(screen.getByRole('button', { name: '2' }).getAttribute('aria-pressed')).toBe('false');
    expect(screen.getByRole('button', { name: '3' }).getAttribute('aria-pressed')).toBe('false');
  });

  it('clicking depth 2 updates store', () => {
    render(<DepthSwitcher />);
    fireEvent.click(screen.getByRole('button', { name: '2' }));
    expect(useAnalysisStore.getState().depth).toBe(2);
  });

  it('clicking depth 3 then 1 cycles correctly', () => {
    render(<DepthSwitcher />);
    fireEvent.click(screen.getByRole('button', { name: '3' }));
    expect(useAnalysisStore.getState().depth).toBe(3);
    fireEvent.click(screen.getByRole('button', { name: '1' }));
    expect(useAnalysisStore.getState().depth).toBe(1);
  });

  it('active button updates visually on re-render', () => {
    const { rerender } = render(<DepthSwitcher />);
    fireEvent.click(screen.getByRole('button', { name: '3' }));
    rerender(<DepthSwitcher />);
    expect(screen.getByRole('button', { name: '3' }).getAttribute('aria-pressed')).toBe('true');
    expect(screen.getByRole('button', { name: '1' }).getAttribute('aria-pressed')).toBe('false');
  });
});
