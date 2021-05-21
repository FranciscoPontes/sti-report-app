import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import React, { Fragment, useState, useEffect } from 'react';
import { StyleSheet, Image, View, TouchableOpacity, Text} from "react-native";
import { Marker, Callout } from 'react-native-maps';
import { Container, Button } from 'native-base';
import * as Location from 'expo-location';
import * as API from '../../../services/firebaseAPI';

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
    height: '100%',
    position: 'absolute',
    zIndex: 1
  },
  animalFilter: {
    position: 'absolute',
    zIndex: 99,
    margin: 10,
    marginRight: 0,
    right: 85,
    borderColor: 'cyan',
    borderWidth: 5
  },
  junkFilter: {
    position: 'absolute',
    zIndex: 99,
    margin: 10,
    right: 0,
    borderColor: 'orange',
    borderWidth: 5
  },
  addButtonMap:{
    position: 'absolute',
    zIndex: 99,
    margin: 10,
    bottom: 0,
    right: 0
  }
});

export default function Map(props){
  const [ geoLocation, setGeoLocation ] = useState( { latitude: 0, longitude: 0, });
  const [trashPins, setTrashPins] = useState(1);
  const [animalPins, setAnimalPins] = useState(1);
  const [data, setData] = useState([]);

  const mapView = React.createRef();
  var animalMarkers = [];
  var trashMarkers = [];

  const goToUserLocation = () => {
      mapView.current.animateToRegion({
          longitude: geoLocation.longitude,
          latitude: geoLocation.latitude,
          latitudeDelta: 0.1,
          longitudeDelta: 0.0121,
      }, 1000);
  }

  const toogleAnimalPins = () => {
    if(animalPins){
      setAnimalPins(0);
      animalMarkers.forEach(element => {
        element.hideCallout();
      });
    }else{
      setAnimalPins(1);
    }
  }

  const toogleTrashPins = () => {
    if(trashPins){
      setTrashPins(0);
      trashMarkers.forEach(element => {
        element.hideCallout();
      });
    }else{
      setTrashPins(1);
    }
  }

  const animalCalloutStyle = function() {
    return {
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'white',
      padding: 15,
      marginBottom: 10,
      opacity: animalPins
    }
  }

  const trashCalloutStyle = function() {
    return {
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'white',
      padding: 15,
      marginBottom: 10,
      opacity: trashPins
    }
  }

  useEffect(() => {
    async function getReports() {
      let response = await API.getAllReports();
      setData(response);
    }

    getReports();
  }, [])

  useEffect(() => {
    async function findCoordinates() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      await Location.hasServicesEnabledAsync()
                    .then( response => console.log("GPS ENABLED: " + response) )
                    .catch( error => console.log("GPS ENABLED ERROR: " + error) );

                    if (status !== 'granted') {
                      console.log('Permission to access location was denied');
                      return;
                    }

      await Location.getCurrentPositionAsync({accuracy:Location.Accuracy.High})
                  .then( response => { setGeoLocation( { latitude: response.coords.latitude, longitude: response.coords.longitude }); })
                  .catch( error => console.log(error) )

    };

    findCoordinates();
  }, [])

  useEffect(() => {
    goToUserLocation();
  }, [geoLocation])

  mapMarkers = () => {
    return data.map((marker, index) => 
      <Marker
      key={index}
      ref={ref => {marker.isAnimalReport ? animalMarkers[index] = ref : trashMarkers[index] = ref}}
      coordinate={{ latitude: parseFloat(marker.latitude), longitude: parseFloat(marker.longitude) }}
      title={marker.isAnimalReport ? marker.typeOfAnimal : marker.typeOfTrash}
      description={"Descrição"}
      pinColor={marker.isAnimalReport ? "rgb(162, 208, 255)" : "orange"}
      opacity={marker.isAnimalReport ? animalPins : trashPins}
      >
      <Callout tooltip={true}>
          {
          marker.isAnimalReport ?
          <View style={animalCalloutStyle()}>
            <Text>Tipo de Animal: {marker.typeOfAnimal.toUpperCase()}</Text>
            <Text>Estado: {marker.status.toUpperCase()}</Text>
            <Text>Data de Submissão: {new Date(marker.submissionDate.seconds * 1000).toLocaleDateString()}</Text>
          </View>
          :
          <View style={trashCalloutStyle()}>
            <Text>Tipo de Lixo: {marker.typeOfTrash.toUpperCase()}</Text>
            <Text>Estado: {marker.status.toUpperCase()}</Text>
            <Text>Tipo de Extração: {marker.extractionType.toUpperCase()}</Text>
            <Text>Tipo de Acesso: {marker.accessType.toUpperCase()}</Text>
            <Text>Data de Submissão: {new Date(marker.submissionDate.seconds * 1000).toLocaleDateString()}</Text>
          </View>
          }
      </Callout>
      </Marker>)
  }
  
  return (
    <Container>
      <TouchableOpacity style={styles.animalFilter} onPress={() => toogleAnimalPins()}>
        <Image
            source={animalPins ? require('../../../assets/AnimalsFilterOn.png') : require('../../../assets/AnimalsFilterOff.png' )}
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.junkFilter} onPress={() => toogleTrashPins()}>
        <Image
          source={trashPins ? require('../../../assets/JunkFilterOn.png') : require('../../../assets/JunkFilterOff.png' )}
        />
      </TouchableOpacity>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}  
        showsUserLocation={true}
        ref={mapView}
        moveOnMarkerPress={false}
        showsMyLocationButton={true}
        initialRegion={{
          latitude: geoLocation.latitude,
          longitude: geoLocation.longitude,
          latitudeDelta: 0.1,
          longitudeDelta: 0.0121
        }}
      >
      {mapMarkers()}
      </MapView>
      <TouchableOpacity style={styles.addButtonMap} onPress={() => alert("Aqui dá redirect para home screen")}>
        <Image
          source={require('../../../assets/addButtonMap.png')}
        />
      </TouchableOpacity>
    </Container>
  );
}