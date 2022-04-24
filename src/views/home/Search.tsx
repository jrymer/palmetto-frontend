import React from 'react';
import { useMutation } from 'react-query';
import { debounce } from 'lodash';
import styled from 'styled-components';

import AutocompleteField from '../../components/common/Autocomplete/AutocompleteField';
import Button from '../../components/common/Button';
import { GooglePrediction, PredictionOption, Units, WeatherQueryParams } from '../../types';
import UnitPicker from './UnitPicker';

const SearchContainer = styled.div`
  grid-area: Search;
  display: flex;
  flex-direction: column;
`;

const SearchControls = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const SearchButtonContainer = styled.div`
  display: flex;
`;

interface SearchProps {
  city?: string;
  queryParams: WeatherQueryParams;
  handleError: (error: { code: number; message: string }) => void;
  handleSearch: (qp: WeatherQueryParams) => void;
}
/**
 *Script to load the google places API instead of tossing it in the index.html, only load when needed
 *
 * @param {React.Dispatch<React.SetStateAction<boolean>>} setLoaded Callback to tell the component when the script has been loaded
 */
const loadGoogleApi = (setLoaded: React.Dispatch<React.SetStateAction<boolean>>) => {
  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_PLACES_API_KEY}&libraries=places`;
  script.id = 'googlePlaces';
  document.body.appendChild(script);
  script.onerror = () => {
    setLoaded(false);
  };
  script.onload = () => {
    setLoaded(true);
  };
};

/**
 * Callback to the Google getPlacePredictions(), returns a list of predictions
 *
 * @param {(google.maps.places.QueryAutocompletePrediction[] | null)} predictions Predictions from getPlacePredictions()
 * @param {google.maps.places.PlacesServiceStatus} status Status of getPlacePredictions()
 * @return {PredictionOption[] | null} The list of predictions
 */
const handlePredictions = (
  predictions: google.maps.places.QueryAutocompletePrediction[] | null
) => {
  return predictions;
};

/**
 * Wrapper component around the autocomplete field and its associated submit button
 *
 * @param {string} city city name from the search
 * @param {WeatherQueryParams} queryParams Default values to fill the page with
 * @param {({code: number, message: string}) => void} handleError Callback for sending errors
 * @param {(qp: WeatherQueryParams) => void} handleSearch Updated the query params
 * which in turn fire the search
 *
 * @return {React.FC<SearchProps>}  A search component with unit picker,
 *  autocomplete, and submit buttin
 */
const Search: React.FC<SearchProps> = ({ city, queryParams, handleSearch, handleError }) => {
  const [selectedOption, setSelectedOption] = React.useState<string>(queryParams.search.city);
  const [unit, setUnit] = React.useState<Units>(queryParams.unit);
  const [scriptLoaded, setScriptLoaded] = React.useState(false);
  const [googleService, setGoogleService] =
    React.useState<google.maps.places.AutocompleteService | null>(null);
  const [search, setSearch] = React.useState(queryParams.search);
  const [options, setOptions] = React.useState<PredictionOption[] | null>(null);
  const [disableSearch, setDisableSearch] = React.useState(false);

  React.useEffect(() => {
    if (city && !search.city.includes(city)) {
      setSearch({ ...search, city });
      setSelectedOption(city);
    }
  }, [city]);

  /**
   * Check if we have an existing script loaded, if not, load it
   */
  React.useEffect(() => {
    const existingScript = document.getElementById('googlePlaces');
    if (!existingScript) {
      loadGoogleApi(setScriptLoaded);
    }
  }, []);

  /**
   * Check if we have a script, if we do, create a new google service
   */
  React.useEffect(() => {
    if (scriptLoaded) {
      setGoogleService(new google.maps.places.AutocompleteService());
    }
  }, [scriptLoaded]);

  /**
   * Mutation to get new predictions, takes a search string and returns a formatted
   * list of predictions
   */
  const { mutate: getPredictions } = useMutation(
    ['autocomplete', search],
    async (newValue: string) => {
      if (scriptLoaded && googleService) {
        return await googleService.getPlacePredictions(
          { input: newValue, types: ['(cities)'] },
          handlePredictions
        );
      }
      return null;
    },
    {
      onSuccess: (predictions: GooglePrediction | null) => {
        setOptions(
          predictions && predictions.predictions.length
            ? predictions.predictions.map(
                (prediction): PredictionOption => ({
                  display: prediction.description,
                  value: prediction.terms[0].value,
                  id: prediction.place_id,
                })
              )
            : null
        );
      },
      onError: () => {
        handleError({ code: 404, message: 'Could not find city' });
      },
    }
  );

  const onGeoLocationSuccess = (position: GeolocationPosition) => {
    const lon = position.coords.longitude;
    const lat = position.coords.latitude;

    handleSearch({ ...queryParams, search: { ...queryParams.search, coords: { lat, lon } } });
  };

  const onGeoLocationError = (e: GeolocationPositionError) => {
    handleError({ code: 500, message: `Couldn't access your location \n Reason: ${e.message}` });
  };

  const handleGeoLocation = React.useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(onGeoLocationSuccess, onGeoLocationError);
    }
  }, [queryParams]);

  /**
   * Handle autocomplete input change. Disable the ability to hit the weather API, we only want to hit it with valid
   * city predictions from google, not from user input. Debounce the actual search value to send to the google service
   *
   * @param {string} newValue search value
   */
  const handleChange = (newValue: string) => {
    setSearch({ ...search, city: newValue });
    if (!disableSearch) {
      setDisableSearch(true);
    }
    if (newValue) {
      debouncedHandleChange(newValue);
    }
  };

  /**
   * Debounce the actual search value to send to the google service
   * @param {string} newValue search value
   */
  const debouncedHandleChange = React.useCallback(
    debounce((newValue: string) => {
      getPredictions(newValue);
    }, 500),
    []
  );

  /**
   * Check our list of options for the option selected and set it as out value
   * @param {string} optionId ID of the option selected
   */
  const handleSelect = React.useCallback(
    (optionId: string) => {
      const found = options?.find((option) => option.id === optionId);
      if (found) {
        setSearch({ ...search, city: found?.display });
        setSelectedOption(found?.display);
        setDisableSearch(false);
      }
    },
    [options, search]
  );

  /**
   * Set unit to incoming value
   * @param {Units} unit New unit
   */
  const handleSetUnit = React.useCallback((unit: Units) => {
    setUnit(unit);
  }, []);

  /**
   * Update query params if we have a selected option
   */
  const onSearch = React.useCallback(() => {
    if (selectedOption && !disableSearch) {
      handleSearch({ search: { city: selectedOption }, unit });
    }
  }, [disableSearch, search, selectedOption, unit]);

  return (
    <SearchContainer>
      <SearchControls>
        <AutocompleteField
          searchDisabled={disableSearch}
          onChange={handleChange}
          onSelect={handleSelect}
          onSearch={onSearch}
          options={options}
          value={search.city}
        />
        <UnitPicker handleSetUnit={handleSetUnit} unit={unit} />
        <Button buttonText="Use current location?" onSearch={handleGeoLocation} />
      </SearchControls>
      <SearchButtonContainer>
        <Button buttonText="Search" disabled={disableSearch} onSearch={onSearch} width="100%" />
      </SearchButtonContainer>
    </SearchContainer>
  );
};

export default Search;
