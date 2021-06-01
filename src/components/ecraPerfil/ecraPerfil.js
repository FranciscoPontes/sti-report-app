import React, { useState, useEffect } from 'react';
import { Text, View } from 'native-base';
import { ScrollView, Image, StyleSheet, TouchableOpacity, Pressable  } from 'react-native';
import * as FirebaseAPI from '../../../services/firebaseAPI';
import Animated from 'react-native-reanimated';
import Popover from 'react-native-popover-view';


const styles = StyleSheet.create({
    profileImage: {
        width: 115,
        height: 115,
        borderRadius: 25,
        overflow: "hidden",
        borderColor: "rgb(0,122,200)",
        borderWidth: 2
    },
    badgeImage:{
        width: 100,
        height: 100,
        marginVertical: 5,
        marginHorizontal: 15,
        resizeMode: "contain"
    },
    PopOverImage: {
        width: 300,
        height: 300,
        justifyContent: 'center',
        alignItems: 'center',
        resizeMode: "contain"
    },
    container: { 
        flex:1,
        padding: 25,
        backgroundColor : "#ECE8E8",
        justifyContent: 'space-evenly',
    },
    personaldetails:{
        flexDirection: 'row',
    },
    progressBar: {
        flexDirection: 'row', 
        height: 25,
        width: '90%',
        backgroundColor: 'white',
        borderColor: '#000',
        borderWidth: 2,
        borderRadius: 5,
        alignSelf: "center",
    },
    headers:{
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 25,
        textAlign: "center"
    },
    progressCheck:{
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 20,
        textAlign: "center"
    },
    separador:{
        marginVertical: 25,
        borderBottomColor: '#737373',
        borderBottomWidth: 2,
    },
    statisticText:{
        fontSize: 18,
        marginVertical: 5,
        textAlign: "center"
    },
    popOverText:{
        fontSize: 18,
        marginBottom: 10,
        fontWeight: "bold",
        textAlign: "center"
    },
    popOverContainer:{
        padding: 10,
        backgroundColor: "rgb(255, 255, 255)",
        borderRadius: 25
    },
    mainScreen:{
        backgroundColor: "#FFFFFF"
    },
    logOutButton:{
        alignItems: 'center',
        justifyContent: 'center',
        width: "80%",
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 15,
        elevation: 3,
        backgroundColor: 'rgb(0,122,200)',
    },
    logOutText:{
        fontSize: 18,
        textAlign: "center",
        fontWeight: "bold",
        color: "white"
    }
  });

