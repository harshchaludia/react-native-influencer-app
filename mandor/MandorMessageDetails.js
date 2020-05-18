//import liraries
import React, { Component, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as firebase from 'firebase';
import {ListItem} from "react-native-elements";

// create a component
const MandorMessageDetails = ({msg}) => {
  const [brandObj, setBrandObj] = useState({})
  const [ch, setCh] = useState('0')
  if(ch == '0') {
  firebase.database().ref(`/users/brand/`+msg).on('value',(snapshot)=>
  {
    setBrandObj(snapshot.val());
    setCh('1');
  })
}
  
    return (
      <View style={styles.container}>
      <ListItem
    key={msg.branduid}
    leftAvatar={{ source: { uri: brandObj.profileImageURL} }}
    title={brandObj.firstname +` `+ brandObj.lastname}
    subtitle={brandObj.brandname}
    bottomDivider
  />
    </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2c3e50',
    },
});

//make this component available to the app
export default MandorMessageDetails;
