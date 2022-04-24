### Installation

1. Clone the repository `git clone git@github.com:jrymer/palmetto-frontend.git`
2. `cd` into the repo you just cloned `cd palmetto-frontend`
3. Install NodeJs v18 [NodeJs](https://nodejs.org/en/download/)
  - If you have `nvm` installed you can do
      - `nvm install`
      - `nvm use`
4. Make sure the backend is running, if not, follow the installation instructions [here](https://github.com/jrymer/palmetto-backend)
5. Run `npm install`
5. Run `npm run start`
6. Navigate to `localhost:3000` and verify you see the app running

### Tests

1. To run the tests themselves run `npm run test`
2. To run the coverage report run `npm run coverage`

### Usage

This is a simple weather app where you can search a city and view its current weather.
If you wish, you can use your current location by clicking the "Use current location" button, or you can search for a city.
Using the autocomplete, type in the city you wish to search, and then select it from the dropdown and click the search button to fire a search. Additionally, you can change the units of the
response with the unit picker. The weather will be shown in the weather card next to a map of the city you searched for.

In the top right corner of the map are additional weather layers to use to explore different overlays on the map such as temperature and precipitation.

NOTE: I plan to delete the API key found in the `.env` file shortly after the application is recieved and tested.
