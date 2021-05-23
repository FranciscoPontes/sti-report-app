import React from 'react';
import { Image } from 'react-native';
import { Container, Button, Text } from 'native-base';
import { Row, Grid } from 'react-native-easy-grid';

const EcraAgradecimento = props => {
    const navigation = props.navigation;

    return (
        <Container>
            <Grid styles={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <Row style={{height: "90%"}}>
                    <Image source={{uri: 'https://i.pinimg.com/originals/8c/40/05/8c4005377742272315e792545a9c93df.gif'}} style={{flex: 1, width: null, height: null, resizeMode: 'contain'}}/>
                </Row>
                <Row style={{alignSelf: "center"}}>
                    <Button info onPress={() => {navigation.replace('ReportScreen'); navigation.navigate('Home')}}><Text>Voltar</Text></Button>
                </Row>
            </Grid>
            
        </Container>
    )
}

export default EcraAgradecimento;