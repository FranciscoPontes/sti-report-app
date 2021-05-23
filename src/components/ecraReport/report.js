import React from 'react';
import EcraReport from './ecraReport';
import EcraSummary from './ecraSummary';
import EcraAgradecimento from './ecraAgradecimento';

import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

const Report = props => {
    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="ReportScreen" component={EcraReport} initialParams={{reportType: 1}}/>
            <Stack.Screen name="SummaryScreen" component={EcraSummary} />
            <Stack.Screen name="ThanksScreen" component={EcraAgradecimento} />
        </Stack.Navigator>
    )
}

export default Report;