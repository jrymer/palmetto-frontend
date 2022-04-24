export interface Weather {
  description: string;
  humidity: string;
  main: string;
  pressure: string;
  temperature: Temperature;
  wind: Wind;
  visibility: string;
}

export interface Temperature {
  feelsLike: string;
  tempActual: string;
  tempMin: string;
  tempMax: string;
}

export interface Wind {
  direction: string;
  speed: string;
}

export interface Time {
  sunrise: number;
  sunset: number;
}

export interface Coordinates {
  lon: number;
  lat: number;
}

export interface WeatherPayload {
  coords: Coordinates;
  time: Time;
  weather: Weather;
  name: string;
}

export type GooglePrediction = google.maps.places.AutocompleteResponse;

export interface PredictionOption {
  display: string;
  value: string;
  id: string;
}

export interface WeatherQueryParams {
  search: {
    city: string;
    coords?: Coordinates;
  };
  unit: Units;
}

export type Units = 'imperial' | 'metric';

export const DEFAULT_CITY_SEARCH = 'Boulder, CO, USA';
