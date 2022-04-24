import React from 'react';
import styled from 'styled-components';

import { WeatherPayload } from '../../types';

const Container = styled.div`
  grid-area: Results;
  display: flex;
  flex-direction: column;
  height: -webkit-fill-available;
  min-width: 40%;
  width: var(--col-width);
  justify-content: space-between;
  margin: ${(props) => props.theme.margin};
  padding: ${(props) => props.theme.padding};
  border: solid thin ${(props) => props.theme.colors.offsetGrey};
`;

const MainTemperature = styled.div`
  font-size: var(--fs-600);
  font-weight: 600;
`;

const SubTemperature = styled.div`
  font-size: var(--fs-500);
`;

const WrapRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;

interface ResultsProps {
  city: string;
  weather: WeatherPayload | undefined;
}

/**
 * Format a date value from epoch to UTC
 *
 * @param {number} epoch Epoch time
 * @return {string}  Time in HH:MM
 */
const getReadableTime = (epoch: number) => {
  const date = new Date(epoch);
  return `${date.getUTCHours()}:${date.getUTCMinutes()}`;
};

/**
 * Returns a result card with weather information about a city
 *
 * @param {string} city Selected city
 * @param {WeatherPayload | undefined} weather Weather payload from weather API
 * @return A result card component
 */
const Results: React.FC<ResultsProps> = ({ city, weather }) => {
  if (!weather) {
    return null;
  }

  const { weather: w, time } = weather;
  const { temperature: temp, wind } = w;
  const desc = w.description.charAt(0).toUpperCase() + w.description.slice(1);
  return (
    <Container>
      <div>{city}</div>
      <WrapRow>
        <div>
          <MainTemperature>
            {temp.tempActual} and {w.main}
          </MainTemperature>
          <SubTemperature>Feels Like: {temp.feelsLike}</SubTemperature>
          <SubTemperature>
            High: {temp.tempMax} Low: {temp.tempMin}
          </SubTemperature>
        </div>
        <div>
          <div>Humidity: {w.humidity}</div>
          <div>Pressure: {w.pressure}</div>
          <div>Visibility: {w.visibility}</div>
          <div>
            Wind: {wind.speed} at {wind.direction}
          </div>
        </div>
      </WrapRow>
      <WrapRow>
        <div>{desc}.</div>
        <div>
          Sunrise: {getReadableTime(time.sunrise)} Sunset: {getReadableTime(time.sunset)}
        </div>
      </WrapRow>
    </Container>
  );
};

export default Results;
