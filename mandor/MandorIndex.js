//This is an example code for Navigation Drawer with Custom Side bar//
import React, { Component } from 'react';
//import react in our code.
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  Platform,
  Text,
  Settings,
} from 'react-native';
// import all basic components

import { Icon } from 'react-native-elements'


//For React Navigation 4+
import {createAppContainer} from 'react-navigation';
import {createDrawerNavigator} from 'react-navigation-drawer';
import {createStackNavigator} from 'react-navigation-stack';

//Import all the screens
import MandorBrandList from "./MandorBrandList"
import MandorHome from "./MandorHome"
import MandorMessages from "./MandorMessages"
import MandorSettings from "./MandorSettings"
import MandorPost from "./MandorPost"
import MandorLogout from "./MandorLogout"

//Import Custom Sidebar
import CustomSidebarMenu from './CustomSidebarMenu';
import PostList from './posts/PostList';
import CreatePost from './posts/CreatePost';

global.currentScreenIndex = 0;
//Navigation Drawer Structure for all screen
class NavigationDrawerStructure extends Component {
  constructor() {
    super();
    this.state = { 
      uid: ''
    }
    
  }
  signOut = () => {
    firebase.auth().signOut().then(() => {
      this.props.navigation.navigate('Login')
    })
    .catch(error => this.setState({ errorMessage: error.message }))
  }  
  
  //Top Navigation Header with Donute Button
  toggleDrawer = () => {
    //Props to open/close the drawer
    this.props.navigationProps.toggleDrawer();
  };

  
  render() {
    return (
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity onPress={this.toggleDrawer.bind(this)}>
          {/*Donute Button Image */}
          <Image
            source={require('../assets/drawer.png')}
            style={{ width: 25, height: 25, marginLeft: 20 }}
          />
        </TouchableOpacity>
      
      </View>
      
    );
  }
}



//Stack Navigator for the First Option of Navigation Drawer
const MandorHome_Activity = createStackNavigator({
  //All the screen from the First Option will be indexed here
  First: {
    screen: MandorHome,
    navigationOptions: ({ navigation }) => ({
      title: 'Hey Mandor',
      headerLeft: <NavigationDrawerStructure navigationProps={navigation} />,
      
      headerStyle: {
        backgroundColor: '#FF9800',
      },
      headerTintColor: '#fff',
    }),
  },
});

//Stack Navigator for the Second Option of Navigation Drawer
const MandorMessages_Activity = createStackNavigator({
  //All the screen from the Second Option will be indexed here
  Second: {
    screen: MandorMessages,
    navigationOptions: ({ navigation }) => ({
      title: 'Messages',
      headerLeft: <NavigationDrawerStructure navigationProps={navigation} />,
      headerRight: (
        <Icon
  raised
  name='arrow-left'
  type='font-awesome'
  onPress={() => {navigation.goBack(null)}}
  />
      ),

      headerStyle: {
        backgroundColor: '#FF9800',
      },
      headerTintColor: '#fff',
    }),
  },
});

//Stack Navigator for the Third Option of Navigation Drawer
const MandorSettings_Activity = createStackNavigator({
  //All the screen from the Third Option will be indexed here
  Third: {
    screen: MandorSettings,
    navigationOptions: ({ navigation }) => ({
      title: 'Settings',
      headerLeft: <NavigationDrawerStructure navigationProps={navigation} />,
      headerRight: (
        <Icon
  raised
  name='arrow-left'
  type='font-awesome'
  onPress={() => {navigation.goBack(null)}}
  />
      ),
      headerStyle: {
        backgroundColor: '#FF9800',
      },
      headerTintColor: '#fff',
    }),
  },
});


//Stack Navigator for the Third Option of Navigation Drawer
const MandorPost_Activity = createStackNavigator({
  //All the screen from the Third Option will be indexed here
  Fourth: {
    screen: MandorPost,
    navigationOptions: ({ navigation }) => ({
      title: 'Post',
      headerLeft: <NavigationDrawerStructure navigationProps={navigation} />,
      headerRight: (
        <Icon
  raised
  name='arrow-left'
  type='font-awesome'
  onPress={() => {navigation.goBack(null)}}
  />
      ),
      headerStyle: {
        backgroundColor: '#FF9800',
      },
      headerTintColor: '#fff',
    }),
  },
});


