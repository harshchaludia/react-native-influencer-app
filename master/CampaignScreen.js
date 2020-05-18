import FilterCampaign from "./campaigns/FilterCampaign"
import PastCampaign from "./campaigns/PastCampaigns"
  
import React, { useCallback, Component } from 'react'
import { View, ScrollView, Button } from 'react-native'
import { Text } from 'react-native-elements';
import { createNavigator, TabRouter } from 'react-navigation'
import BottomNavigation, {
  FullTab
} from 'react-native-material-bottom-navigation'
import * as firebase from 'firebase';
import { Card, CardTitle, CardContent, CardAction, CardButton, CardImage } from 'react-native-cards';
import { Overlay, Input, CheckBox, Icon } from 'react-native-elements';
import { TouchableOpacity } from "react-native-gesture-handler"
import SubscriberList from "./SubscriberList"


// Screens. Normally you would put these in separate files.
class CurrentScreen extends Component {
  constructor(){
    super();
    this.state = {postArray:[], subscribedPosts: [], ch: "0", visible: false, tasks: [], tasksCompleted: [], subscribersVisible: false, subscriberNames: [], description: "", postid: "", tasksToComplete: [], points: 0, rewards: 0, coupon: "", check: false};
}
componentDidMount = async () =>{
  const fid = firebase.auth().currentUser.uid
  await firebase.database().ref(`/users/followers/` + fid + `/subscribedPosts`).on('value',(snapshot)=>
  {
      if(snapshot.val() == null) {
        return
      }
      else {
        let ch = []
        this.setState({subscribedPosts: snapshot.val()})
        ch = snapshot.val()
        let postArr = []
        for(let i = 0; i < ch.length; i++){
          let pid = ch[i]
          firebase.database().ref(`/posts/`+pid).on('value',(snapshots)=>
          {
              if(snapshots.val() == null) {
                  return;
              }
              else {
                  let test = snapshots.val()
                  if(test.active == "1") {
                    var sdate = new Date(test.startdate)
                    var edate = new Date(test.enddate)
                    var today = new Date()
                    if(sdate <= today && edate >= today) {
                      postArr.push(test)
                    }
                  }
              }
          })
        }
        this.setState({postArray: postArr})
      }
  })
}

toggleSubscribersOverlay = async (subscriberIDs) => {
  
  for(let i = 0; i < subscriberIDs.length; i++) {
    const ref = firebase.storage().ref("images/"+subscriberIDs[i]+"userimage");
    let profileImageURL
    await ref.getDownloadURL().then(function(url) {
      profileImageURL = url
      console.log(profileImageURL)
    }).catch(function(error) {
      console.log("fail")
      profileImageURL = "https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg"
    })
    firebase.database().ref(`/users/followers/` + subscriberIDs[i] + `/firstname`).on('value',(snapshot)=>
    {
      if(snapshot.val() == null) {
        this.setState({subscriberNames: []})
      }
      else {
        var sNames = []
        sNames = this.state.subscriberNames
        const subObj = {}
        subObj.name = snapshot.val()
        subObj.avatar_url = profileImageURL
        sNames.push(subObj)
        this.setState({subscriberNames: sNames})
      }
    })
  }
  this.setState({subscribersVisible: !this.state.subscribersVisible})
}

toggleSubscribersOverlayBack = () => {
  this.setState({subscriberNames: []})
  this.setState({subscribersVisible: !this.state.subscribersVisible})
}

toggleOverlay = (post) => {
  this.setState({tasks: post.tasks})
  this.setState({postid: post.datetime})
  this.setState({description: post.description})
  this.setState({rewards: post.rewards})
  this.setState({coupon: post.coupon})
  const fid = firebase.auth().currentUser.uid
    firebase.database().ref(`/users/followers/` + fid + `/subscribedPostTasks/` + post.datetime + `/tasks`).on('value',(snapshot)=>
    {
      if(snapshot.val() == null) {
        this.setState({tasksCompleted: []})
      }
      else {
        this.setState({tasksCompleted: snapshot.val(), tasksToComplete: snapshot.val()})
      }
    })
    firebase.database().ref(`/users/followers/` + fid + `/points`).on('value',(snapshot)=>
    {
      if(snapshot.val() == null) {
        this.setState({points: 0})
      }
      else {
        this.setState({points: snapshot.val()})
      }
    })
    firebase.database().ref(`/users/followers/` + fid + `/couponsReceived/` + post.datetime).on('value',(snapshot)=>
    {
      if(snapshot.val() == null) {
        this.setState({check: false})
      }
      else {
        this.setState({check: true})
      }
    })
  this.setState({visible: !this.state.visible});
};

toggleOverlayBack = () => {
  this.setState({tasksCompleted: [], description: "", tasksToComplete: []})
  this.setState({visible: !this.state.visible});
};

onUnsubscribe = (post) => {
    const folid = firebase.auth().currentUser.uid
    const indPost = this.state.subscribedPosts.indexOf(post.datetime)
    const indUser = post.subscribedUsers.indexOf(folid)
    firebase.database().ref(`users/followers/`+folid+`/subscribedPostTasks/`+post.datetime).remove()
    const subscribedPosts = this.state.subscribedPosts
    subscribedPosts.splice(indPost, 1)
    const subscribedUsers = post.subscribedUsers
    subscribedUsers.splice(indUser, 1)
    firebase.database().ref(`posts/`+post.datetime).update({subscribedUsers})
    firebase.database().ref(`users/followers/`+folid).update({subscribedPosts})
}


