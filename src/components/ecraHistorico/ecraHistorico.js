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
    const [filterValue, setFilterValue] = useState('all');
    const [ triggerChildRefresh, setTriggerChildRefresh ] = useState(false);

    const userData = API.userData;
    // console.log(userData);
    const navigation = props.navigation;
    const PROCESSING_STATUS = 'processing';

    const refreshData = async () => {
      console.log('refreshing..');
      setRefreshing(true);
      const data = await API.getCurrentUserReports();
      setUserReports( orderDataByDateDescending( data ) );
      setTriggerChildRefresh(true);
      setRefreshing(false);
    }

    const orderDataByDateDescending = data => data.sort( (a,b) => b.submissionDate - a.submissionDate )

    const filterDataAccordingToSelectValue = () => {
      if ( filterValue === 'all' ) return userReports;
      if ( filterValue === 'animals' ) return userReports.filter( report => report.isAnimalReport );
      return userReports.filter( report => !report.isAnimalReport );
  }

  useEffect( () => {
      setFilteredData( filterDataAccordingToSelectValue() );
  }, [userReports, filterValue])

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
                            selectedValue={filterValue}
                            style={{height: 50, width: 150 }}
                            onValueChange={ itemValue => setFilterValue(itemValue) }>
                            <SelectPicker.Item label="Todos" value="all" />
                            <SelectPicker.Item label="Animais" value="animals" />
                            <SelectPicker.Item label="Lixo" value="trash" />
                </SelectPicker>
                <ScrollView style={{ flexDirection: 'column', width: '85%' }} nestedScrollEnabled>
                { filteredData.filter( report => report.status !== PROCESSING_STATUS).length !== 0 ? 
                                    filteredData.filter( report => report.status !== PROCESSING_STATUS).map( (report, idx) => <Record data={report} key={idx} showAll refreshRequested={triggerChildRefresh} navigation={navigation}/> )
                                : <Text style={{ alignSelf: 'center' }}>Nenhum report analisado </Text>
                }
              </ScrollView>
          </View>
        </ScrollView>
      </SafeAreaView>
    )
}

export default EcraHistorico;