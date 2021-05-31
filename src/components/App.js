import React, { Fragment, useState, useEffect } from 'react';
import { View, StyleSheet, Image } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Header, Item } from 'react-native-elements';
import EcraInicial from '../components/ecraInicial/ecraInicial';
import EcraMapa from '../components/ecraMapa/ecraMapa';
import EcraPerfil from '../components/ecraPerfil/ecraPerfil';
import { Button, Text } from 'native-base';
import TabHistorico from './ecraHistorico/tabHistorico';
import Home from './ecraInicial/home';

import * as FirebaseAPI from '../../services/firebaseAPI';

import * as Google from 'expo-auth-session/providers/google';

import { LogBox } from 'react-native';

LogBox.ignoreLogs(['Setting a timer']);

const styles = StyleSheet.create({
  header: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999
  },
  buttonsContainer: {
    ...StyleSheet.absoluteFillObject,
    position: 'absolute',
    top: '45%',
  }
});

const Tab = createBottomTabNavigator();

const App = () => {

  const [user, setUser] = useState(null);

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest(
    {
      clientId: '628699918493-33ee12rl5c289ifq5b3v5t5v6hskmag4.apps.googleusercontent.com',
    },
  );

  const testData = {
    "displayName": "Test user",
    "email": null,
    "phoneNumber": null,
    "photoURL": null,
    "providerId": "google.com",
    "uid": "test-user",
  }
    
  useEffect(() => {
    const tryLogin = async () => response?.type === 'success' ? setUser(await FirebaseAPI.login(response)) : null;
    tryLogin();
    
  }, [response]);

  useEffect(() => {
    FirebaseAPI.startFirebase()
  }, [])

  return (
    !user ?
      <Fragment>
        <Header style={styles.header}
        centerComponent={{ text: 'Nature Reporter', style: { color: '#fff', fontWeight: 'bold', fontSize: 15 } }}
      />
        <View style={styles.buttonsContainer}>  	
          <View style={{ alignSelf: 'center', paddingBottom: '5%' }}>
            <Button
              style={{ width: '45%' }}
              disabled={!request}
              large
              // rounded
              primary
              onPress={() => {
                promptAsync();
              }}
            >
              <Text style={{ color: 'white', fontSize: 16 }}>Google Login</Text>
            </Button>
          </View>

          <View style={{ alignSelf: 'center', paddingBottom: '5%' }}>
            <Button
                style={{ width: '45%' }}
                disabled={!request}
                large
                // rounded
                warning
                onPress={ async () => {
                  FirebaseAPI.changeUserData(testData);
                  await FirebaseAPI.addUser(testData);
                  setUser(FirebaseAPI.userData);
                  }}
            >
              <Text style={{ color: 'white', fontSize: 16 }}>Test account</Text>
            </Button>
          </View>
        </View>
      </Fragment>
      :
      <NavigationContainer>
        <Header style={styles.header}
          centerComponent={{ text: 'Nature Reporter', style: { color: '#fff', fontWeight: 'bold', fontSize: 15 } }}
        />
        <Tab.Navigator>
          <Tab.Screen name="Home" component={Home} initialParams={ { user } } 
            options={{ unmountOnBlur: true, 
                       title: 'Início',
                       tabBarIcon: ({ tintColor }) => (
                        <Image
                          source={require('../../assets/navHome.png')}
                          style={{ width: 26, height: 26, tintColor: tintColor }}
                        />
                      ) 
                      }}
            listeners={({ navigation, route }) => ({
              tabPress: e => {
                  // Prevent default action
                  e.preventDefault();

                  // Do something with the `navigation` object
                  navigation.navigate('Home', {
                    screen: 'HomeScreen'
                  });
              },
            })}/>
          <Tab.Screen name="Mapa" component={EcraMapa}
            options={{
              tabBarIcon: ({ tintColor }) => (
                <Image
                  source={require('../../assets/navLocation.png')}
                  style={{ width: 26, height: 26, tintColor: tintColor }}
                />
              )
            }}/>
          <Tab.Screen name="Histórico" component={TabHistorico}
            options={{
              tabBarIcon: ({ tintColor }) => (
                <Image
                  source={require('../../assets/navReports.png')}
                  style={{ width: 26, height: 26, tintColor: tintColor }}
                />
              )
            }}
            listeners={({ navigation, route }) => ({
              tabPress: e => {
                  // Prevent default action
                  e.preventDefault();

                  // Do something with the `navigation` object
                  navigation.navigate('Histórico', {
                    screen: 'Historico'
                  });
              },
            })}/>
          <Tab.Screen name="Perfil" component={EcraPerfil}
            options={{
              tabBarIcon: ({ tintColor }) => (
                <Image
                  source={require('../../assets/navProfile.png')}
                  style={{ width: 26, height: 26, tintColor: tintColor}}
                />
              )
            }} />
        </Tab.Navigator>
      </NavigationContainer>
  );
}

export default App;
