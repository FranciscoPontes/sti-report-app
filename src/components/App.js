import React, { Fragment, useState, useEffect } from 'react';
import { Text, View, StyleSheet } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {Header, Item} from 'react-native-elements';
import EcraInicial from '../components/ecraInicial/ecraInicial';
import EcraMapa from '../components/ecraMapa/ecraMapa';
import EcraReport from '../components/ecraReport/ecraReport';
import EcraPerfil from '../components/ecraPerfil/ecraPerfil';
import { Button } from 'react-native';

import * as GoogleSignIn from 'expo-google-sign-in';

const styles = StyleSheet.create({
    header: {
      ...StyleSheet.absoluteFillObject,
      zIndex: 999
    },
    signInButton: {
      ...StyleSheet.absoluteFillObject,
      position: 'absolute',
      top: '50%'
    }
 });

const Tab = createBottomTabNavigator();

const App = () => {

  const [user, setUser] = useState(null);

  const finalizeSignIn = async () => {
    const user = await GoogleSignIn.signInSilentlyAsync();
    setUser(user);
  }

  signOutAsync = async () => {
    await GoogleSignIn.signOutAsync();
    setUser(null);
  };

  signInAsync = async () => {
    try {
      await GoogleSignIn.askForPlayServicesAsync();
      const { type, user } = await GoogleSignIn.signInAsync();
      console.log(user);
      if (type === 'success') {
        finalizeSignIn();
      }
    } catch ({ message }) {
      alert('login: Error:' + message);
    }
  };

  useEffect( () => {
    const initSignInAttempt = async () => {
      await GoogleSignIn.initAsync({
        clientId: '628699918493-qg7puaoqa6m34u7a8cih3bh06amcvhdd.apps.googleusercontent.com',
      });
      console.log('init done');
      finalizeSignIn();
    }
    initSignInAttempt();
  }, [] )

  return (
    !user ?
      <Button style={styles.signInButton}
      title="Google Sign-In"
      onPress={signInAsync}
    />
    :
    <NavigationContainer>
      <Header style={styles.header}
          centerComponent={{ text: 'REPORT APP', style: { color: '#fff' } }}
      />
      <Tab.Navigator>
        <Tab.Screen name="Home" component={EcraInicial} />
        <Tab.Screen name="Map" component={EcraMapa} />
        <Tab.Screen name="Report" component={EcraReport} />
        <Tab.Screen name="Perfil" component={EcraPerfil} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default App;
