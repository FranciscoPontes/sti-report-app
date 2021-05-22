import React, { useState, useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Container, Content, Text, Card, CardItem, Body, Label, Button, Col } from 'native-base';
import { Switch } from 'react-native-elements';
import { Row, Grid } from 'react-native-easy-grid';
import * as Location from 'expo-location';

const EcraSummary = props => {
    const report = props.route.params;
    const navigation = props.navigation;

    const [location, setLocation] = useState("");
    const [typeAnimal, setTypeAnimal] = useState(null);
    const [typeOfTrash, setTypeOfTrash] = useState(null);
    const [extractionType, setExtractionType] = useState(null);
    const [accessType, setAccessType] = useState(null);

    useEffect(() => {
        setDetails();
        reverseCoord();
    }, []);

    const setDetails = () => {
        if(report.isAnimalReport){
            switch (report.typeAnimal) {
                case "dog":
                    setTypeAnimal("Cão");
                    break;
                case "cat":
                    setTypeAnimal("Gato");
                    break;
                case "bird":
                    setTypeAnimal("Pássaro");
                    break;
                case "turtle":
                    setTypeAnimal("Tartaruga");
                    break;
                case "rabbit":
                    setTypeAnimal("Coelho");
                    break;
                case "hamster":
                    setTypeAnimal("Hamster");
                    break;
                default:
                    break;
            }
        }else{
            switch (report.typeOfTrash) {
                case "metal":
                    setTypeOfTrash("Metal");
                    break;
                case "paper":
                    setTypeOfTrash("Papel");
                    break;
                case "dead":
                    setTypeOfTrash("Restos Animais");
                    break;
                case "car":
                    setTypeOfTrash("Automóvel");
                    break;
                case "dangerous":
                    setTypeOfTrash("Perigoso");
                    break;
                case "plastic":
                    setTypeOfTrash("Plástico");
                    break;
                default:
                    break;
            }

            switch (report.accessType) {
                case "easy":
                    setAccessType("Citadino (fácil)");
                    break;
                case "medium":
                    setAccessType("Rural (médio)");
                    break;
                case "hard":
                    setAccessType("Montanhoso (díficil)");
                    break;
                default:
                    break;
            }

            switch (report.extractionType) {
                case "bag":
                    setExtractionType("Saco de Lixo");
                    break;
                case "truck":
                    setExtractionType("Carro de Lixo");
                    break;
                case "cart":
                    setExtractionType("Carro de Mão");
                    break;
                default:
                    break;
            }
        }
    };

    const reverseCoord = async () => {
        await Location.reverseGeocodeAsync(report.geoLocation)
                        .then( response => {
                            var data = response[0].street + ", " + response[0].postalCode + ", " + response[0].city + ", " + response[0].country;
                            setLocation(data);
                        } )
                        .catch( error => console.log(error))
    };

    return (
        <Container>
            <Content padder>
                <Text style={{textAlign: 'center'}}>Resumo do report</Text>
                <Card>
                    <CardItem>
                        <Body>
                            <Grid style={styles.gridImage}>
                                <Row style={report.image ? styles.withImage : styles.withoutImage}>
                                    {report.image && <Image source={{ uri: report.image }} style={styles.image} />}
                                </Row>
                            </Grid>
                            {
                                report.isAnimalReport 
                                
                                ?

                                <View>
                                    <Label style={{paddingTop: 15, fontWeight: "bold"}}>Tipo de Animal</Label>
                                    <Text>{typeAnimal}</Text>
                                </View>

                                :

                                <View>
                                    <Label style={{paddingTop: 15, fontWeight: "bold"}}>Tipo de Lixo</Label>
                                    <Text>{typeOfTrash}</Text>

                                    <Label style={{paddingTop: 15, fontWeight: "bold"}}>Recursos Necessários</Label>
                                    <Text>{extractionType}</Text>

                                    <Label style={{paddingTop: 15, fontWeight: "bold"}}>Tipo de Acesso</Label>
                                    <Text>{accessType}</Text>
                                </View>
                            }

                            <Label style={{paddingTop: 15, fontWeight: "bold"}}>Informação Adicional</Label>
                            <Text>{report.adicionalInfo}</Text>

                            <Label style={{paddingTop: 15, fontWeight: "bold"}}>Localização</Label>
                            <Text>{location}</Text>
                        </Body>
                    </CardItem>
                </Card>
                <Grid style={{paddingTop: 15, alignItems: 'center', justifyContent: 'center'}}>
                    <Row style={{paddingTop: 10}}>
                        <Label style={{paddingRight: 5, paddingTop: 5}}>Enviar Anonimamente</Label>
                        <Switch value={report.anonymous} onValueChange={() => null} />
                    </Row>
                    <Row style={{paddingTop: 15}}>
                        <Col>
                            <Button light onPress={() => {navigation.navigate('ReportScreen')}} style={{alignSelf: 'flex-end', marginRight: 10}}><Text style={{color: "white"}}>Editar</Text></Button>
                        </Col>
                        <Col>
                            <Button info onPress={() => {navigation.navigate('ThanksScreen')}}><Text>Enviar</Text></Button>
                        </Col>
                    </Row>
                </Grid>
            </Content>
        </Container>
    )
}

const styles = StyleSheet.create({
    withImage: {
        height: 200
    },
    withoutImage: {
        height: 0
    },
    image: {
        width: "100%", 
        height: "100%"
    },
    gridImage: {
        flex: 1, 
        alignItems: 'center', 
        justifyContent: 'center', 
        paddingTop: 5
    }
});

export default EcraSummary;