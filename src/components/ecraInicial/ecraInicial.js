import React, { useState, useEffect } from 'react';
import { Container, Button, Text } from 'native-base';
import { Image, StyleSheet  } from 'react-native';
import { Col, Row, Grid } from 'react-native-easy-grid';

const EcraInicial = props => {
    const navigation = props.navigation;

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