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
  Button,
  Settings,
} from 'react-native';
// import all basic components
import { Icon } from 'react-native-elements'

//For React Navigation 4+
import {createAppContainer} from 'react-navigation';
import {createDrawerNavigator} from 'react-navigation-drawer';
import {createStackNavigator} from 'react-navigation-stack';

//Import all the screens
import BrandHome from "./BrandHome"
import BrandMessage from "./BrandMessage"
import BrandSettings from "./BrandSettings"
import BrandLogout from "./BrandLogout"
import BrandPricing from "./BrandPricing"
import BrandEdit from './message/SendMessage'

//Import Custom Sidebar
import CustomSidebarMenu from './CustomSidebarMenu';

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
const BrandHome_Activity = createStackNavigator({
  //All the screen from the First Option will be indexed here
  First: {
    screen: BrandHome,
    navigationOptions: ({ navigation }) => ({
      title: 'Hey Brand',
      headerLeft: <NavigationDrawerStructure navigationProps={navigation} />,
      headerStyle: {
        backgroundColor: '#FF9800',
      },
      headerTintColor: '#fff',
    }),
  },
});

//Stack Navigator for the Second Option of Navigation Drawer
const BrandMessage_Activity = createStackNavigator({
  //All the screen from the Second Option will be indexed here
  Second: {
    screen:  BrandMessage,
    navigationOptions: ({ navigation }) => ({
      title: 'Messages',
      headerLeft: <NavigationDrawerStructure navigationProps={navigation} />,
  
      headerStyle: {
        backgroundColor: '#FF9800',
      },
      headerTintColor: '#fff',
    }),
  },
});

//Stack Navigator for the Third Option of Navigation Drawer
const BrandSettings_Activity = createStackNavigator({
  //All the screen from the Third Option will be indexed here
  Third: {
    screen: BrandSettings,
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
const BrandPricing_Activity = createStackNavigator({
  //All the screen from the Third Option will be indexed here
  Fourth: {
    screen: BrandPricing,
    navigationOptions: ({ navigation }) => ({
      title: 'Pricing',
      headerLeft: <NavigationDrawerStructure navigationProps={navigation} />,
      headerStyle: {
        backgroundColor: '#FF9800',
      },
      headerTintColor: '#fff',
    }),
  },
});

//Stack Navigator for the Third Option of Navigation Drawer
const BrandLogout_Activity = createStackNavigator({
  //All the screen from the Third Option will be indexed here
  Fifth: {
    screen: BrandLogout,
    navigationOptions: ({ navigation }) => ({
      title: 'Logout',
      headerLeft: <NavigationDrawerStructure navigationProps={navigation} />,
      headerStyle: {
        backgroundColor: '#FF9800',
      },
      headerTintColor: '#fff',
    }),
  },
});

//Stack Navigator for the Third Option of Navigation Drawer
const BrandEdit_Activity = createStackNavigator({
  //All the screen from the Third Option will be indexed here
  Sixth: {
    screen: BrandEdit,
    navigationOptions: ({ navigation }) => ({
      title: 'Edit',
      headerLeft: <NavigationDrawerStructure navigationProps={navigation} />,
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
    Home: {
      screen: BrandHome_Activity,
      navigationOptions: {
        drawerLabel: 'Home',
      },
    },
    Message: {
      screen: BrandMessage_Activity,
      navigationOptions: {
        drawerLabel: 'Messages',
      },
    },
    Settings: {
      screen: BrandSettings_Activity,
      navigationOptions: {
        drawerLabel: 'Settings',
      },
    },
    Pricing: {
      screen: BrandPricing_Activity,
      navigationOptions: {
        drawerLabel: 'Pricing',
      },
    },
    Logout: {
      screen: BrandLogout_Activity,
      navigationOptions: {
        drawerLabel: 'Logout',
      },
    },
    BrandEdit: {
      screen: BrandEdit_Activity,
      navigationOptions: {
        drawerLabel: 'Logout',
      },
    }
    
     
    
    
  },
  {
    //For the Custom sidebar menu we have to provide our CustomSidebarMenu
    contentComponent: CustomSidebarMenu,
    //Sidebar width
    drawerWidth: Dimensions.get('window').width - 130,
  }
);
const AppContainer = createAppContainer(DrawerNavigatorExample);