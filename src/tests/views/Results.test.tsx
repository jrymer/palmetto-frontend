import React from 'react';

import { WeatherPayload } from '../../types';
import Results from '../../views/home/Results';
import { createSnapshot, render, screen } from '../testWrapper';

const weater: WeatherPayload = {
  coords: {
    lat: 47.6062,
    lon: -122.3321,
  },
  time: {
    sunrise: 1651409512,
    sunset: 1651461645,
  },
  weather: {
    description: 'broken clouds',
    humidity: '57%',
    main: 'Clouds',
    pressure: '1014 hPa',
    temperature: {
      feelsLike: '15.61° C',
      tempActual: '16.42° C',
      tempMin: '14.89° C',
      tempMax: '18.29° C',
    },
    wind: {
      direction: '280°',
      speed: '3.09 mps',
    },
    visibility: '1000 km',
  },
  name: 'Seattle',
};

describe('Results tests', () => {
  it('Results snapshot is valid with base props', () => {
    const snapshot = createSnapshot(<Results city="Seattle" weather={weater} />);
    expect(snapshot).toMatchSnapshot();
  });
  it('Displays weather', () => {
    render(<Results city="Seattle" weather={weater} />);
    expect(screen.getByText(/seattle/i)).toBeInTheDocument();
    expect(screen.getByText(/16\.42° c and clouds/i)).toBeInTheDocument();
    expect(screen.getByText(/pressure: 1014 hpa/i)).toBeInTheDocument();
    expect(screen.getByText(/sunrise: 2:43 sunset: 2:44/i)).toBeInTheDocument();
  });
});
