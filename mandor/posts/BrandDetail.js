//import liraries
import React, { Component , useState} from 'react';
import { View, StyleSheet } from 'react-native';
import {ListItem, Overlay, CheckBox, Text } from "react-native-elements";
import {  Paragraph, Dialog, Portal } from 'react-native-paper';
import { Provider } from 'react-native-paper';
import { Button, Icon, ButtonGroup } from "react-native-elements";
import * as firebase from "firebase";



// create a component
const BrandDetail = (brand, i) => {

  
    const [visible, setVisible] = useState(false);
    const [checked, setChecked] = useState(false);

     const _onPressUpdateBrand = (checked, brand) => {
       console.log(checked, brand.brand.uid)
       let requestValue = checked
        firebase
          .database()
          .ref(`users/brand/` + brand.brand.uid)
          .update({
            requestValue, })

            setChecked(!checked);


    }
        

const toggleOverlay = () => {
  setVisible(!visible);

  if(brand.brand.requestValue)
  {
    console.log()
   setChecked(true);

  }
  else
  {
    setChecked(false);

  }
    };
  


    return (
      <View>
          
        <View style={styles.container}>
          
          <ListItem
        key={i}
        leftAvatar={{ source: { uri: brand.brand.profileImageURL } }}
        title={brand.brand.firstname +` `+ brand.brand.lastname}
        subtitle={brand.brand.brandname}
        bottomDivider
        chevron
        onPress={toggleOverlay}      />
      

          </View>
          <Overlay isVisible={visible} onBackdropPress={toggleOverlay} >
            <View style={{justifyContent:"center", alignItems:"center", textAlign:"center", flex:1, }}>
        
    <Text h4 >ACTIVE STATUS :</Text>
    <Text h4 >{brand.brand.requestValue.toString()}</Text>

        <CheckBox
        style={{marginTop:50}}
        center
        title='CHANGE STATUS'
  checkedIcon={<Icon
  
    name='check'
    type='font-awesome'
    color='#517fa4'
  />}
  uncheckedIcon={<Icon
    name='times'
    type='font-awesome'
    color='#517fa4'
  />}
  checked={checked}
  onPress={() => {_onPressUpdateBrand(checked,brand)}}
/>

        </View>
      </Overlay>
 
          </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        
        backgroundColor: '#2c3e50',
    },
});

//make this component available to the app
export default BrandDetail;
