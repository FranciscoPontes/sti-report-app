import React, { useState, useEffect } from 'react';
import { Container, Button, Text } from 'native-base';
import { Image, StyleSheet  } from 'react-native';

const styles = StyleSheet.create({
    ava: {
      width: 66,
      height: 58,
    },
  });

const EcraInicial = props => {
    const userData = props.route.params.user; 

    return (
        <Container>
            <Text>Este é o ecra inicial</Text>
            <Text>{ 'Nome: ' + userData.displayName}</Text>
            <Text>{'Email: ' + userData.email}</Text>
            <Image 
                style={styles.ava}
                source={{ uri: userData.photoURL }} />
        </Container>
    )
}

export default EcraInicial;