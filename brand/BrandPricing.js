//import liraries
import React, { Component } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { PricingCard,fonts, colors ,Text} from 'react-native-elements'
import { number } from 'yup';
import * as firebase from "firebase";
import { Button, Paragraph, Dialog, Portal } from 'react-native-paper';
import { Provider } from 'react-native-paper';

// create a component
class BrandPricing extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      selectedPlan:"",    visible: false,

    };
  }

  _showDialog = (selected) => this.setState({ visible: true, selectedPlan:selected,});

  _hideDialog = (type) => {
    
    
    this.setState({ visible: false });
    this.pressButton(type)
  
  }


  pressButton = (numbertype) => {
    //console.log( numbertype)
    let selectedPlan = numbertype
    let requestValue = false
    let uid = firebase.auth().currentUser.uid;
    firebase.auth().onAuthStateChanged(function () {
      firebase
        .database()
        .ref(`users/brand/` + uid)
        .update({
          requestValue, selectedPlan
        });
    });

    this.setState({selectedPlan: numbertype})
    console.log(selectedPlan)
    this.props.navigation.navigate("Home")
  }
    render()
  {
    let one = "0"
    let two = "1"
    let three = "2"
    return (
      <Provider>
        <ScrollView>
        <View style={styles.container}>
            <PricingCard
  color="green"
  title='Basic Plan'
  price='$50'
  info={['Text', 'Basic Support', 'Mandor sends only Text']}
  button={{ title: 'GET STARTED'  }}
  onButtonPress={() => {this._showDialog(one)}}
  containerStyle={{alignSelf:"stretch"}}

/>

<PricingCard
  color="blue"
  title='Pro Plan' 
  price='$100'
  info={['Video ', 'Pro Support', 'Mandor sends only Video']}
  button={{ title: 'GET STARTED'}}
  onButtonPress={() => {this._showDialog(two)}}
  containerStyle={{alignSelf:"stretch"}}

/>


<PricingCard
  color="orange"
  title='Premium Plan'
  price='$125'
  info={['Text & Video ', 'Premium Support', 'Mandor sends Text & Video']}
  button={{ title: 'GET STARTED' }}
  onButtonPress={() => {this._showDialog(three)}}
  containerStyle={{alignSelf:"stretch"}}
/>

<Portal>
          <Dialog
             visible={this.state.visible}
             onDismiss={()=>{this._hideDialog(this.state.selectedPlan)}}   >
            <Dialog.Title>Alert</Dialog.Title>
            <Dialog.Content>
    <Paragraph>Are you sure you want to change your plan to {this.state.selectedPlan}?</Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={()=>{this._hideDialog(this.state.selectedPlan)}}>Done</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
        </View>
        </ScrollView>
        </Provider>

    );
  }
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 0,
        alignItems: 'center',
        padding:15,
        backgroundColor: '#2c3e50',
    },
});

//make this component available to the app
export default BrandPricing;
