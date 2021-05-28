import React, { useState, useEffect } from 'react';
import { Container, Row, Text, View } from 'native-base';
import { ScrollView, Image, StyleSheet, Button, Alert  } from 'react-native';
import { SafeAreaView } from 'react-native';
import { stopLocationUpdatesAsync } from 'expo-location';
import * as FirebaseAPI from '../../../services/firebaseAPI';
import { useIsFocused } from '@react-navigation/native';
import { NavigationContainer } from '@react-navigation/native';
import { PanResponder } from 'react-native';
import Animated, { Transition } from 'react-native-reanimated';


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
        flexDirection: 'row', 
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
    const [animalReports, setAnimalReports] = useState([]);
    const [junkReports, setJunkReports] = useState([]);

    const BRONZE = 250;
    const SILVER = 500;
    const GOLD = 1000;

    const ReportsCheck = async () => {  
        const response = await FirebaseAPI.getCurrentUserReports();
        setReports(response);

        const resultAnimals = response.filter(response => response.isAnimalReport === true);
        setAnimalReports(resultAnimals.length);
        console.log(resultAnimals.length);

        const resultJunk = response.filter(response => response.isAnimalReport === false);
        setJunkReports(resultJunk.length);
        console.log(resultJunk.length);
    }
        

    useEffect(() => {   
        const unsubscribe = navigation.addListener('focus', () => {
            ReportsCheck();});
              return unsubscribe;
            }, [navigation]);


    const ProgressCheck = () => {
        if (reports.length <=BRONZE){      
            return <Text> {reports.length} / {BRONZE} </Text>;
            }
        if(reports.length <= SILVER){
            return <Text> {reports.length} / {SILVER}</Text>;
            }  
        if(reports.length <= GOLD){
            return <Text> {reports.length} / {GOLD}</Text>;
            }
        return <Text> {GOLD} / {GOLD}</Text>;
        }

    const SpecialBadges = () => { 
        if (reports.length >=BRONZE && reports.length <SILVER){ 
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
    }   
    return null;
    }

    const NrReportsBadge = () => { 
        if (reports.length >=5 && reports.length < 25){  
            return <View style={{flexDirection:'row', justifyContent: 'space-evenly'}}>
                <Image style={styles.profileImage} source={require('../../../assets/5Reports.png')}/>        
                </View>;
        } 
        if (reports.length >=25 && reports.length < 50){ 
            return <View style={{flexDirection:'row', justifyContent: 'space-evenly'}}>
                <Image style={styles.profileImage} source={require('../../../assets/5Reports.png')}/>        
                <Image style={styles.profileImage} source={require('../../../assets/25Reports.png')}/>        
                </View>;
        } 
        if (reports.length >=50 ){   
            return <View style={{flexDirection:'row', justifyContent: 'space-evenly'}}>
                <Image style={styles.profileImage} source={require('../../../assets/5Reports.png')}/>        
                <Image style={styles.profileImage} source={require('../../../assets/25Reports.png')}/> 
                <Image style={styles.profileImage} source={require('../../../assets/50Reports.png')}/> 
                </View>;
        } 
    return null;
    }


    const MissionBadges = () => { 
        if (animalReports >=1 && junkReports == 0){ 
            return <View style={{flexDirection:'row', justifyContent: 'space-evenly'}}>
                <Image style={styles.profileImage} source={require('../../../assets/PetSavior.png')}/>        
                </View>;
        } 
        if(junkReports >=1 && animalReports == 0 ){
            return <View style={{flexDirection:'row', justifyContent: 'space-evenly'}}>
                <Image style={styles.profileImage} source={require('../../../assets/EarthLover.png')}/>        
                </View>;
        }
        if(junkReports >=1 && animalReports >=1 && reports.length >=10){
            return <View style={{flexDirection:'row', justifyContent: 'space-evenly'}}>
                <Image style={styles.profileImage} source={require('../../../assets/PetSavior.png')}/>        
                <Image style={styles.profileImage} source={require('../../../assets/EarthLover.png')}/>     
                <Image style={styles.profileImage} source={require('../../../assets/ReportDuty.png')}/>           
                </View>;
        }   
        if(junkReports >=1 && animalReports >=1 ){
            return <View style={{flexDirection:'row', justifyContent: 'space-evenly'}}>
            <Image style={styles.profileImage} source={require('../../../assets/PetSavior.png')}/>        
            <Image style={styles.profileImage} source={require('../../../assets/EarthLover.png')}/>        
            </View>;
        }
    return null;
    }

    const Barfill = () => {
        if (reports.length <=BRONZE){      
            return <Animated.View style={[StyleSheet.absoluteFill], {backgroundColor: "#8BED4F", width: (reports.length/BRONZE)*100+"%"}}/>
        }
        if(reports.length <= SILVER){
          return <Animated.View style={[StyleSheet.absoluteFill], {backgroundColor: "#8BED4F", width: (reports.length/SILVER)*100+"%"}}/>
        }  
        if(reports.length <=GOLD){
          return <Animated.View style={[StyleSheet.absoluteFill], {backgroundColor: "#8BED4F", width: (reports.length/GOLD)*100+"%"}}/>
        }
        return <Animated.View style={[StyleSheet.absoluteFill], {backgroundColor: "#8BED4F", width: "100%"}}/>
    }

    return (
        
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={{flexDirection:'row', justifyContent: 'space-evenly'}}>
                    <Image style={styles.profileImage} source={{ uri: userData.photoURL }} />
                    <View style={{flexDirection:'column', justifyContent:'space-evenly'}}>
                        <Text>{userData.displayName}</Text>
                        <Text>{userData.email}</Text>
                    </View> 
                </View>

                <View style = {{padding : 25 }} >
                    <View style={styles.progressBar}>
                        {Barfill()}
                    </View>
                    {ProgressCheck()} 
                </View> 
     
                <Text style={{alignSelf:"center"}}>Recompensas</Text>
                {SpecialBadges()}
                {MissionBadges()}
                {NrReportsBadge()} 
                { reports.length !== 0 ? 
                    <View style={{ alignSelf: 'center', flexDirection: 'column', width: "90%", borderWidth: 1,
                    borderColor: "thistle",
                    borderRadius: 50, }}>
                        <Text style={{ alignSelf: 'center' }}>{reports.length} Reports Submetidos no Total</Text> 
                        <Text style={{ alignSelf: 'center' }}>{animalReports} Reports Submetidos do tipo animal</Text> 
                        <Text style={{ alignSelf: 'center' }}>{junkReports} Reports Submetidos do tipo lixo</Text> 
                    </View>
                : <Text style={{ alignSelf: 'center' }}>Nenhum report efetuado</Text>
                }   
            </ScrollView>
        </SafeAreaView>
       
    );
}


export default EcraPerfil;