import React from "react";
import {
  StyleSheet,
  Text,
  ScrollView,
  View
  } from "react-native";
import uuid from 'react-native-uuid';
import { Avatar, Button, Card, Title, Paragraph } from 'react-native-paper';
import { ListItem } from "react-native-elements";
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons";
import * as firebase from "firebase";
import {
  CardTitle,
  CardContent,
  CardAction,
  CardButton,
  CardImage,
} from "react-native-cards";
import ValidationComponent from "react-native-form-validator";

import { Input } from "react-native-elements";
const list = [
  {
    title: '50% off all food items at Krogers',
    icon: 'av-timer'
  },
  {
    title: '30% off all grocery items at Sprouts',
    icon: 'description'
  },
  {
    title: '75% off all mobile accessories',
    icon: 'av-timer'
  },
  {
    title: '45% off all toys at Hamleys',
    icon: 'copyright'
  },
  {
    title: '50% off all food items at Krogers',
    icon: 'build'
  },
  {
    title: '30% off all grocery items at Sprouts',
    icon: 'event'
  },
  {
    title: '75% off all mobile accessories',
    icon: 'copyright'
  },
  {
    title: '45% off all toys at Hamleys',
    icon: 'build'
  },
  {
    title: '50% off all food items at Krogers',
    icon: 'autorenew'
  },
  {
    title: '75% off all mobile accessories',
    icon: 'event'
  },
  {
    title: '45% off all toys at Hamleys',
    icon: 'done'
  },
  {
    title: '30% off all grocery items at Sprouts',
    icon: 'dns'
  },
  {
    title: '30% off all grocery items at Sprouts',
    icon: 'eject'
  }
]
class CouponScreen extends React.Component {
  constructor() {
    super();
    this.state = { coupons: [] };
  }

  componentDidMount(){
    const id = firebase.auth().currentUser.uid
    firebase.database().ref('users/followers/'+id+`/couponsReceived`).on('value',(snapshot)=>
    {
        if(snapshot.val() == null) {
            this.setState({coupons:[]})
        }
        else {
            this.setState({coupons: Object.values(snapshot.val())});
        }
    })
}
 
  render()
  
  {
    const LeftContent = props => <Avatar.Icon {...props} icon="tag" type="font-awesome"/>

    return(


      <ScrollView><View style={styles.container}>
          {this.state.coupons.map((couponcode) => {return (
          <Card style={{marginBottom:15}}>
            <Card.Title title="BestBuy" subtitle={"50% off on Computer Accessories"} left={LeftContent} />
            <Card.Cover source={{ uri: couponcode.profileImageURL }} />
            <Card.Actions>
              <Button>CODE :</Button>
              <Button>{couponcode.coupon}</Button>
            </Card.Actions>
          </Card>)})}



          </View>
          </ScrollView>
    )
  }
}


class DealsScreen extends React.Component {
  constructor() {
    super();
    this.state = { };
  }
  render()
  {
    return(
      <ScrollView>
      <View>
      {
        list.map((item, i) => (
          <ListItem
            key={i}
            title={item.title}
            leftIcon={{ name: item.icon }}
            bottomDivider
            chevron
          />
        ))
      }
    </View>
    </ScrollView>
    )
  }
}



const styles = StyleSheet.create({
  container: {
    backgroundColor:"lightgrey",
    padding: 20,
  },
});
const TabNavigator = createMaterialBottomTabNavigator(
  {
    Coupon: {
      screen: CouponScreen,
      navigationOptions: {
        tabBarLabel: "Coupon",
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

    Deals: {
      screen: DealsScreen,
      navigationOptions: {
        
        tabBarLabel: "Deals",
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

  
  },
  
  {
    initialRouteName: "Coupon",
    activeColor: "#f0edf6",
    inactiveColor: "#226557",
    barStyle: { backgroundColor: "#3BAD87" },
  }
);

export default TabNavigator;
