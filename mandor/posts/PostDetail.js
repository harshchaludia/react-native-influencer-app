//import liraries
import React, { Component, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card, CardTitle, CardContent, CardAction, CardButton, CardImage } from 'react-native-cards';
import { Icon, Button, Overlay } from 'react-native-elements';
import * as firebase from "firebase";

// create a component
const PostDetail = ({post}) => {
  const [visible, setVisible] = useState(false);
  const act = "1"
  const toggleOverlay = () => {
    setVisible(!visible);
  };
    console.log(post)
    return (
      <View>{post.active==act?
        <Card>
    <CardImage 
      source={{uri: 'http://bit.ly/2GfzooV'}} 
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
        onPress={() => {toggleOverlay()}}
        title="Edit"
        color="#FEB557"
      />
      <Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
        <Text>Hello from Overlay!</Text>
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
</View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        marginBottom:20
    },
});

//make this component available to the app
export default PostDetail;