//Stack Navigator for the Third Option of Navigation Drawer
const MandorBrandList_Activity = createStackNavigator({
  //All the screen from the Third Option will be indexed here
  Five: {
    screen: MandorBrandList,
    navigationOptions: ({ navigation }) => ({
      title: 'Brands',
      headerLeft: <NavigationDrawerStructure navigationProps={navigation} />,
      headerRight: (
        <Icon
  raised
  name='arrow-left'
  type='font-awesome'
  onPress={() => {navigation.goBack(null)}}
  />
      ),
      headerStyle: {
        backgroundColor: '#FF9800',
      },
      headerTintColor: '#fff',
    }),
  },
});


//Stack Navigator for the Third Option of Navigation Drawer
const MandorLogout_Activity = createStackNavigator({
  //All the screen from the Third Option will be indexed here
  Five: {
    screen: MandorLogout,
    navigationOptions: ({ navigation }) => ({
      title: 'Brands',
      headerLeft: <NavigationDrawerStructure navigationProps={navigation} />,
      headerRight: (
        <Icon
  raised
  name='arrow-left'
  type='font-awesome'
  onPress={() => {navigation.goBack(null)}}
  />
      ),
      headerStyle: {
        backgroundColor: '#FF9800',
      },
      headerTintColor: '#fff',
    }),
  },
});

//Stack Navigator for the Third Option of Navigation Drawer
const MandorPostList_Activity = createStackNavigator({
  //All the screen from the Third Option will be indexed here
  Six: {
    screen: PostList,
    navigationOptions: ({ navigation }) => ({
      title: 'Post List',
      headerLeft: <NavigationDrawerStructure navigationProps={navigation} />,
      headerRight: (
        <Icon
  raised
  name='arrow-left'
  type='font-awesome'
  onPress={() => {navigation.goBack(null)}}
  />
      ),
      headerStyle: {
        backgroundColor: '#FF9800',
      },
      headerTintColor: '#fff',
    }),
  },
});

const MandorCreatePost_Activity = createStackNavigator({
  //All the screen from the Third Option will be indexed here
  Six: {
    screen: CreatePost,
    navigationOptions: ({ navigation }) => ({
      title: 'Create Post',
      headerLeft: <NavigationDrawerStructure navigationProps={navigation} />,
      headerRight: (
        <Icon
  raised
  name='arrow-left'
  type='font-awesome'
  onPress={() => {navigation.goBack(null)}}
  />
      ),
      headerStyle: {
        backgroundColor: '#FF9800',
      },
      headerTintColor: '#fff',
    }),
  },
});






export default class MandorIndex extends React.Component {
  render() {
    return (
    
    
    <React.Fragment> 
    <AppContainer />
    
    </React.Fragment>
    
    );
  }
}

//Drawer Navigator Which will provide the structure of our App
const DrawerNavigatorExample = createDrawerNavigator(
  {
    //Drawer Optons and indexing
    MandorHome: {
      screen: MandorHome_Activity,
      navigationOptions: {
        drawerLabel: 'Home',
      },
    },
    MandorMessages: {
      screen: MandorMessages_Activity,
      navigationOptions: {
        drawerLabel: 'Messages',
      },
    },
    MandorSettings: {
      screen: MandorSettings_Activity,
      navigationOptions: {
        drawerLabel: 'Settings',
      },
    },
    MandorPost: {
        screen: MandorPost_Activity,
        navigationOptions: {
        drawerLabel: 'Post',
      },  
    },
    MandorBrands: {
      screen: MandorBrandList_Activity,
      navigationOptions: {
        drawerLabel: 'Brands',
     },  
    },
    MandorLogout: {
      screen: MandorLogout_Activity,
      navigationOptions: {
        drawerLabel: 'Logout',
     },  
    },
    NavScreen7: {
      screen: MandorPostList_Activity,
      navigationOptions: {
        drawerLabel: 'Post List',
     },
     
       
    },
    NavScreen8: {
      screen: MandorCreatePost_Activity,
      navigationOptions: {
        drawerLabel: 'Create Post',
     },
     
     
       
    },
  

  },
  {
    //For the Custom sidebar menu we have to provide our CustomSidebarMenu
    contentComponent: CustomSidebarMenu,
    //Sidebar width
    drawerWidth: Dimensions.get('window').width - 130,
  }
);
const AppContainer = createAppContainer(DrawerNavigatorExample);