import React, { useState, useEffect } from 'react';
import { Container, Button, Text, View } from 'native-base';
import { Image, StyleSheet, RefreshControl, SafeAreaView, ScrollView  } from 'react-native';
import { Col, Row, Grid } from 'react-native-easy-grid';
import * as API from '../../../services/firebaseAPI';
import * as Location from 'expo-location';
import Record from '../ReportRecord/ReportRecord';

const EcraInicial = props => {
    const navigation = props.navigation;
    const [ userReports, setUserReports ] = useState([]);
    const [ refreshing, setRefreshing ] = useState(false);

    const userData = API.userData;
    // console.log(userData);

    const refreshData = async () => {
      console.log('refreshing..');
      setRefreshing(true);
      const data = await API.getCurrentUserReports();
      setUserReports(data);
      setRefreshing(false);
    }

    useEffect( () => {
      console.log('---- use effect ----');
      console.log(userData);
      refreshData();
    }, [])

    return (
        <SafeAreaView>
          <ScrollView refreshControl={
            <RefreshControl 
              refreshing={refreshing}
              onRefresh={refreshData}
            />
          }>
            <Container>
                <Grid style={{paddingTop: 15, alignItems: 'center'}}>
                    <View style={{ flexDirection: 'row' }}>
                        <Button style={[styles.button, { backgroundColor: "#Daa900" }]} onPress={() => { navigation.navigate('Home', { screen: 'ReportScreen', params: { reportType: 1 } } ) }}>
                            <Row style={styles.insideButton}>
                                <Col style={{ alignItems: 'center' }}>
                                    <Text style={styles.buttonText}>
                                        Novo
                                    </Text>
                                </Col>
                                <Image style={{ height: 50, width: 50 }} source={require('../../../assets/trash.png')}></Image>
                            </Row>
                        </Button>

                        <Button style={[styles.button, { backgroundColor: "#0582CA" }]} onPress={() => { navigation.navigate('Home', { screen: 'ReportScreen', params: { reportType: 0 } } ) }}>
                            <Row style={styles.insideButton}>
                                <Col style={{ alignItems: 'center' }}>
                                    <Text style={styles.buttonText}>
                                        Novo
                                    </Text>
                                </Col>
                                <Image style={{ height: 40, width: 40 }} source={require('../../../assets/animal.png')}></Image>
                            </Row>
                        </Button>
                    </View>
                    {/* <Row size={5}>
                        <Col>
                            <Button light onPress={() => {navigation.navigate('Report', {screen: "ReportScreen", params: { reportType: 0 }})}} style={{alignSelf: 'flex-end', marginRight: 10, borderRadius: 10}}><Text style={{color: "white"}}>Report Animal</Text></Button>
                        </Col>
                        <Col>
                            <Button info onPress={() => {navigation.navigate('Report', {screen: "ReportScreen", params: { reportType: 1 }})}} style={{paddingHorizontal: 10, borderRadius: 10}}><Text>Report Lixo</Text></Button>
                        </Col>
                    </Row> */}
                    <Row size={40} >
                        <Col style={{ backgroundColor: '#ece8e8', padding: '5%', borderRadius: 10, width: '85%', alignItems: 'center' }}>
                                <Text style={{ fontSize: 20, fontWeight: 'bold', paddingBottom: 10 }}>
                                    Pedidos em Análise
                                </Text>
                            <View style={{ flexDirection: 'column' }} size={90}>
                                { userReports ? 
                                      userReports.map( (report, idx) => <Record data={report} key={idx}/> )
                                    : <Text>You have not made any report</Text>
                                }
                            </View>
                        </Col>
                    </Row>
                </Grid>
                {/* <Grid style={{ width: '85%', alignSelf: 'center', backgroundColor: '#ece8e8'}}>
                    <Row style={{ }}>
                        <Text style={{ color: '#000', textAlign: 'center' }}>
                            Pedidos em Análise
                        </Text>
                    </Row>
                    <Row style={{ padding: 5}}>
                            <Record />
                    </Row>
                </Grid> */}
                {/* <Table data={userReports}/> */}
            </Container>
            {/* <View> */}
            {/* <View style={styles.rowz}>

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

            </View> */}
            {/* </View > */}
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
        // height: 80,
        width: 170,
        // padding: '5%'
        margin: '1%',
        marginBottom: '3%'
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