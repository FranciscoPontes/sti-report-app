import React, { useState, useEffect } from 'react';
import { Container, Text, View } from 'native-base';
import { RefreshControl, SafeAreaView, ScrollView  } from 'react-native';
import { Col, Row, Grid } from 'react-native-easy-grid';
import * as API from '../../../services/firebaseAPI';
import Record from '../ReportRecord/ReportRecord';

const EcraHistorico = props => {
    const [ userReports, setUserReports ] = useState([]);
    const [ refreshing, setRefreshing ] = useState(false);

    const userData = API.userData;
    // console.log(userData);
    const navigation = props.navigation;

    const refreshData = async () => {
      //console.log('refreshing..');
      setRefreshing(true);
      const data = await API.getCurrentUserReports();
      setUserReports(data);
      setRefreshing(false);
    }

    useEffect( () => {
      //console.log('---- use effect ----');
      //console.log(userData);
      refreshData();
    }, [])

    useEffect(() => {
      const unsubscribe = navigation.addListener('focus', () => {
        refreshData();
      });
      
      return unsubscribe;
    }, [navigation]);

    return (
        <SafeAreaView>
        <ScrollView refreshControl={
          <RefreshControl 
            refreshing={refreshing}
            onRefresh={refreshData}
          />
        }>
          <View style={{ alignItems: 'center', backgroundColor: '#ece8e8', padding: '5%', marginTop: '5%', marginBottom: '10%', borderRadius: 10, width: '85%', alignSelf: 'center' }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', paddingBottom: 10 }}>
                    Históricos de pedidos
                </Text>
                <ScrollView style={{ flexDirection: 'column', width: '85%' }} nestedScrollEnabled>
                { userReports.length !== 0 ? 
                                    userReports.map( (report, idx) => <Record data={report} key={idx} showAll/> )
                                : <Text style={{ alignSelf: 'center' }}>Não fez qualquer pedido</Text>
                }
              </ScrollView>
          </View>
        </ScrollView>
      </SafeAreaView>
    )
}

export default EcraHistorico;