  render() {
      if(this.state.ch == "0") {
      setTimeout (() => this.componentDidMount(), 250 )
      this.setState({ch: "1"})
      }
    return (
    <ScrollView><View style={{ flex: 1,
      backgroundColor: '#fff', padding: 15}}>
      {this.state.postArray.map((post) => {return(<View><Card>
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
        <CardButton
              onPress={() => {this.toggleSubscribersOverlay(post.subscribedUsers)}}
               title={`Subscribers (` + post.subscribedUsers.length + `)`}
               color="#fff"
               style={{backgroundColor:"orange"}}
             />
        <View style={{flexDirection:"row", alignSelf:"stretch"}}>
            
        <CardButton
        onPress={() => {this.onUnsubscribe(post)}}
         title="UNSUBSCRIBE"
         color="#fff"
         style={{backgroundColor:"gray"}}
       />
          
             <CardButton
              onPress={() => {this.toggleOverlay(post)}}
              title="Tasks"
              color="#fff"
              style={{backgroundColor:"violet"}}
              />
        </View>
        
      </Card><Overlay isVisible={this.state.visible} onBackdropPress={this.toggleOverlayBack}><ScrollView><Text h4 style={{marginHorizontal: 15}}>Description:</Text><Text style={{marginBottom: 20, marginHorizontal: 15}}>{this.state.description}</Text><Text h4 style={{marginHorizontal: 15}}>Tasks Completed:</Text>{this.state.tasksCompleted.map((task, i) => {return (!task ? <CheckBox
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
  title={this.state.tasks[i]}
  checked={this.state.tasksToComplete[i]}
  onPress={() => {if(!task) {let tasks = this.state.tasksToComplete
    tasks[i] = !this.state.tasksToComplete[i]
    this.setState({tasksToComplete: tasks})
  }}}
/>: <CheckBox 
title={this.state.tasks[i]}
checked={task}/>)})}{this.state.tasksCompleted.includes(false) ? <Button onPress={() => {const fid = firebase.auth().currentUser.uid;
  firebase.database().ref(`users/followers/`+fid+`/subscribedPostTasks/`+this.state.postid).update({tasks: this.state.tasksToComplete})
  if(!this.state.tasksToComplete.includes(false) && !this.state.check) {
    let p = this.state.points + this.state.rewards
    firebase.database().ref(`/users/followers/` + fid).update({points: p})
    firebase.database().ref(`/users/followers/` + fid + `/couponsReceived/` + this.state.postid).set({coupon: this.state.coupon})
  }
this.toggleOverlayBack()}} title="Update" color="orange"/>: <View></View>}<Text h4 style={{marginHorizontal: 15, marginTop: 20}}>Rewards:</Text><Text style={{marginBottom: 20, marginHorizontal: 15}}>{this.state.rewards}</Text></ScrollView>
              </Overlay><Overlay isVisible={this.state.subscribersVisible} onBackdropPress={() => {this.toggleSubscribersOverlayBack()}}><ScrollView><SubscriberList subObj={this.state.subscriberNames}/></ScrollView></Overlay></View>)
      }
      )}</View></ScrollView>
    )

    
  }
}
class FutureScreen extends Component {
  constructor(){
    super();
    this.state = {postArray:[], subscribedPosts: [], ch: "0", visible: false, tasks: [], tasksCompleted: [], subscribersVisible: false, subscriberNames: [], description: "", rewards: 0};
}
componentDidMount(){
    const fid = firebase.auth().currentUser.uid
    firebase.database().ref(`/users/followers/` + fid + `/subscribedPosts`).on('value',(snapshot)=>
    {
        if(snapshot.val() == null) {
          return
        }
        else {
          let ch = []
          this.setState({subscribedPosts: snapshot.val()})
          ch = snapshot.val()
          let postArr = []
          for(let i = 0; i < ch.length; i++){
            let pid = ch[i]
            firebase.database().ref(`/posts/`+pid).on('value',(snapshots)=>
            {
                if(snapshots.val() == null) {
                    return;
                }
                else {
                    let test = snapshots.val()
                    if(test.active == "1") {
                      var sdate = new Date(test.startdate)
                      var today = new Date()
                      if(sdate > today) {
                        postArr.push(test)
                      }
                    }
                }
            })
          }
          this.setState({postArray: postArr})
        }
    })
}

onUnsubscribe = (post) => {
    const folid = firebase.auth().currentUser.uid
    const indPost = this.state.subscribedPosts.indexOf(post.datetime)
    const indUser = post.subscribedUsers.indexOf(folid)
    firebase.database().ref(`users/followers/`+folid+`/subscribedPostTasks/`+post.datetime).remove()
    const subscribedPosts = this.state.subscribedPosts
    subscribedPosts.splice(indPost, 1)
    const subscribedUsers = post.subscribedUsers
    subscribedUsers.splice(indUser, 1)
    firebase.database().ref(`posts/`+post.datetime).update({subscribedUsers})
    firebase.database().ref(`users/followers/`+folid).update({subscribedPosts})
}

toggleSubscribersOverlay = async (subscriberIDs) => {
  
  for(let i = 0; i < subscriberIDs.length; i++) {
    const ref = firebase.storage().ref("images/"+subscriberIDs[i]+"userimage");
    let profileImageURL
    await ref.getDownloadURL().then(function(url) {
      profileImageURL = url
      console.log(profileImageURL)
    }).catch(function(error) {
      console.log("fail")
      profileImageURL = "https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg"
    })
    firebase.database().ref(`/users/followers/` + subscriberIDs[i] + `/firstname`).on('value',(snapshot)=>
    {
      if(snapshot.val() == null) {
        this.setState({subscriberNames: []})
      }
      else {
        var sNames = []
        sNames = this.state.subscriberNames
        const subObj = {}
        subObj.name = snapshot.val()
        subObj.avatar_url = profileImageURL
        sNames.push(subObj)
        this.setState({subscriberNames: sNames})
      }
    })
  }
  this.setState({subscribersVisible: !this.state.subscribersVisible})
}

toggleSubscribersOverlayBack = () => {
  this.setState({subscriberNames: []})
  this.setState({subscribersVisible: !this.state.subscribersVisible})
}

toggleOverlay = (post) => {
  this.setState({tasks: post.tasks})
  this.setState({rewards: post.rewards})
  this.setState({description: post.description})
  const fid = firebase.auth().currentUser.uid
    firebase.database().ref(`/users/followers/` + fid + `/subscribedPostTasks/` + post.datetime + `/tasks`).on('value',(snapshot)=>
    {
      if(snapshot.val() == null) {
        this.setState({tasksCompleted: []})
      }
      else {
        this.setState({tasksCompleted: snapshot.val()})
      }
    })
  this.setState({visible: !this.state.visible});
};

toggleOverlayBack = () => {
  this.setState({tasksCompleted: [], description: "", rewards: 0})
  this.setState({visible: !this.state.visible});
};

