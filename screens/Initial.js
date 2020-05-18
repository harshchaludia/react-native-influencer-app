import React, { Component } from 'react'
import { AppLoading } from 'expo'
import { Asset } from 'expo-asset'
import * as Font from 'expo-font'
import * as Icon from '@expo/vector-icons'
import { withFirebaseHOC } from '../config/Firebase'
import * as firebase from 'firebase';

class Initial extends Component {
  state = {
    isAssetsLoadingComplete: false,
    
  }
  

  componentDidMount = async () => {
   
    try {
      // previously
      this.loadLocalAsync()

      await this.props.firebase.checkUserAuth(user => {
        
        if(user)  {
          let userBrand;
          let userFollower;
          let usermandor;
          
          firebase.database().ref(`users/followers/`+user.uid).on('value',(snapshot)=>
        {
          userFollower = snapshot.val();
          if(userFollower==null)
          {
            userFollower=""
          }
          else {
            if (!firebase.apps.length) {
              firebase.initializeApp({});
           }
            this.props.navigation.navigate('App')
            return
          }
          //console.log(userFollower.type)
          
        })

        firebase.database().ref(`users/brand/`+user.uid).on('value',(snapshot)=>
        {
          
          userBrand = snapshot.val();
          if(userBrand==null || userBrand==undefined)
          {
            //console.log("Success")

            userBrand=""
          }
          else {
            if (!firebase.apps.length) {
              firebase.initializeApp({});
           }
            this.props.navigation.navigate('BrandIndex')
          }

          
        })

        firebase.database().ref(`users/mandor/`+user.uid).on('value',(snapshot)=>
        {
          
          usermandor = snapshot.val();
          if(usermandor==null)
          {
            usermandor=""
          }
          else {
            if (!firebase.apps.length) {
              firebase.initializeApp({});
           }
            this.props.navigation.navigate('MandorIndex')
          }
          

         // console.log("userBrand--",userBrand)

        })

  
      

        }
      
        
        else {
          // if the user has previously signed out from the app
          this.props.navigation.navigate('Auth')
        }
      
      })
    } catch (error) {
      console.log(error)
    }
  }

  loadLocalAsync = async () => {
    return await Promise.all([
      Asset.loadAsync([
        require('../assets/flame.png'),
        require('../assets/icon.png')
      ]),
      Font.loadAsync({
        ...Icon.Ionicons.font
      })
    ])
  }

  handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error)
  }

  handleFinishLoading = () => {
    this.setState({ isAssetsLoadingComplete: true })
  }

  render() {
    return (
      <AppLoading
        startAsync={this.loadLocalAsync}
        onFinish={this.handleFinishLoading}
        onError={this.handleLoadingError}
      />
    )
  }
}

export default withFirebaseHOC(Initial)
