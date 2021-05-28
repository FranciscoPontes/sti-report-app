import React from 'react';
import EcraHistorico from './ecraHistorico';
import EcraDetails from './ecraDetails';

import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

const TabHistorico = props => {
    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="Historico" component={EcraHistorico} />
            <Stack.Screen name="Details" component={EcraDetails} />
        </Stack.Navigator>
    )
}

export default TabHistorico;