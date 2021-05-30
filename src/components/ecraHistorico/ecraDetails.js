import React, { useState, useEffect } from 'react';
import { View, Text } from 'native-base';
import { StyleSheet, ScrollView, TouchableHighlight } from 'react-native';
import * as API from '../../../services/firebaseAPI';
import { Image, Button } from "react-native";
import { useIsFocused } from '@react-navigation/native'
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { Row, Grid } from 'react-native-easy-grid';
import Marker from 'react-native-maps';

const EcraDetails = props => {

    const currentUser = API.userData;

    const [report, setReport] = useState({});
    const [reportImage, setReportImage] = useState(null);
    const [userOfReport, setUserOfReport] = useState(null);
    const [contentLoaded, setContentLoaded] = useState(false);
    const [currentUserData, setCurrentUserData] = useState(null)
    const userFocused = useIsFocused()

    useEffect(() => {

        async function getReport() {
            setContentLoaded(false);
            let response = await API.getReport(props.route.params.reportId);
            response = await response[0];
            setReport(response);
            getReportAdditionalData(response.id, response.isAnimalReport, response.user)
        }

        async function getReportAdditionalData(reportId, type, userId) {
            let responseOne = await API.getImage(reportId, type);
            setReportImage(responseOne);
            let responseTwo = await API.getUser(userId);
            responseTwo = await responseTwo[0];
            setUserOfReport(responseTwo);
            let responseThree = await API.getUser(currentUser.uid);
            responseThree = await responseThree[0];
            setCurrentUserData(responseThree);
            setContentLoaded(true);
        }

        if(props.route.params.reportId != report.id){
            getReport();
        }
        
    } , [userFocused])

    async function updateReportState(state) {
        setContentLoaded(false);
        await API.editReportState(report.id, state);
        report.status = state;
        setContentLoaded(true);
    }

    return (
        contentLoaded ?
            <ScrollView>
                <View style={styles.detailsScreen}>
                {
                    report.isAnimalReport ?
                        <View style={styles.animalContainer}>
                            <Text style={styles.informationBetweenContainers}>Informação acerca do Report:</Text>
                            <View style={styles.animalInfo}>
                                <Text style={styles.headers}>Animal Reportado:</Text>
                                <Text style={styles.information}>{report.typeOfAnimal}</Text>
                                <Text style={styles.headers}>Imagem relativa ao report:</Text>
                                <Image style={styles.image} source={{uri: reportImage}} />
                                <Text style={styles.headers}>Informação adicional:</Text>
                                <Text style={styles.information}>{report.additionalInfo}</Text>
                                <Text style={styles.headers}>Estado do Report:</Text>
                                {report.status == "processing" ? <Text style={styles.information}>Em processo</Text> : report.status == "closed" ? <Text style={styles.information}>Resolvido</Text> : <Text style={styles.information}>Recusado</Text>}
                                <Text style={styles.headers}>Coordenadas do report: </Text>
                                <Text style={styles.information}>{report.latitude.toFixed(5)} , {report.longitude.toFixed(5)}</Text>
                                <Text style={styles.headers}>Localização do mapa: </Text>
                                <View style={styles.mapContainer}>
                                    <MapView
                                        provider={PROVIDER_GOOGLE}
                                        style={styles.map}
                                        scrollEnabled={false}
                                        zoomEnabled={false}
                                        region={{
                                            latitude: report.latitude,
                                            longitude: report.longitude,
                                            latitudeDelta: 0.001,
                                            longitudeDelta: 0.001,
                                        }}
                                    >
                                    {<MapView.Marker coordinate={{ latitude : report.latitude , longitude : report.longitude }} pinColor={report.isAnimalReport ? "rgb(162, 208, 255)" : "orange"} />}
                                    </MapView>
                                </View>
                            </View>
                            <Text style={styles.informationBetweenContainers}>Informação acerca do utilizador que submeteu este report:</Text>
                            {!report.anonymousMode ?
                                <View style={styles.userInfo}>
                                    <Text style={styles.headers}>Nome do Utilizador (Conta Google):</Text>
                                    <Text style={styles.information}>{userOfReport.displayName}</Text>
                                    <Text style={styles.headers}>Email do Utilizador:</Text>
                                    <Text style={styles.information}>{userOfReport.email}</Text>
                                    <Text style={styles.headers}>Fotografia do Utilizador:</Text>
                                    <Image style={styles.imageUser} source={{uri: userOfReport.photoURL}} />
                                </View> :
                                currentUserData.admin ?
                                <View style={styles.userInfo}>
                                    <Text style={styles.headers}>Nome do Utilizador (Conta Google):</Text>
                                    <Text style={styles.information}>{userOfReport.displayName}</Text>
                                    <Text style={styles.headers}>Email do Utilizador:</Text>
                                    <Text style={styles.information}>{userOfReport.email}</Text>
                                    <Text style={styles.headers}>Fotografia do Utilizador:</Text>
                                    <Image style={styles.imageUser} source={{uri: userOfReport.photoURL}} />
                                    <Text style={styles.headers}>Informação de visibilidade:</Text>
                                    <Text style={styles.information}>O utilizador submeteu este report em modo anónimo, apenas os administradores conseguem ver a sua origem</Text>
                                </View> :
                                currentUserData.uid === userOfReport.uid ?
                                <View style={styles.userInfo}>
                                    <Text style={styles.headers}>Este report foi feito por ti próprio no entanto as tuas informações encontram-se ocultas para os outros utilizadores</Text>
                                </View> : 
                                <View style={styles.userInfo}>
                                    <Text style={styles.headers}>O utilizador optou por não partilhar informações suas neste report</Text>
                                </View>
                            }
                            {currentUserData.admin ? <Text style={styles.informationBetweenContainers}>Gerir Report:</Text> : null}
                            {currentUserData.admin ?
                            <View style={styles.adminInfo}>
                                <Text style={styles.headers}>Ações disponíveis para este report enquanto administrador:</Text>
                                {report.status == "processing" ? <Button onPress={() => updateReportState("closed")} title="Resolver"/> : null}
                                {report.status == "processing" ? <View style={styles.separador} /> : null}
                                {report.status == "processing" ? <Button onPress={() => updateReportState("rejected")} title="Rejeitar"/> : null}
                                {report.status == "closed" ? <Button onPress={() => updateReportState("processing")} title="Colocar Pendente"/> : null}
                                {report.status == "rejected" ? <Button onPress={() => updateReportState("processing")} title="Colocar Pendente"/> : null}
                            </View> : null
                            }
                        </View>
                    :
                        <View style={styles.trashContainer}>
                            <Text style={styles.informationBetweenContainers}>Informação acerca do Report:</Text>
                            <View style={styles.trashInfo}>
                                <Text style={styles.headers}>Lixo Reportado:</Text>
                                <Text style={styles.information}>{report.typeOfTrash}</Text>
                                <Text style={styles.headers}>Imagem relativa ao report:</Text>
                                <Image style={styles.image} source={{uri: reportImage}} />
                                <Text style={styles.headers}>Tipo de acesso:</Text>
                                <Text style={styles.information}>{report.accessType}</Text>
                                <Text style={styles.headers}>Tipo de extração necessária:</Text>
                                <Text style={styles.information}>{report.extractionType}</Text>
                                <Text style={styles.headers}>Informação adicional:</Text>
                                <Text style={styles.information}>{report.additionalInfo}</Text>
                                <Text style={styles.headers}>Estado do Report:</Text>
                                {report.status == "processing" ? <Text style={styles.information}>Em processo</Text> : report.status == "closed" ? <Text style={styles.information}>Resolvido</Text> : <Text style={styles.information}>Recusado</Text>}
                                <Text style={styles.headers}>Coordenadas do report: </Text>
                                <Text style={styles.information}>{report.latitude.toFixed(5)} , {report.longitude.toFixed(5)}</Text>
                                <Text style={styles.headers}>Localização do mapa: </Text>
                                <View style={styles.mapContainer}>
                                    <MapView
                                        provider={PROVIDER_GOOGLE}
                                        style={styles.map}
                                        scrollEnabled={false}
                                        zoomEnabled={false}
                                        region={{
                                            latitude: report.latitude,
                                            longitude: report.longitude,
                                            latitudeDelta: 0.001,
                                            longitudeDelta: 0.001,
                                        }}
                                    >
                                    {<MapView.Marker coordinate={{ latitude : report.latitude , longitude : report.longitude }} pinColor={report.isAnimalReport ? "rgb(162, 208, 255)" : "orange"} />}
                                    </MapView>
                                </View>
                            </View>
                            <Text style={styles.informationBetweenContainers}>Informação acerca do utilizador que submeteu este report:</Text>
                            {!report.anonymousMode ?
                                <View style={styles.userInfo}>
                                    <Text style={styles.headers}>Nome do Utilizador (Conta Google):</Text>
                                    <Text style={styles.information}>{userOfReport.displayName}</Text>
                                    <Text style={styles.headers}>Email do Utilizador:</Text>
                                    <Text style={styles.information}>{userOfReport.email}</Text>
                                    <Text style={styles.headers}>Fotografia do Utilizador:</Text>
                                    <Image style={styles.imageUser} source={{uri: userOfReport.photoURL}} />
                                </View> :
                                currentUserData.admin ?
                                <View style={styles.userInfo}>
                                    <Text style={styles.headers}>Nome do Utilizador (Conta Google):</Text>
                                    <Text style={styles.information}>{userOfReport.displayName}</Text>
                                    <Text style={styles.headers}>Email do Utilizador:</Text>
                                    <Text style={styles.information}>{userOfReport.email}</Text>
                                    <Text style={styles.headers}>Fotografia do Utilizador:</Text>
                                    <Image style={styles.imageUser} source={{uri: userOfReport.photoURL}} />
                                    <Text style={styles.headers}>Informação de visibilidade:</Text>
                                    <Text style={styles.information}>O utilizador submeteu este report em modo anónimo, apenas os administradores conseguem ver a sua origem</Text>
                                </View> :
                                currentUserData.uid === userOfReport.uid ?
                                <View style={styles.userInfo}>
                                    <Text style={styles.headers}>Este report foi feito por ti próprio no entanto as tuas informações encontram-se ocultas para os outros utilizadores</Text>
                                </View> : 
                                <View style={styles.userInfo}>
                                    <Text style={styles.headers}>O utilizador optou por não partilhar informações suas neste report</Text>
                                </View>
                            }
                            {currentUserData.admin ? <Text style={styles.informationBetweenContainers}>Gerir Report:</Text> : null}
                            {currentUserData.admin ?
                            <View style={styles.adminInfo}>
                                <Text style={styles.headers}>Ações disponíveis para este report enquanto administrador:</Text>
                                {report.status == "processing" ? <Button onPress={() => updateReportState("closed")} title="Resolver"/> : null}
                                {report.status == "processing" ? <View style={styles.separador} /> : null}
                                {report.status == "processing" ? <Button onPress={() => updateReportState("rejected")} title="Rejeitar"/> : null}
                                {report.status == "closed" ? <Button onPress={() => updateReportState("processing")} title="Colocar Pendente"/> : null}
                                {report.status == "rejected" ? <Button onPress={() => updateReportState("processing")} title="Colocar Pendente"/> : null}
                            </View> : null
                            }
                        </View>
                }
                </View>
            </ScrollView>
        :
        <View style={{flex: 1, flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
            <Text style={styles.headers}>Conteúdo a carregar, por favor aguarde.</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    detailsScreen: {
        flex: 1,
        flexDirection: "column",
        alignItems: "center",
    },
    animalContainer: {
        flex: 2,
        flexDirection: "column",
        alignItems: "center"
    },
    trashContainer: {
        flex: 2,
        flexDirection: "column",
        alignItems: "center"
    },
    map:{
        ...StyleSheet.absoluteFillObject,
        position: 'absolute',
        zIndex: 1
    },
    mapContainer:{
        width: 300,
        height: 200,
        borderColor: "black",
        borderWidth: 1,
    },
    headers:{
        marginBottom: 10,
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
    },
    information:{
        fontSize: 18,
        marginBottom: 10,
        textAlign: "center"
    },
    image:{
        borderColor: "black",
        borderWidth: 2,
        borderRadius: 15,
        height: 250,
        width: 250,
        marginBottom: 20,
        marginTop: 10
    },
    animalInfo:{
        flex: 1,
        borderWidth: 2,
        borderColor: "black",
        borderRadius: 15,
        flexDirection: "column",
        alignItems: "center",
        marginTop: 20,
        marginLeft: 20,
        marginRight: 20,
        padding: 15,
    },
    trashInfo:{
        flex: 1,
        borderWidth: 2,
        borderColor: "black",
        borderRadius: 15,
        flexDirection: "column",
        alignItems: "center",
        marginTop: 20,
        marginLeft: 20,
        marginRight: 20,
        padding: 15,
    },
    userInfo:{
        flex: 1,
        borderWidth: 2,
        borderColor: "black",
        borderRadius: 15,
        flexDirection: "column",
        alignItems: "center",
        marginTop: 20,
        marginLeft: 20,
        marginRight: 20,
        padding: 15,
    },
    informationBetweenContainers:{
        marginTop: 20,
        marginLeft: 20,
        marginRight: 20,
        fontSize: 25,
        fontWeight: "bold",
        textAlign: "center",
    },
    imageUser:{
        borderColor: "black",
        borderWidth: 2,
        borderRadius: 15,
        height: 125,
        width: 125,
        marginTop: 10,
        marginBottom: 10
    },
    adminInfo:{
        flex: 1,
        borderWidth: 2,
        borderColor: "black",
        borderRadius: 15,
        flexDirection: "column",
        alignItems: "center",
        marginTop: 20,
        marginLeft: 20,
        marginRight: 20,
        padding: 15
    },
    imageLoading:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    separador:{
        marginVertical: 8,
        borderBottomColor: '#737373',
        borderBottomWidth: StyleSheet.hairlineWidth,
    }
});

export default EcraDetails;