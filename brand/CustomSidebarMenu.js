//This is an example code for Navigation Drawer with Custom Side bar//
import React, { Component } from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';

export default class CustomSidebarMenu extends Component {
  constructor() {
    super();
    this.state = {
      profileImageURL:""
    }
    //Setting up the Main Top Large Image of the Custom Sidebar
    this.proileImage =
      'https://www.pngitem.com/pimgs/m/146-1468465_early-signs-of-conception-user-profile-icon-hd.png';
    //Array of the sidebar navigation option with icon and screen to navigate
    //This screens can be any screen defined in Drawer Navigator in App.js
    //You can find the Icons from here https://material.io/tools/icons/
    this.items = [
      {
        navOptionThumb: 'dashboard',
        navOptionName: 'Home',
        screenToNavigate: 'Home',
      },
      {
        navOptionThumb: 'envelope',
        navOptionName: 'Messages',
        screenToNavigate: 'Message',
      },
      {
        navOptionThumb: 'cog',
        navOptionName: 'Settings',
        screenToNavigate: 'Settings',
      },
      {
        navOptionThumb: 'tag',
        navOptionName: 'Pricing',
        screenToNavigate: 'Pricing',
      },
      {
        navOptionThumb: 'sign-out',
        navOptionName: 'Logout',
        screenToNavigate: 'Logout',
      }
     
      
    ];
  }
  componentDidMount = async() => {
    const uid = firebase.auth().currentUser.uid;
    await firebase
      .database()
      .ref(`users/brand/` + uid)
      .on("value", (snapshot) => {
        let testDrawer;
        testDrawer = snapshot.val();
        if(testDrawer==undefined)
        {
          return
        }
        else{
        this.setState({profileImageURL: testDrawer.profileImageURL})}
      })
      
  }
  render() {
    return (
      <View style={styles.sideMenuContainer}>
        {/*Top Large Image */}
        <Image
            source={{ uri: this.state.profileImageURL }}
            style={styles.sideMenuProfileIcon}
        />
        {/*Divider between Top Image and Sidebar Option*/}
        <View
          style={{
            width: '100%',
            height: 1,
            backgroundColor: '#e2e2e2',
            marginTop: 25,
          }}
        />
        {/*Setting up Navigation Options from option array using loop*/}
        <View style={{ width: '100%' }} >
          {this.items.map((item, key) => (
            <View
            
              style={{
                paddingTop: 10,
                paddingBottom: 10,
                backgroundColor: global.currentScreenIndex === key ? '#e0dbdb' : '#ffffff',
              }}
              key={key}>

            <View
             
                style={{
                flexDirection: 'row',
                alignItems: 'center',}}
                >


              <View style={{ marginRight: 10, marginLeft: 20 }}>
                <Icon name={item.navOptionThumb} type="font-awesome" size={25} color="#808080" />
              </View>
              <TouchableOpacity
              style={{
                flex: 1,
              }}
              onPress={() => {
                global.currentScreenIndex = key;
                this.props.navigation.navigate(item.screenToNavigate);
              }}
              
              >
              <Text
                style={{
                  fontSize: 15,
                  color: global.currentScreenIndex === key ? 'red' : 'black',
                }}
               
                
                >
                {item.navOptionName}
              </Text>
              </TouchableOpacity>

</View>


            </View>
          ))}
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  sideMenuContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 20,
  },
  sideMenuProfileIcon: {
    resizeMode: 'center',
    width: 150,
    height: 150,
    marginTop: 20,
    borderRadius: 150 / 2,
  },
});