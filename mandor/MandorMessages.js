import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, Button } from 'react-native';
import * as firebase from 'firebase';
import MandorMessageDetails from './MandorMessageDetails';
import { TouchableOpacity, TextInput } from 'react-native-gesture-handler';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { Input, Icon, Overlay } from "react-native-elements";
import uuid from 'react-native-uuid';
import ValidationComponent from "react-native-form-validator";
import {
  Card,
  CardTitle,
  CardContent,
  CardAction,
  CardButton,
  CardImage,
} from "react-native-cards";

// create a component
class MandorMessages extends React.Component{
    static navigationOptions = {
        header: null
    }
    constructor(){
        super();
        this.state = {messageArray:[], brands: [], changed: "0"};
    }
    
    componentDidMount = async () =>{
        const uidb = firebase.auth().currentUser.uid; 
        
        await firebase.database().ref('/messages').orderByChild('uid').on('value',(snapshot)=>
        {
          let sample = []
          sample = Object.values(snapshot.val())
          this.setState({brands: [], messageArray: sample, changed: "0"})
        })
    }


    render(){
      if(this.state.changed == "0") {
        this.forceUpdate()
        this.setState({changed: "1"})
      }
      //console.log(this.state.messageArray)
        for(let i = 0; i < this.state.messageArray.length; i++) {
            let fir =Object.values(this.state.messageArray[i])
            
            this.state.brands.push(
                <TouchableOpacity onPress={() => {this.props.navigation.navigate("MandorBrandMessage", {bid: fir[0].branduid})}}><MandorMessageDetails msg={fir[0].branduid}/></TouchableOpacity>
            )
        }
    return (
        <View style={styles.container}>
            <ScrollView>{this.state.brands}</ScrollView>
        </View>
    )}
};

class MandorBrandMessage extends ValidationComponent{
    static navigationOptions = {
        header: null
    }
    constructor(props) {
        super(props);
        this.state = { messageArray: [], messagedescr: "", visible: false, messagedescription: "", datetime: "", branduid: ""};
    }

    _onPressButton = async () => {
        this.validate({
            messagedescr: { required: true },
          });
          var today = new Date();
          var date =
      today.getFullYear() +
      "-" +
      ('0' + today.getMonth()).slice(-2) +
      "-" +
      ('0' + today.getDate()).slice(-2);
    var time =
    ('0' + today.getHours()).slice(-2) + ":" + ('0' + today.getMinutes()).slice(-2) + ":" + ('0' + today.getSeconds()).slice(-2)+ ":" + ('0' + today.getMilliseconds()).slice(-3);
    let datetime = today.getFullYear() +
    "" +
    ('0' + today.getMonth()).slice(-2) +
    "" +
    ('0' + today.getDate()).slice(-2) + ""+ ('0' + today.getHours()).slice(-2) + "" + ('0' + today.getMinutes()).slice(-2) + "" + ('0' + today.getSeconds()).slice(-2)+ "" + ('0' + today.getMilliseconds()).slice(-3);
    let messagedate = date;
          let messagetime = time;
          let messagedescription = this.state.messagedescr;
      
          //await firebase.auth().onAuthStateChanged(function (user) {
            
            const {bid} = this.props.navigation.state.params
            const branduid = bid;
            const sender = firebase.auth().currentUser.uid;
      
            await firebase.database().ref(`/messages/`+branduid+`/`+datetime).set({
              branduid,
              sender,
              datetime,
              messagedescription,
              messagedate,
              messagetime,
              messagetype: "created",
              messageedit: ""
            });
          this.setState({ messagedescr: "" });
    }
    componentDidMount() {
        const {bid} = this.props.navigation.state.params
        
         firebase
          .database()
          .ref('/messages/'+ bid)
          .orderByChild("datetime")
          .on("value", (snapshot) => {
            if(snapshot.val()==null)
            {
              this.setState({ messageArray:[]})
            }
            else{
              this.setState({messageArray: Object.values(snapshot.val())})
            }
          
          });
    
          
      }

      toggleOverlay = (msg) => {
        this.setState({messagedescription: msg.messagedescription, datetime: msg.datetime, branduid: msg.branduid})
        this.setState({visible: !this.state.visible});
      };
      _onPressButtonEdit = () => {
        let messagedescription = this.state.messagedescription
        let datetime = this.state.datetime
        let branduid = this.state.branduid
        firebase.database().ref(`/messages/`+branduid+`/`+datetime).update({messagedescription, messageedit: "Edited"})
        this.setState({visible: !this.state.visible})
      }

    render(){
    const mandorid = firebase.auth().currentUser.uid;
    return (<View style={styles.container1}>
        <ScrollView
    ref={ref => {this.scrollView = ref}}
    onContentSizeChange={() => this.scrollView.scrollToEnd({animated: true})}
    >{this.state.messageArray.map((msg, i) => {
      return (
        <View style={styles.container}>
        {msg.sender==mandorid ? <Card style={{backgroundColor:"lightgreen"}}>
            <CardTitle subtitle="Mandor:" />
            <CardContent text={msg.messagedescription}/>
            <CardContent
            text={`Date--` + msg.messagedate + `  Time--` + msg.messagetime}
            />
            <CardContent text={msg.messageedit} />
            <CardAction seperator={true} inColumn={false}>
            <CardButton 
            
            onPress={() => {
               this.toggleOverlay(msg)
              }}

            title="Edit"
             color="#FEB557" />
            <CardButton 
            
            onPress={() => {
               firebase.database().ref(`/messages/`+msg.branduid+`/`+msg.datetime).remove()
              }}

            title="Delete"
             color="#FEB557" />
          </CardAction>
          <Overlay isVisible={this.state.visible} onBackdropPress={() => {this.toggleOverlay(msg)}}>
              <ScrollView>

                <Input label="Description" ref="messagedescription" onChangeText={(messagedescription) => this.setState({messagedescription})} value={this.state.messagedescription} inputStyle={styles.text} labelStyle={styles.label} placeholder="Message..."/>
                <Button onPress={this._onPressButtonEdit} title="Update" color="orange"/>

              </ScrollView>
          </Overlay>
        </Card>: <Card style={{backgroundColor:"cyan"}}>
          <CardTitle subtitle="Brand:" />
            <CardContent text={msg.messagedescription}/>
          <CardContent
            text={`Date--` + msg.messagedate + `  Time--` + msg.messagetime}
          />
          <CardContent text={msg.messageedit} />
          
          
        </Card>}
      </View>
      )
    })}<Input
    label="Message"
    ref="messagedescr"
    onChangeText={(messagedescr) => this.setState({ messagedescr })}
    value={this.state.messagedescr}
    style={styles.texto}
    placeholder="Enter your message..."
  />
  <Button
    onPress={() => this._onPressButton()}
    title="submit"
    color="black"
  /></ScrollView>
    
    </View>
    );}
};



const RootStack = createStackNavigator({
    MandorMessages: MandorMessages,
  MandorBrandMessage: MandorBrandMessage,
  
});
// define your styles
const styles = StyleSheet.create({
    container: {
       flex:1,
       padding:20,
        backgroundColor: '#fff',
    },
    container1: {
         backgroundColor: '#fff',
     },
     texto: {
       color: "black",
       fontSize: 18,
       borderBottomWidth: 1,
     },
});

export default createAppContainer(RootStack);

