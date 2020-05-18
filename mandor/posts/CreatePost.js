//import liraries
import React, { Component } from 'react';
import { View, StyleSheet, Picker } from 'react-native';
import * as firebase from 'firebase';

import {Input, Text} from 'react-native-elements';
import ValidationComponent from 'react-native-form-validator';
import DatePicker from 'react-native-datepicker'
import { ScrollView } from 'react-native-gesture-handler';
import {Button} from 'react-native-elements';
import {TouchableHighlight } from "react-native-gesture-handler";
import { Image } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

// create a component
class CreatePost extends ValidationComponent {
    constructor(props) {
        super(props);
        this.state = {title : "", description:"", startdate: "", enddate:"", taskcount:0, taskarray:[], location:"", rewards:0, coupon: "", choosenIndex: "",
        firebaseimage:"https://img.favpng.com/0/15/12/computer-icons-avatar-male-user-profile-png-favpng-ycgruUsQBHhtGyGKfw7fWCtgN.jpg",
        beforeUrl:'https://img.favpng.com/0/15/12/computer-icons-avatar-male-user-profile-png-favpng-ycgruUsQBHhtGyGKfw7fWCtgN.jpg',
        profileImageURL: "https://img.favpng.com/0/15/12/computer-icons-avatar-male-user-profile-png-favpng-ycgruUsQBHhtGyGKfw7fWCtgN.jpg",
        brandfreedeal:"",
        brandpromotionname:"",
        pickerResultData:{},
        uploading: false
      };
      }

      _pickImage = async () => {
        console.log("clicked")
        let pickerResult = await ImagePicker.launchImageLibraryAsync({
          allowsEditing: true,
          aspect: [4, 3],
        });
        this.setState({pickerResultData:pickerResult})
        console.log(this.state.pickerResultData)
        //this._handleImagePicked(pickerResult);
      };
     
