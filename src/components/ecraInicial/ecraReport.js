import React, { useState, useEffect } from 'react';
import { Image, StyleSheet, TouchableHighlight, View } from 'react-native';
import { Container, Content, Form, Label, Textarea, Badge, Button, Text } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { FAB, Icon, Switch } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useIsFocused } from '@react-navigation/native'

const EcraReport = props => {
    const userChoice = props.route.params.reportType; // 0 -> Animais 1 -> Lixo
    const navigation = props.navigation;

    const mapView = React.createRef();
    const isFocused = useIsFocused();

    const [image, setImage] = useState(null);
    const [typeAnimal, setTypeAnimal] = useState(null);
    const [typeOfTrash, setTypeOfTrash] = useState(null);
    const [extractionType, setExtractionType] = useState(null);
    const [accessType, setAccessType] = useState(null);
    const [adicionalInfo, setAdicionalInfo] = useState("");
    const [anonymous, setAnonymous] = useState(false);
    const [geoLocation, setGeoLocation] = useState( { latitude: 0, longitude: 0, latitudeDelta: 0.001, longitudeDelta: 0.007 });
    const [currentZoom, setCurrentZoom] = useState({ latitudeDelta: 0.001, longitudeDelta: 0.007 })
    const [location, setLocation] = useState("");

    useEffect(() => {    
        async function findCoordinates() {
          let { status } = await Location.requestForegroundPermissionsAsync();
          await Location.hasServicesEnabledAsync()
                        .then( response => console.log("GPS ENABLED: " + response) )
                        .catch( error => console.log("GPS ENABLED ERROR: " + error) );
    
                        if (status !== 'granted') {
                          console.log('Permission to access location was denied');
                          return;
                        }
    
          await Location.getCurrentPositionAsync({accuracy:Location.Accuracy.High})
                      .then( response => { setGeoLocation( { latitude: response.coords.latitude, longitude: response.coords.longitude }); getAddressFromCoordinates(response.coords.latitude, response.coords.longitude); })
                      .catch( error => console.log(error) )
    
        };
    
        findCoordinates();
    } , [isFocused])

    const goToUserLocation = () => {
        mapView.current.animateToRegion({
            longitude: geoLocation.longitude,
            latitude: geoLocation.latitude,
            latitudeDelta: currentZoom.latitudeDelta,
            longitudeDelta: currentZoom.longitudeDelta
        }, 100);
    }

    useEffect(() => {
        goToUserLocation();
      }, [geoLocation])

    /*const reverseCoord = async (newLocation) => {
        console.log(newLocation)
        await Location.reverseGeocodeAsync(newLocation)
                        .then( response => {
                            var data = response[0].street + ", " + response[0].postalCode + ", " + response[0].city + ", " + response[0].country;
                            setLocation(data);
                        } )
                        .catch( error => console.log(error))
    };*/

    function getAddressFromCoordinates(latitude, longitude) {
        return new Promise((resolve) => {
            const API_KEY = "CPnrb5c5grlxwZM2DQoXO1WYK-_8XSgnCCfmDYjHBGU";
            const url = "https://revgeocode.search.hereapi.com/v1/revgeocode?at=" + latitude + "," + longitude + "&lang=pt-PT&apikey=" + API_KEY;
            fetch(url)
            .then(res => res.json())
            .then((resJson) => {
                var address = resJson.items[0].address;
                var data = address.street + ", " + address.postalCode + ", " + address.city + ", " + address.county;
                setLocation(data);
            })
            .catch((e) => {
                console.log('Error in getAddressFromCoordinates', e)
                resolve()
            })
        })
    }

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
            quality: 0.2,
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

        const result = await ImagePicker.launchCameraAsync({
            quality: 0.2
        });

        console.log(result);

        if (!result.cancelled) {
            setImage(result.uri);
        }
    }

    return (
        <Container>
            <Content style={{padding: 25}}>
                <Form>
                    <Label style={styles.headers}>Fotografia <Text style={{color: 'red'}}>*</Text></Label>
                    <Grid style={styles.gridImage}>
                        <Row style={image ? styles.withImage : styles.withoutImage}>
                            {image && <Image source={{ uri: image }} style={styles.image} />}
                            <Col>
                                <Row style={{paddingTop: 73}}>
                                    <Col style={{flex: (image ? null : 5)}}>
                                        <FAB icon={<Icon name="camera" color="white"/>} placement="right" color="rgb(65, 137, 214)" style={{position: "absolute", paddingRight: (image ? 60 : 0), bottom: -45}} onPress={openCamera}></FAB>
                                    </Col>
                                    <Col>
                                        <FAB icon={<Icon name="image" color="white"/>} placement="right" color="rgb(65, 137, 214)" style={{position: 'absolute', right: (image ? -5 : 0), bottom: -45}} onPress={pickImage}></FAB>
                                    </Col>
                                </Row>     
                            </Col>
                        </Row>
                    </Grid>

                    <View style={styles.separador} />

                    { userChoice === 0 
                    
                    ?
                    
                    (<View>
                        <Label style={styles.headers}>Tipo de Animal <Text style={{color: 'red'}}>*</Text></Label>
                        <Grid style={{padding: 5}}>
                            <Row style={styles.rows}>
                                <Col>
                                    <TouchableHighlight activeOpacity={0.6} underlayColor="#DDDDDD" onPress={() => {setTypeAnimal("dog")}}>
                                        <Image source={require('./img/dog.png')} style={{width: "100%", height:"100%"}} resizeMode='contain'/>
                                    </TouchableHighlight>
                                    { typeAnimal === "dog" ? <Badge success style={{ position: 'absolute', right: 10 , bottom: 0}}><Icon name="check" color="white" style={{ fontSize: 15, lineHeight: 20 }}/></Badge> : null}    
                                    <Text style={styles.selectItem}>Cão</Text>
                                </Col>
                                <Col>
                                    <TouchableHighlight activeOpacity={0.6} underlayColor="#DDDDDD" onPress={() => {setTypeAnimal("cat")}}>
                                        <Image source={require('./img/cat.png')} style={{width: "100%", height:"100%"}} resizeMode='contain'/>
                                    </TouchableHighlight>
                                    { typeAnimal === "cat" ? <Badge success style={{ position: 'absolute', right: 10 , bottom: 0}}><Icon name="check" color="white" style={{ fontSize: 15, lineHeight: 20 }}/></Badge> : null} 
                                    <Text style={{ textAlign: 'center', marginTop: 10   }}>Gato</Text>
                                </Col>
                                <Col>
                                    <TouchableHighlight activeOpacity={0.6} underlayColor="#DDDDDD" onPress={() => {setTypeAnimal("bird")}}>
                                        <Image source={require('./img/sparrow.png')} style={{width: "100%", height:"100%"}} resizeMode='contain'/>
                                    </TouchableHighlight>
                                    { typeAnimal === "bird" ? <Badge success style={{ position: 'absolute', right: 10 , bottom: 0}}><Icon name="check" color="white" style={{ fontSize: 15, lineHeight: 20 }}/></Badge> : null}
                                    <Text style={{ textAlign: 'center', marginTop: 10   }}>Pássaro</Text>
                                </Col>
                            </Row>
                            <Row style={styles.rows}>
                                <Col>
                                    <TouchableHighlight activeOpacity={0.6} underlayColor="#DDDDDD" onPress={() => {setTypeAnimal("turtle")}}>
                                        <Image source={require('./img/turtle.png')} style={{width: "100%", height:"100%"}} resizeMode='contain'/>
                                    </TouchableHighlight>
                                    { typeAnimal === "turtle" ? <Badge success style={{ position: 'absolute', right: 10 , bottom: 0}}><Icon name="check" color="white" style={{ fontSize: 15, lineHeight: 20 }}/></Badge> : null}
                                    <Text style={{ textAlign: 'center', marginTop: 10   }}>Tartaruga</Text>
                                </Col>
                                <Col>
                                    <TouchableHighlight activeOpacity={0.6} underlayColor="#DDDDDD" onPress={() => {setTypeAnimal("rabbit")}}>
                                        <Image source={require('./img/rabbit.png')} style={{width: "100%", height:"100%"}} resizeMode='contain'/>
                                    </TouchableHighlight>
                                    { typeAnimal === "rabbit" ? <Badge success style={{ position: 'absolute', right: 10 , bottom: 0}}><Icon name="check" color="white" style={{ fontSize: 15, lineHeight: 20 }}/></Badge> : null}
                                    <Text style={{ textAlign: 'center', marginTop: 10 }}>Coelho</Text>
                                </Col>
                                <Col>
                                    <TouchableHighlight activeOpacity={0.6} underlayColor="#DDDDDD" onPress={() => {setTypeAnimal("hamster")}}>
                                        <Image source={require('./img/hamster.png')} style={{width: "100%", height:"100%"}} resizeMode='contain'/>
                                    </TouchableHighlight>
                                    { typeAnimal === "hamster" ? <Badge success style={{ position: 'absolute', right: 10 , bottom: 0}}><Icon name="check" color="white" style={{ fontSize: 15, lineHeight: 20 }}/></Badge> : null}
                                    <Text style={{ textAlign: 'center', marginTop: 10  }}>Hamster</Text>
                                </Col>
                            </Row>
                            <Row style={styles.rows125}>
                                <Col>
                                    <TouchableHighlight style={{width: "33%", height:"100%"}} activeOpacity={0.6} underlayColor="#DDDDDD" onPress={() => {setTypeAnimal("other")}}>
                                        <Image source={require('./img/paws.png')} style={{width: "100%", height:"100%", marginTop: 5}} resizeMode='contain'/>
                                    </TouchableHighlight>
                                    { typeAnimal === "other" ? <Badge success style={{ position: 'absolute', left: 80, bottom: 0}}><Icon name="check" color="white" style={{ fontSize: 15, lineHeight: 20 }}/></Badge> : null}
                                    <Text style={{ width: '33%', textAlign: 'center', marginTop: 20}}>Outro</Text>
                                </Col>
                            </Row>
                        </Grid>
                    </View>)

                    : 
                    
                    (<View>
                        <Label style={styles.headers}>Tipo de Lixo <Text style={{color: 'red'}}>*</Text></Label>
                        <Grid style={{padding: 5}}>
                            <Row style={styles.rows}>
                                <Col>
                                    <TouchableHighlight activeOpacity={0.6} underlayColor="#DDDDDD" onPress={() => {setTypeOfTrash("metal")}}>
                                        <Image source={require('./img/can.png')} style={{width: "100%", height:"100%"}} resizeMode='contain'/>
                                    </TouchableHighlight>
                                    { typeOfTrash === "metal" ? <Badge success style={{ position: 'absolute', right: 10 , bottom: 0}}><Icon name="check" color="white" style={{ fontSize: 15, lineHeight: 20 }}/></Badge> : null}    
                                    <Text style={{ textAlign: 'center', marginTop: 10}}>Metal</Text>
                                </Col>
                                <Col>
                                    <TouchableHighlight activeOpacity={0.6} underlayColor="#DDDDDD" onPress={() => {setTypeOfTrash("paper")}}>
                                        <Image source={require('./img/tissue-roll.png')} style={{width: "100%", height:"100%"}} resizeMode='contain'/>
                                    </TouchableHighlight>
                                    { typeOfTrash === "paper" ? <Badge success style={{ position: 'absolute', right: 10 , bottom: 0}}><Icon name="check" color="white" style={{ fontSize: 15, lineHeight: 20 }}/></Badge> : null} 
                                    <Text style={{ textAlign: 'center', marginTop: 10   }}>Papel</Text>
                                </Col>
                                <Col>
                                    <TouchableHighlight activeOpacity={0.6} underlayColor="#DDDDDD" onPress={() => {setTypeOfTrash("dead")}}>
                                        <Image source={require('./img/dead.png')} style={{width: "100%", height:"100%"}} resizeMode='contain'/>
                                    </TouchableHighlight>
                                    { typeOfTrash === "dead" ? <Badge success style={{ position: 'absolute', right: 10 , bottom: 0}}><Icon name="check" color="white" style={{ fontSize: 15, lineHeight: 20 }}/></Badge> : null}
                                    <Text style={{ textAlign: 'center', marginTop: 10   }}>Animais mortos</Text>
                                </Col>
                            </Row>
                            <Row style={styles.rows}>
                                <Col>
                                    <TouchableHighlight activeOpacity={0.6} underlayColor="#DDDDDD" onPress={() => {setTypeOfTrash("car")}}>
                                        <Image source={require('./img/car.png')} style={{width: "100%", height:"100%"}} resizeMode='contain'/>
                                    </TouchableHighlight>
                                    { typeOfTrash === "car" ? <Badge success style={{ position: 'absolute', right: 10 , bottom: 0}}><Icon name="check" color="white" style={{ fontSize: 15, lineHeight: 20 }}/></Badge> : null}
                                    <Text style={{ textAlign: 'center', marginTop: 10}}>Peças automóveis</Text>
                                </Col>
                                <Col>
                                    <TouchableHighlight activeOpacity={0.6} underlayColor="#DDDDDD" onPress={() => {setTypeOfTrash("dangerous")}}>
                                        <Image source={require('./img/biohazard-sign.png')} style={{width: "100%", height:"100%"}} resizeMode='contain'/>
                                    </TouchableHighlight>
                                    { typeOfTrash === "dangerous" ? <Badge success style={{ position: 'absolute', right: 10 , bottom: 0}}><Icon name="check" color="white" style={{ fontSize: 15, lineHeight: 20 }}/></Badge> : null}
                                    <Text style={{ textAlign: 'center', marginTop: 10   }}>Lixo tóxico</Text>
                                </Col>
                                <Col>
                                    <TouchableHighlight activeOpacity={0.6} underlayColor="#DDDDDD" onPress={() => {setTypeOfTrash("plastic")}}>
                                        <Image source={require('./img/water-bottle.png')} style={{width: "100%", height:"100%"}} resizeMode='contain'/>
                                    </TouchableHighlight>
                                    { typeOfTrash === "plastic" ? <Badge success style={{ position: 'absolute', right: 10 , bottom: 0}}><Icon name="check" color="white" style={{ fontSize: 15, lineHeight: 20 }}/></Badge> : null}
                                    <Text style={{ textAlign: 'center', marginTop: 10}}>Plástico</Text>
                                </Col>
                            </Row>
                            <Row style={styles.rows}>
                                <Col>
                                    <TouchableHighlight style={{width: "33%", height:"100%", top: 15}} activeOpacity={0.6} underlayColor="#DDDDDD" onPress={() => {setTypeOfTrash("other")}}>
                                        <Image source={require('./img/waste.png')} style={{width: "100%", height:"100%", marginTop: 5}} resizeMode='contain'/>
                                    </TouchableHighlight>
                                    { typeOfTrash === "other" ? <Badge success style={{ position: 'absolute', left: 80, bottom: -15}}><Icon name="check" color="white" style={{ fontSize: 15, lineHeight: 20 }}/></Badge> : null}
                                    <Text style={{ width: '33%', textAlign: 'center', marginTop: 30}}>Outro</Text>
                                </Col>
                            </Row>
                        </Grid>

                        <View style={styles.separador} />

                        <Label style={styles.headers}>Recursos Necessários <Text style={{color: 'red'}}>*</Text></Label>
                        <Grid style={{padding: 5}}>
                            <Row style={styles.rows125}>
                                <Col>
                                    <TouchableHighlight activeOpacity={0.6} underlayColor="#DDDDDD" onPress={() => {setExtractionType("bag")}}>
                                        <Image source={require('./img/eco-bag.png')} style={{width: "100%", height:"100%"}} resizeMode='contain'/>
                                    </TouchableHighlight>
                                    { extractionType === "bag" ? <Badge success style={{ position: 'absolute', right: 10 , bottom: 0}}><Icon name="check" color="white" style={{ fontSize: 15, lineHeight: 20 }}/></Badge> : null}
                                    <Text style={{ textAlign: 'center', marginTop: 10   }}>Saco de Lixo</Text>
                                </Col>
                                <Col>
                                    <TouchableHighlight activeOpacity={0.6} underlayColor="#DDDDDD" onPress={() => {setExtractionType("truck")}}>
                                        <Image source={require('./img/truck.png')} style={{width: "100%", height:"100%"}} resizeMode='contain'/>
                                    </TouchableHighlight>
                                    { extractionType === "truck" ? <Badge success style={{ position: 'absolute', right: 10 , bottom: 0}}><Icon name="check" color="white" style={{ fontSize: 15, lineHeight: 20 }}/></Badge> : null}
                                    <Text style={{ textAlign: 'center', marginTop: 10   }}>Carro do Lixo</Text>
                                </Col>
                                <Col>
                                    <TouchableHighlight activeOpacity={0.6} underlayColor="#DDDDDD" onPress={() => {setExtractionType("cart")}}>
                                        <Image source={require('./img/carry.png')} style={{width: "100%", height:"100%"}} resizeMode='contain'/>
                                    </TouchableHighlight>
                                    { extractionType === "cart" ? <Badge success style={{ position: 'absolute', right: 10 , bottom: 0}}><Icon name="check" color="white" style={{ fontSize: 15, lineHeight: 20 }}/></Badge> : null}
                                    <Text style={{ textAlign: 'center', marginTop: 10   }}>Carrinho de Mão</Text>
                                </Col>
                            </Row>
                        </Grid>

                        <View style={styles.separador} />

                        <Label style={styles.headers}>Tipo de Acesso <Text style={{color: 'red'}}>*</Text></Label>
                        <Grid style={{padding: 5}}>
                            <Row style={styles.rows125}>
                                <Col>
                                    <TouchableHighlight activeOpacity={0.6} underlayColor="#DDDDDD" onPress={() => {setAccessType("easy")}}>
                                        <Image source={require('./img/city-building.png')} style={{width: "100%", height:"100%"}} resizeMode='contain'/>
                                    </TouchableHighlight>
                                    { accessType === "easy" ? <Badge success style={{ position: 'absolute', right: 10 , bottom: 0}}><Icon name="check" color="white" style={{ fontSize: 15, lineHeight: 20 }}/></Badge> : null}
                                    <Text style={{ textAlign: 'center', marginTop: 10   }}>Citadino (fácil)</Text>
                                </Col>
                                <Col>
                                    <TouchableHighlight activeOpacity={0.6} underlayColor="#DDDDDD" onPress={() => {setAccessType("medium")}}>
                                        <Image source={require('./img/acreage.png')} style={{width: "100%", height:"100%"}}/>
                                    </TouchableHighlight>
                                    { accessType === "medium" ? <Badge success style={{ position: 'absolute', right: 10 , bottom: 0}}><Icon name="check" color="white" style={{ fontSize: 15, lineHeight: 20 }}/></Badge> : null}
                                    <Text style={{ textAlign: 'center', marginTop: 10   }}>Rural (médio)</Text>
                                </Col>
                                <Col>
                                    <TouchableHighlight activeOpacity={0.6} underlayColor="#DDDDDD" onPress={() => {setAccessType("hard")}}>
                                        <Image source={require('./img/mountains.png')} style={{width: "100%", height:"100%"}} resizeMode='contain'/>
                                    </TouchableHighlight>
                                    { accessType === "hard" ? <Badge success style={{ position: 'absolute', right: 10 , bottom: 0}}><Icon name="check" color="white" style={{ fontSize: 15, lineHeight: 20 }}/></Badge> : null}
                                    <Text style={{ textAlign: 'center', marginTop: 10   }}>Montanhoso (difícil)</Text>
                                </Col>
                            </Row>
                        </Grid>
                    </View>)
                    
                    }

                    <View style={styles.separador} />

                    <Label style={styles.headers}>Informação Adicional</Label>
                    <Textarea style={{marginBottom: 25}} rowSpan={5} bordered enableAutoAutomaticScroll={false} scrollEnabled={false} keyboardShouldPersistTaps="always" placeholder="" defaultValue={adicionalInfo} onChangeText={adicionalInfo => setAdicionalInfo(adicionalInfo)}/>

                    <View style={styles.separador} />

                    <Label style={styles.headers}>Localização <Text style={{color: 'red'}}>*</Text></Label>
                    <View style={{height: 300, borderWidth: 2, borderColor: "black"}}>
                        <MapView
                            provider={PROVIDER_GOOGLE}
                            style={styles.map}
                            ref={mapView}
                            initialRegion={{
                                latitude: geoLocation.latitude,
                                longitude: geoLocation.longitude,
                                latitudeDelta: 0.015, 
                                longitudeDelta: 0.0121
                            }}
                            onRegionChangeComplete={(e) => {
                                setCurrentZoom({
                                    latitudeDelta: e.latitudeDelta,
                                    longitudeDelta: e.longitudeDelta
                                })
                            }}
                            onPress={(e) => {
                                setGeoLocation({
                                    latitude: e.nativeEvent.coordinate.latitude, 
                                    longitude: e.nativeEvent.coordinate.longitude,
                                });
                                //reverseCoord(e.nativeEvent.coordinate)
                                getAddressFromCoordinates(e.nativeEvent.coordinate.latitude, e.nativeEvent.coordinate.longitude);
                            }}
                        >
                            {
                                geoLocation &&
                                <Marker coordinate={geoLocation} />
                            }
                        </MapView>
                    </View>

                    <Text style={styles.mapBadge}>Clique na posição desejada</Text>
                    
                    <Grid style={{paddingTop: 15, alignItems: 'center', justifyContent: 'center'}}>
                        <Row>
                            {location !== "" && <Text style={{textAlign: "center"}}>{location}</Text>}
                        </Row>
                        <Row style={{paddingTop: 10}}>
                            <Label style={{paddingRight: 5, paddingTop: 5}}>Enviar Anonimamente</Label>
                            <Switch value={anonymous} onValueChange={() => setAnonymous(!anonymous)} />
                        </Row>
                        {
                            (!image || (userChoice === 0 && !typeAnimal) || (userChoice === 1 && (!typeOfTrash || !extractionType || !accessType))) &&
                            <Row style={{marginTop: 10}}>
                                <Text style={{color: 'red', textAlign: 'center'}}>Por favor preencha todos os campos obrigatórios</Text>
                            </Row>
                        }
                        <Row style={{paddingTop: 15, paddingBottom: 45}}>
                            <Button
                                info
                                disabled={!image || (userChoice === 0 && !typeAnimal) || (userChoice === 1 && (!typeOfTrash || !extractionType || !accessType))}
                                onPress={() => navigation.navigate('SummaryScreen', {
                                    image, typeAnimal, typeOfTrash, extractionType, accessType, adicionalInfo, anonymous, geoLocation, isAnimalReport: (userChoice === 0 ? true : false)
                                })}
                            ><Text>Continuar</Text></Button>
                        </Row>
                    </Grid>
                </Form>
            </Content>
            
        </Container>
    )
}

const styles = StyleSheet.create({
    withImage: {
        height: 200,
        marginBottom: 30,
        borderWidth: 2,
        borderColor: "black"
    },
    withoutImage: {
        height: 60,
        marginBottom: 50
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
    },
    separador:{
        marginTop: 10,
        borderBottomColor: '#737373',
        borderBottomWidth: 2,
    },
    headers:{
        marginBottom: 20,
        marginTop: 20,
        fontSize: 25, 
        textAlign: "center", 
        fontWeight: "bold"
    },
    rows:{
        marginBottom: 55,
        height: 100
    },
    rows125:{
        marginBottom: 55,
        height: 125
    },
    selectItem:{
        textAlign: 'center',
        marginTop: 10
    }
});

export default EcraReport;