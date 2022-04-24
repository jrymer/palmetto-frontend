import React from 'react';
import leaflet from 'leaflet';
import styled from 'styled-components';

import { Coordinates } from '../../types';

const Container = styled.div`
  height: -webkit-fill-available;
  min-width: 40%;
  width: var(--col-width);
  grid-area: Map;
  border: solid thin ${(props) => props.theme.colors.offsetGrey};
  margin: ${(props) => props.theme.margin};
`;

interface MapProps {
  coords: Coordinates;
}

const tileLayerConf: leaflet.TileLayerOptions = {
  attribution:
    'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 14,
  id: 'mapbox/streets-v11',
  tileSize: 512,
  zoomOffset: -1,
  accessToken: process.env.REACT_APP_MAP_BOX_API_KEY,
};

/**
 * Returns a leaflet map of the weather location searched
 *
 * @param {Coordinates} { coords } LAT LON set to be plotted
 * @return A leaflet map
 */
const Map: React.FC<MapProps> = ({ coords }) => {
  const ref = React.useRef(true);

  /**
   * Initialize the map
   */
  React.useEffect(() => {
    if (ref.current && coords) {
      const { lat, lon } = coords;
      const map = leaflet.map('map').setView([lat, lon], 13);
      leaflet
        .tileLayer(
          `https://api.mapbox.com/styles/v1/${tileLayerConf.id}/tiles/{z}/{x}/{y}?access_token=${tileLayerConf.accessToken}`,
          {
            ...tileLayerConf,
          }
        )
        .addTo(map);
      const precip = leaflet.tileLayer(
        'https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=471ff37832bebfa6f9a5a94a2c0c4b34',
        { maxZoom: 14 }
      );
      const temp = leaflet.tileLayer(
        'https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=471ff37832bebfa6f9a5a94a2c0c4b34',
        { maxZoom: 14 }
      );
      const clouds = leaflet.tileLayer(
        'https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=471ff37832bebfa6f9a5a94a2c0c4b34',
        { maxZoom: 14 }
      );
      const wind = leaflet.tileLayer(
        'https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=471ff37832bebfa6f9a5a94a2c0c4b34',
        { maxZoom: 14 }
      );

      const weatherLayers = {
        Precipitation: precip,
        Temperature: temp,
        'Wind Speed': wind,
        'Cloud coverage': clouds,
      };

      leaflet.control.layers(weatherLayers).addTo(map);

      leaflet
        .marker([lat, lon], {
          title: 'Location weather data was pulled from',
        })
        .addTo(map);
    }
    return () => {
      ref.current = false;
    };
  }, [coords]);

  return (
    <Container>
      <div id="map" />
    </Container>
  );
};

export default Map;
