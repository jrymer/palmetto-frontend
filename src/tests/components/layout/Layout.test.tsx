import React from 'react';

import Layout from '../../../components/layout/Layout';
import { createSnapshot, render, screen } from '../../testWrapper';

const child = <div>child</div>;

describe('Layout tests', () => {
  it('Layout snapshot is valid', () => {
    const snapshot = createSnapshot(<Layout>{child}</Layout>);
    expect(snapshot).toMatchSnapshot();
  });
  it('Renders a child', () => {
    render(<Layout>{child}</Layout>);
    expect(screen.getByText(/child/i)).toBeInTheDocument();
  });
});
