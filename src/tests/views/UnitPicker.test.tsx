import React from 'react';

import { Units } from '../../types';
import UnitPicker from '../../views/home/UnitPicker';
import { createSnapshot, fireEvent, render, screen } from '../testWrapper';

const mockHandleSetUnit = jest.fn((unit: Units) => unit);

describe('UnitPicker tests', () => {
  it('UnitPicker snapshot is valid with base props', () => {
    const snapshot = createSnapshot(
      <UnitPicker unit={'imperial'} handleSetUnit={mockHandleSetUnit} />
    );
    expect(snapshot).toMatchSnapshot();
  });
  it('Can click', () => {
    render(<UnitPicker unit={'imperial'} handleSetUnit={mockHandleSetUnit} />);
    const imperial = screen.getByText(/imperial/i);
    const metric = screen.getByText(/metric/i);
    expect(imperial).toBeInTheDocument();
    expect(metric).toBeInTheDocument();
    fireEvent.click(imperial);
    expect(mockHandleSetUnit).toHaveBeenCalled();
  });
});
