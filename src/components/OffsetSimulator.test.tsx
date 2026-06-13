// @vitest-environment jsdom
import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import OffsetSimulator from './OffsetSimulator';

afterEach(() => {
  cleanup();
});

describe('OffsetSimulator Component', () => {
  it('renders initial state correctly with emissions', () => {
    render(<OffsetSimulator monthlyEmissions={300} onNetZeroUnlocked={() => {}} />);

    const emissionTexts = screen.getAllByText(/300\s*KG/);
    expect(emissionTexts.length).toBe(2); // One for Emissions, one for Remaining
    expect(screen.getByText(/\+\s*0\s*KG/)).toBeDefined();
    expect(screen.queryByRole('alert')).toBeNull(); // No net-zero alert initially
  });

  it('updates offset and remaining footprint when inputs change', () => {
    render(<OffsetSimulator monthlyEmissions={300} onNetZeroUnlocked={() => {}} />);

    // Modify solar panels input
    const solarInput = screen.getByLabelText(/Community Solar/i);
    fireEvent.change(solarInput, { target: { value: '2' } });

    // Solar panels offset is 50 each. 2 Panels = 100 kg.
    expect(screen.getByText(/\+\s*100\s*KG/)).toBeDefined();
    expect(screen.getByText(/200\s*KG/)).toBeDefined(); // Remaining is 300 - 100 = 200
  });

  it('triggers onNetZeroUnlocked and shows alert when offsets exceed emissions', () => {
    const netZeroMock = vi.fn();
    render(<OffsetSimulator monthlyEmissions={100} onNetZeroUnlocked={netZeroMock} />);

    const solarInput = screen.getByLabelText(/Community Solar/i);
    fireEvent.change(solarInput, { target: { value: '2' } }); // 100 kg offset (100% neutralized)

    expect(netZeroMock).toHaveBeenCalled();
    expect(screen.getByRole('alert')).toBeDefined();
    expect(screen.getByText(/NET_ZERO_STABILITY_LOCKED/i)).toBeDefined();
  });

  it('resets offsets when reset button is clicked', () => {
    render(<OffsetSimulator monthlyEmissions={300} onNetZeroUnlocked={() => {}} />);

    const solarInput = screen.getByLabelText(/Community Solar/i);
    fireEvent.change(solarInput, { target: { value: '2' } });

    expect(screen.getByText(/\+\s*100\s*KG/)).toBeDefined();

    const resetButton = screen.getByRole('button', { name: /Reset all offset sliders/i });
    fireEvent.click(resetButton);

    expect(screen.getByText(/\+\s*0\s*KG/)).toBeDefined();
  });
});
