import React, { useState, useEffect } from 'react';
import { Button, Text, View } from 'native-base';
import { Image, StyleSheet, RefreshControl, SafeAreaView, ScrollView  } from 'react-native';
import * as API from '../../../services/firebaseAPI';
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
            <View>
                <View style={{paddingTop: 15, alignItems: 'center'}}>
                    <View style={{ flexDirection: 'row' }}>
                        <Button style={[styles.button, { backgroundColor: "#Daa900" }]} large onPress={() => { navigation.navigate('Home', { screen: 'ReportScreen', params: { reportType: 1 } } ) }}>
                            <View style={styles.buttonContent}>
                                <Text style={styles.buttonText}>
                                    Novo
                                </Text>
                                <Image style={[styles.buttonIcon, { height: 50, width: 50 }]} source={require('../../../assets/trash.png')}></Image>
                            </View>
                        </Button>

                        <Button style={[styles.button, { backgroundColor: "#0582CA" }]} large onPress={() => { navigation.navigate('Home', { screen: 'ReportScreen', params: { reportType: 0 } } ) }}>
                            <View style={styles.buttonContent}>
                                    <Text style={styles.buttonText}>
                                        Novo
                                    </Text>
                                <Image style={[styles.buttonIcon, { height: 35, width: 35 }]} source={require('../../../assets/animal.png')}></Image>
                            </View>
                        </Button>
                    </View>
                    <View style={{ marginTop: '5%', marginBottom: '5%', backgroundColor: '#ece8e8', padding: '5%', borderRadius: 10, width: '85%', alignItems: 'center' }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', paddingBottom: 10 }}>
                            Pedidos em Análise
                        </Text>
                        <View style={{ flexDirection: 'column', width: '90%' }}>
                            { userReports.length !== 0 ? 
                                    userReports.map( (report, idx) => <Record data={report} key={idx}/> )
                                : <Text style={{ alignSelf: 'center' }}>Não fez qualquer pedido</Text>
                            }
                        </View>
                    </View>
                </View>
            </View>
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
        margin: '1%',
        marginBottom: '3%',
        maxWidth: '30%'
    },

    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 20,
    },

    buttonContent: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        paddingHorizontal: 12,
    },

    buttonIcon: {
        alignSelf: 'stretch'
    }
})

export default EcraInicial;