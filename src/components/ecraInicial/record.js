import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import * as FirebaseAPI from '../../../services/firebaseAPI';

const record = ()=> {

    const userReports = FirebaseAPI.getCurrentUserReports;

    if ('processing' == 'processing'){
      return(
      <View style={styles.process}>
        <Text>
          {'fu '}
        </Text>
        <Image style={{ height: 40, width: 40 }} source={require('../../../assets/loading.png')}></Image>
      </View>

    )}

    if ('F' == 'closed'){
      return (

      <View style={styles.process}>
        <Text>
          not
        </Text>
        <Image style={{ height: 40, width: 40 }} source={require('../../../assets/check.png')}></Image>
      </View>

      )}
}

const styles = StyleSheet.create({
      process: {
      backgroundColor: '#FFF',
        padding: 15,
        marginHorizontal: 15,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
});

export default record;