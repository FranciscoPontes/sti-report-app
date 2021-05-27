import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import React, { Fragment, useState, useEffect } from 'react';
import { StyleSheet, Image, TouchableHighlight, Text} from "react-native";
import { Marker, Callout } from 'react-native-maps';
import { Container, Button, Icon, Fab, View, Header} from 'native-base';
import * as Location from 'expo-location';
import * as API from '../../../services/firebaseAPI';
import { useIsFocused } from '@react-navigation/native'
import Moment from 'moment';

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
    zIndex: 999,
    right: 85,
    top: 25
  },
  junkFilter: {
    position: 'absolute',
    zIndex: 999,
    right: 25,
    top: 25
  },
  addButtonMap:{
    position: 'absolute',
    zIndex: 99,

  },
  createAnimalReport:{
    position: 'absolute',
    zIndex: 99,
    marginBottom: 0
  },
  createTrashReport:{
    position: 'absolute',
    zIndex: 99,
    marginBottom: 5
  }
});

export default function Map(props){
  Moment.locale('pt');
  const [ geoLocation, setGeoLocation ] = useState( { latitude: 0, longitude: 0, });
  const [trashPins, setTrashPins] = useState(1);
  const [animalPins, setAnimalPins] = useState(1);
  const [data, setData] = useState([]);
  const [createButtonStatus, setCreateButtonStatus] = useState(false);

  const isFocused = useIsFocused()
  const navigation = props.navigation;

  const mapView = React.createRef();
  var animalMarkers = [];
  var trashMarkers = [];

  useEffect(() => {
    async function getReports() {
      let response = await API.getAllReports();
      setData(response);
    }

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

    getReports();
    findCoordinates();
    setCreateButtonStatus(false);
  } , [isFocused])

  const goToUserLocation = () => {
      mapView.current.animateToRegion({
          longitude: geoLocation.longitude,
          latitude: geoLocation.latitude,
          latitudeDelta: 0.03,
          longitudeDelta: 0.0121,
      }, 1000);
  }

  const goToReport = (screen) => {
    navigation.navigate('New', {screen: "ReportScreen", params: { reportType: screen }});
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
            <Text>Tipo de Animal: {marker.typeOfAnimal}</Text>
            {marker.status == "processing" ? <Text>Estado: Em processo</Text> : marker.status == "closed" ? <Text>Estado: Resolvido</Text> : <Text>Estado: Recusado</Text>}
            <Text>Data de Submissão: {Moment.unix(marker.submissionDate.seconds).format("DD-MM-YYYY | HH:mm")}</Text>
          </View>
          :
          <View style={trashCalloutStyle()}>
            <Text>Tipo de Lixo: {marker.typeOfTrash}</Text>
            {marker.status == "processing" ? <Text>Estado: Em processo</Text> : marker.status == "closed" ? <Text>Estado: Resolvido</Text> : <Text>Estado: Recusado</Text>}
            <Text>Tipo de Extração: {marker.extractionType}</Text>
            <Text>Tipo de Acesso: {marker.accessType}</Text>
            <Text>Data de Submissão: {Moment.unix(marker.submissionDate.seconds).format("DD-MM-YYYY | HH:mm")}</Text>
          </View>
          }
      </Callout>
      </Marker>) 
  }
  
  return (
    <Container>
      <TouchableHighlight style={styles.animalFilter} onPress={() => toogleAnimalPins()}>
        <Image
            source={animalPins ? require('../../../assets/AnimalsFilterOn.png') : require('../../../assets/AnimalsFilterOff.png' )}
        />
      </TouchableHighlight>
      <TouchableHighlight style={styles.junkFilter} onPress={() => toogleTrashPins()}>
        <Image
          source={trashPins ? require('../../../assets/TrashFilterOn.png') : require('../../../assets/TrashFilterOff.png' )}
        />
      </TouchableHighlight>
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
        <View style={{ flex: 1 }}>
          <Fab
            active={createButtonStatus}
            direction="up"
            containerStyle={{}}
            style={{ backgroundColor: "#000000", zIndex: 99 }}
            position="bottomRight"
            onPress={() => setCreateButtonStatus(!createButtonStatus)}>
            <Icon name="add"/>
            <TouchableHighlight style={styles.createAnimalReport} onPress={() => goToReport(0)}>
              <Image
                  source={require('../../../assets/reportAnimal.png')}
              />
            </TouchableHighlight>
            <TouchableHighlight style={styles.createTrashReport} onPress={() => goToReport(1)}>
              <Image
                  source={require('../../../assets/reportTrash.png')}
              />
            </TouchableHighlight>
          </Fab>
        </View>
    </Container>
  );
}