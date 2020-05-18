'use strict';
import React from 'react';
import {
  StyleSheet,
  Button,
} from 'react-native';
import * as firebase from 'firebase';

import {View, Text,Picker, TouchableHighlight} from 'react-native';
import {Input} from 'react-native-elements';
import ValidationComponent from 'react-native-form-validator';
import DatePicker from 'react-native-datepicker'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';

import {  Paragraph, Dialog, Portal } from 'react-native-paper';
import { Provider } from 'react-native-paper';

class MandorSettings extends ValidationComponent {
  
  constructor(props) {
    super(props);
    this.state = {firstname : "", lastname:"", gender: "", number:"", date:"", email: "", city:"", states:"", country:"", twitterusername:"", instagramusername:'', occupation:'',  };
  }

  
  _showDialog = (msgerror) => {
    
    let sampleerror = msgerror
    this.setState({ visible: true});
    this.setState({ msgerror:sampleerror});


  }

      _hideDialog = (value) => {
        
        if(value){
          this.setState({ visible: false });
          this.props.navigation.navigate("MandorSettings");
        }
        else
        {
        this.setState({ visible: false });
        this.props.navigation.navigate("MandorHome");
        }
      
      } 
      
  componentDidMount() {
    const uid = firebase.auth().currentUser.uid;

  firebase.database().ref(`users/mandor/`+uid).on('value',(snapshot)=>
    {
      let test;
      test = snapshot.val();
      if(test==null)
      {
        return
      }
      this.setState({firstname: test.firstname});
      this.setState({lastname: test.lastname});
      this.setState({gender: test.gender});
      this.setState({number: test.number});
      this.setState({date:test.date});
      this.setState({states: test.states});
      this.setState({email:test.email});
      this.setState({city:test.city});
      this.setState({country:test.country});
      this.setState({twitterusername:test.twitterusername});
      this.setState({instagramusername:test.instagramusername});
      this.setState({occupation:test.occupation});
      //console.log(this.state.selectedItems);
    })

  }
  onSelectedItemsChange = (selectedItems) => {
    this.setState({ selectedItems });
  };

  
  