  render() {
    if(this.state.ch == "0") {
        setTimeout (() => this.componentDidMount(), 250 )
        this.setState({ch: "1"})
        }
    return (
        <ScrollView><View style={{ flex: 1,
            backgroundColor: '#fff', padding: 15}}>
            {this.state.postArray.map((post) => {return(<View><Card>
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
              onPress={() => {this.onUnsubscribe(post)}}
               title="UNSUBSCRIBE"
               color="#fff"
               style={{backgroundColor:"gray"}}
             />
                
              </View>
              <View style={{flexDirection:"row", alignSelf:"stretch"}}>
              <CardButton
              onPress={() => {this.toggleSubscribersOverlay(post.subscribedUsers)}}
               title={`Subscribers (` + post.subscribedUsers.length + `)`}
               color="#fff"
               style={{backgroundColor:"orange"}}
             />
             <CardButton
              onPress={() => {this.toggleOverlay(post)}}
              title="Tasks"
              color="#fff"
              style={{backgroundColor:"violet"}}
              />
              </View>
              
            </Card><Overlay isVisible={this.state.visible} onBackdropPress={this.toggleOverlayBack}><ScrollView><Text h4 style={{marginHorizontal: 15}}>Description:</Text><Text style={{marginBottom: 20, marginHorizontal: 15}}>{this.state.description}</Text><Text h4 style={{marginHorizontal: 15}}>Tasks Completed:</Text>{this.state.tasksCompleted.map((task, i) => {return (<CheckBox
  title={this.state.tasks[i]}
  checked={task}
/>)})}<Text h4 style={{marginHorizontal: 15, marginTop: 20}}>Rewards:</Text><Text style={{marginBottom: 20, marginHorizontal: 15}}>{this.state.rewards}</Text></ScrollView>
              </Overlay><Overlay isVisible={this.state.subscribersVisible} onBackdropPress={() => {this.toggleSubscribersOverlayBack()}}><ScrollView><SubscriberList subObj={this.state.subscriberNames}/></ScrollView></Overlay></View>)
            }
            )}</View></ScrollView>
    )}
}
class PastScreen extends Component {
  constructor(){
    super();
    this.state = {postArray:[], subscribedPosts: [], ch: "0", visible: false, tasks: [], tasksCompleted: [], subscribersVisible: false, subscriberNames: [], description: "", rewards: 0};
}
componentDidMount = async() => {
  const fid = firebase.auth().currentUser.uid
  await firebase.database().ref(`/users/followers/` + fid + `/subscribedPosts`).on('value',(snapshot)=>
  {
      if(snapshot.val() == null) {
        return
      }
      else {
        let ch = []
        this.setState({subscribedPosts: snapshot.val()})
        ch = snapshot.val()
        let postArr = []
        for(let i = 0; i < ch.length; i++){
          let pid = ch[i]
          firebase.database().ref(`/posts/`+pid).on('value',(snapshots)=>
          {
              if(snapshots.val() == null) {
                  return;
              }
              else {
                  let test = snapshots.val()
                  if(test.active == "1") {
                    var edate = new Date(test.enddate)
                    var today = new Date()
                    if(edate < today) {
                      postArr.push(test)
                    }
                  }
              }
          })
        }
        this.setState({postArray: postArr})
      }
  })
}

toggleSubscribersOverlay = async (subscriberIDs) => {
  
  for(let i = 0; i < subscriberIDs.length; i++) {
    const ref = firebase.storage().ref("images/"+subscriberIDs[i]+"userimage");
    let profileImageURL
    await ref.getDownloadURL().then(function(url) {
      profileImageURL = url
      console.log(profileImageURL)
    }).catch(function(error) {
      console.log("fail")
      profileImageURL = "https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg"
    })
    firebase.database().ref(`/users/followers/` + subscriberIDs[i] + `/firstname`).on('value',(snapshot)=>
    {
      if(snapshot.val() == null) {
        this.setState({subscriberNames: []})
      }
      else {
        var sNames = []
        sNames = this.state.subscriberNames
        const subObj = {}
        subObj.name = snapshot.val()
        subObj.avatar_url = profileImageURL
        sNames.push(subObj)
        this.setState({subscriberNames: sNames})
      }
    })
  }
  this.setState({subscribersVisible: !this.state.subscribersVisible})
}

toggleSubscribersOverlayBack = () => {
  this.setState({subscriberNames: []})
  this.setState({subscribersVisible: !this.state.subscribersVisible})
}

toggleOverlay = (post) => {
  this.setState({tasks: post.tasks})
  this.setState({description: post.description})
  this.setState({rewards: post.rewards})
  const fid = firebase.auth().currentUser.uid
    firebase.database().ref(`/users/followers/` + fid + `/subscribedPostTasks/` + post.datetime + `/tasks`).on('value',(snapshot)=>
    {
      if(snapshot.val() == null) {
        this.setState({tasksCompleted: []})
      }
      else {
        this.setState({tasksCompleted: snapshot.val()})
      }
    })
  this.setState({visible: !this.state.visible});
};

toggleOverlayBack = () => {
  this.setState({tasksCompleted: [], description: "", rewards: 0})
  this.setState({visible: !this.state.visible});
};

