import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import * as FirebaseAPI from '../../../services/firebaseAPI';
import { Container, Header, Content, Accordion } from "native-base";

const record = props => {

 /*  const userData = FirebaseAPI.userData; */
  const [reports, setReports] = useState([]);
  // const refreshTriggered = props.triggerRefresh;
  // const parentRefreshDone = props.refreshDone;

  const ReportsCheck = async () => {
    const response = await FirebaseAPI.getCurrentUserReports();
    //console.log(response);
    setReports(response);
  }
  const dataArray = [
    { title: "First Element", content: "Lorem ipsum dolor sit amet" },
    { title: "Second Element", content: "Lorem ipsum dolor sit amet" },
    { title: "Third Element", content: "Lorem ipsum dolor sit amet" }
  ];
  console.log(reports);

  useEffect(() => { 
    ReportsCheck()
  }, []);

  // useEffect(() => { 
  //   ( async () =>
  //     {
  //       console.log('here');
  //       // parentRefreshDone();
  //       if (!refreshTriggered) return;
  //       await ReportsCheck();
  //       // parentRefreshDone();
  //       console.log('refresh done');
  //     }
  //   )()
  //   // on unmount fix
  //   return () => null;
  //   }, [refreshTriggered]
  // );

    return (
      <View style={{ width: '85%' }}>

        {reports.map( (reportss, index) => 
          (
            <View style={styles.process} key={index}>

              <Text>{reportss.isAnimalReport ? 'Animal' : 'Lixo'}</Text>
              { reportss.status == 'processing' ? 
                <Image style={{ height: 40, width: 40 }} source={require('../../../assets/loading.png')}></Image> : 
                <Image style={{ height: 40, width: 40 }} source={require('../../../assets/check.png')}></Image> 
              }              
            </View>
          )
        )}

      </View>
    )
}



const styles = StyleSheet.create({
  process: {
    backgroundColor: '#FFF',
    padding: 15,
    // marginHorizontal: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    // width: '85%'
  },
});

export default record;