      _handleImagePicked = async (pickerResult, imageid) => {
        console.log("Picker Result ----",pickerResult)
        console.log("imageid Result ----", imageid)
        try {
          this.setState({ uploading: true });
          let uid = imageid
          if (!pickerResult.cancelled) {
            let uploadUrl
            uploadUrl = await this.uploadImageAsync(pickerResult.uri, imageid);
            this.setState({ firebaseimage: uploadUrl });
            const ref = firebase.storage().ref("images/"+uid+"postimage");
            let profileImageURL = await ref.getDownloadURL();
        
           
            this.setState({profileImageURL: profileImageURL})
            this.setState({pickerResultData:{}})
            
            firebase.auth().onAuthStateChanged(function () {
              firebase
                .database()
                .ref("posts/"+ uid)
                .update({
                    profileImageURL
                })
              })
    
    
          }
        } catch (e) {
          //console.log(e);
          alert('Upload failed, sorry :(');
        } finally {
          this.setState({ uploading: false });
        }
      };
    
       
    uploadImageAsync = async (uri, imageid) => {
      // Why are we using XMLHttpRequest? See:
      // https://github.com/expo/expo/issues/2402#issuecomment-443726662
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function() {
          resolve(xhr.response);
        };
        xhr.onerror = function(e) {
          //console.log(e);
          reject(new TypeError('Network request failed'));
        };
        xhr.responseType = 'blob';
        xhr.open('GET', uri, true);
        xhr.send(null);
      });
    
      const ref = firebase.storage().ref('images/'+imageid+"postimage");
    
      const snapshot = await ref.put(blob);
      
    
      // We're done with the blob, close and release it
      blob.close();
    
      return await snapshot.ref.getDownloadURL();
    }

      _onPressButton = async() => {
        await Permissions.askAsync(Permissions.CAMERA_ROLL);

        if (!firebase.apps.length) {
          firebase.initializeApp({});
       }
       this.validate({
        title:{ required: true },
        description:{  required: true },
        enddate:{ required: true},
        rewards: {required: true, number: true}
        });
        let title = this.state.title
        let category = this.state.category
        let description= this.state.description
        let startdate = this.state.startdate
        let enddate = this.state.enddate
        let location = this.state.location
        let coupon = this.state.coupon
        let brandpromotionname = this.state.brandpromotionname
        let brandfreedeal = this.state.brandfreedeal

        let subscribers = 0
        let tasks = this.state.taskarray
        let start = new Date(this.state.startdate)
        start = start.getFullYear() +
        "" +
        ('0' + (start.getMonth() + 1)).slice(-2) +
        "" +
        ('0' + (start.getDate() + 1)).slice(-2);

        let proImg = this.state.profileImageURL
        var today = new Date();
        let datetime = start + today.getFullYear() +
        "" +
        ('0' + (today.getMonth() + 1)).slice(-2) +
        "" +
        ('0' + (today.getDate() + 1)).slice(-2) + ""+ ('0' + today.getHours()).slice(-2) + "" + ('0' + today.getMinutes()).slice(-2) + "" + ('0' + today.getSeconds()).slice(-2);
        let ImageID = datetime
        this._handleImagePicked(this.state.pickerResultData,ImageID );
        if(!isNaN(this.state.rewards)) {
          let rewards = parseInt(this.state.rewards)
        
          firebase.database().ref(`posts/`+datetime).set({
          title,brandpromotionname,brandfreedeal, description, startdate, enddate, tasks, location, rewards, datetime, coupon, category, active: "1", profileImageURL: proImg })
          this.setState({err: "", title: "", description:"", startdate: "", enddate:"", taskcount:0, taskarray:[], location:"", rewards:0, category: "", coupon: "", profileImageURL: this.state.beforeUrl})
          this.props.navigation.navigate('NavScreen7')
        }
        else {
          this.setState({err: "Rewards must be number"})
        }
        
      }
      updateState = (value, index) => {
          const taskarray = [...this.state.taskarray]
          taskarray[index] = value;
          this.setState({taskarray: taskarray});
      }
    render() {

        var tasks = [];
        for(let i = 0; i < this.state.taskcount; i++) {
            let j = i + 1
            tasks.push(
                <View key = {i}>
				<View>
                <Input label={`Task `+j} ref='task' onChangeText={(task) => this.updateState(task, i)} value={this.state.taskarray[i]} inputStyle={styles.text} labelStyle={styles.label} placeholder="Task"/>
                <Text style={{color: 'red'}}>   </Text>
				</View>
                </View>
            )
        }
    return (
        <ScrollView style={{backgroundColor:'#2c3e50'}}>
        <View style={styles.container}>
        <TouchableHighlight  style={{alignItems:"center", justifyContent:"center",}} onPress={() => this._pickImage()}           

><Image 
  source={{ uri: this.state.profileImageURL }}
  style={{width:125, height:125, alignItems:"center", justifyContent:"center"
}}

/></TouchableHighlight>
         <Input label="Title" ref="title" onChangeText={(title) => this.setState({title})} value={this.state.title} inputStyle={styles.text} labelStyle={styles.label} placeholder="Post Title"/>
         <Text style={{color: 'red'}}>  { this.getErrorsInField('title')} </Text>
         <Picker        
              label = "Category"
              ref="picker"

              selectedValue = {this.state.category}
              style={{marginBottom:20}}
              onValueChange={(itemValue, itemPosition) =>  
              this.setState({category: itemValue, choosenIndex: itemPosition})}  
                    >  
                    <Picker.Item label="Select Category of this Event.." value="" />  
                    <Picker.Item label="Music" value="Music" />  
                    <Picker.Item label="Education" value="Education" />   
                    <Picker.Item label="Food" value="Food" />  
                    <Picker.Item label="Apparels" value="apparels" /> 
                    <Picker.Item label="Kids" value="Kids" /> 
                    <Picker.Item label="e-commerce" value="E-commerce" /> 
                    <Picker.Item label="Travel" value="Travel" /> 
                    <Picker.Item label="Occassion" value="Occassion" /> 
          </Picker>  
         <Input label="Description" ref="description" onChangeText={(description) => this.setState({description})} value={this.state.description} inputStyle={styles.text} labelStyle={styles.label} placeholder="Post Description"/>
         <Text style={{color: 'red'}}>  { this.getErrorsInField('description')} </Text>

         <Input label="Brand Promotion Name" ref="brandpromotionname" onChangeText={(brandpromotionname) => this.setState({brandpromotionname})} value={this.state.brandpromotionname} inputStyle={styles.text} labelStyle={styles.label} placeholder="Eg. Nike"/>
         <Text style={{color: 'red'}}>  { this.getErrorsInField('brandpromotionname')} </Text>

         <Input label="Brand Free Deal" ref="brandfreedeal" onChangeText={(brandfreedeal) => this.setState({brandfreedeal})} value={this.state.brandfreedeal} inputStyle={styles.text} labelStyle={styles.label} placeholder="Eg. 30% of on all Formal Shoes"/>
         <Text style={{color: 'red'}}>  { this.getErrorsInField('brandfreedeal')} </Text>



         <Input label="Location" ref="location" onChangeText={(location) => this.setState({location})} value={this.state.location} inputStyle={styles.text} labelStyle={styles.label} placeholder="Location"/>
         <Text style={{color: 'red'}}>  { this.getErrorsInField('location')} </Text>
         <Input label="Rewards" ref="rewards" onChangeText={(rewards) => this.setState({rewards})} value={this.state.rewards} inputStyle={styles.text} labelStyle={styles.label} placeholder="Eg. 500 "/>
         <Text style={{color: 'red'}}>  {this.state.err} </Text>




         <Input label="Coupon" ref="coupon" onChangeText={(coupon) => this.setState({coupon})} value={this.state.coupon} inputStyle={styles.text} labelStyle={styles.label} placeholder="Coupon"/>
         <Text style={{color: 'red'}}>  { this.getErrorsInField('coupon')} </Text>
         <Input label="Number of Tasks" ref="nooftasks" onChangeText={(taskcount) => this.setState({taskcount})} value={this.state.taskcount} inputStyle={styles.text} labelStyle={styles.label} placeholder="Number of Tasks"/>
         <Text style={{color: 'red'}}>  { this.getErrorsInField('taskcount')} </Text>
         {tasks}
         <DatePicker
              style={{    
              alignSelf: 'stretch',
              paddingBottom:20, width: '100%'}}
              date={this.state.startdate}
              label="Start Date"
              mode="date"
              placeholder="Start Date"
              format="YYYY-MM-DD"
              minDate="1920-01-01"
              maxDate="2030-04-23"
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
            onDateChange={(date) => {this.setState({startdate: date})}}
           />
         <DatePicker
              style={{    
              alignSelf: 'stretch',
              paddingBottom:20, width: '100%'}}
              date={this.state.enddate}
              label="Expiry Date"
              mode="date"
              placeholder="Expiry Date"
              format="YYYY-MM-DD"
              minDate="1920-01-01"
              maxDate="2030-04-23"
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
            onDateChange={(date) => {this.setState({enddate: date})}}
           />

            <Button onPress={this._onPressButton} title="Create" color="orange"/>
         </View>
         </ScrollView>
    )};
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 10,
        paddingVertical: 25
    },
    text: {
      color: 'black',
      fontSize: 18,
    },
    label: {
        color: 'orange',
        fontWeight: 'bold',
        fontSize: 20,
      },
});

//make this component available to the app
export default CreatePost;
