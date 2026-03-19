// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ElementCard } from '../ElementCard';
import type { GraphNode } from '../../../../engine/types';

function makeNode(overrides: Partial<GraphNode> = {}): GraphNode {
  return {
    element: {
      id: 'elem-1',
      name: 'Payment Gateway',
      type: 'ApplicationComponent',
      diagramIds: ['d1', 'd2'],
    },
    degree: 8,
    inDegree: 3,
    outDegree: 5,
    diagramsCount: 2,
    isOrphan: false,
    ...overrides,
  };
}

describe('ElementCard', () => {
  it('renders element name', () => {
    render(<ElementCard node={makeNode()} onClose={vi.fn()} />);
    expect(screen.getByText('Payment Gateway')).toBeTruthy();
  });

  it('renders element type', () => {
    render(<ElementCard node={makeNode()} onClose={vi.fn()} />);
    expect(screen.getByText('ApplicationComponent')).toBeTruthy();
  });

  it('renders ArchiMate layer badge', () => {
    render(<ElementCard node={makeNode()} onClose={vi.fn()} />);
    expect(screen.getByText('Application')).toBeTruthy();
  });

  it('renders correct degree metrics', () => {
    render(<ElementCard node={makeNode()} onClose={vi.fn()} />);
    expect(screen.getByText('8')).toBeTruthy(); // total degree
    expect(screen.getByText('3')).toBeTruthy(); // in-degree
    expect(screen.getByText('5')).toBeTruthy(); // out-degree
  });

  it('renders diagrams count', () => {
    render(<ElementCard node={makeNode()} onClose={vi.fn()} />);
    expect(screen.getByText('2')).toBeTruthy();
  });

  it('shows orphan badge when isOrphan is true', () => {
    render(<ElementCard node={makeNode({ isOrphan: true })} onClose={vi.fn()} />);
    expect(screen.getByText('Orphan')).toBeTruthy();
  });

  it('does not show orphan badge when isOrphan is false', () => {
    render(<ElementCard node={makeNode({ isOrphan: false })} onClose={vi.fn()} />);
    expect(screen.queryByText('Orphan')).toBeNull();
  });

  it('has Analyze Impact button', () => {
    render(<ElementCard node={makeNode()} onClose={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Analyze Impact' })).toBeTruthy();
  });

  it('calls onClose when X button is clicked', () => {
    const onClose = vi.fn();
    render(<ElementCard node={makeNode()} onClose={onClose} />);
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('calls onClose when overlay is clicked', () => {
    const onClose = vi.fn();
    render(<ElementCard node={makeNode()} onClose={onClose} />);
    fireEvent.click(screen.getByTestId('element-card-overlay'));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('does not call onClose when card body is clicked', () => {
    const onClose = vi.fn();
    render(<ElementCard node={makeNode()} onClose={onClose} />);
    fireEvent.click(screen.getByRole('dialog'));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('calls onAnalyzeImpact when button is clicked', () => {
    const onAnalyze = vi.fn();
    render(
      <ElementCard node={makeNode()} onClose={vi.fn()} onAnalyzeImpact={onAnalyze} />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Analyze Impact' }));
    expect(onAnalyze).toHaveBeenCalledWith('elem-1');
  });

  it('renders correctly for a Business layer element', () => {
    const node = makeNode({
      element: {
        id: 'bp-1',
        name: 'Order Process',
        type: 'BusinessProcess',
        diagramIds: [],
      },
      degree: 2,
      inDegree: 1,
      outDegree: 1,
      diagramsCount: 0,
      isOrphan: true,
    });
    render(<ElementCard node={node} onClose={vi.fn()} />);
    expect(screen.getByText('Order Process')).toBeTruthy();
    expect(screen.getByText('Business')).toBeTruthy();
    expect(screen.getByText('Orphan')).toBeTruthy();
  });

  it('updates when node prop changes', () => {
    const onClose = vi.fn();
    const { rerender } = render(<ElementCard node={makeNode()} onClose={onClose} />);
    expect(screen.getByText('Payment Gateway')).toBeTruthy();

    const newNode = makeNode({
      element: {
        id: 'elem-2',
        name: 'Auth Service',
        type: 'ApplicationService',
        diagramIds: ['d1'],
      },
    });
    rerender(<ElementCard node={newNode} onClose={onClose} />);
    expect(screen.getByText('Auth Service')).toBeTruthy();
  });
});
