import React, { useState, useEffect } from 'react';
import { Image, StyleSheet, TouchableHighlight, View } from 'react-native';
import { Container, Content, Form, Label, Textarea, Badge, Button, Text } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { FAB, Icon, Switch } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import ReportHistory from '../ecraReport/ecraReport';

const EcraReport = props => {
    console.log(props);
    const userChoice = props.route.params?.reportType; // 0 -> Animais 1 -> Lixo
    const navigation = props.navigation;

    const [image, setImage] = useState(null);
    const [typeAnimal, setTypeAnimal] = useState(null);
    const [typeOfTrash, setTypeOfTrash] = useState(null);
    const [extractionType, setExtractionType] = useState(null);
    const [accessType, setAccessType] = useState(null);
    const [adicionalInfo, setAdicionalInfo] = useState("");
    const [anonymous, setAnonymous] = useState(false);
    const [geoLocation, setGeoLocation] = useState({ latitude: 32.6592174, longitude: -16.9239346 });

    const [location, setLocation] = useState("");

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();

            await Location.hasServicesEnabledAsync()
                            .then( response => console.log("GPS ENABLED: " + response) )
                            .catch( error => console.log("GPS ENABLED ERROR: " + error) );

            if (status !== 'granted') {
                console.log('Permission to access location was denied');
                return;
            }

            findCoordinates();
        })();
    }, []);


    const findCoordinates = async () => {
        await Location.getCurrentPositionAsync({ timeInterval: 2000})
                        .then( response => {
                            setGeoLocation( { 
                                latitude: response.coords.latitude, 
                                longitude: response.coords.longitude 
                            });
                        } )
                        .catch( error => console.log(error) )
    };

    const reverseCoord = async () => {
        await Location.reverseGeocodeAsync(geoLocation)
                        .then( response => {
                            var data = response[0].street + ", " + response[0].postalCode + ", " + response[0].city + ", " + response[0].country;
                            setLocation(data);
                        } )
                        .catch( error => console.log(error))
    };

    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            alert("Sorry, we need camera roll permissions to make this work!");
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            allowsMultipleSelection: true,
            aspect: [4, 3],
            quality: 1,
        });

        console.log(result);

        if (!result.cancelled) {
            setImage(result.uri);
        }
    };

    const openCamera = async () => {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

        if (permissionResult.granted === false) {
            alert("You've refused to allow this app to access your camera!");
            return;
        }

        const result = await ImagePicker.launchCameraAsync();

        console.log(result);

        if (!result.cancelled) {
            setImage(result.uri);
        }
    }

    return (
        props.route.params ?
        <Container>
            <Content padder>
                <Form>
                    <Label>Fotografia</Label>
                    <Grid style={styles.gridImage}>
                        <Row style={image ? styles.withImage : styles.withoutImage}>
                            {image && <Image source={{ uri: image }} style={styles.image} />}
                            <Col>
                                <Row style={{paddingTop: 73}}>
                                    <Col style={{flex: (image ? null : 5)}}>
                                        <FAB icon={<Icon name="image" color="white"/>} placement="right" size="small" color="rgb(65, 137, 214)" style={{position: "absolute", paddingRight: (image ? 60 : 0)}} onPress={pickImage}></FAB>
                                    </Col>
                                    <Col>
                                        <FAB icon={<Icon name="camera" color="white"/>} placement="right" color="rgb(65, 137, 214)" style={{position: 'absolute'}} onPress={openCamera}></FAB>
                                    </Col>
                                </Row>     
                            </Col>
                        </Row>
                    </Grid>
                    
                    { userChoice === 0 
                    
                    ?
                    
                    (<View>
                        <Label style={{paddingTop: 15}}>Tipo de Animal</Label>
                        <Grid style={{padding: 5}}>
                            <Row style={{height:100}}>
                                <Col>
                                    <TouchableHighlight activeOpacity={0.6} underlayColor="#DDDDDD" onPress={() => {setTypeAnimal("dog")}}>
                                        <Image source={require('./img/dog.png')} style={{width: "100%", height:"100%"}}/>
                                    </TouchableHighlight>
                                    { typeAnimal === "dog" ? <Badge success style={{ position: 'absolute', right: 10 , bottom: 0}}><Icon name="check" color="white" style={{ fontSize: 15, lineHeight: 20 }}/></Badge> : null}    
                                </Col>
                                <Col>
                                    <TouchableHighlight activeOpacity={0.6} underlayColor="#DDDDDD" onPress={() => {setTypeAnimal("cat")}}>
                                        <Image source={require('./img/cat.png')} style={{width: "100%", height:"100%"}}/>
                                    </TouchableHighlight>
                                    { typeAnimal === "cat" ? <Badge success style={{ position: 'absolute', right: 10 , bottom: 0}}><Icon name="check" color="white" style={{ fontSize: 15, lineHeight: 20 }}/></Badge> : null} 
                                </Col>
                                <Col>
                                    <TouchableHighlight activeOpacity={0.6} underlayColor="#DDDDDD" onPress={() => {setTypeAnimal("bird")}}>
                                        <Image source={require('./img/sparrow.png')} style={{width: "100%", height:"100%"}}/>
                                    </TouchableHighlight>
                                    { typeAnimal === "bird" ? <Badge success style={{ position: 'absolute', right: 10 , bottom: 0}}><Icon name="check" color="white" style={{ fontSize: 15, lineHeight: 20 }}/></Badge> : null}
                                </Col>
                            </Row>
                            <Row style={{height:100}}>
                                <Col>
                                    <TouchableHighlight activeOpacity={0.6} underlayColor="#DDDDDD" onPress={() => {setTypeAnimal("turtle")}}>
                                        <Image source={require('./img/turtle.png')} style={{width: "100%", height:"100%"}}/>
                                    </TouchableHighlight>
                                    { typeAnimal === "turtle" ? <Badge success style={{ position: 'absolute', right: 10 , bottom: 0}}><Icon name="check" color="white" style={{ fontSize: 15, lineHeight: 20 }}/></Badge> : null}
                                </Col>
                                <Col>
                                    <TouchableHighlight activeOpacity={0.6} underlayColor="#DDDDDD" onPress={() => {setTypeAnimal("rabbit")}}>
                                        <Image source={require('./img/rabbit.png')} style={{width: "100%", height:"100%"}}/>
                                    </TouchableHighlight>
                                    { typeAnimal === "rabbit" ? <Badge success style={{ position: 'absolute', right: 10 , bottom: 0}}><Icon name="check" color="white" style={{ fontSize: 15, lineHeight: 20 }}/></Badge> : null}
                                </Col>
                                <Col>
                                    <TouchableHighlight activeOpacity={0.6} underlayColor="#DDDDDD" onPress={() => {setTypeAnimal("hamster")}}>
                                        <Image source={require('./img/hamster.png')} style={{width: "100%", height:"100%"}}/>
                                    </TouchableHighlight>
                                    { typeAnimal === "hamster" ? <Badge success style={{ position: 'absolute', right: 10 , bottom: 0}}><Icon name="check" color="white" style={{ fontSize: 15, lineHeight: 20 }}/></Badge> : null}
                                </Col>
                            </Row>
                        </Grid>
                    </View>)

                    : 
                    
                    (<View>
                        <Label style={{paddingTop: 15}}>Tipo de Lixo</Label>
                        <Grid style={{padding: 5}}>
                            <Row style={{height:125}}>
                                <Col>
                                    <TouchableHighlight activeOpacity={0.6} underlayColor="#DDDDDD" onPress={() => {setTypeOfTrash("metal")}}>
                                        <Image source={require('./img/can.png')} style={{width: "100%", height:"100%"}}/>
                                    </TouchableHighlight>
                                    { typeOfTrash === "metal" ? <Badge success style={{ position: 'absolute', right: 10 , bottom: 0}}><Icon name="check" color="white" style={{ fontSize: 15, lineHeight: 20 }}/></Badge> : null}    
                                </Col>
                                <Col>
                                    <TouchableHighlight activeOpacity={0.6} underlayColor="#DDDDDD" onPress={() => {setTypeOfTrash("paper")}}>
                                        <Image source={require('./img/tissue-roll.png')} style={{width: "100%", height:"100%"}}/>
                                    </TouchableHighlight>
                                    { typeOfTrash === "paper" ? <Badge success style={{ position: 'absolute', right: 10 , bottom: 0}}><Icon name="check" color="white" style={{ fontSize: 15, lineHeight: 20 }}/></Badge> : null} 
                                </Col>
                                <Col>
                                    <TouchableHighlight activeOpacity={0.6} underlayColor="#DDDDDD" onPress={() => {setTypeOfTrash("dead")}}>
                                        <Image source={require('./img/dead.png')} style={{width: "100%", height:"100%"}}/>
                                    </TouchableHighlight>
                                    { typeOfTrash === "dead" ? <Badge success style={{ position: 'absolute', right: 10 , bottom: 0}}><Icon name="check" color="white" style={{ fontSize: 15, lineHeight: 20 }}/></Badge> : null}
                                </Col>
                            </Row>
                            <Row style={{height:100}}>
                                <Col>
                                    <TouchableHighlight activeOpacity={0.6} underlayColor="#DDDDDD" onPress={() => {setTypeOfTrash("car")}}>
                                        <Image source={require('./img/car.png')} style={{width: "100%", height:"100%"}}/>
                                    </TouchableHighlight>
                                    { typeOfTrash === "car" ? <Badge success style={{ position: 'absolute', right: 10 , bottom: 0}}><Icon name="check" color="white" style={{ fontSize: 15, lineHeight: 20 }}/></Badge> : null}
                                </Col>
                                <Col>
                                    <TouchableHighlight activeOpacity={0.6} underlayColor="#DDDDDD" onPress={() => {setTypeOfTrash("dangerous")}}>
                                        <Image source={require('./img/biohazard-sign.png')} style={{width: "100%", height:"100%"}}/>
                                    </TouchableHighlight>
                                    { typeOfTrash === "dangerous" ? <Badge success style={{ position: 'absolute', right: 10 , bottom: 0}}><Icon name="check" color="white" style={{ fontSize: 15, lineHeight: 20 }}/></Badge> : null}
                                </Col>
                                <Col>
                                    <TouchableHighlight activeOpacity={0.6} underlayColor="#DDDDDD" onPress={() => {setTypeOfTrash("plastic")}}>
                                        <Image source={require('./img/water-bottle.png')} style={{width: "100%", height:"100%"}}/>
                                    </TouchableHighlight>
                                    { typeOfTrash === "plastic" ? <Badge success style={{ position: 'absolute', right: 10 , bottom: 0}}><Icon name="check" color="white" style={{ fontSize: 15, lineHeight: 20 }}/></Badge> : null}
                                </Col>
                            </Row>
                        </Grid>

                        <Label style={{paddingTop: 15}}>Recursos Necessários</Label>
                        <Grid style={{padding: 5}}>
                            <Row style={{height:125}}>
                                <Col>
                                    <TouchableHighlight activeOpacity={0.6} underlayColor="#DDDDDD" onPress={() => {setExtractionType("bag")}}>
                                        <Image source={require('./img/eco-bag.png')} style={{width: "100%", height:"100%"}}/>
                                    </TouchableHighlight>
                                    { extractionType === "bag" ? <Badge success style={{ position: 'absolute', right: 10 , bottom: 0}}><Icon name="check" color="white" style={{ fontSize: 15, lineHeight: 20 }}/></Badge> : null}    
                                </Col>
                                <Col>
                                    <TouchableHighlight activeOpacity={0.6} underlayColor="#DDDDDD" onPress={() => {setExtractionType("truck")}}>
                                        <Image source={require('./img/truck.png')} style={{width: "100%", height:"100%"}}/>
                                    </TouchableHighlight>
                                    { extractionType === "truck" ? <Badge success style={{ position: 'absolute', right: 10 , bottom: 0}}><Icon name="check" color="white" style={{ fontSize: 15, lineHeight: 20 }}/></Badge> : null} 
                                </Col>
                                <Col>
                                    <TouchableHighlight activeOpacity={0.6} underlayColor="#DDDDDD" onPress={() => {setExtractionType("cart")}}>
                                        <Image source={require('./img/carry.png')} style={{width: "100%", height:"100%"}}/>
                                    </TouchableHighlight>
                                    { extractionType === "cart" ? <Badge success style={{ position: 'absolute', right: 10 , bottom: 0}}><Icon name="check" color="white" style={{ fontSize: 15, lineHeight: 20 }}/></Badge> : null}
                                </Col>
                            </Row>
                        </Grid>

                        <Label style={{paddingTop: 15}}>Tipo de Acesso</Label>
                        <Grid style={{padding: 5}}>
                            <Row style={{height:125}}>
                                <Col>
                                    <TouchableHighlight activeOpacity={0.6} underlayColor="#DDDDDD" onPress={() => {setAccessType("easy")}}>
                                        <Image source={require('./img/city-building.png')} style={{width: "100%", height:"100%"}}/>
                                    </TouchableHighlight>
                                    { accessType === "easy" ? <Badge success style={{ position: 'absolute', right: 10 , bottom: 0}}><Icon name="check" color="white" style={{ fontSize: 15, lineHeight: 20 }}/></Badge> : null}    
                                </Col>
                                <Col>
                                    <TouchableHighlight activeOpacity={0.6} underlayColor="#DDDDDD" onPress={() => {setAccessType("medium")}}>
                                        <Image source={require('./img/acreage.png')} style={{width: "100%", height:"100%"}}/>
                                    </TouchableHighlight>
                                    { accessType === "medium" ? <Badge success style={{ position: 'absolute', right: 10 , bottom: 0}}><Icon name="check" color="white" style={{ fontSize: 15, lineHeight: 20 }}/></Badge> : null} 
                                </Col>
                                <Col>
                                    <TouchableHighlight activeOpacity={0.6} underlayColor="#DDDDDD" onPress={() => {setAccessType("hard")}}>
                                        <Image source={require('./img/mountains.png')} style={{width: "100%", height:"100%"}}/>
                                    </TouchableHighlight>
                                    { accessType === "hard" ? <Badge success style={{ position: 'absolute', right: 10 , bottom: 0}}><Icon name="check" color="white" style={{ fontSize: 15, lineHeight: 20 }}/></Badge> : null}
                                </Col>
                            </Row>
                        </Grid>
                    </View>)
                    
                    }

                    <Label style={{paddingTop: 15}}>Informação Adicional</Label>
                    <Textarea rowSpan={5} bordered enableAutoAutomaticScroll={false} scrollEnabled={false} keyboardShouldPersistTaps="always" placeholder="" defaultValue={adicionalInfo} onChangeText={adicionalInfo => setAdicionalInfo(adicionalInfo)}/>

                    <Label style={{paddingTop: 15}}>Localização</Label>
                    <View style={{height: 300}}>
                        <MapView
                            provider={PROVIDER_GOOGLE}
                            style={styles.map}
                            region={{
                                latitude: geoLocation.latitude,
                                longitude: geoLocation.longitude,
                                latitudeDelta: 0.015,
                                longitudeDelta: 0.0121,
                            }}
                            onPress={(e) => {setGeoLocation({
                                latitude: e.nativeEvent.coordinate.latitude, 
                                longitude: e.nativeEvent.coordinate.longitude
                            }); reverseCoord()}}
                        >
                            {
                                  geoLocation && reverseCoord() &&
                                  <Marker coordinate={{ latitude : geoLocation.latitude , longitude : geoLocation.longitude }} />
                            }
                        </MapView>
                    </View>

                    <Text style={styles.mapBadge}>Clique na posição desejada</Text>
                    
                    <Grid style={{paddingTop: 15, alignItems: 'center', justifyContent: 'center'}}>
                        <Row>
                            {geoLocation && <Text style={{textAlign: "center"}}>{location}</Text>}
                        </Row>
                        <Row style={{paddingTop: 10}}>
                            <Label style={{paddingRight: 5, paddingTop: 5}}>Enviar Anonimamente</Label>
                            <Switch value={anonymous} onValueChange={() => setAnonymous(!anonymous)} />
                        </Row>
                        <Row style={{paddingTop: 15}}>
                            <Button info onPress={() => navigation.navigate('SummaryScreen', {
                                image, typeAnimal, typeOfTrash, extractionType, accessType, adicionalInfo, anonymous, geoLocation, isAnimalReport: (userChoice === 0 ? true : false)
                            })}><Text>Continuar</Text></Button>
                        </Row>
                    </Grid>
                </Form>
            </Content>
        </Container>
        :
        <ReportHistory />

    )
}

const styles = StyleSheet.create({
    withImage: {
        height: 200
    },
    withoutImage: {
        height: 60
    },
    image: {
        width: "100%", 
        height: "100%"
    },
    withPadding: {
        paddingRight: 60,
        flex: 0
    },
    withoutPadding: {
        padding: 0
    },
    selected: {
        opacity: 100
    },
    unselected: {
        opacity: 0
    },
    map: {
        ...StyleSheet.absoluteFillObject,
        top: '2%'
    },
    mapBadge: {
        textAlign: 'center', 
        backgroundColor: "orange", 
        color:'white', 
        borderRadius:10, 
        overflow:'hidden', 
        width: "65%", 
        marginHorizontal: 65,
        marginTop: 15
    },
    gridImage: {
        flex: 1, 
        alignItems: 'center', 
        justifyContent: 'center', 
        paddingTop: 5
    }
});

export default EcraReport;