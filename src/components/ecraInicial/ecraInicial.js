import React, { useState, useEffect } from 'react';
import { Container, Text } from 'native-base';
import { Image, StyleSheet, Button  } from 'react-native';
import * as FirebaseAPI from '../../../services/firebaseAPI';

const styles = StyleSheet.create({
    ava: {
      width: 66,
      height: 58,
    },
  });

const EcraInicial = props => {
    const userData = props.route.params.user; 

    const reportTemplate = 
    {
        user: '113842996349886677035',
        latitude: '15',
        longitude: '20',
        accessType: 'medium', // easy, medium, hard
        extractionType: 'truck',
        isAnimalReport: false,
        typeOfAnimal: null,
        typeOfTrash: 'plastic', // plastic etc..
        submissionDate: new Date('2017-08-15'), // data atual
        status: 'processing' // processing, closed, rejected
    }

    const handleButtonPress = async () => {
        var array = await FirebaseAPI.getAllReports();
        console.log(array);
        console.log('----------------------');
        array.map( obj => console.log(obj));
    }

    return (
        <Container>
            <Text>Este é o ecra inicial</Text>
            <Text>{ 'Nome: ' + userData.displayName}</Text>
            <Text>{'Email: ' + userData.email}</Text>
            <Image 
                style={styles.ava}
                source={{ uri: userData.photoURL }} />
            <Button 
              title="Add new template report"
              onPress={() => FirebaseAPI.addNewReport(reportTemplate)}
            />
            <Button 
              title="Get user reports"
              onPress={FirebaseAPI.getCurrentUserReports}
            />
            <Button 
              title="Get all reports"
              onPress={handleButtonPress}
            />
        </Container>
    )
}

export default EcraInicial;