  _onPressButton = () => {
    if (!firebase.apps.length) {
      firebase.initializeApp({});
   }
   this.validate({
    firstname:{minlength:3, maxlength:10, required: true},
    lastname:{minlength:3, maxlength:10, required: true},
    gender : {required: true,required: true},
    email: {email: true,required: true},
    number: {numbers: true,required: true},
    date : {required:true,required: true},
    city : {minlength:3, maxlength:15, required: true},
    states : {minlength:3, maxlength:15, required: true},
    country : {minlength:3, maxlength:15, required: true},
    twitterusername : {minlength:3, maxlength:20, required: true},
    instagramusername :{minlength:3, maxlength:20, required: true},
    occupation : {minlength:5, maxlength:18, required: true},
    
    });
    let check_errors = this.isFormValid()
    if(this.isFormValid()){

    let firstname = this.state.firstname
    let lastname= this.state.lastname
    let gender = this.state.gender
    let number = this.state.number
    let email = this.state.email
    let date = this.state.date
    let city = this.state.city
    let states = this.state.states
    let country = this.state.country
    let twitterusername = this.state.twitterusername
    let instagramusername = this.state.instagramusername
    let occupation = this.state.occupation
    let uid = firebase.auth().currentUser.uid;

    //console.log( firstname, lastname, gender,number, email, date, city, states, country, twitterusername, instagramusername, occupation,Interests)
    firebase.auth().onAuthStateChanged(function(user) {  
      firebase.database().ref('users/mandor/'+ uid).update({
        firstname, lastname, gender,number, email, date, city, states, country, twitterusername, instagramusername, occupation })
    });
    let error = "Values Successfully Updated"
    this._showDialog(error)


  }
    else
    {
      let error = "Check for errors! Please enter correct values!"
      this._showDialog(error)

    }


  }

  
  render() {

    return (
      
      <ScrollView>
      <View style={styles.container}>
          <Text style={styles.header}> Registration form </Text>
         <Input label="First Name" ref="firstname" onChangeText={(firstname) => this.setState({firstname})} value={this.state.firstname} style={styles.text} placeholder="First Name"/>
         <Text style={{color: 'red'}}>  { this.getErrorsInField('firstname')} </Text>
         <Input label="Last Name" ref="lastname" onChangeText={(lastname) => this.setState({lastname})} value={this.state.lastname} style={styles.text} placeholder="Last Name"/>
         <Text style={{color: 'red'}}>  { this.getErrorsInField('lastname')} </Text>
         <Picker        
          label = "Gender"
          style={styles.pickerStyle}  
          selectedValue = {this.state.gender}
          style={{marginBottom:20}}
          selectedValue={this.state.gender}  
          onValueChange={(itemValue, itemPosition) =>  
          this.setState({gender: itemValue, choosenIndex: itemPosition})}  
                    >  
                    <Picker.Item label="Select Gender.." value="" />  
                    <Picker.Item label="Male" value="male" />  
                    <Picker.Item label="Female" value="female" />  
         </Picker>  
          
          <Input label="Phone Number" ref="number" onChangeText={(number) => this.setState({number})} value={this.state.number} style={styles.text} placeholder="Phone Number"/>
          <Text style={{color: 'red'}}> {this.getErrorsInField('number')} </Text>

          <Input label="Email" ref="email" onChangeText={(email) => this.setState({email})} value={this.state.email} style={styles.text} placeholder="Email"/>
          <Text style={{color: 'red'}}> {this.getErrorsInField('email')} </Text>
            
          <DatePicker
              style={{    
              alignSelf: 'stretch',
              paddingBottom:20}}
              date={this.state.date}
              label="Date"
              mode="date"
              placeholder="Date of Birth"
              format="YYYY-MM-DD"
              minDate="1920-01-01"
              maxDate="2020-04-23"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              customStyles={{
                dateIcon: {
                  position: 'absolute',
                  left: 0,
                  top: 4,
                  marginLeft: 10
                },
                dateInput: {
                  marginLeft: 50,

                }
                // ... You can check the source to find the other keys.
            }}
            onDateChange={(date) => {this.setState({date: date})}}
           />


         <Input label="City" ref="city" onChangeText={(city) => this.setState({city})} value={this.state.city} style={styles.text} placeholder="City"/>
         <Text style={{color: 'red'}}>  { this.getErrorsInField('city')} </Text>

         <Input label="State" ref="states" onChangeText={(states) => this.setState({states})} value={this.state.states} style={styles.text} placeholder="State"/>
         <Text style={{color: 'red'}}>  { this.getErrorsInField('states')} </Text>


         <Input label="Country" ref="country" onChangeText={(country) => this.setState({country})} value={this.state.country} style={styles.text} placeholder="Country"/>
         <Text style={{color: 'red'}}>  { this.getErrorsInField('country')} </Text>


        

         <Input label="Twitter Username" ref="twitterusername" onChangeText={(twitterusername) => this.setState({twitterusername})} value={this.state.twitterusername} style={styles.text} placeholder="Country"/>
         <Text style={{color: 'red'}}>  { this.getErrorsInField('twitterusername')} </Text>

         <Input label="Instagram Username" ref="instagramusername" onChangeText={(instagramusername) => this.setState({instagramusername})} value={this.state.instagramusername} style={styles.text} placeholder="Country"/>
         <Text style={{color: 'red'}}>  { this.getErrorsInField('instagramusername')} </Text>

          <Input label="Occupation" ref="occupation"  onChangeText={(occupation) => this.setState({occupation})} value={this.state.occupation} style={styles.text} placeholder="Occupation"/>
          <Text style={{color: 'red'}}> { this.getErrorsInField('occupation')} </Text>
<TouchableOpacity>
          <Button onPress={this._onPressButton} title="submit" color="black"/>
          </TouchableOpacity>

          <Provider>
          <Portal stlye={{flex:1}}>
            <Dialog
              visible={this.state.visible}
              onDismiss={()=>{this._hideDialog(1)}}   >
              <Dialog.Title>Alert</Dialog.Title>
              <Dialog.Content>
              <Paragraph>{this.state.msgerror}</Paragraph>
              
              </Dialog.Content>
              <Dialog.Actions>
              <Button onPress={()=>{this._hideDialog(0)}} title="GO HOME" />
              <Text>&nbsp;&nbsp;&nbsp;&nbsp;</Text>
              <Button onPress={()=>{this._hideDialog(1)}} title="RETURN" />

              </Dialog.Actions>
            </Dialog>
           </Portal>
          </Provider>

        </View>
        </ScrollView>

    );
  }
}


const styles = StyleSheet.create({
 container: {
    flex: 1,
    alignContent: 'space-around',
    backgroundColor: '#fff',
    paddingLeft: 15,
    paddingRight: 15
 },
 text: {
   color: 'black',
   fontSize: 18,
   borderBottomWidth: 1,
 },
 header: {
   fontSize: 25,
   textAlign: 'left',
   marginBottom: 10,
   color: "white"
 },


});
console.disableYellowBox = true;

export default MandorSettings;