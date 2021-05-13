import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import React, { Fragment, useState } from 'react';
import { View, StyleSheet, ToastAndroid } from "react-native";
import { Marker } from 'react-native-maps';
import { Container, Content, Button, Text } from 'native-base';
import * as Location from 'expo-location';
import {Header, Tab, Item} from 'react-native-elements';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

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
    header: {
      ...StyleSheet.absoluteFillObject,
      zIndex: 999
    },
    buttonContainer: {
      display: 'flex',
      flexDirection: 'row'
    }
   });

const MapContainer = props => {

  const [ geoLocation, setGeoLocation ] = useState( { latitude: 32.6592174,
                                                      longitude: -16.9239346, });
                                             
  const Tab = createBottomTabNavigator();

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
        <Header style={styles.header}
          centerComponent={{ text: 'MY TITLE', style: { color: '#fff' } }}
        />
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
          <Button onPress={() => ToastAndroid.show({
                text: 'Hi there!',
                buttonText: 'Okay'
              })}>
              <Text>Click Me for toast!</Text>
          </Button>
        </Container>
        <NavigationContainer>
          <Tab.Navigator>
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Settings" component={SettingsScreen} />
          </Tab.Navigator>
        </NavigationContainer>
        </Container>
      </Fragment>
    );
}

export default MapContainer;