import React, { useState, useEffect } from 'react';
import { Container, Button, Text } from 'native-base';
import { Image, StyleSheet, RefreshControl, SafeAreaView, ScrollView  } from 'react-native';
import { Col, Row, Grid } from 'react-native-easy-grid';
import * as API from '../../../services/firebaseAPI';
import Table from '../ReportsTable';
import * as Location from 'expo-location';

const EcraInicial = props => {
    const navigation = props.navigation;
    const [ userReports, setUserReports ] = useState([]);
    const [ refreshing, setRefreshing ] = useState(false);

    const refreshData = async () => {
      console.log('refreshing..');
      setRefreshing(true);
      transformData(await API.getCurrentUserReports() );
      setRefreshing(false);
    }

    const transformData = async data => {
      const transformedData = Promise.all( data.map( async val => modifiedObj(val) ) )
      console.log('here');
      setUserReports(transformedData);
    }

    const modifiedObj = async data => {
      console.log('modifying obj');
      const city = await reverseCoord({
        latitude: data.latitude, 
        longitude: data.longitude
      })
      console.log(city);
      return {...data, city: city};
    }
 
    const reverseCoord = async location => await Location.reverseGeocodeAsync(location)
                                        .then( response => response[0].city )
                                        .catch( error => console.log(error.message) )

    useEffect( () => refreshData(),[])

    return (
        <SafeAreaView>
          <ScrollView refreshControl={
            <RefreshControl 
              refreshing={refreshing}
              onRefresh={refreshData}
            />
          }>
            <Container>
                <Grid style={{paddingTop: 15, alignItems: 'center', justifyContent: 'center'}}>
                    <Row>
                        <Col>
                            <Button light onPress={() => {navigation.navigate('Report', {screen: "ReportScreen", params: { reportType: 0 }})}} style={{alignSelf: 'flex-end', marginRight: 10}}><Text style={{color: "white"}}>Report Animal</Text></Button>
                        </Col>
                        <Col>
                            <Button info onPress={() => {navigation.navigate('Report', {screen: "ReportScreen", params: { reportType: 1 }})}} style={{paddingHorizontal: 10}}><Text>Report Lixo</Text></Button>
                        </Col>
                    </Row>
                </Grid>
                <Table data={userReports}/>
            </Container>
          </ScrollView>
        </SafeAreaView>
    )
}

export default EcraInicial;