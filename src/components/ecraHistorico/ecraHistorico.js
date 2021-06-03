import React, { useState, useEffect } from 'react';
import { Container, Text, View } from 'native-base';
import { RefreshControl, SafeAreaView, ScrollView  } from 'react-native';
import { Col, Row, Grid } from 'react-native-easy-grid';
import * as API from '../../../services/firebaseAPI';
import Record from '../ReportRecord/ReportRecord';
import { Picker as SelectPicker } from '@react-native-picker/picker';

const EcraHistorico = props => {
    const [ userReports, setUserReports ] = useState([]);
    const [ refreshing, setRefreshing ] = useState(false);
    const [ filteredData, setFilteredData ] = useState(userReports);
    const [filterByType, setFilterByType] = useState('all');
    const [filterByState, setFilterByState] = useState('all');
    const [ triggerChildRefresh, setTriggerChildRefresh ] = useState(false);

    const userData = API.userData;
    const isAdmin = API.userData.admin;
    const navigation = props.navigation;
    const PROCESSING_STATUS = 'processing';

    const refreshData = async () => {
      console.log('refreshing..');
      setRefreshing(true);
      console.log(isAdmin);
      const data = !isAdmin ? await API.getCurrentUserReports() : await API.getAllReports();
      setUserReports( orderDataByDateDescending( data ) );
      setTriggerChildRefresh(true);
      setRefreshing(false);
    }

    const orderDataByDateDescending = data => data.sort( (a,b) => b.submissionDate - a.submissionDate )

    const filterRecordsByType = () => {
      if ( filterByType === 'all' ) return filterRecordsByStatus(userReports);
      if ( filterByType === 'animals' ) return filterRecordsByStatus(userReports.filter( report => report.isAnimalReport ));
      return filterRecordsByStatus( userReports.filter( report => !report.isAnimalReport ) );
    }

    const filterRecordsByStatus = data => {
      if ( filterByState === 'all' ) return data;
      return data.filter( report => report.status === filterByState );
    }

    useEffect( () => {
        setFilteredData( filterRecordsByType() );
    }, [userReports, filterByType, filterByState])

    useEffect( () => {
      refreshData();
    }, [])

    useEffect(() => {
      const unsubscribe = navigation.addListener('focus', () => {
        refreshData();
      });
      
      return unsubscribe;
    }, [navigation]);


    useEffect( () => {
      const timeoutRefresh = () => {
          setTimeout( () => {
              setTriggerChildRefresh(false);
          }, 1200);
      }
      if (triggerChildRefresh) timeoutRefresh();
    }, [triggerChildRefresh])

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
                    Histórico de reports
                </Text>
                <SelectPicker
                            selectedValue={filterByType}
                            style={{height: 50, width: "80%" }}
                            onValueChange={ itemValue => setFilterByType(itemValue) }>
                            <SelectPicker.Item label="Tipo: Todos" value="all" />
                            <SelectPicker.Item label="Tipo: Animais" value="animals" />
                            <SelectPicker.Item label="Tipo: Lixo" value="trash" />
                </SelectPicker>
                <SelectPicker
                            selectedValue={filterByState}
                            style={{height: 50, width: "80%" }}
                            onValueChange={ itemValue => setFilterByState(itemValue) }>
                            <SelectPicker.Item label="Estado: Todos" value="all" />
                            {  userData.admin ? <SelectPicker.Item label="Estado: Análise" value="processing" /> : null }
                            <SelectPicker.Item label="Estado: Rejeitado" value="rejected" />
                            <SelectPicker.Item label="Estado: Aprovado" value="approved" />
                            <SelectPicker.Item label="Estado: Concluído" value="closed" />
                </SelectPicker>
                <ScrollView style={{ flexDirection: 'column', width: '85%' }} nestedScrollEnabled>
                {  !userData.admin ? ( filteredData.filter( report => report.status !== PROCESSING_STATUS).length !== 0 ? 
                                    filteredData.filter( report => report.status !== PROCESSING_STATUS).map( (report, idx) => <Record data={report} key={idx} showAll refreshRequested={triggerChildRefresh} navigation={navigation}/> )
                                : <Text style={{ alignSelf: 'center', marginTop: 20 }}>Nenhum report</Text> )
                    : (
                      filteredData.length !== 0 ? 
                                    filteredData.map( (report, idx) => <Record data={report} key={idx} showAll refreshRequested={triggerChildRefresh} navigation={navigation}/> )
                                : <Text style={{ alignSelf: 'center', marginTop: 20 }}>Nenhum report</Text>
                    )
                }
              </ScrollView>
          </View>
        </ScrollView>
      </SafeAreaView>
    )
}

export default EcraHistorico;