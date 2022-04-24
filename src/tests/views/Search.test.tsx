import React from 'react';
import { fireEvent } from '@testing-library/dom';

import { WeatherQueryParams } from '../../types';
import Search from '../../views/home/Search';
import { createSnapshot, render, screen } from '../testWrapper';

const defaultQueryParams: WeatherQueryParams = { search: { city: 'Seattle' }, unit: 'imperial' };

const mockHandleSearch = jest.fn((qp: WeatherQueryParams) => qp);
const mockHandleError = jest.fn((error: { code: number; message: string }) => error);

const DefaultComponent = (
  <Search
    queryParams={defaultQueryParams}
    handleSearch={mockHandleSearch}
    handleError={mockHandleError}
  />
);

describe('Search tests', () => {
  it('Search snapshot is valid with base props', () => {
    const snapshot = createSnapshot(DefaultComponent, true);
    expect(snapshot).toMatchSnapshot();
  });
  it('Loads google script', () => {
    const component = render(DefaultComponent, true);
    expect(component.container.querySelector('googlePlaces')).toBeInTheDocument;
  });
  it('Can type', () => {
    render(DefaultComponent, true);
    const input = screen.getByRole('textbox');
    expect(input).toHaveValue(defaultQueryParams.search.city);
    fireEvent.change(input, { target: { value: 'hello' } });
    expect(input).toHaveValue('hello');
  });
});
