import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import * as FirebaseAPI from '../../../services/firebaseAPI';

const record = () => {

 /*  const userData = FirebaseAPI.userData; */
  const [reports, setReports] = useState([]);

  const ReportsCheck = async () => {
    const response = await FirebaseAPI.getCurrentUserReports();
    //console.log(response);
    setReports(response);
  }

  console.log(reports)

  useEffect(() => { ReportsCheck(); }, []);


  if ('processing' == 'processing') {

    return (
      <View>

        {reports.map((reportss) => {
          return (
            <View style={styles.process} key={reportss.id}>

              {reportss.isAnimalReport == false ? <Text>Animal</Text> : <Text>Lixo</Text> }
              {reportss.status == 'processing' ? <Image style={{ height: 40, width: 40 }} source={require('../../../assets/loading.png')}></Image> : null }
              {reportss.status == 'closed' ? <Image style={{ height: 40, width: 40 }} source={require('../../../assets/check.png')}></Image> : null }
              
            </View>
          )
        })}

      </View>
    )
  }
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
