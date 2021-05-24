import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import * as FirebaseAPI from '../../../services/firebaseAPI';

const record = (props) => {

  return (
    <View style={styles.process}>
    <Text>
        {props.text}
    </Text>
    <Image style={{ height: 40, width: 40 }} source={require('../../../assets/loading.png')}></Image>
    </View>
  )
}

const styles = StyleSheet.create({
    process: {
        backgroundColor: '#FFF',
        padding: 15,
        marginHorizontal: 10,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
});

export default record;