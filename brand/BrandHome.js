import React, { Component } from "react";
import { Dimensions } from "react-native";
import * as firebase from "firebase";
import { Input } from "react-native-elements";
import ValidationComponent from "react-native-form-validator";
import { ListItem } from 'react-native-elements'
import { StyleSheet,Picker, View,ScrollView, ActivityIndicator } from "react-native";
import { Button, Icon, ButtonGroup } from "react-native-elements";
import { Image } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import {  Paragraph, Dialog, Portal } from 'react-native-paper';
import { Provider } from 'react-native-paper';
var width = Dimensions.get("window").width / 1.2; //full width
import { Avatar, Text } from 'react-native-elements';
import { TouchableHighlight } from "react-native-gesture-handler";



export default class BrandHome extends ValidationComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedPlan:"",
      usernumber: "",
      usertype: "",
      brandname: "",
      branddescr: "",
      firstname: "",
      lastname: "",
      gender: "",
      number: "",
      date: "",
      email: "",
      city: "",
      states: "",
      country: "",
      uploading: false,
      changing:"0",
      twitterusername: "",
      instagramusername: "",
      occupation: "",
      msgerror:"",
      selectedItems: [],
      firebaseimage:"https://img.favpng.com/0/15/12/computer-icons-avatar-male-user-profile-png-favpng-ycgruUsQBHhtGyGKfw7fWCtgN.jpg",
      beforeUrl:'https://img.favpng.com/0/15/12/computer-icons-avatar-male-user-profile-png-favpng-ycgruUsQBHhtGyGKfw7fWCtgN.jpg'
    };
  }


  _pickImage = async () => {
    console.log("clicked")
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    this._handleImagePicked(pickerResult);
  };
  
  _handleImagePicked = async pickerResult => {
    try {
      this.setState({ uploading: true });

      if (!pickerResult.cancelled) {
        let uploadUrl
        uploadUrl = await this.uploadImageAsync(pickerResult.uri);
        this.setState({ firebaseimage: uploadUrl });


        const uid = firebase.auth().currentUser.uid;
        const ref = firebase.storage().ref("images/"+uid+"userimage");
        let profileImageURL = await ref.getDownloadURL();
    
       
        firebase.auth().onAuthStateChanged(function () {
          firebase
            .database()
            .ref("users/brand/" + uid)
            .update({
              profileImageURL,
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

   
uploadImageAsync = async (uri) => {
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
  const uid = firebase.auth().currentUser.uid;

  const ref = firebase.storage().ref('images/'+uid+"userimage");

  const snapshot = await ref.put(blob);
  

  // We're done with the blob, close and release it
  blob.close();

  return await snapshot.ref.getDownloadURL();
}




  componentDidMount = async() => {
    await Permissions.askAsync(Permissions.CAMERA_ROLL);
    await Permissions.askAsync(Permissions.CAMERA);
   

    const uid = firebase.auth().currentUser.uid;
    
    
    await firebase
      .database()
      .ref(`users/brand/` + uid)
      .on("value", (snapshot) => {
        let test;
        test = snapshot.val();
        this.setState({ usertype: test.type });
        this.setState({ usernumber: test.num });

        console.log("usertype,----",this.state.usernumber)
        if (this.state.usernumber == "0") {
          return;
        }

        if (this.state.usernumber == "1"){  

          if(test.selectedPlan == "0")
          {
            this.setState({ selectedPlan: 0 });
          }else if (test.selectedPlan =="1")
          {         
            this.setState({ selectedPlan: 1 });
          }
          else {         
            this.setState({ selectedPlan: 2 });
          }
          this.setState({ profileImageURL: test.profileImageURL });

          this.setState({ brandname: test.brandname });
          this.setState({ branddescr: test.branddescr });
          this.setState({ firstname: test.firstname });
          this.setState({ lastname: test.lastname });
          this.setState({ number: test.number });
          this.setState({ email: test.email });
          this.setState({ occupation: test.occupation });
          this.setState({ twitterusername: test.twitterusername });
          this.setState({ instagramusername: test.instagramusername });

        }


      });
  }
  

  _onPressButton = async () => {
    
    if (!firebase.apps.length) {
      firebase.initializeApp({});
    }
    this.validate({
      brandname:{ minlength:3, maxlength:15, required: true },
      branddescr: { minlength:1, maxlength:200, required: true },
      firstname: { minlength:5, maxlength:20, required: true },
      lastname: { minlength:5, maxlength:20, required: true },
      number: { numbers: true, required:true },
      email: { email: true, required:true  },
      twitterusername: { minlength:3, maxlength:25, required:true },
      instagramusername: {minlength:3, maxlength:25, required:true },
      occupation: {minlength:3, maxlength:25,  required:true },
    });

 if(this.isFormValid()	){
  let selectedPlan = this.state.selectedPlan;
  let brandname = this.state.brandname;
  let branddescr = this.state.branddescr;
  let firstname = this.state.firstname;
  let lastname = this.state.lastname;
  let number = this.state.number;
  let email = this.state.email;
  let twitterusername = this.state.twitterusername;
  let instagramusername = this.state.instagramusername;
  let occupation = this.state.occupation;
  let uid = firebase.auth().currentUser.uid;
  let num = "1";

  


  console.log(num,
    selectedPlan,
    brandname,
    branddescr,
    firstname,
    lastname,
    number,
    email,
    twitterusername,
    instagramusername,
    occupation)
  firebase.auth().onAuthStateChanged(function () {
    firebase
      .database()
      .ref("users/brand/" + uid)
      .update({
        num,
        selectedPlan,
        brandname,
        branddescr,
        firstname,
        lastname,
        number,
        email,
        twitterusername,
        instagramusername,
        occupation,
      });
  });
        let error = "Values Successfully Updated"
        this._showDialog(error)
    
    
      }
        else
        {
          let error = "Check for errors! Please enter correct values!"
          this._showDialog(error)
    
        }

  
  };


  _showDialog = (msgerror) => {
    
    let sampleerror = msgerror
    this.setState({ visible: true});
    this.setState({ msgerror:sampleerror});


  }

  _hideDialog = (value) => {
        
    if(value){
      this.setState({ visible: false });
      this.props.navigation.navigate("Settings");
    }
    else
    {
    this.setState({ visible: false });
    }
  
  } 
  render() {
    
    const buttons = ["Basic", "Pro", "Premium"];
    //console.log(this.state.usernumber)
    //const { selectedIndex } = this.state.selectedPlan;
    if (this.state.usernumber == "1") {
      return (
        <ScrollView>
          <View style={styles.container}>
            <View style={styles.header}></View>
            
<View style={{ justifyContent:"center",  borderRadius:50,
    borderWidth: 1,
    borderColor: '#fff',    overflow: 'hidden', alignSelf:"center", alignItems:"center", position:"absolute", marginTop:50}}>

<TouchableHighlight   onPress={() => this._pickImage()}           

><Image
  source={{ uri: this.state.profileImageURL }}
  style={{width:125, height:125
}}

/></TouchableHighlight>
</View>
            
            <View style={styles.body}>
<View>
<Text style={styles.name}         >{this.state.branddescr}</Text>

  </View>
            <View style={{ flexDirection: "column",flex:1, marginTop:20 }}>

                  <View  style={{ flexDirection: "row", }}>
                      <ListItem
                        //key={}
                        leftIcon={{ name: "business" }}
                        title={this.state.brandname}
                        subtitle="Clothing"
                        style={{flex:1}}
                        topDivider
                      />
                      <ListItem
                        //key={}
                        leftIcon={{ name: "face" }}
                        title={this.state.firstname+` `+this.state.brandname}
                        subtitle={this.state.occupation}
                        style={{flex:1}}

                        topDivider
                      />
                  </View>
                  <View  style={{ flexDirection: "row", }}>
                      <ListItem
                        //key={}
                        leftIcon={{ name: "phone" }}
                        title="Work"
                        subtitle={this.state.number}
                        style={{flex:1}}

                        topDivider
                      />

<View  style={{ flex:1 }}>
                      <ListItem
                        //key={}
                        leftIcon={{ name: "twitter", type:"font-awesome" }} 
                        title="Username"
                        subtitle={this.state.twitterusername}
                        bottomDivider
                        topDivider
                      />
                   
                  </View>
                      
  
                  </View>



                  <View  style={{ flexDirection: "row" }}>
                      
                      <ListItem
                        //key={}
                        leftIcon={{ name: "email" }}
                        title="Company"
                        subtitle={this.state.email}
                        style={{flex:2}}

                        topDivider
                      />
  
                  </View>

              </View>




              <View style={{ flexDirection: "row", }}>
                  
                  
                  <View  style={{ flex:1 }}>
                      <ListItem
                        //key={}
                        leftIcon={{ name: "instagram", type:"font-awesome" }} 
                        title="Username"
                        subtitle={this.state.instagramusername}
                        bottomDivider
                        topDivider
                      />
                      
                  </View>
                  

              </View>









              <View  style={styles.bodyContent}>


               
        
             
<View style={{flexDirection:"row"}}>
  
<Icon
  raised
  name='facebook'
  type='font-awesome'
  color='blue'
  />


<Icon
  raised
  name='instagram'
  type='font-awesome'
  color='#f50'
   />

<Icon
  raised
  name='twitter'
  type='font-awesome'
  color='skyblue'
  />


<Icon
  raised
  name='snapchat'
  type='font-awesome'
  color='yellow'
   />

  </View>
  
                <Button
                  title="  CONTACT MANDOR"
                  icon={{
                    name: "message",
                    size: 17,
                    color: "white",
                  }}
                  buttonStyle={{ padding: 10,marginTop:25, width: width }}
                  onPress={() => {
                    this.props.navigation.navigate("Message");
                  }}
                />

                
<Button
                  title=" CHANGE PROFILE"
                  icon={{
                    name: "cog",
                    size: 17,
                    color: "white",
                    type:"font-awesome"
                  }}
                  buttonStyle={{ padding: 10,marginTop:15, width: width }}
                  onPress={() => {
                    this.props.navigation.navigate("Settings");
                  }}
                />

                                
                <Button
                  title=" CHANGE PLAN"
                  icon={{
                    name: "cog",
                    size: 17,
                    color: "white",
                    type:"font-awesome"
                  }}
                  buttonStyle={{ padding: 10,marginTop:15, width: width }}
                  onPress={() => {
                    this.props.navigation.navigate("Pricing");
                  }}
                />
                <ButtonGroup
                  onPress={() => {}}
                  selectedIndex={this.state.selectedPlan}
                  buttons={buttons}
                  containerStyle={{ height: 50,marginTop:15, width: width }}
                />
              </View>
              

            </View>
          </View>
        </ScrollView>
      );
    } 
    
    
     if (this.state.usernumber == "0") {
      return (
        <ScrollView>
          <View style={styles.containero}>
            <Text h4 style={{justifyContent:"center", alignItems:"center", textAlign:"center"}}> Registration form </Text>
           <Text h5 style={{justifyContent:"center", alignItems:"center", textAlign:"center"}}>Upload an Image</Text>
<Avatar
  size="xlarge"

  
 source={{uri:this.state.beforeUrl}}
  containerStyle={{alignSelf:"center"}}
  onPress={() => this._pickImage()}

/>

            <Picker        
              label = "Gender"
              ref="picker"

              selectedValue = {this.state.selectedPlan}
              style={{marginBottom:20}}
              onValueChange={(itemValue, itemPosition) =>  
              this.setState({selectedPlan: itemValue, choosenIndex: itemPosition})}  
                    >  
                    <Picker.Item label="Select Plan.." value="" />  
                    <Picker.Item label="Basic" value="0" />  
                    <Picker.Item label="Pro" value="1" />   
                    <Picker.Item label="Premium" value="2" />  
          </Picker>  

         
         

  

            <Input
              label="Brand Name"
              ref="brandname"
              onChangeText={(brandname) => this.setState({ brandname })}
              value={this.state.brandname}
              style={styles.texto}
              placeholder="First Name"
            />

            <Text style={{ color: "red" }}>
              {" "}
              {this.getErrorsInField("brandname")}{" "}
            </Text>
            <Input
              label="Brand Description"
              ref="branddescr"
              onChangeText={(branddescr) => this.setState({ branddescr })}
              value={this.state.branddescr}
              style={styles.texto}
              placeholder="First Name"
            />

            <Text style={{ color: "red" }}>
              {" "}
              {this.getErrorsInField("branddescr")}{" "}
            </Text>
            <Input
              label="First Name"
              ref="firstname"
              onChangeText={(firstname) => this.setState({ firstname })}
              value={this.state.firstname}
              style={styles.texto}
              placeholder="First Name"
            />

            <Text style={{ color: "red" }}>
              {" "}
              {this.getErrorsInField("firstname")}{" "}
            </Text>
            <Input
              label="Last Name"
              ref="lastname"
              onChangeText={(lastname) => this.setState({ lastname })}
              value={this.state.lastname}
              style={styles.texto}
              placeholder="Last Name"
            />
            <Text style={{ color: "red" }}>
              {" "}
              {this.getErrorsInField("lastname")}{" "}
            </Text>

            <Input
              label="Phone Number"
              ref="number"
              onChangeText={(number) => this.setState({ number })}
              value={this.state.number}
              style={styles.texto}
              placeholder="Phone Number"
            />
            <Text style={{ color: "red" }}>
              {" "}
              {this.getErrorsInField("number")}{" "}
            </Text>

            <Input
              label="Email"
              ref="email"
              onChangeText={(email) => this.setState({ email })}
              value={this.state.email}
              style={styles.texto}
              placeholder="Email"
            />
            <Text style={{ color: "red" }}>
              {" "}
              {this.getErrorsInField("email")}{" "}
            </Text>

            <Input
              label="Twitter Username"
              ref="twitterusername"
              onChangeText={(twitterusername) =>
                this.setState({ twitterusername })
              }
              value={this.state.twitterusername}
              style={styles.texto}
              placeholder="Country"
            />
            <Text style={{ color: "red" }}>
              {" "}
              {this.getErrorsInField("twitterusername")}{" "}
            </Text>

            <Input
              label="Instagram Username"
              ref="instagramusername"
              onChangeText={(instagramusername) =>
                this.setState({ instagramusername })
              }
              value={this.state.instagramusername}
              style={styles.texto}
              placeholder="Country"
            />
            <Text style={{ color: "red" }}>
              {" "}
              {this.getErrorsInField("instagramusername")}{" "}
            </Text>

            <Input
              label="Occupation"
              ref="occupation"
              onChangeText={(occupation) => this.setState({ occupation })}
              value={this.state.occupation}
              style={styles.texto}
              placeholder="Occupation"
            />
            <Text style={{ color: "red" }}>
              {" "}
              {this.getErrorsInField("occupation")}{" "}
            </Text>

<Button    onPress={() => {this._onPressButton()}}
              title="submit"
              color="black"
            />
          </View>
          <Text>
            {this.getErrorMessages()}
          </Text>



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
        </ScrollView>
      );
    }

    if(!this.state.usernumber) {
      console.log("show me usernumber ---",this.state.usernumber)
      
      return (
      <View style={{    flex: 1,
        justifyContent: 'center',
        alignItems: 'center'}}>
                <ActivityIndicator size="large" color="#0000ff" />

        </View>
      )
    }
  }
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#9370DB",
    height: 100,
  },
 
  name: {
    fontSize: 24,
    color: "#000",
    fontWeight: "500",
    marginTop:50,
    flex:1,
    textAlign:"center"
  },
  body: {
    marginTop: 40,
  },
  bodyContent: {
    alignItems: "center",
    padding: 25,
  },
 
  info: {
    fontSize: 16,
    color: "#00BFFF",
    marginTop: 10,
  },
  description: {
    fontSize: 16,
    color: "#696969",
    marginTop: 10,
    textAlign: "center",
  },
  containero: {
    flex: 1,
    alignContent: "space-around",
    backgroundColor: "#fff",
    paddingLeft: 15,
    paddingRight: 15,
  },
  texto: {
    color: "black",
    fontSize: 18,
    borderBottomWidth: 1,
  },
  headero: {
    fontSize: 25,
    textAlign: "left",
    marginBottom: 10,
    color: "white",
  },
});
