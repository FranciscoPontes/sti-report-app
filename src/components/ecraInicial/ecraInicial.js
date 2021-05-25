import React, { useState, useEffect } from 'react';
import { Container, Button, Text, View } from 'native-base';
import { Image, ScrollView, StyleSheet } from 'react-native';
import { Col, Row, Grid } from 'react-native-easy-grid';
import * as FirebaseAPI from '../../../services/firebaseAPI';
import Record from './record';

const EcraInicial = props => {
    const navigation = props.navigation;

    return (
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
                <Record />
                <Record />
                <Record />
                <Record />
                <Record />
                <Record />
                <Record />
                <Record />
                <Record />
                <Record />
                <Record />
            </ScrollView>
        </View >
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