import React from 'react';

import Map from '../../views/home/Map';
import { createSnapshot } from '../testWrapper';

describe('Map tests', () => {
  it('Map snapshot is valid with base props', () => {
    const snapshot = createSnapshot(<Map coords={{ lat: 1, lon: 1 }} />);
    expect(snapshot).toMatchSnapshot();
  });
});