const logOut = () => {
    console.log("Efetuar Logout")
}

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

    const BronzeBlur = () => { 
        return <Popover popoverStyle={styles.popOverContainer} from={(
        <TouchableOpacity>
                <Image style={styles.badgeImage} blurRadius={4} source={require('../../../assets/badgeBronze.png')}/>        
        </TouchableOpacity>)}>
            <Image style={styles.PopOverImage} source={require('../../../assets/badgeBronze.png')}/>        
            <Text style={styles.popOverText}>250 Reports Para Desbloquear</Text> 
        </Popover>;
        }
    
    const SilverBlur = () => {return <Popover popoverStyle={styles.popOverContainer} from={(
        <TouchableOpacity>
                <Image style={styles.badgeImage} blurRadius={4} source={require('../../../assets/badgeSilver.png')}/>        
        </TouchableOpacity>)}>
    <Image style={styles.PopOverImage} source={require('../../../assets/badgeSilver.png')}/>        
    <Text style={styles.popOverText}>500 Reports Para Desbloquear</Text> 
    </Popover>;
    }
    
    const GoldBlur = () => {return <Popover popoverStyle={styles.popOverContainer} from={(
        <TouchableOpacity>
                <Image style={styles.badgeImage} blurRadius={4} source={require('../../../assets/badgeGold.png')}/>        
        </TouchableOpacity>)}>
    <Image style={styles.PopOverImage} source={require('../../../assets/badgeGold.png')}/>        
    <Text style={styles.popOverText}>1000 Reports Para Desbloquear</Text> 
    </Popover>;
    }

    const PetBlur = () => {return <Popover popoverStyle={styles.popOverContainer} from={(
        <TouchableOpacity>
                <Image style={styles.badgeImage} blurRadius={4} source={require('../../../assets/PetSavior.png')}/>        
        </TouchableOpacity>)}>
    <Image style={styles.PopOverImage} source={require('../../../assets/PetSavior.png')}/>        
    <Text style={styles.popOverText}>1 Report de Animais Para Desbloquear</Text> 
    </Popover>;
    }
    
    const JunkBlur = () => {return <Popover popoverStyle={styles.popOverContainer} from={(
        <TouchableOpacity>
                <Image style={styles.badgeImage} blurRadius={4} source={require('../../../assets/EarthLover.png')}/>        
        </TouchableOpacity>)}>
    <Image style={styles.PopOverImage} source={require('../../../assets/EarthLover.png')}/>        
    <Text style={styles.popOverText}>1 Report de Lixo para Desbloquear</Text> 
    </Popover>;
    }

    const DutyBlur = () => {return <Popover popoverStyle={styles.popOverContainer} from={(
        <TouchableOpacity>
                <Image style={styles.badgeImage} blurRadius={4} source={require('../../../assets/ReportDuty.png')}/>        
        </TouchableOpacity>)}>
    <Image style={styles.PopOverImage} source={require('../../../assets/ReportDuty.png')}/>        
    <Text style={styles.popOverText}>10 Reports Para Desbloquear</Text> 
    </Popover>;
    }

    const FiveBlur = () => {return <Popover popoverStyle={styles.popOverContainer} from={(
        <TouchableOpacity>
                <Image style={styles.badgeImage} blurRadius={4} source={require('../../../assets/5Reports.png')}/>        
        </TouchableOpacity>)}>
    <Image style={styles.PopOverImage} source={require('../../../assets/5Reports.png')}/>        
    <Text style={styles.popOverText}>5 Reports Para Desbloquear</Text> 
    </Popover>;
    }

    const Twenty5Blur = () => {return <Popover popoverStyle={styles.popOverContainer} from={(
        <TouchableOpacity>
                <Image style={styles.badgeImage} blurRadius={4} source={require('../../../assets/25Reports.png')}/>        
        </TouchableOpacity>)}>
    <Image style={styles.PopOverImage} source={require('../../../assets/25Reports.png')}/>        
    <Text style={styles.popOverText}>25 Reports Para Desbloquear</Text> 
    </Popover>;
    }

    const FiftyBlur = () => {return <Popover popoverStyle={styles.popOverContainer} from={(
        <TouchableOpacity>
                <Image style={styles.badgeImage} blurRadius={4} source={require('../../../assets/50Reports.png')}/>        
        </TouchableOpacity>)}>
    <Image style={styles.PopOverImage} source={require('../../../assets/50Reports.png')}/>        
    <Text style={styles.popOverText}>50 Reports Para Desbloquear</Text> 
    </Popover>;
    }

    const ProgressCheck = () => {
        if (reports.length <= BRONZE){      
            return <Text style={styles.progressCheck}> {reports.length} / {BRONZE} BRONZE</Text>;
            }
        if(reports.length <= SILVER){
            return <Text style={styles.progressCheck}> {reports.length} / {SILVER} SILVER</Text>;
            }  
        if(reports.length <= GOLD){
            return <Text style={styles.progressCheck}> {reports.length} / {GOLD} GOLD</Text>;
            }
            return <Text style={styles.progressCheck}> {GOLD} / {GOLD}</Text>;
    }

    const SpecialBadges = () => {
        if (reports.length >=BRONZE && reports.length <SILVER){ 
            return <View style={{flexDirection:'row', justifyContent: 'space-evenly'}}>
                <Image style={styles.profileImage} source={require('../../../assets/badgeBronze.png')}/> 
                {SilverBlur()}
                {GoldBlur()}       
                </View>;
    } 
        if(reports.length >=SILVER && reports.length <GOLD){ 
            return <View style={{flexDirection:'row', justifyContent: 'space-evenly'}}>
                <Image style={styles.badgeImage} source={require('../../../assets/badgeBronze.png')}/>
                <Image style={styles.badgeImage} source={require('../../../assets/badgeSilver.png')}/>  
                {GoldBlur()}       
                </View>;               
    } 
        if(reports.length >=GOLD){ 
            return <View style={{flexDirection:'row', justifyContent: 'space-evenly'}}>
                <Image style={styles.badgeImage} source={require('../../../assets/badgeBronze.png')}/>
                <Image style={styles.badgeImage} source={require('../../../assets/badgeSilver.png')}/>
                <Image style={styles.badgeImage} source={require('../../../assets/badgeGold.png')}/>       
                </View>; 
    }   

    return <View style={{flexDirection:'row', justifyContent: 'space-evenly'}}>
                {BronzeBlur()}
                {SilverBlur()}
                {GoldBlur()}     
            </View>;
    }

    const NrReportsBadge = () => { 
        if (reports.length >=5 && reports.length < 25){  
            return <View style={{flexDirection:'row', justifyContent: 'space-evenly'}}>
                <Image style={styles.badgeImage} source={require('../../../assets/5Reports.png')}/>
                {Twenty5Blur()}
                {FiftyBlur()}        
                </View>;
        } 
        if (reports.length >=25 && reports.length < 50){ 
            return <View style={{flexDirection:'row', justifyContent: 'space-evenly'}}>
                <Image style={styles.badgeImage} source={require('../../../assets/5Reports.png')}/>        
                <Image style={styles.badgeImage} source={require('../../../assets/25Reports.png')}/>
                {FiftyBlur()}        
                </View>;
        } 
        if (reports.length >=50 ){   
            return <View style={{flexDirection:'row', justifyContent: 'space-evenly'}}>
                <Image style={styles.badgeImage} source={require('../../../assets/5Reports.png')}/>        
                <Image style={styles.badgeImage} source={require('../../../assets/25Reports.png')}/> 
                <Image style={styles.badgeImage} source={require('../../../assets/50Reports.png')}/> 
                </View>;
        } 
    return <View style={{flexDirection:'row', justifyContent: 'space-evenly'}}> 
                {FiveBlur()}
                {Twenty5Blur()}
                {FiftyBlur()}
             </View>
    ;}


    const MissionBadges = () => { 
        if (animalReports >=1 && junkReports == 0){ 
            return <View style={{flexDirection:'row', justifyContent: 'space-evenly'}}>
                <Image style={styles.badgeImage} source={require('../../../assets/PetSavior.png')}/> 
                {JunkBlur()}
                {DutyBlur()}       
                </View>;
        } 
        if(junkReports >=1 && animalReports == 0 ){
            return <View style={{flexDirection:'row', justifyContent: 'space-evenly'}}>
                {PetBlur()}
                <Image style={styles.badgeImage} source={require('../../../assets/EarthLover.png')}/>
                {DutyBlur()}        
                </View>;
        }
        if(junkReports >=1 && animalReports >=1 && reports.length >=10){
            return <View style={{flexDirection:'row', justifyContent: 'space-evenly'}}>
                <Image style={styles.badgeImage} source={require('../../../assets/PetSavior.png')}/>        
                <Image style={styles.badgeImage} source={require('../../../assets/EarthLover.png')}/>     
                <Image style={styles.badgeImage} source={require('../../../assets/ReportDuty.png')}/>           
                </View>;
        }   
        if(junkReports >=1 && animalReports >=1 ){
            return <View style={{flexDirection:'row', justifyContent: 'space-evenly'}}>
            <Image style={styles.badgeImage} source={require('../../../assets/PetSavior.png')}/>        
            <Image style={styles.badgeImage} source={require('../../../assets/EarthLover.png')}/> 
            {DutyBlur()}       
            </View>;
        }
    return <View style={{flexDirection:'row', justifyContent: 'space-evenly'}}>
                {PetBlur()}
                {JunkBlur()}
                {DutyBlur()}
            </View>;;
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
        <ScrollView style={styles.mainScreen}>
            <View style={styles.container}>
                <Text style={styles.headers}>Informações Pessoais</Text>
                <View style={{flexDirection:'row', justifyContent: 'space-evenly'}}>
                    <Image style={styles.profileImage} source={{ uri: userData.photoURL }} />
                    <View style={{flexDirection:'column', justifyContent:'space-evenly'}}>
                        <Text style={{fontSize: 18, textAlign: "center", fontWeight: "bold"}}>Nome</Text>
                        <Text style={{fontSize: 15, textAlign: "center"}}>{userData.displayName}</Text>
                        <Text style={{fontSize: 18, textAlign: "center", fontWeight: "bold"}}>Email</Text>
                        <Text style={{fontSize: 15, textAlign: "center"}}>{userData.email}</Text>
                    </View> 
                </View>
                <View style={styles.separador} />
                <Text style={styles.headers}>Progesso</Text>
                <View style={{}}>
                    <View style={styles.progressBar}>
                        {Barfill()}
                    </View>
                    {ProgressCheck()} 
                </View> 
                <View style={styles.separador} />
                <Text style={styles.headers}>Emblemas e Recompensas</Text>
                
                {SpecialBadges()}
                {MissionBadges()}
                {NrReportsBadge()}

                <View style={styles.separador} />
                <Text style={styles.headers}>Estatísticas do Utilizador</Text>

                { reports.length !== 0 ? 
                    <View style={{ alignSelf: 'center', flexDirection: 'column'}}>
                        <Text style={styles.statisticText}>{reports.length} Reports submetidos no Total</Text> 
                        <Text style={styles.statisticText}>{animalReports} Reports de animais submetidos</Text> 
                        <Text style={styles.statisticText}>{junkReports} Reports de lixo submetidos</Text> 
                    </View>
                : <Text style={styles.statisticText}>Nenhum report efetuado</Text>
                }
                <View style={styles.separador} />
                <Text style={styles.headers}>Configurações de Sessão</Text>
                <View style={{ alignSelf: 'center', flexDirection: 'column'}}>
                    <TouchableOpacity style={styles.logOutButton} onPress={() => logOut()}>
                        <Text style={styles.logOutText}>Sair da Conta</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}


export default EcraPerfil;