import React, { useState, useEffect } from 'react';
import { Button, Text, View } from 'native-base';
import { Image, StyleSheet, RefreshControl, SafeAreaView, ScrollView  } from 'react-native';
import { Picker as SelectPicker } from '@react-native-picker/picker';
import * as API from '../../../services/firebaseAPI';
import Record from '../ReportRecord/ReportRecord';

const EcraInicial = props => {
    const navigation = props.navigation;
    const [ userReports, setUserReports ] = useState([]);
    const [ refreshing, setRefreshing ] = useState(false);
    const [ filteredData, setFilteredData ] = useState([]);
    const [filterValue, setFilterValue] = useState('all');
    

    const userData = API.userData;
    // console.log(userData);

    const refreshData = async () => {
      console.log('refreshing..');
      setRefreshing(true);
      const data = await API.getCurrentUserReports();
      setUserReports( orderDataByDateDescending( data ) );
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
                            Reports em Análise
                        </Text>
                        <SelectPicker
                            selectedValue={filterValue}
                            style={{height: 50, width: 150 }}
                            onValueChange={ itemValue => setFilterValue(itemValue) }>
                            <SelectPicker.Item label="Todos" value="all" />
                            <SelectPicker.Item label="Animais" value="animals" />
                            <SelectPicker.Item label="Lixo" value="trash" />
                        </SelectPicker>
                        <View style={{ flexDirection: 'column', width: '90%' }}>
                            { filteredData.length !== 0 ? 
                                    filteredData.map( (report, idx) => <Record data={report} key={idx}/> )
                                : <Text style={{ alignSelf: 'center' }}>Não fez qualquer report</Text>
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