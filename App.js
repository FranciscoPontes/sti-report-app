import Map from './Map.js';
import React, { Fragment } from 'react';
import { Text } from "react-native";

function App() {

  return (
    <Fragment>
      <Text>Welcome to our Google Maps API test run in React!</Text>
        <Map />
    </Fragment>
  );
}

export default App;
