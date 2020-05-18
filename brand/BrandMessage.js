import React from "react";
import {
  StyleSheet,
  Text,
  ScrollView,
  View,
  Button,
  TouchableOpacity,
} from "react-native";
import uuid from 'react-native-uuid';

import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons";
import * as firebase from "firebase";
import {
  Card,
  CardTitle,
  CardContent,
  CardAction,
  CardButton,
  CardImage,
} from "react-native-cards";
import ValidationComponent from "react-native-form-validator";

import { Input } from "react-native-elements";

class MessageListScreen extends React.Component {
  constructor() {
    super();
    this.state = { messageArray: [], ch: [] };
  }
   componentDidMount() {
    const uidb = firebase.auth().currentUser.uid;
    
    console.log("Del")
     firebase
      .database()
      .ref('/messages/'+ uidb)
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

  /*handleDelete= (i) => {
    
      var checked = this.state.messageArray;
      checked.splice(i, 1);
      this.setState({messageArray: checked});
      console.log(this.state.messageArray)
    
  }*/

  render() {
    

      //console.log(this.state.messageArray[i])
      
    
    return <ScrollView
    ref={ref => {this.scrollView = ref}}
    onContentSizeChange={() => this.scrollView.scrollToEnd({animated: true})}
    >{this.state.messageArray.map((msg, i) => {
      return (
        <View style={styles.container}>
        {msg.sender==msg.branduid ?<Card>
          <CardTitle subtitle="Brand:"/>
          <CardContent text={`Category: `+msg.messagecategory} />
          <CardContent text={msg.messagedescription} />
          <CardContent
            text={`Date--` + msg.messagedate + `  Time--` + msg.messagetime}
          />
          <CardContent text={msg.messageedit} />
          {msg.sender==msg.branduid ? <CardAction separator={true} inColumn={false}>
            <CardButton
              onPress={ async() => {
                console.log("success edit")
              await firebase
            .database()
            .ref('/messages/'+ msg.branduid)
            .orderByChild("messagetype")
            .equalTo("update")
            .on("value", (snapshot) => {
            if(snapshot.val()==null)
            {
              this.setState({ ch: [] })
            }
            else{
            this.setState({ch: Object.values(snapshot.val())})
            }
            });
            console.log(this.state.ch)
            if(this.state.ch.length > 0) {
              for(let ind = 0; ind < this.state.ch.length; ind++) {
                await firebase.database().ref(`/messages/`+ msg.branduid+ `/`+this.state.ch[ind].datetime).update({
                  messagetype:"created"
                });
              }
            }
                this.props.navigation.navigate("EditMessage", {
                  msg
                })
              //this.setState({messageArray:[]}) 
            }
              }
              title="Edit"
              color="#FEB557"
            />
            <CardButton 
            
            onPress={() => {
              console.log("delete success")
               firebase.database().ref(`/messages/`+msg.branduid+`/`+msg.datetime).remove()
               //this.props.navigation.navigate("Messages")
              }}

            title="Delete"
             color="#FEB557" />
          </CardAction> : <CardAction></CardAction>}
          
        </Card> : <Card style={{backgroundColor:"cyan"}}>
        <CardTitle subtitle="Mandor:" />
          <CardContent text={msg.messagedescription} />
          <CardContent
            text={`Date--` + msg.messagedate + `  Time--` + msg.messagetime}
          />
          <CardContent text={msg.messageedit} />
          
          
        </Card>}
      </View>
      )
    })}</ScrollView>;
  }
}

class SendMessageScreen extends ValidationComponent {
  constructor(props) {
    super(props);

    this.state = {
      messagecategory: "",
      messagedescription: "",
      messagedate: "",
      messagetime: "",
    };

    
  }

