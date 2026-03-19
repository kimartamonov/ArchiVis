// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ExportButton } from '../ExportButton';

describe('ExportButton', () => {
  it('renders with label', () => {
    render(<ExportButton label="Export CSV" onClick={vi.fn()} />);
    expect(screen.getByText('Export CSV')).toBeTruthy();
  });

  it('calls onClick when clicked', () => {
    const onClick = vi.fn();
    render(<ExportButton label="Export" onClick={onClick} />);
    fireEvent.click(screen.getByText('Export'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('does not call onClick when disabled', () => {
    const onClick = vi.fn();
    render(<ExportButton label="Export" onClick={onClick} disabled />);
    fireEvent.click(screen.getByText('Export'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('has disabled attribute when disabled', () => {
    render(<ExportButton label="Export" onClick={vi.fn()} disabled />);
    const btn = screen.getByText('Export');
    expect(btn.closest('button')?.disabled).toBe(true);
  });
});
