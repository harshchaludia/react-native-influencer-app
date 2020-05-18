//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, Picker, Image, TouchableHighlight } from 'react-native';
import { Icon, Button, Overlay, Input } from 'react-native-elements';
import { Card, CardTitle, CardContent, CardAction, CardButton, CardImage } from 'react-native-cards';
import * as firebase from 'firebase';
import DatePicker from 'react-native-datepicker'
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

// create a component
class PostList extends Component{
    constructor(){
        super();
        this.state = {postArray:[],
          firebaseimage:"https://img.favpng.com/0/15/12/computer-icons-avatar-male-user-profile-png-favpng-ycgruUsQBHhtGyGKfw7fWCtgN.jpg",
        beforeUrl:'https://img.favpng.com/0/15/12/computer-icons-avatar-male-user-profile-png-favpng-ycgruUsQBHhtGyGKfw7fWCtgN.jpg',
        profileImageURL:"https://img.favpng.com/0/15/12/computer-icons-avatar-male-user-profile-png-favpng-ycgruUsQBHhtGyGKfw7fWCtgN.jpg",
          
        visible: false, title : "",        pickerResultData:{},
        description:"", startdate: "", enddate:"", taskarray:[], location:"", rewards:"", coupon: "", choosenIndex: "", datetime: ""};
    }
    _pickImage = async () => {
      console.log("clicked")
      let pickerResult = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
      });
      this.setState({pickerResultData:pickerResult})
      console.log(this.state.pickerResultData)
    };
   
    _handleImagePicked = async (pickerResult, imageid) => {
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
        this.setState({profileImageURL: "https://img.favpng.com/0/15/12/computer-icons-avatar-male-user-profile-png-favpng-ycgruUsQBHhtGyGKfw7fWCtgN.jpg"})

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
    componentDidMount= async() =>{
      await Permissions.askAsync(Permissions.CAMERA_ROLL);

        firebase.database().ref('posts/').on('value',(snapshot)=>
        {
            if(snapshot.val() == null) {
                this.setState({postArray:[]});
            }
            else {
        this.setState({postArray: Object.values(snapshot.val())});
            }
        })
        
    }
    updateState = (value, index) => {
        const taskarray = [...this.state.taskarray]
        taskarray[index] = value;
        this.setState({taskarray: taskarray});
    }

    _onPressButton = async () => {
        let title = this.state.title
        let category = this.state.category
        let description= this.state.description
        let startdate = this.state.startdate
        let enddate = this.state.enddate
        let location = this.state.location
        let rewards = this.state.rewards
        let coupon = this.state.coupon
        let tasks = this.state.taskarray
        let datetime = this.state.datetime
        this._handleImagePicked(this.state.pickerResultData,datetime );


        firebase.database().ref(`/posts/`+datetime).update({title, category, description, startdate, enddate, location, rewards, coupon, tasks})
        this.setState({visible: false, title : "", description:"", startdate: "", enddate:"", taskarray:[], location:"", rewards:"", coupon: "", choosenIndex: "", datetime: ""})
    
    
        this.setState({profileImageURL: "https://img.favpng.com/0/15/12/computer-icons-avatar-male-user-profile-png-favpng-ycgruUsQBHhtGyGKfw7fWCtgN.jpg"})

      }

    toggleOverlay = (post) => {
        this.setState({title: post.title, category: post.category, description: post.description, startdate: post.startdate, enddate: post.enddate, taskarray:post.tasks, location: post.location, rewards: post.rewards, coupon: post.coupon, choosenIndex: post.choosenIndex, datetime: post.datetime})
        this.setState({visible: !this.state.visible});
      };

      toggleOverlayBack = (post) => {
        this.setState({title : "", description:"", startdate: "", enddate:"", taskarray:[], location:"", rewards:"", coupon: "", choosenIndex: "", datetime: ""})
        this.setState({visible: !this.state.visible});
      };
    render(){
        const act = "1"
    return (
        <View style={styles.container}>
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{flex: 1, fontWeight: 'bold', fontSize: 25, color: 'orange'}}>Post List</Text>
            <Button
                icon={
                <Icon
                name="add"
                size={30}
                color="orange"
                />
                }
                onPress={()=>{this.props.navigation.navigate('NavScreen8')}}
            />
            </View>
            <View style={{marginTop: 10, borderTopWidth: 2, paddingTop: 10}}>
            <ScrollView>
            {this.state.postArray.map((post, i) => {
            return (
                <View>{post.active==act?
                    <Card>
                <CardImage 
                  source={{uri: post.profileImageURL}} 
                  title={post.title}
                />
                <CardTitle
                  subtitle={`Start Date: `+post.startdate+`  End Date: `+post.enddate}
                />
                <CardTitle
                  subtitle={`Location: `+post.location}
                />
                <CardContent text={`Description: `+post.description} />
                <CardAction 
                  separator={true} 
                  inColumn={false}>
                  <CardButton
                    onPress={() => {this.toggleOverlay(post)}}
                    title="Edit"
                    color="#FEB557"
                  />
                  <Overlay isVisible={this.state.visible} onBackdropPress={this.toggleOverlayBack}>
                      <ScrollView>
                      <TouchableHighlight  style={{alignItems:"center", justifyContent:"center",}} onPress={() => this._pickImage()}           

><Image 
  source={{ uri: this.state.profileImageURL }}
  style={{width:125, height:125, alignItems:"center", justifyContent:"center"
}}

/></TouchableHighlight>
                  <Input label="Title" ref="title" onChangeText={(title) => this.setState({title})} value={this.state.title} inputStyle={styles.text} labelStyle={styles.label} placeholder="Post Title"/>
         <Picker        
              label = "Category"
              ref="picker"

              selectedValue = {this.state.category}
              style={{marginBottom:20}}
              onValueChange={(itemValue, itemPosition) =>  
              this.setState({category: itemValue, choosenIndex: itemPosition})}  
                    >  
                    <Picker.Item label="Select Plan.." value="" />  
                    <Picker.Item label="Music" value="music" />  
                    <Picker.Item label="Education" value="education" />   
                    <Picker.Item label="Food" value="food" />  
                    <Picker.Item label="Apparels" value="apparels" /> 
                    <Picker.Item label="Kids" value="kids" /> 
                    <Picker.Item label="e-commerce" value="e-commerce" /> 
                    <Picker.Item label="Travel" value="travel" /> 
                    <Picker.Item label="Occassion" value="occassion" /> 
          </Picker>  
         <Input label="Description" ref="description" onChangeText={(description) => this.setState({description})} value={this.state.description} inputStyle={styles.text} labelStyle={styles.label} placeholder="Post Description"/>
         <Input label="Location" ref="location" onChangeText={(location) => this.setState({location})} value={this.state.location} inputStyle={styles.text} labelStyle={styles.label} placeholder="Location"/>
         <Input label="Rewards" ref="rewards" onChangeText={(rewards) => this.setState({rewards})} value={this.state.rewards} inputStyle={styles.text} labelStyle={styles.label} placeholder="Rewards"/>
         <Input label="Coupon" ref="coupon" onChangeText={(coupon) => this.setState({coupon})} value={this.state.coupon} inputStyle={styles.text} labelStyle={styles.label} placeholder="Coupon"/>
         {this.state.taskarray.map((task, i) => {
    return (
       <View key = {i}>
       <View>
       <Input label={`Task `+i} ref='task' onChangeText={(task) => this.updateState(task, i)} value={this.state.taskarray[i]} inputStyle={styles.text} labelStyle={styles.label} placeholder="Task"/>
       <Text style={{color: 'red'}}>   </Text>
       </View>
       </View>
    )
})}


         <DatePicker
              style={{    
              alignSelf: 'stretch',
              paddingBottom:20, width: '100%' }}
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
                  backgroundColor: 'black',
                  flex:1,
                  
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
           
            <Button onPress={() => this._onPressButton()} title="Update" color="orange"/>
            </ScrollView>
                  </Overlay>
                  <CardButton
                    onPress={() => {
                      firebase.database().ref(`/posts/`+post.datetime).update({active : "0"})
                    }}
                    title="Delete"
                    color="#FEB557"
                  />
                </CardAction>
              </Card>:<View></View>}
            </View>)
            })}
            </ScrollView>

            </View>
        </View>
    )};
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#3c280d',
        padding: 10
    },
});

//make this component available to the app
export default PostList;
