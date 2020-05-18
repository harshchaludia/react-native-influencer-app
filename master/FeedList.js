//import liraries
import React, { Component,useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card, CardTitle, CardContent, CardAction, CardButton, CardImage } from 'react-native-cards';

// create a component
const FeedList = ({post, users}) => {
    let [setCount] = useState("");

    
    //console.log(post)
    return (
            <View>
     {
  users.map(() => {
    return (
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
    <View style={{flexDirection:"row", alignSelf:"stretch"}}>
      
       <CardButton
        title="SUBSCRIBE"
        color="#fff"
        style={{backgroundColor:"orange"}}
      />
      <CardButton
        onPress={() => {}}
        title="Open"
        color="#fff"
        style={{backgroundColor:"violet", alignSelf:"flex-end",textAlign: 'right', alignItems: 'flex-end'}}
      />
    </View>
    
  </Card>
    )
  })

}
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
export default FeedList;