  render() {
    if(this.state.ch == "0") {
      setTimeout (() => this.componentDidMount(), 250 )
      this.setState({ch: "1"})
      }
    //const {postArr} = this.props.navigation.state.params
    //console.log(this.state.subscriberNames)
    return (
        <ScrollView><View style={{ flex: 1,
            backgroundColor: '#fff', padding: 15}}>
            {this.state.postArray.map((post) => {return(<View><Card>
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
              onPress={() => {this.toggleSubscribersOverlay(post.subscribedUsers)}}
               title={`Subscribers (` + post.subscribedUsers.length + `)`}
               color="#fff"
               style={{backgroundColor:"orange"}}
             />
             <CardButton
              onPress={() => {this.toggleOverlay(post)}}
              title="Tasks"
              color="#fff"
              style={{backgroundColor:"violet"}}
              />
              </View>
              
            </Card><Overlay isVisible={this.state.visible} onBackdropPress={this.toggleOverlayBack}><ScrollView><Text h4 style={{marginHorizontal: 15}}>Description:</Text><Text style={{marginBottom: 20, marginHorizontal: 15}}>{this.state.description}</Text><Text h4 style={{marginHorizontal: 15}}>Tasks Completed:</Text>{this.state.tasksCompleted.map((task, i) => {return (<CheckBox
  title={this.state.tasks[i]}
  checked={task}
/>)})}<Text h4 style={{marginHorizontal: 15, marginTop: 20}}>Rewards:</Text><Text style={{marginBottom: 20, marginHorizontal: 15}}>{this.state.rewards}</Text></ScrollView>
</Overlay><Overlay isVisible={this.state.subscribersVisible} onBackdropPress={() => {this.toggleSubscribersOverlayBack()}}><ScrollView><SubscriberList subObj={this.state.subscriberNames}/></ScrollView></Overlay></View>)
            }
            )}</View></ScrollView>
    )}
}


