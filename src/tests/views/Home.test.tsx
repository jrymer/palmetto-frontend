import React from 'react';

import HomeView from '../../views/home';
import { createSnapshot, fireEvent, render, screen } from '../testWrapper';

describe('HomeView tests', () => {
  it('HomeView snapshot is valid with base props', () => {
    const snapshot = createSnapshot(<HomeView />, true);
    expect(snapshot).toMatchSnapshot();
  });
  it('Can type', () => {
    const searchValue = 'hello world';
    render(<HomeView />, true);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: searchValue } });
    expect(input).toHaveValue(searchValue);
  });
  it('Has geolocation button', () => {
    render(<HomeView />, true);
    const button = screen.getByText(/use current location\?/i);
    expect(button).toBeInTheDocument();
  });
});
