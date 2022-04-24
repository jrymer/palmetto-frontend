import React from 'react';

import Button from '../../../components/common/Button';
import { createSnapshot, fireEvent, render, screen } from '../../testWrapper';

const mockOnSearch = jest.fn();

describe('Button tests', () => {
  const buttonText = 'Search';
  it('Button snapshot is valid with base props', () => {
    const snapshot = createSnapshot(<Button buttonText={buttonText} onSearch={mockOnSearch} />);
    expect(snapshot).toMatchSnapshot();
  });
  it('Can change button text', () => {
    render(<Button buttonText={buttonText} onSearch={mockOnSearch} />);
    expect(screen.getByText(buttonText)).toBeInTheDocument();
    render(<Button buttonText={'something else'} onSearch={mockOnSearch} />);
    expect(screen.getByText('something else')).toBeInTheDocument();
  });
  it('Can be clicked', () => {
    render(<Button buttonText={buttonText} onSearch={mockOnSearch} />);
    fireEvent.click(screen.getByRole('button'));
    expect(mockOnSearch).toHaveBeenCalled();
  });
  it('Cannot be clicked if disabled', () => {
    render(<Button buttonText={buttonText} disabled={true} onSearch={mockOnSearch} />);
    fireEvent.click(screen.getByRole('button'));
    expect(mockOnSearch).toHaveBeenCalledTimes(0);
  });
});
