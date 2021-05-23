import React, { useEffect} from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import { Table, TableWrapper, Row, Cell } from 'react-native-table-component';
 
const ReportsTable = props => {
    const tableHead = [];
    const data = props.data;

    const element = (data, index) => (
      <TouchableOpacity onPress={() => null}>
        <View style={styles.btn}>
          <Text style={styles.btnText}>button</Text>
        </View>
      </TouchableOpacity>
    );

    // cells: tipo, data, cidade, estado (icone)
 
    return ( 
      <View style={styles.container}>
        <Table borderStyle={{borderColor: 'transparent'}}>
          <Row data={tableHead} style={styles.head} textStyle={styles.text}/>
          {
            data.map( (rowData, index) => (
              <TableWrapper key={index} style={styles.row}>
                {
                  Object.keys(rowData).map( (cellData, cellIndex) => {
                    console.log(cellData);
                    return (
                        <Cell key={cellIndex} 
                        // data={cellIndex === 3 ? element(cellData, index) : cellData} 
                        data={rowData[cellData]} 
                        textStyle={styles.text}/>
                        )
                      })
                }
              </TableWrapper>
            ))
          }
        </Table>
      </View>
    )
}
 
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
  head: { height: 40, backgroundColor: '#808B97' },
  text: { margin: 6 },
  row: { flexDirection: 'row', backgroundColor: '#FFF1C1' },
  btn: { width: 58, height: 18, backgroundColor: '#78B7BB',  borderRadius: 2 },
  btnText: { textAlign: 'center', color: '#fff' }
});

export default ReportsTable;