  _onPressButton = async () => {
    
    this.validate({
      messagecategory: { required: true },
      messagedescription: { required: true },
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
    let messagecategory = this.state.messagecategory;
    let messagedescription = this.state.messagedescription;

    //await firebase.auth().onAuthStateChanged(function (user) {
      const branduid = firebase.auth().currentUser.uid;
      const sender = branduid;

      await firebase.database().ref(`/messages/`+branduid+`/`+datetime).set({
        branduid,
        sender,
        datetime,
        messagecategory,
        messagedescription,
        messagedate,
        messagetime,
        messagetype: "created",
        messageedit: ""
      });
      this.setState({ messagecategory: "" });
    this.setState({ messagedescription: "" });

    this.props.navigation.navigate("Messages");
  };
  render() {
    return (
      <ScrollView>
        <View style={styles.containero}>
          <Text style={styles.headero}></Text>
          <Input
            label="Message Category"
            ref="messagecategory"
            onChangeText={(messagecategory) =>
              this.setState({ messagecategory })
            }
            value={this.state.messagecategory}
            style={styles.texto}
            placeholder="Description"
          />
          <Text style={{ color: "red" }}>
            {" "}
            {this.getErrorsInField("messagecategory")}{" "}
          </Text>
          <Input
            label="Message Description"
            ref="messagedescription"
            onChangeText={(messagedescription) =>
              this.setState({ messagedescription })
            }
            value={this.state.messagedescription}
            style={styles.texto}
            placeholder="Description"
          />
          <Text style={{ color: "red" }}>
            {" "}
            {this.getErrorsInField("messagedescription")}{" "}
          </Text>

          <TouchableOpacity>
            <Button
              onPress={this._onPressButton}
              title="submit"
              color="black"
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }
}

class EditMessageScreen extends ValidationComponent {
  constructor(props) {
    super(props);
    this.state = {
      datetime:"",
      messagecategory: "",
      messagedescription:"",
      messagedate: "",
      messagetime: "",
    };

    
  }
  handlePage = (msg) => {
    this.setState({ datetime: msg.datetime });
    this.setState({ messagecategory: msg.messagecategory });
    this.setState({ messagedescription: msg.messagedescription });
  }
  _onPressButton = async () => {
    if (!firebase.apps.length) {
      firebase.initializeApp({});
    }

    this.validate({
      messagecategory: {required: true},
      messagedescription: { required: true },
    });
    let datetime = this.state.datetime;
    let messagecategory = this.state.messagecategory;
    let messagedescription = this.state.messagedescription;
    const branduid = firebase.auth().currentUser.uid;
    const sender = branduid;

    console.log( branduid,
      messagedescription)

      await firebase.database().ref(`/messages/`+branduid+`/`+datetime).update({
        branduid,
        sender,
        messagecategory,
      messagedescription,
        messagetype:"created",
        messageedit:"Edited"
      });
      this.setState({ messagecategory: "" });
    this.setState({ messagedescription: "" });
    this.setState({ datetime: "" });

    this.props.navigation.navigate("Messages");
  };

  render() {
    const {msg} = this.props.navigation.state.params
    if(msg.messagetype == "created") {
      firebase.database().ref(`/messages/`+msg.branduid+`/`+msg.datetime).update({
        messagetype:"update"
      });
      msg.messagetype="update"
      this.handlePage(msg)
    }
    return (
      <ScrollView>
        <View style={styles.containero}>
          <Text style={styles.headero}></Text>
          <Input
            label="Message Category"
            ref="messagecategory"
            onChangeText={(messagecategory) =>
              this.setState({ messagecategory })
            }
            value={this.state.messagecategory}
            style={styles.texto}
            placeholder="Description"
          />
          <Text style={{ color: "red" }}>
            {" "}
            {this.getErrorsInField("messagecategory")}{" "}
          </Text>

          <Input
            label="Message Description"
            ref="messagedescription"
            onChangeText={(messagedescription) =>
              this.setState({ messagedescription })
            }
            value={this.state.messagedescription}
            style={styles.texto}
            placeholder="Description"
          />
          <Text style={{ color: "red" }}>
            {" "}
            {this.getErrorsInField("messagedescription")}{" "}
          </Text>
            <Button
              onPress={() => this._onPressButton()}
              title="submit"
              color="black"
            />
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
  },
});
const TabNavigator = createMaterialBottomTabNavigator(
  {
    Messages: {
      screen: MessageListScreen,
      navigationOptions: {
        tabBarLabel: "Messages",
        tabBarIcon: ({ tintColor }) => (
          <View>
            <Icon
              style={[{ color: tintColor }]}
              size={25}
              name={"ios-person"}
            />
          </View>
        ),
        activeColor: "#fff",
        inactiveColor: "#fff",
        barStyle: { backgroundColor: "purple" },
      },
    },

    Send: {
      screen: SendMessageScreen,
      navigationOptions: {
        
        tabBarLabel: "Send",
        tabBarIcon: ({ tintColor }) => (
          <View>
            <Icon
              style={[{ color: tintColor }]}
              size={25}
              name={"ios-person"}
            />
          </View>
        ),
        activeColor: "#fff",
        inactiveColor: "#fff",
        barStyle: { backgroundColor: "orange" },
      },
    },

    EditMessage: {
      screen: EditMessageScreen,
      navigationOptions: {
        tabBarLabel: "Edit",
        
        tabBarIcon: ({ tintColor }) => (
          <View>
            <Icon
              style={[{ color: tintColor }]}
              size={25}
              name={"ios-person"}
            />
          </View>
        ),
        activeColor: "#fff",
        inactiveColor: "#fff",
        barStyle: { backgroundColor: "pink" },
      },
    },
  },
  
  {
    initialRouteName: "Messages",
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarOnPress: ({ navigation, defaultHandler }) => {
        if (navigation.state.routeName === "EditMessage") {
          return null;
        }
        
        defaultHandler();
      }
    }),
    activeColor: "#f0edf6",
    inactiveColor: "#226557",
    barStyle: { backgroundColor: "#3BAD87" },
  }
);

export default TabNavigator;
