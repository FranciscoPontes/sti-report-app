import React, { Fragment, useState, useEffect } from 'react';
import { Text, View, StyleSheet } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {Header, Item} from 'react-native-elements';
import Home from './ecraInicial/home';
import EcraMapa from '../components/ecraMapa/ecraMapa';
import EcraPerfil from '../components/ecraPerfil/ecraPerfil';
import EcraReport from './ecraReport/ecraReport';
import { Button } from 'react-native';

import * as FirebaseAPI from '../../services/firebaseAPI';

import * as Google from 'expo-auth-session/providers/google';

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
    
  useEffect(() => {
    const tryLogin = async () => response?.type === 'success' ? setUser( await FirebaseAPI.login(response) ) : null;
    tryLogin();
  }, [response]);

  useEffect( () => FirebaseAPI.startFirebase(), [])

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
      </View>
    :
    <NavigationContainer>
      <Header style={styles.header}
          centerComponent={{ text: 'REPORT APP', style: { color: '#fff' } }}
      />
      <Tab.Navigator>
        <Tab.Screen name="Home" component={Home} initialParams={ { user } } options={{ unmountOnBlur: true }}
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
        <Tab.Screen name="Map" component={EcraMapa} />
        <Tab.Screen name="Report" component={EcraReport} />
        <Tab.Screen name="Perfil" component={EcraPerfil} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default App;
