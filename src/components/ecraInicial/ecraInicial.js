import React, { useState, useEffect } from 'react';
import { Container, Button, Text } from 'native-base';
import { Image, StyleSheet  } from 'react-native';
import { Col, Row, Grid } from 'react-native-easy-grid';

const styles = StyleSheet.create({
    ava: {
      width: 66,
      height: 58,
    },
  });

const EcraInicial = props => {
    const userData = props.route.params.user; 
    const navigation = props.navigation;

    const reportTemplate = 
    {
        user: '113842996349886677035',
        latitude: '15',
        longitude: '20',
        accessType: 'medium', // easy, medium, hard
        extractionType: 'truck',
        isAnimalReport: false,
        typeOfAnimal: null,
        typeOfTrash: 'plastic', // plastic etc..
        submissionDate: new Date('2017-08-15'), // data atual
        status: 'processing' // processing, closed, rejected
    }

    const handleButtonPress = async () => {
        var array = await FirebaseAPI.getAllReports();
        console.log(array);
        console.log('----------------------');
        array.map( obj => console.log(obj));
    }

    return (
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
        </Container>
    )
}

export default EcraInicial;