import React from 'react';
import EcraInicial from './ecraInicial';
import EcraReport from './ecraReport';
import EcraSummary from './ecraSummary';
import EcraAgradecimento from './ecraAgradecimento';

import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

const Home = props => {
    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="HomeScreen" component={EcraInicial} initialParams={{ user: props.route.params.user }} />
            <Stack.Screen name="ReportScreen" component={EcraReport} />
            <Stack.Screen name="SummaryScreen" component={EcraSummary} />
            <Stack.Screen name="ThanksScreen" component={EcraAgradecimento} />
        </Stack.Navigator>
    )
}

export default Home;