// @vitest-environment jsdom
import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import InsightsAdvisor from './InsightsAdvisor';
import { Commitment } from '../lib/ecoStore';

afterEach(() => {
  cleanup();
});

describe('InsightsAdvisor Component', () => {
  const mockCommitments: Commitment[] = [
    {
      id: 'c1',
      title: 'Meatless Mondays',
      description: 'Switch to a plant-based diet one day a week.',
      category: 'food',
      carbonSaving: 150,
      costSaving: 120,
      active: true,
    },
    {
      id: 'c2',
      title: 'Switch to LED Lighting',
      description: 'Replace standard incandescent bulbs with energy-efficient LEDs.',
      category: 'energy',
      carbonSaving: 80,
      costSaving: 45,
      active: false,
    },
  ];

  it('renders summary cards with correct savings values', () => {
    render(<InsightsAdvisor commitments={mockCommitments} onToggleCommitment={() => {}} />);

    expect(screen.getByText('150')).toBeDefined();
    expect(screen.getByText('$120')).toBeDefined();
    expect(screen.getByText('Meatless Mondays')).toBeDefined();
    expect(screen.getByText('Switch to LED Lighting')).toBeDefined();
  });

  it('triggers onToggleCommitment when clicking a commitment action button', () => {
    const onToggleMock = vi.fn();
    render(<InsightsAdvisor commitments={mockCommitments} onToggleCommitment={onToggleMock} />);

    const button = screen.getByLabelText(/Toggle commitment Meatless Mondays/i);
    fireEvent.click(button);

    expect(onToggleMock).toHaveBeenCalledWith('c1');
  });

  it('triggers onToggleCommitment when pressing Enter or Space key', () => {
    const onToggleMock = vi.fn();
    render(<InsightsAdvisor commitments={mockCommitments} onToggleCommitment={onToggleMock} />);

    const button = screen.getByLabelText(/Toggle commitment Switch to LED Lighting/i);
    
    // Press Enter
    fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' });
    expect(onToggleMock).toHaveBeenCalledWith('c2');

    // Press Space
    fireEvent.keyDown(button, { key: ' ', code: 'Space' });
    expect(onToggleMock).toHaveBeenCalledWith('c2');
  });
});
