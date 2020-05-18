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
import { Icon } from "react-native-elements";


//For React Navigation 4+
import {createAppContainer} from 'react-navigation';
import {createDrawerNavigator} from 'react-navigation-drawer';
import {createStackNavigator} from 'react-navigation-stack';

//Import all the screens
import HomeScreen from '../master/HomeScreen';
import FeedScreen from '../master/FeedScreen';
import CampaignScreen from '../master/CampaignScreen';
import RewardsScreen from '../master/RewardsScreen';
import SettingScreen from '../master/SettingScreen';
import LogoutScreen from '../master/LogoutScreen';

//Import Custom Sidebar
import CustomSidebarMenu from '../master/CustomSidebarMenu';

global.currentScreenIndex = 0;
//Navigation Drawer Structure for all screen
class NavigationDrawerStructure extends Component {
  constructor() {
    super();
    this.state = { 
      uid: '',
       profileImageURL:"",
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
const HomeScreen_Activity = createStackNavigator({
  //All the screen from the First Option will be indexed here
  First: {
    screen: HomeScreen,
    navigationOptions: ({ navigation }) => ({
      title: 'Dashboard',
      headerLeft: <NavigationDrawerStructure navigationProps={navigation} />,
      headerStyle: {
        backgroundColor: '#FF9800',
      },
      headerTintColor: '#fff',
    }),
  },
});

//Stack Navigator for the Second Option of Navigation Drawer
const FeedScreen_Activity = createStackNavigator({
  //All the screen from the Second Option will be indexed here
  Second: {
    screen: FeedScreen,
    navigationOptions: ({ navigation }) => ({
      title: 'Feed',
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
const CampaignScreen_Activity = createStackNavigator({
  //All the screen from the Third Option will be indexed here
  Third: {
    screen: CampaignScreen,
    navigationOptions: ({ navigation }) => ({
      title: 'Campaign',
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
const RewardsScreen_Activity = createStackNavigator({
  //All the screen from the Third Option will be indexed here
  Fourth: {
    screen: RewardsScreen,
    navigationOptions: ({ navigation }) => ({
      title: 'Rewards',
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
const SettingScreen_Activity = createStackNavigator({
  //All the screen from the Third Option will be indexed here
  Five: {
    screen: SettingScreen,
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
const LogoutScreen_Activity = createStackNavigator({
  //All the screen from the Third Option will be indexed here
  Six: {
    screen: LogoutScreen,
    navigationOptions: ({ navigation }) => ({
      title: 'Exit',
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



export default class Home extends React.Component {
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
    NavScreen1: {
      screen: HomeScreen_Activity,
      navigationOptions: {
        drawerLabel: 'Home',
      },
    },
    NavScreen2: {
      screen: FeedScreen_Activity,
      navigationOptions: {
        drawerLabel: 'Feed',
      },
    },
    NavScreen3: {
      screen: CampaignScreen_Activity,
      navigationOptions: {
        drawerLabel: 'Campaigns',
      },
    },
    NavScreen4: {
        screen: RewardsScreen_Activity,
        navigationOptions: {
        drawerLabel: 'Rewards',
      },  
    },
    NavScreen5: {
      screen: SettingScreen_Activity,
      navigationOptions: {
        drawerLabel: 'Settings',
     },  
    },
      NavScreen6: {
        screen: LogoutScreen_Activity,
        navigationOptions: {
          drawerLabel: 'Exit',
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