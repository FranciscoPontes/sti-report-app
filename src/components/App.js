import React, { Fragment } from 'react';
import { Text, View, StyleSheet } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {Header, Item} from 'react-native-elements';
import EcraInicial from '../components/ecraInicial/ecraInicial';
import EcraMapa from '../components/ecraMapa/ecraMapa';
import EcraReport from '../components/ecraReport/ecraReport';
import EcraPerfil from '../components/ecraPerfil/ecraPerfil';

const styles = StyleSheet.create({
    header: {
      ...StyleSheet.absoluteFillObject,
      zIndex: 999
    }
 });

const Tab = createBottomTabNavigator();

function App() {

  return (
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
