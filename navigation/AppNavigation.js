import { createStackNavigator } from 'react-navigation-stack'
import Home from '../screens/Home'
import { createSwitchNavigator } from 'react-navigation'



const AppNavigation = createSwitchNavigator(
  {
    Home: { screen: Home },

  },
  {
    initialRouteName: 'Home'
  }
)

export default AppNavigation
