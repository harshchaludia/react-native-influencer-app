//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Icon, Button } from 'react-native-elements';
import * as firebase from 'firebase';
import BrandDetail from './posts/BrandDetail';

// create a component
class MandorBrandList extends Component{
    constructor(){
        super();
        this.state = {brandArray:[]};
    }
    componentDidMount(){
        firebase.database().ref('/users/brand').on('value',(snapshot)=>
        {
        this.setState({brandArray: Object.values(snapshot.val())});
           })
    }


    render(){
        var brands =[]
        for(let i = 0; i < this.state.brandArray.length; i++) {
            brands.push(
                <BrandDetail brand={this.state.brandArray[i]} key={i} />
            )
        }
    return (
        <View style={styles.container}>
            <ScrollView>{brands}</ScrollView>
        </View>
    )}
};

// define your styles
const styles = StyleSheet.create({
    container: {
       
        backgroundColor: '#2c3e50',
    },
});

//make this component available to the app
export default MandorBrandList;
