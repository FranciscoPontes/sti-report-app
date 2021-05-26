import React, { useState, useEffect } from 'react';
import { Container, Button, Text, View } from 'native-base';
import { Image, StyleSheet, RefreshControl, SafeAreaView, ScrollView  } from 'react-native';
import { Col, Row, Grid } from 'react-native-easy-grid';
import * as API from '../../../services/firebaseAPI';
import Table from '../ReportsTable';
import * as Location from 'expo-location';
import Record from './record';

const EcraInicial = props => {
    const navigation = props.navigation;
    const [ userReports, setUserReports ] = useState([]);
    const [ refreshing, setRefreshing ] = useState(false);
    const userData = API.userData;
    console.log(userData);

    const refreshData = async () => {
      console.log('refreshing..');
      setRefreshing(true);
      transformData(await API.getCurrentUserReports() );
      setRefreshing(false);
    }

    const transformData = async data => {
      // console.log(data);
      const transformedData = await Promise.all( data.map( async val => await modifiedObj(val) ) )
      // console.log(transformedData);
      setUserReports(transformedData);
    }

    const modifiedObj = async data => {
      console.log('modifying obj');
      const city = await reverseCoord({
        'latitude': data.latitude, 
        'longitude': data.longitude
      })
      console.log('Obj modified city: ' + city);
      return {...data, city: city};
    }
 
    const reverseCoord = async location => await Location.reverseGeocodeAsync(location)
                                        .then( response => response[0].city )
                                        .catch( error => error.message )

    // useEffect( () => () => {
    //   console.log('---- use effect ----');
    //   console.log(userData);
    //   refreshData();
    // } ,[userData])

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
            <View>
            <View style={styles.rowz}>

                <Button style={[styles.button, { backgroundColor: "#Daa900" }]} onPress={() => { navigation.navigate('Report', { screen: "ReportScreen", params: { reportType: 0 } }) }}>
                    <Row style={styles.insideButton}>
                        <Col style={{ alignItems: 'center' }}>
                            <Text style={styles.buttonText}>
                                Novo
                            </Text>
                            <Text style={styles.buttonText}>
                                Pedido
                            </Text>
                        </Col>
                        <Image style={{ height: 50, width: 50 }} source={require('../../../assets/trash.png')}></Image>
                    </Row>
                </Button>

                <Button style={[styles.button, { backgroundColor: "#0582CA" }]} onPress={() => { navigation.navigate('Report', { screen: "ReportScreen", params: { reportType: 1 } }) }}>
                    <Row style={styles.insideButton}>
                        <Col style={{ alignItems: 'center' }}>
                            <Text style={styles.buttonText}>
                                Novo
                            </Text>
                            <Text style={styles.buttonText}>
                                Pedido
                            </Text>
                        </Col>
                        <Image style={{ height: 40, width: 40 }} source={require('../../../assets/animal.png')}></Image>
                    </Row>
                </Button>

            </View>

            <Text style={{ color: '#000', textAlign: 'center', paddingBottom: 20 }}>
                Pedidos em Análise
            </Text>

            <ScrollView style={{marginBottom: 180}} >
                <Record />
{/*                 <Record />
                <Record />
                <Record />
                <Record />
                <Record />
                <Record />
                <Record />
                <Record />
                <Record />
                <Record />
                <Record /> */}
            </ScrollView>
            </View >
          </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    rowz: {
        paddingHorizontal: 15,
        paddingVertical: 30,
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },

    button: {
        borderRadius: 10,
        height: 80,
        width: 170,
    },

    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 20,
    },

    insideButton: {
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        paddingHorizontal: 12,
    },
})

export default EcraInicial;