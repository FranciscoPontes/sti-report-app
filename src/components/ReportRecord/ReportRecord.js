import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Button } from 'react-native';
import * as FirebaseAPI from '../../../services/firebaseAPI';
import * as Location from 'expo-location';
import { atan } from 'react-native-reanimated';

const ReportRecord = props => {

  // flag to show all or just the ones pending
  const showAll = props.showAll;
  const PROCESSING_STATUS = 'processing';
  const IMG_SIZE = 30;
 /*  const userData = FirebaseAPI.userData; */
  const { data, refreshRequested, navigation } = props;
  const [ city, setCity ] = useState(null);

  const recordStates = {
    processing: 'Análise',
    rejected: 'Rejeitado',
    approved: 'Aprovado',
    closed: 'Concluído',
  }

  const toDateTime = secs => {
    var t = new Date(1970, 0, 1); 
    t.setSeconds(secs);
    return t;
  }

  const goToDetails = () => {
    navigation.navigate('Histórico', { screen: 'Details', params: { reportId: data.id }});
  }

  useEffect( () => {
      const getCity = async () => {
        const location = {
                          latitude: data.latitude,
                          longitude: data.longitude,
                        }
        console.log('----------------LOCATION--------------');
        console.log(location);
        const response = await Location.reverseGeocodeAsync(location)
                                      .then( response => {
                                        console.log('here');
                                        console.log(response);
                                        return response[0].city;
                                      } )
                                      .catch( error => {
                                        console.log(error.message);
                                        return error.message;
                                      } );
        setCity( response || 'Unable to find city' );
      }
      if (refreshRequested && !city) getCity();
    }
    , [refreshRequested])

    // report data received
    //   "acessType": "",
    //   "extractionType": "",
    //   "isAnimalReport": true,
    //   "latitude": "32.67",
    //   "longitude": "-16.91",
    //   "status": "processing",
    //   "submissionDate": Object {
    //     "nanoseconds": 0,
    //     "seconds": 1621508400,
    //   },
    //   "typeOfAnimal": "cat",
    //   "typeOfTrash": "",
    //   "user": "113842996349886677035",
    // },

    // data to show in the header: tipo, data, cidade, estado (icone)

    return (
              <View style={styles.process}>
                <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', margin: 5 }}>
                  <Text><Text style={{ fontWeight: 'bold' }}>Tipo: </Text>{data.isAnimalReport ? 'Animal' : 'Lixo'}</Text>
                  <Text>{toDateTime(data.submissionDate.seconds).toLocaleDateString("en-US")}</Text>
                </View>
                <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', margin: 5 }}>
                  <Text><Text style={{ fontWeight: 'bold' }}>Estado: </Text>{recordStates[data.status]}</Text>
                  <Text>{city}</Text>
                </View>
                <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'flex-start', margin: 5 }}>
                    <Text style={{fontWeight: "bold"}}>{data.isAnimalReport ? "Animal: " : "Lixo: "}</Text>
                    <Text>{data.isAnimalReport ? data.typeOfAnimal : data.typeOfTrash}</Text>
                </View>
                { data.additionalInfo ? 
                  <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'flex-start', marginBottom: '5%', flexShrink: 1 }}>
                      <Text style={{marginVertical: 5, lineHeight: 20}}><Text style={{fontWeight: "bold"}}>Descrição: </Text>{data.additionalInfo}</Text>
                  </View>
                  : null 
                }
                <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
                  <Button
                    onPress={goToDetails}
                    title="Ver detalhes"
                    small
                  />
                </View>

              </View>
            )
}



const styles = StyleSheet.create({
  process: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginRight: 20,
    width: '100%'
  },
});

export default ReportRecord;
