import { createSwitchNavigator, createAppContainer } from 'react-navigation'
import Initial from '../screens/Initial'
import AuthNavigation from './AuthNavigation'
import AppNavigation from './AppNavigation'
import BrandIndex from '../brand/BrandIndex'
import MandorIndex from '../mandor/MandorIndex'



const SwitchNavigator = createSwitchNavigator(
  {
    Initial: Initial,
    Auth: AuthNavigation,
    App: AppNavigation,
    BrandIndex : BrandIndex,
    MandorIndex : MandorIndex

  
  },
  {
    initialRouteName: 'Initial'
  }
)

const AppContainer = createAppContainer(SwitchNavigator)

export default AppContainer
