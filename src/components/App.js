import React, { Fragment, useState, useEffect } from 'react';
import { Text, View, StyleSheet, Image } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Header, Item } from 'react-native-elements';
import EcraInicial from '../components/ecraInicial/ecraInicial';
import EcraMapa from '../components/ecraMapa/ecraMapa';
import Report from '../components/ecraReport/report';
import EcraPerfil from '../components/ecraPerfil/ecraPerfil';
import { Button } from 'react-native';

import * as FirebaseAPI from '../../services/firebaseAPI';

import * as Google from 'expo-auth-session/providers/google';
import color from 'color';
import { TouchableOpacity } from 'react-native-gesture-handler';

const styles = StyleSheet.create({
  header: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999
  },
  buttonsContainer: {
    ...StyleSheet.absoluteFillObject,
    position: 'absolute',
    top: '50%'
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

  useEffect(() => FirebaseAPI.startFirebase(), [])

  return (
    !user ?
      <View style={styles.buttonsContainer}>
        <Button
          disabled={!request}
          title="Google Sign-In"
          onPress={() => {
            promptAsync();
          }}
        />
        <Button
          disabled={!request}
          title="Login (test user)"
          onPress={ async () => {
            FirebaseAPI.changeUserData(testData);
            await FirebaseAPI.addUser(testData);
            setUser(FirebaseAPI.userData);
            }}
        />
      </View>
      :
      <NavigationContainer>
        <Header style={styles.header}
          centerComponent={{ text: 'Nature Reporter', style: { color: '#fff', fontWeight: 'bold', fontSize: 15 } }}
        />

        <Tab.Navigator>
          <Tab.Screen name="Home" component={EcraInicial} initialParams={{ user: user }}
            options={{
              tabBarIcon: ({ tintColor }) => (
                <Image
                  source={require('../../assets/navHome.png')}
                  style={{ width: 26, height: 26, tintColor: tintColor }}
                />
              )
            }} />
          <Tab.Screen name="Map" component={EcraMapa}
            options={{
              tabBarIcon: ({ tintColor }) => (
                <Image
                  source={require('../../assets/navLocation.png')}
                  style={{ width: 26, height: 26, tintColor: tintColor }}
                />
              )
            }} />
          <Tab.Screen name="Report" component={Report}
            options={{
              tabBarIcon: ({ tintColor }) => (
                <Image
                  source={require('../../assets/navReports.png')}
                  style={{ width: 26, height: 26, tintColor: tintColor }}
                />
              )
            }} />
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
