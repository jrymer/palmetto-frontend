import React from 'react';
import { useQuery } from 'react-query';
import styled from 'styled-components';

import Spinner from '../../components/common/Spinner';
import { DEFAULT_CITY_SEARCH, WeatherPayload, WeatherQueryParams } from '../../types';
import Map from './Map';
import Results from './Results';
import Search from './Search';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin: ${(props) => props.theme.margin};
  width: 100%;
  overflow: auto;
`;

const ResultsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex: 1 1 auto;
  justify-content: space-between;
`;

const SpinnerContainer = styled.div`
  display: flex;
  align-self: center;
`;

const HomeView: React.FC = () => {
  const [queryParams, setQueryParams] = React.useState<WeatherQueryParams>({
    search: { city: DEFAULT_CITY_SEARCH },
    unit: 'imperial',
  });
  const [error, setError] = React.useState<{ code: number; message: string } | null>(null);

  /**
   * Weather API search, gets fired when our query params are updated.
   */
  const { data, isFetching } = useQuery(
    ['weather_search', queryParams],
    async () => {
      try {
        let response;
        if (queryParams.search.coords) {
          response = await fetch(
            `http://localhost:4000/search?lat=${queryParams.search.coords.lat}&lon=${queryParams.search.coords.lon}&units=${queryParams.unit}`
          );
        } else {
          response = await fetch(
            `http://localhost:4000/search?city=${queryParams.search.city}&units=${queryParams.unit}`
          );
        }

        const responseData: WeatherPayload = await response.json();
        return responseData;
      } catch (e) {
        throw new Error('Error fetching weather data');
      }
    },
    {
      refetchOnWindowFocus: false,
      retry: false,
      onError: () => {
        setError({ code: 500, message: 'Failed to retrieve weather' });
      },
    }
  );

  /**
   * Update our query params which in terms fires a new query
   *
   * @param {WeatherQueryParams} qp New query params
   */
  const handleSetQueryParams = React.useCallback((qp: WeatherQueryParams) => {
    setQueryParams(qp);
  }, []);

  const handleSetError = React.useCallback((error: { code: number; message: string }) => {
    setError(error);
  }, []);

  return (
    <Container>
      <Search
        queryParams={queryParams}
        city={data?.name}
        handleSearch={handleSetQueryParams}
        handleError={handleSetError}
      />
      {isFetching ? (
        <SpinnerContainer>
          <Spinner />
        </SpinnerContainer>
      ) : (
        <>
          {error ? (
            <ResultsContainer>
              Error: {error.code}, Message: {error.message}
            </ResultsContainer>
          ) : (
            data && (
              <ResultsContainer>
                <Results city={data?.name} weather={data} />
                <Map coords={data?.coords} />
              </ResultsContainer>
            )
          )}
        </>
      )}
    </Container>
  );
};

export default HomeView;
