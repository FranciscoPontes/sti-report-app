import React, { useState, useEffect } from 'react';
import { Container, Text, View } from 'native-base';
import { RefreshControl, SafeAreaView, ScrollView  } from 'react-native';
import { Col, Row, Grid } from 'react-native-easy-grid';
import * as API from '../../../services/firebaseAPI';
import Record from '../ReportRecord/ReportRecord';

const EcraHistorico = () => {
    const [ userReports, setUserReports ] = useState([]);
    const [ refreshing, setRefreshing ] = useState(false);

    const userData = API.userData;
    // console.log(userData);

    const refreshData = async () => {
      console.log('refreshing..');
      setRefreshing(true);
      const data = await API.getCurrentUserReports();
      setUserReports(data);
      setRefreshing(false);
    }

    useEffect( () => {
      console.log('---- use effect ----');
      console.log(userData);
      refreshData();
    }, [])

    return (
        <SafeAreaView>
        <ScrollView refreshControl={
          <RefreshControl 
            refreshing={refreshing}
            onRefresh={refreshData}
          />
        }>
          <Container>
              <Grid style={{paddingTop: 15, alignItems: 'center'}}>
                  <Row size={40} >
                      <Col style={{ backgroundColor: '#ece8e8', padding: '5%', borderRadius: 10, width: '85%', alignItems: 'center' }}>
                              <Text style={{ fontSize: 20, fontWeight: 'bold', paddingBottom: 10 }}>
                                  Históricos de pedidos
                              </Text>
                          <View style={{ flexDirection: 'column' }} size={90}>
                              { userReports ? 
                                    userReports.map( (report, idx) => <Record data={report} key={idx} showAll={true}/> )
                                  : <Text>You have not made any report</Text>
                              }
                          </View>
                      </Col>
                  </Row>
              </Grid>
          </Container>
        </ScrollView>
      </SafeAreaView>
    )
}

export default EcraHistorico;