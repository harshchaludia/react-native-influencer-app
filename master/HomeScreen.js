import React from "react";
import { StyleSheet, View, SafeAreaView, ScrollView } from "react-native";
import { Text } from 'react-native-elements';

import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import * as firebase from "firebase";
import { Input } from "react-native-elements";
import { ListItem } from 'react-native-elements'
import { Picker,Alert } from "react-native";
import { Button, Icon, ButtonGroup } from "react-native-elements";
import { ActivityIndicator } from 'react-native';
import { Image } from 'react-native';
import {  Paragraph, Dialog, Portal } from 'react-native-paper';
import { Provider } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import ValidationComponent from "react-native-form-validator";
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import DatePicker from 'react-native-datepicker'
import { Avatar } from 'react-native-elements';
import { TouchableOpacity, TouchableHighlight } from "react-native-gesture-handler";
import { string } from "yup";
import { isInteger } from "formik";


const items = [
    // this is the parent or 'item'
    {
      name: 'Interests',
      id: 0,
      // these are the children or 'sub items'
      children: [
        {
          name: 'Music',
          id: 10,
        },
        {
          name: 'Education',
          id: 11,
        },
        {
          name: 'Food',
          id: 12,
        },
        {
          name: 'Apparels',
          id: 13,
        },
        {
          name: 'E-commerce',
          id: 14,
        },
        {
          name: 'Travel',
          id: 15,
        },
        {
            name: 'Occassion',
            id: 16,
        }
      ],
    },
    
  
  ];
 class HomeScreen extends ValidationComponent {

   
    constructor(props) {
        super(props);
        this.state = {firstname : "",
         lastname:"",
         numberSubscribed:0,
          gender: "",
           number:"",
           points:"",
            date:"",
             email: "",
              city:"",
               states:"",
                country:"",
                msgerror:"",
                ch:"0",
                 twitterusername:"",
                  instagramusername:'',
                   occupation:'',
                   beforeUrl:'https://img.favpng.com/0/15/12/computer-icons-avatar-male-user-profile-png-favpng-ycgruUsQBHhtGyGKfw7fWCtgN.jpg',
                    
                   firebaseimage:"https://img.favpng.com/0/15/12/computer-icons-avatar-male-user-profile-png-favpng-ycgruUsQBHhtGyGKfw7fWCtgN.jpg",
                  profileImageURL:"",
                  postinfo:[],
                    posts:[],
                   selectedItems: [],
                };
      }




      onSelectedItemsChange = (selectedItems) => {
        this.setState({ selectedItems });
      };
    
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
            .ref("users/followers/" + uid)
            .update({
              profileImageURL,
            })
          })


          this.setState({beforeUrl:"https://d33v4339jhl8k0.cloudfront.net/docs/assets/59f9ae61042863319924181d/images/5a28531a2c7d3a1a640ca94b/file-eesqBFuUGp.png"})


      }
    } catch (e) {
      //console.log(e);
      alert('Upload failed, sorry :(');
    } finally {
      this.setState({ uploading: false });
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
      this.props.navigation.navigate("NavScreen5");
    }
    else
{    
    this.setState({ visible: false });
}
  
  } 
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
        //await Permissions.askAsync(Permissions.CAMERA);
        let uid = firebase.auth().currentUser.uid;
    await firebase
      .database()
      .ref(`users/followers/` + uid)
      .on("value", (snapshot) => {
        let test;
        test = snapshot.val();
        this.setState({ usertype: test.type });
        this.setState({ usernumber: test.num });

        //console.log("usertype,----",this.state.usernumber)
        if (this.state.usernumber == "0") {
          return;
        }

        if (this.state.usernumber == "1"){  
            this.setState({firstname: test.firstname});
                      this.setState({ profileImageURL: test.profileImageURL });

            this.setState({lastname: test.lastname});
            this.setState({gender: test.gender});
            this.setState({number: test.number});
            this.setState({date:test.date});
            this.setState({states: test.states});
            this.setState({email:test.email});
            this.setState({city:test.city});
            this.setState({rewards:test.rewards});
            this.setState({country:test.country});
            this.setState({twitterusername:test.twitterusername});
            this.setState({instagramusername:test.instagramusername});
            this.setState({occupation:test.occupation});
            this.setState({ selectedItems: test.Interests });
            this.setState({ points: test.points });
            this.setState({ numberSubscribed: test.subscribedPosts.length });

            let length = 0
            if(test.subscribedPosts!=undefined)
            {
                length = test.subscribedPosts.length
            }
            let arrPostName = [];
            length = length -1
            let c = 3
            while (length!=-1 && c != 0)
            {
                
                let uidn = test.subscribedPosts[length]
               firebase
                .database()
                .ref(`posts/` + uidn)
                .on("value", (snapshot) => {
                  
                let testing;
                testing = snapshot.val();
                arrPostName.push(testing.title)
                this.setState({ch:"0"})

                 })

                length -= 1
                c -= 1
            }

            this.setState({ posts:arrPostName});
             console.log(this.state.posts)

        }




    
    
      });
    }

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
        Interests : {required: true}
        });
        //console.log(this.state.usernumber)

        if(this.isFormValid()	){
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
        let Interests = this.state.selectedItems; 
        //console.log( firstname, lastname, gender,number, email, date, city, states, country, twitterusername, instagramusername, occupation,Interests)
        let uid = firebase.auth().currentUser.uid;
        var points=0
    
        var num="1"
        firebase.auth().onAuthStateChanged(function(user) {  
          firebase.database().ref('users/followers/'+ uid).update({
            num,firstname,points, lastname, gender,number, email, date, city, states, country, twitterusername, instagramusername, occupation,Interests })
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
      
    render(){
   
        if(this.state.ch=="0")
        {
          this.forceUpdate()
          this.setState({ch:"1"})
        }

        if (this.state.usernumber == "0") {
            
            return (
              <ScrollView>
                <View style={styles.containero}>
                  <Text h4 style={{textAlign:"center"}}> REGISTRATION FORM </Text>
                  
                 <Text h5 style={{textAlign:"center"}}>Upload Profile Image</Text>
      <Avatar
        size="xlarge"
      
        
       source={{uri:this.state.beforeUrl}}
        containerStyle={{alignSelf:"center"}}
        onPress={() => this._pickImage()}
      
      /> 


<Input label="First Name" ref="firstname" onChangeText={(firstname) => this.setState({firstname})} value={this.state.firstname} style={styles.text} placeholder="First Name"/>
         <Text style={{color: 'red'}}>  { this.getErrorsInField('firstname')} </Text>
         <Input label="Last Name" ref="lastname" onChangeText={(lastname) => this.setState({lastname})} value={this.state.lastname} style={styles.text} placeholder="Last Name"/>
         <Text style={{color: 'red'}}>  { this.getErrorsInField('lastname')} </Text>


         <Input label="Phone Number" ref="number" onChangeText={(number) => this.setState({number})} value={this.state.number} style={styles.text} placeholder="Phone Number"/>
          <Text style={{color: 'red'}}> {this.getErrorsInField('number')} </Text>

          <Input label="Email" ref="email" onChangeText={(email) => this.setState({email})} value={this.state.email} style={styles.text} placeholder="Email"/>
          <Text style={{color: 'red'}}> {this.getErrorsInField('email')} </Text>
      
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


         <SectionedMultiSelect
          ref= "list"
          items={items}
          label="Interests"
          uniqueKey="name"
          subKey="children"
          selectText="Select Your Interests..."
          showDropDowns={true}
          readOnlyHeadings={true}
          onSelectedItemsChange={this.onSelectedItemsChange}
          selectedItems={this.state.selectedItems}
          value={this.state.selectedItems}
          style={{marginBottom:200}}
            />
          

         <Input label="Twitter Username" ref="twitterusername" onChangeText={(twitterusername) => this.setState({twitterusername})} value={this.state.twitterusername} style={styles.text} placeholder="Country"/>
         <Text style={{color: 'red'}}>  { this.getErrorsInField('twitterusername')} </Text>

         <Input label="Instagram Username" ref="instagramusername" onChangeText={(instagramusername) => this.setState({instagramusername})} value={this.state.instagramusername} style={styles.text} placeholder="Country"/>
         <Text style={{color: 'red'}}>  { this.getErrorsInField('instagramusername')} </Text>

          <Input label="Occupation" ref="occupation"  onChangeText={(occupation) => this.setState({occupation})} value={this.state.occupation} style={styles.text} placeholder="Occupation"/>
          <Text style={{color: 'red'}}> { this.getErrorsInField('occupation')} </Text>

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

      <Button    onPress={() => {this._onPressButton()}}
                    title="submit"
                    color="black"
                  />
                </View>
                
              </ScrollView>
            );
          }
        
          else {
       
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.titleBar}>
                 
                </View>

                <View style={{ alignSelf: "center" }}>
                    <View style={styles.profileImage} >
                        <Image source={{
          uri:
          this.state.profileImageURL}} style={styles.image} resizeMode="center"></Image>
                    </View>
                  
                    <View style={styles.active}></View>
                    <View style={styles.add}>
                        <Ionicons onPress={() => this._pickImage()}
 name="ios-add" size={48} color="#DFD8C8" style={{ marginTop: 6, marginLeft: 2 }}></Ionicons>
                    </View>
                </View>

                <View style={styles.infoContainer}>
                        <Text style={[styles.text, { fontWeight: "200", fontSize: 36 }]}>{this.state.firstname} {this.state.lastname}</Text>
                    <Text style={[styles.text, { color: "#AEB5BC", fontSize: 14 }]}>{this.state.occupation}</Text>
                </View>
                           
                <View style={styles.statsContainer}>
                    <View style={styles.statsBox}>
                        <Text style={[styles.text, { fontSize: 24 }]}>{this.state.points}</Text>
                        <Text style={[styles.text, styles.subText]}>Points</Text>
                    </View>
                    <View style={[styles.statsBox, { borderColor: "#DFD8C8", borderLeftWidth: 1, borderRightWidth: 1 }]}>
                        <Text style={[styles.text, { fontSize: 24 }]}>{this.state.numberSubscribed}</Text>
                        <Text style={[styles.text, styles.subText]}>Subscribed Posts</Text>
                    </View>
                </View>


                <View style={{backgroundColor:"black", marginTop:20, paddingBottom:20}}>
                <View style={styles.statsContainer}>
                    <View style={styles.statsBox}>
                        <Text style={[styles.textInfo, { fontSize: 18 }]}>{this.state.number}</Text>
                        <Text style={[styles.textInfo, styles.subTextInfo]}>Contact</Text>
                    </View>
                    <View style={styles.statsBox}>
                        <Text style={[styles.textInfo, { fontSize: 18 }]}>{this.state.date}</Text>
                        <Text style={[styles.textInfo, styles.subTextInfo]}>D.O.B</Text>
                    </View>
                </View>



                <View style={styles.statsContainer}>
                    <View style={styles.statsBox}>
                        <Text style={[styles.textInfo, { fontSize: 18 }]}>{this.state.email}</Text>
                        <Text style={[styles.textInfo, styles.subTextInfo]}>EMAIL</Text>
                    </View>
                   
                    
                </View>
                <View style={styles.statsContainer}>
                    <View style={styles.statsBox}>
                        <Text style={[styles.textInfo, { fontSize: 18 }]}>{this.state.city}</Text>
                        <Text style={[styles.textInfo, styles.subTextInfo]}>CITY</Text>
                    </View>
                    <View style={styles.statsBox}>
                        <Text style={[styles.textInfo, { fontSize: 18 }]}>{this.state.states}</Text>
                        <Text style={[styles.textInfo, styles.subTextInfo]}>STATE</Text>
                    </View>
                    <View style={styles.statsBox}>
                        <Text style={[styles.textInfo, { fontSize: 18 }]}>{this.state.country}</Text>
                        <Text style={[styles.textInfo, styles.subTextInfo]}>COUNTRY</Text>
                    </View>

                    
                </View></View>
               
                
                <Text style={[styles.subText, styles.recent]}>Recent Activity</Text>

                
             


                <View style={{ alignItems: "center" }}>
                    {
                        
                        this.state.posts.map((post) => {
                            
                            return(

                           

                            <View style={styles.recentItem}>
                            <View style={styles.activityIndicator}></View>
                            <View style={{ width: 250 }}>
                                <Text style={[styles.text, { color: "#41444B", fontWeight: "300" }]}>
                                    Subscribed <Text style={{ fontWeight: "400" }}>{post}</Text>
                                </Text>
                            </View>
                        </View>
    )})
                    }
                   

                </View>
            </ScrollView>
        </SafeAreaView>
    )}
}
 }
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF"
    },
    text: {
        color: "#52575D"
    },
    textInfo :{
        color: "#fff"

    },
    image: {
        flex: 1,
        height: undefined,
        width: undefined
    },
    titleBar: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 24,
        marginHorizontal: 16
    },
    subText: {
        fontSize: 12,
        color: "#AEB5BC",
        textTransform: "uppercase",
        fontWeight: "500"
    },
    subTextInfo:{
        fontSize: 12,
        color: "#AEB5BC",
        textTransform: "uppercase",
        fontWeight: "500"
    },
    profileImage: {
        width: 200,
        height: 200,
        borderRadius: 100,
        overflow: "hidden"
    },
    dm: {
        backgroundColor: "#41444B",
        position: "absolute",
        top: 20,
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center"
    },
    active: {
        backgroundColor: "#34FFB9",
        position: "absolute",
        bottom: 28,
        left: 10,
        padding: 4,
        height: 20,
        width: 20,
        borderRadius: 10
    },
    add: {
        backgroundColor: "#41444B",
        position: "absolute",
        bottom: 0,
        right: 0,
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center"
    },
    infoContainer: {
        alignSelf: "center",
        alignItems: "center",
        marginTop: 16
    },
    statsContainer: {
        flexDirection: "row",
        alignSelf: "center",
        marginTop: 32
    },
    statsBox: {
        alignItems: "center",
        flex: 1
    },
    mediaImageContainer: {
        width: 180,
        height: 200,
        borderRadius: 12,
        overflow: "hidden",
        marginHorizontal: 10
    },
    mediaCount: {
        backgroundColor: "#41444B",
        position: "absolute",
        top: "50%",
        marginTop: -50,
        marginLeft: 30,
        width: 100,
        height: 100,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 12,
        shadowColor: "rgba(0, 0, 0, 0.38)",
        shadowOffset: { width: 0, height: 10 },
        shadowRadius: 20,
        shadowOpacity: 1
    },
    recent: {
        marginLeft: 78,
        marginTop: 32,
        marginBottom: 6,
        fontSize: 10
    },
    recentItem: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 16
    },
    activityIndicator: {
        backgroundColor: "#CABFAB",
        padding: 4,
        height: 12,
        width: 12,
        borderRadius: 6,
        marginTop: 3,
        marginRight: 20
    }
});

export default HomeScreen;