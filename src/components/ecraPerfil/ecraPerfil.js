import React, { useState, useEffect } from 'react';
import { Container, Row, Text, View } from 'native-base';
import { ScrollView, Image, StyleSheet, Button  } from 'react-native';
import { SafeAreaView } from 'react-native';
import { stopLocationUpdatesAsync } from 'expo-location';
import * as FirebaseAPI from '../../../services/firebaseAPI';

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


const EcraPerfil = props => {
    const userData = FirebaseAPI.userData; 
    const [reports, setReports] = useState([]);
    var result;

    const ReportsCheck = async () => {  
    const response = await FirebaseAPI.getCurrentUserReports();
    console.log(response);
    setReports(response);}
        
    useEffect(() => { ReportsCheck();},[]);
    console.log(reports.length)

    const ProgressCheck = () => { if (reports.length <=5){ 
                return <Text> {reports.length} / 5</Text>;
            } else if(reports.length <= 10){ 
                return <Text> {reports.length} / 10</Text>;
            } else if(reports.length <= 15){ 
                return <Text> {reports.length} / 15</Text>;
            }   return null;
        }

    const BadgesCheck = () => { if (reports.length >=5 && reports.length <10){ 
       
        return <View style={{flexDirection:'row', justifyContent: 'space-evenly'}}>
                <Image style={styles.profileImage} source={require('../../../assets/badgeBronze.png')}/>        
                </View>;
    } 
        if(reports.length >=10 && reports.length <15){ 
        return <View style={{flexDirection:'row', justifyContent: 'space-evenly'}}>
                <Image style={styles.profileImage} source={require('../../../assets/badgeBronze.png')}/>
                <Image style={styles.profileImage} source={require('../../../assets/badgeSilver.png')}/>         
                </View>;             
    } 
        if(reports.length >=15){ 

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
  

            <Button title="Reload" onPress={ReportsCheck}/>  
        </SafeAreaView>
       
    );
}


export default EcraPerfil;