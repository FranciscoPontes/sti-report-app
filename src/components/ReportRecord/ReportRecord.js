import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import * as FirebaseAPI from '../../../services/firebaseAPI';
import * as Location from 'expo-location';

const ReportRecord = props => {

  // flag to show all or just the ones pending
  const showAll = props.showAll;
  const PROCESSING_STATUS = 'processing';
  const IMG_SIZE = 30;
 /*  const userData = FirebaseAPI.userData; */
  const data = props.data;
  const [ city, setCity ] = useState(null);

  const toDateTime = secs => {
    var t = new Date(1970, 0, 1); 
    t.setSeconds(secs);
    return t;
  }

  const getReportCity = async location => {
    // console.log('--------------GOT THESE LOCATION--------------');
    // console.log(location);
    // console.log('----------------------------------------------');
    const response = await Location.reverseGeocodeAsync(location)
                                    .then( response => response[0].city )
                                    .catch( error => error.message );
    return response ? response : 'Unable to find city';
  }

  useEffect( () => {
        const getLocation = async () => {
        //console.log(data);
        if (city) return;
        const location = {
                          latitude: data.latitude,
                          longitude: data.longitude,
                        }
        setCity( await getReportCity(location) );
      }
      getLocation();
    }
    , [])

    //useEffect( () => console.log(city), [city])

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
            !showAll && data.status !== PROCESSING_STATUS ? null : 
            (
              <View style={styles.process}>
                <View style={{ flexDirection: 'column' }}>
                  <Text>{data.isAnimalReport ? data.typeOfAnimal : data.typeOfTrash}</Text>
                  { data.extractionType ? <Text>{data.extractionType}</Text> : null }
                  { data.acessType ? <Text>{data.acessType}</Text> : null }
                  <Text>{toDateTime(data.submissionDate.seconds).toLocaleDateString("en-US")}</Text>
                  <Text>{city}</Text>
                  <Text><Text style={{ fontWeight: 'bold' }}>Comentário: </Text>{data.additionalInfo}</Text>
                </View>

                { data.status == PROCESSING_STATUS ? 
                  <Image style={{ height: IMG_SIZE, width: IMG_SIZE }} source={require('../../../assets/loading.png')}></Image> : 
                  <Image style={{ height: IMG_SIZE, width: IMG_SIZE }} source={require('../../../assets/check.png')}></Image> 
                }              
              </View>
            )
          )
}



const styles = StyleSheet.create({
  process: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginRight: 20,
    width: '100%'
  },
});

export default ReportRecord;
