import React from "react";
import { StyleSheet, Text, View, SafeAreaView, Image,Alert, ScrollView } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import * as firebase from "firebase";
import { ListItem } from 'react-native-elements'

 class MandorHome extends React.Component {
    constructor(props) {
        super(props);
        this.state = {firstname : "",postsNumber:0,brandNumber:0,followerNumber:0,uploading:false,profileImageURL:"",firebaseimage:"",msgerror:"", lastname:"", gender: "", number:"", date:"", email: "", city:"", states:"", country:"", twitterusername:"", instagramusername:'', occupation:'',  };
      }

      _pickImage = async () => {
        console.log("clicked")
        let pickerResult = await ImagePicker.launchImageLibraryAsync({
          allowsEditing: true,
          aspect: [4, 3],
        });
    
        this._handleImagePicked(pickerResult);
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
                .ref("users/mandor/" + uid)
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


    componentDidMount = async() => {

        await Permissions.askAsync(Permissions.CAMERA_ROLL);
        //await Permissions.askAsync(Permissions.CAMERA);
        let uid = firebase.auth().currentUser.uid;
         await firebase
        .database()
         .ref(`users/mandor/` + uid)
        .on("value", (snapshot) => {
        let test;
        test = snapshot.val();
        this.setState({ usertype: test.type });
        this.setState({ usernumber: test.num });
            //console.log(test)
        //console.log("usertype,----",this.state.usernumber)
        if (this.state.usernumber == "0") {
          return;
        }
        if (this.state.usernumber == "1"){  
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
            this.setState({profileImageURL:test.profileImageURL});

            firebase
            .database()
             .ref(`users/brand/`)
            .on("value", (snapshot) => {
            let brand;
            brand = Object.values(snapshot.val());
            brand = brand.length
            this.setState({brandNumber:brand});

        //console.log("brand length",brand);
     }
            
            )

            firebase
            .database()
             .ref(`users/followers/`)
            .on("value", (snapshot) => {
            let followers;
            followers = Object.values(snapshot.val());
            followers = followers.length
            this.setState({followerNumber:followers});

            //console.log("brand length",followers);
        
        })
            
         
        firebase
        .database()
         .ref(`posts/`)
        .on("value", (snapshot) => {
        let posts;
        posts = Object.values(snapshot.val());
        posts = posts.length
        this.setState({postsNumber:posts});

        //console.log("brand length",followers);
    
    })



        }




    
    
      });
    }
    render(){
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
                       
            <View style={styles.statsContainerBox}>
                <View style={styles.statsBox}>
                    <Text style={[styles.textInfo, { fontSize: 24 }]}>{this.state.postsNumber}</Text>
                    <Text style={[styles.textInfo, styles.subTextInfo]}>Posts</Text>
                </View>
                <View style={[styles.statsBox, { borderColor: "#DFD8C8", borderLeftWidth: 2, borderRightWidth: 2 }]}>
                    <Text style={[styles.textInfo, { fontSize: 24 }]}>{this.state.followerNumber}</Text>
                    <Text style={[styles.textInfo, styles.subTextInfo]}>Followers</Text>
                </View>

                <View style={styles.statsBox}>
                    <Text style={[styles.textInfo, { fontSize: 24 }]}>{this.state.brandNumber}</Text>
                    <Text style={[styles.textInfo, styles.subTextInfo]}>Brands</Text>
                </View>
            </View>


            <View style={{backgroundColor:"black",  paddingBottom:20}}>
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

            
            
      <ListItem
        leftIcon={{ name: "instagram", type:"font-awesome" }}
        title={this.state.instagramusername}
        subtitle="Instagram Id"
        bottomDivider
      />
       
       <ListItem
        leftIcon={{ name: "twitter", type:"font-awesome" }}
        title={this.state.twitterusername}
        subtitle="Twitter Id"
        bottomDivider
      />
  
           
            

            
         


            
        </ScrollView>
    </SafeAreaView>
    )}
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
    statsContainerBox: {
        flexDirection: "row",
        alignSelf: "center",
        marginTop: 32,
        paddingBottom:15,
        paddingTop:15,
        backgroundColor:"#4b0082"
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

export default MandorHome;