function AppTabView(props) {
  const tabs = [
    { key: 'Current', label: 'Current', barColor: '#00695C', icon: 'movie' },
    { key: 'Past', label: 'Past', barColor: '#6A1B9A', icon: 'music-note' },
    { key: 'Future', label: 'Future', barColor: '#1565C0', icon: 'book' },
  ]

  const { navigation, descriptors } = props
  const { routes, index } = navigation.state
  const activeScreenName = routes[index].key
  const descriptor = descriptors[activeScreenName]
  const ActiveScreen = descriptor.getComponent()

  const handleTabPress = useCallback(
    newTab => navigation.navigate(newTab.key),
    [navigation]
  )

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <ActiveScreen navigation={descriptor.navigation} />
      </View>

      <BottomNavigation
        tabs={tabs}
        activeTab={activeScreenName}
        onTabPress={handleTabPress}
        renderTab={({ tab, isActive }) => (
          <FullTab
            isActive={isActive}
            key={tab.key}
            label={tab.label}
            renderIcon={() => <Icon name={tab.icon} size={24} color="white" />}
          />
        )}
      />
    </View>
  )
}

const AppTabRouter = TabRouter({
  Current: CurrentScreen,
  Past: { screen: PastScreen },
  Future: { screen: FutureScreen },
})

const AppNavigator = createNavigator(AppTabView, AppTabRouter, {})

export default AppNavigator