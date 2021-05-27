import React, { useState, useEffect } from 'react';
import { Container, Row, Text, View } from 'native-base';
import { ScrollView, Image, StyleSheet, Button, Alert  } from 'react-native';
import { SafeAreaView } from 'react-native';
import { stopLocationUpdatesAsync } from 'expo-location';
import * as FirebaseAPI from '../../../services/firebaseAPI';
import { useIsFocused } from '@react-navigation/native';
import { NavigationContainer } from '@react-navigation/native';

const styles = StyleSheet.create({
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 100,
        overflow: "hidden",
         
    },
    container: { 
        flex:1,
       padding: 10,
        backgroundColor : "#fff",
        justifyContent: 'space-evenly',
    },
    personaldetails:{
        flexDirection: 'row',

    },
    progressBar: {
        height: 20,
        width: '100%',
        backgroundColor: 'white',
        borderColor: '#000',
        borderWidth: 2,
        borderRadius: 5,
        alignSelf: "center",
        
      }
  });


const EcraPerfil = ({navigation}) => {
  
    const userData = FirebaseAPI.userData; 
    const [reports, setReports] = useState([]);
    var result;
    const BRONZE = 5;
    const SILVER = 10;
    const GOLD = 15;

    const ReportsCheck = async () => {  
        const response = await FirebaseAPI.getCurrentUserReports();
        setReports(response);}
        

    useEffect(() => {   
        const unsubscribe = navigation.addListener('focus', () => {
            ReportsCheck();});
              return unsubscribe;
            }, [navigation]);


    const ProgressCheck = () => { if (reports.length <=BRONZE){ 
                return <Text> {reports.length} / 5</Text>;
            } else if(reports.length <= SILVER){ 
                return <Text> {reports.length} / 10</Text>;
            }  
                return <Text> {reports.length} / 15</Text>;
        }

    const BadgesCheck = () => { if (reports.length >=BRONZE && reports.length <SILVER){ 
       
        return <View style={{flexDirection:'row', justifyContent: 'space-evenly'}}>
                <Image style={styles.profileImage} source={require('../../../assets/badgeBronze.png')}/>        
                </View>;
    } 
        if(reports.length >=SILVER && reports.length <GOLD){ 
        return <View style={{flexDirection:'row', justifyContent: 'space-evenly'}}>
                <Image style={styles.profileImage} source={require('../../../assets/badgeBronze.png')}/>
                <Image style={styles.profileImage} source={require('../../../assets/badgeSilver.png')}/>         
                </View>;               
    } 
        if(reports.length >=GOLD){ 

        return <View style={{flexDirection:'row', justifyContent: 'space-evenly'}}>
                <Image style={styles.profileImage} source={require('../../../assets/badgeBronze.png')}/>
                <Image style={styles.profileImage} source={require('../../../assets/badgeSilver.png')}/>
                <Image style={styles.profileImage} source={require('../../../assets/badgeGold.png')}/>       
                </View>; 
    }   return null;

}
        
    return (
        
        <SafeAreaView style={styles.container}>
            <View style={{flexDirection:'row', justifyContent: 'space-evenly'}}>
                <Image style={styles.profileImage} source={{ uri: userData.photoURL }} />
                <View style={{flexDirection:'column', justifyContent:'space-evenly'}}>
                    <Text>{userData.displayName}</Text>
                    <Text>{userData.email}</Text>
                </View> 
            </View>

            <View>
            <View style={styles.progressBar}></View>
           {ProgressCheck()} 
            <Text style={{alignSelf:"center"}}>{ 'Progresso'}</Text>
            </View> 
     
            <Text style={{alignSelf:"center"}}>Badges</Text>
            {BadgesCheck()}
  
        </SafeAreaView>
       
    );
}


export default EcraPerfil;