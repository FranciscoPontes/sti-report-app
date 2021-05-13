import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import React, { Fragment, useState } from 'react';
import { StyleSheet } from "react-native";
import { Marker } from 'react-native-maps';
import { Container, Button, Text } from 'native-base';
import * as Location from 'expo-location';

const styles = StyleSheet.create({
    container: {
      ...StyleSheet.absoluteFillObject,
      // height: 400,
      // width: 400,
      // justifyContent: 'flex-end',
      alignItems: 'center',
    },
    map: {
      ...StyleSheet.absoluteFillObject,
      zIndex: 100,
      height: '40%',
      position: 'absolute',
      top: '50%'
    },
    buttonContainer: {
      display: 'flex',
      flexDirection: 'row'
    }
   });

const MapContainer = props => {

  const [ geoLocation, setGeoLocation ] = useState( { latitude: 32.6592174,
                                                      longitude: -16.9239346, });
                                             
  findCoordinates = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      await Location.hasServicesEnabledAsync()
                    .then( response => console.log("GPS ENABLED: " + response) )
                    .catch( error => console.log("GPS ENABLED ERROR: " + error) );
      console.log(status);
      // console.log(GPSactive);
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      await Location.getCurrentPositionAsync({ timeInterval: 2000})
                    .then( response => {
                                        console.log(response); 
                                        setGeoLocation( { latitude: response.coords.latitude, 
                                                          longitude: response.coords.longitude } ); 
                                       } )
                    .catch( error => console.log(error) )
	};

    return (
      <Fragment>

        <Container style={styles.container}>
        <MapView
          provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          style={styles.map}
          region={{
            latitude: geoLocation.latitude,
            longitude: geoLocation.longitude,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}
        >
        <Marker
          coordinate={{ latitude : geoLocation.latitude , longitude : geoLocation.longitude }}
          title='test'
          description='123'
        />
        </MapView>
        <Container style={styles.buttonContainer}>
          <Button onPress={findCoordinates}>
              <Text>Click Me!</Text>
          </Button>
        </Container>
        </Container>
      </Fragment>
    );
}

export default MapContainer;