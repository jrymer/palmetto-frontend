import React from 'react';
import { fireEvent } from '@testing-library/dom';

import AutocompleteField from '../../../../components/common/Autocomplete/AutocompleteField';
import { PredictionOption } from '../../../../types';
import { createSnapshot, render, screen } from '../../../testWrapper';

const defaultOptions: PredictionOption[] = [
  { display: 'Value One', value: 'value-1', id: 'v1' },
  { display: 'Value Two', value: 'value-2', id: 'v2' },
];
const defaultValue = 'Value One';

const mockOnSearch = jest.fn();
const mockOnChange = jest.fn((value: string) => value);
const mockOnSelect = jest.fn((optionId: string) => optionId);

const DefaultComponent = (
  <AutocompleteField
    options={defaultOptions}
    value={defaultValue}
    onSearch={mockOnSearch}
    onChange={mockOnChange}
    onSelect={mockOnSelect}
  />
);

describe('AutocompleteField tests', () => {
  let searchValue = defaultValue;

  beforeEach(() => {
    mockOnChange.mockClear();
    mockOnSearch.mockClear();
    mockOnSelect.mockClear;
  });
  it('AutocompleteField snapshot is valid with base props', () => {
    const snapshot = createSnapshot(DefaultComponent);
    expect(snapshot).toMatchSnapshot();
  });
  it('User can type', () => {
    render(DefaultComponent);
    searchValue = 'hello world';
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
    fireEvent.change(input, { target: { value: searchValue } });
    expect(mockOnChange).toHaveBeenCalled();
  });
  it('User clicks a selection', () => {
    render(DefaultComponent);
    const li = screen.getAllByRole('listitem')[0];
    fireEvent.click(li);
    expect(mockOnSelect).toHaveBeenCalled();
    expect(li).not.toBeInTheDocument();
  });
  it('Clicking collapse button show/hides options', () => {
    render(DefaultComponent);
    const img = screen.getAllByRole('img')[0];
    let li = screen.getAllByRole('listitem')[0];
    expect(li).toBeInTheDocument();
    fireEvent.click(img);
    expect(li).not.toBeInTheDocument();
    fireEvent.click(img);
    li = screen.getAllByRole('listitem')[0];
    expect(li).toBeInTheDocument();
  });
  it('Clicking x button clears input', () => {
    render(DefaultComponent);
    const img = screen.getAllByRole('img')[1];
    const li = screen.getAllByRole('listitem')[0];
    expect(img).toBeInTheDocument();
    fireEvent.click(img);
    expect(mockOnChange).toHaveBeenCalled();
    expect(li).not.toBeInTheDocument();
  });
});
