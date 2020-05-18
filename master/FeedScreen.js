//import liraries
import React, { Component ,useCallback } from 'react';
import { View, StyleSheet, ScrollView,Picker, SafeAreaView } from 'react-native';
import { TouchableOpacity } from 'react-native';
import * as firebase from 'firebase';
import { Card, CardTitle, CardContent, CardAction, CardButton, CardImage } from 'react-native-cards';
import SubscriberList from "./SubscriberList"
import { Overlay, Text, Icon } from 'react-native-elements';
import { createNavigator, TabRouter } from 'react-navigation'
import BottomNavigation, {
  FullTab
} from 'react-native-material-bottom-navigation'

// create a component
class FeedScreen extends Component{
    constructor(){
        super();
        this.state = {postArray:[], subscribedPosts:[], ch: "0", visible: false, subscribersVisible: false, subscriberNames: [], description: "", rewards: 0, tasks: []};
    }

    componentDidMount(){
        const id = firebase.auth().currentUser.uid
        firebase.database().ref('posts/').on('value',(snapshot)=>
        {
            if(snapshot.val() == null) {
                this.setState({postArray:[]})
            }
            else {
                this.setState({postArray: Object.values(snapshot.val())});
            }
        })
        firebase.database().ref('users/followers/'+id+`/subscribedPosts`).on('value',(snapshot)=>
        {
            if(snapshot.val() == null) {
                this.setState({subscribedPosts:[]})
            }
            else {
                this.setState({subscribedPosts: Object.values(snapshot.val())});
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

    onSubscribe = (post) => {
        let postLen = post.tasks.length
        var tasks = []
        for(let m = 0; m < postLen; m++) {
            tasks[m] = false
        }
        const fid = firebase.auth().currentUser.uid;
        let subscribedUsers = []
        if(post.subscribedUsers != undefined) {
            subscribedUsers = post.subscribedUsers
        }
        subscribedUsers.push(fid)
        firebase.database().ref(`posts/`+post.datetime).update({subscribedUsers})
        let subscribedPosts = this.state.subscribedPosts
        subscribedPosts.push(post.datetime)
        firebase.database().ref(`users/followers/`+fid).update({subscribedPosts})
        firebase.database().ref(`users/followers/`+fid+`/subscribedPostTasks/`+post.datetime).set({tasks})
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
        this.setState({visible: !this.state.visible});
      }
      
      toggleOverlayBack = () => {
        this.setState({tasksCompleted: [], description: "", rewards: 0})
        this.setState({visible: !this.state.visible});
      };

    render(){
        if(this.state.ch == "0") {
            setTimeout (() => this.componentDidMount(), 250 )
            this.setState({ch: "1"})
            }
        const act = "1"
        const fuid = firebase.auth().currentUser.uid;
    return (
      <ScrollView>

            <View style={{ flex: 1,
        backgroundColor: '#fff', padding: 15}}>
                {this.state.postArray.map((post, i) => {
            return (
                <View>{post.active==act?<Card>
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
        {post.subscribedUsers == undefined? <CardButton
       onPress={() => {this.onSubscribe(post)}}
        title="SUBSCRIBE"
        color="#fff"
        style={{backgroundColor:"orange"}}
      />:post.subscribedUsers.includes(fuid)?
    <CardButton
    onPress={() => {this.onUnsubscribe(post)}}
     title="UNSUBSCRIBE"
     color="#fff"
     style={{backgroundColor:"gray"}}
   />:
       <CardButton
       onPress={() => {this.onSubscribe(post)}}
        title="SUBSCRIBE"
        color="#fff"
        style={{backgroundColor:"orange"}}
      />}
    </View>
    <View style={{flexDirection:"row", alignSelf:"stretch"}}>
              {post.subscribedUsers != undefined ?<CardButton
              onPress={() => {this.toggleSubscribersOverlay(post.subscribedUsers)}}
               title={`Subscribers (` + post.subscribedUsers.length + `)`}
               color="#fff"
               style={{backgroundColor:"orange"}}
             />: <CardButton
             onPress={() => {}}
              title={"Subscribers (0)"}
              color="#fff"
              style={{backgroundColor:"orange"}}
            />}
             <CardButton
              onPress={() => {this.toggleOverlay(post)}}
              title="Tasks"
              color="#fff"
              style={{backgroundColor:"violet"}}
              />
              </View>
    
  </Card>:<View></View>}
        <Overlay isVisible={this.state.visible} onBackdropPress={this.toggleOverlayBack}><ScrollView><Text h4 style={{marginHorizontal: 15}}>Description:</Text><Text style={{marginBottom: 20, marginHorizontal: 15}}>{this.state.description}</Text><Text h4 style={{marginHorizontal: 15}}>Tasks:</Text>{this.state.tasks.map((task, i) => {return (<Text style={{marginHorizontal: 15}}>{task}</Text>
  )})}<Text h4 style={{marginHorizontal: 15, marginTop: 20}}>Rewards:</Text><Text style={{marginBottom: 20, marginHorizontal: 15}}>{this.state.rewards}</Text></ScrollView>
              </Overlay><Overlay isVisible={this.state.subscribersVisible} onBackdropPress={() => {this.toggleSubscribersOverlayBack()}}><ScrollView><SubscriberList subObj={this.state.subscriberNames}/></ScrollView></Overlay></View>
                )
                })}
                

            </View>       
                 </ScrollView>

    )};
};

class FilterScreen extends Component{
    constructor(){
        super();
        this.state = {postArray:[], subscribedPosts:[], ch: "0", visible: false, subscribersVisible: false, subscriberNames: [], description: "", rewards: 0, tasks: [], category: ""};
    }

    componentDidMount(){
        const id = firebase.auth().currentUser.uid
        firebase.database().ref('posts/').on('value',(snapshot)=>
        {
            if(snapshot.val() == null) {
                this.setState({postArray:[]})
            }
            else {
                this.setState({postArray: Object.values(snapshot.val())});
            }
        })
        firebase.database().ref('users/followers/'+id+`/subscribedPosts`).on('value',(snapshot)=>
        {
            if(snapshot.val() == null) {
                this.setState({subscribedPosts:[]})
            }
            else {
                this.setState({subscribedPosts: Object.values(snapshot.val())});
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

    onSubscribe = (post) => {
        let postLen = post.tasks.length
        var tasks = []
        for(let m = 0; m < postLen; m++) {
            tasks[m] = false
        }
        const fid = firebase.auth().currentUser.uid;
        let subscribedUsers = []
        if(post.subscribedUsers != undefined) {
            subscribedUsers = post.subscribedUsers
        }
        subscribedUsers.push(fid)
        firebase.database().ref(`posts/`+post.datetime).update({subscribedUsers})
        let subscribedPosts = this.state.subscribedPosts
        subscribedPosts.push(post.datetime)
        firebase.database().ref(`users/followers/`+fid).update({subscribedPosts})
        firebase.database().ref(`users/followers/`+fid+`/subscribedPostTasks/`+post.datetime).set({tasks})
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
        this.setState({visible: !this.state.visible});
      }
      
      toggleOverlayBack = () => {
        this.setState({tasksCompleted: [], description: "", rewards: 0})
        this.setState({visible: !this.state.visible});
      };

    render(){
        if(this.state.ch == "0") {
            setTimeout (() => this.componentDidMount(), 250 )
            this.setState({ch: "1"})
            }
        const act = "1"
        const fuid = firebase.auth().currentUser.uid;
    return (
        
      <ScrollView>
          <Picker        
        label = "Category"
        ref="picker"

        selectedValue = {this.state.category}
        style={{marginBottom:20}}
        onValueChange={(itemValue, itemPosition) =>  
        this.setState({category: itemValue})}  
              >  
              <Picker.Item label="Select Plan.." value="" />  
              <Picker.Item label="Music" value="music" />  
              <Picker.Item label="Education" value="education" />   
              <Picker.Item label="Food" value="food" />  
              <Picker.Item label="Apparels" value="apparels" /> 
              <Picker.Item label="Kids" value="kids" /> 
              <Picker.Item label="e-commerce" value="e-commerce" /> 
              <Picker.Item label="Travel" value="travel" /> 
              <Picker.Item label="Occassion" value="occassion" /> 
    </Picker>
            <View style={{ flex: 1,
        backgroundColor: '#fff', padding: 15}}>
                {this.state.postArray.map((post, i) => {
            return (
                <View>{post.active==act ? post.category == this.state.category ?<Card>
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
        {post.subscribedUsers == undefined? <CardButton
       onPress={() => {this.onSubscribe(post)}}
        title="SUBSCRIBE"
        color="#fff"
        style={{backgroundColor:"orange"}}
      />:post.subscribedUsers.includes(fuid)?
    <CardButton
    onPress={() => {this.onUnsubscribe(post)}}
     title="UNSUBSCRIBE"
     color="#fff"
     style={{backgroundColor:"gray"}}
   />:
       <CardButton
       onPress={() => {this.onSubscribe(post)}}
        title="SUBSCRIBE"
        color="#fff"
        style={{backgroundColor:"orange"}}
      />}
    </View>
    <View style={{flexDirection:"row", alignSelf:"stretch"}}>
              {post.subscribedUsers != undefined ?<CardButton
              onPress={() => {this.toggleSubscribersOverlay(post.subscribedUsers)}}
               title={`Subscribers (` + post.subscribedUsers.length + `)`}
               color="#fff"
               style={{backgroundColor:"orange"}}
             />: <CardButton
             onPress={() => {}}
              title={"Subscribers (0)"}
              color="#fff"
              style={{backgroundColor:"orange"}}
            />}
             <CardButton
              onPress={() => {this.toggleOverlay(post)}}
              title="Tasks"
              color="#fff"
              style={{backgroundColor:"violet"}}
              />
              </View>
    
  </Card>:<View></View>:<View></View>}
        <Overlay isVisible={this.state.visible} onBackdropPress={this.toggleOverlayBack}><ScrollView><Text h4 style={{marginHorizontal: 15}}>Description:</Text><Text style={{marginBottom: 20, marginHorizontal: 15}}>{this.state.description}</Text><Text h4 style={{marginHorizontal: 15}}>Tasks:</Text>{this.state.tasks.map((task, i) => {return (<Text style={{marginHorizontal: 15}}>{task}</Text>
  )})}<Text h4 style={{marginHorizontal: 15, marginTop: 20}}>Rewards:</Text><Text style={{marginBottom: 20, marginHorizontal: 15}}>{this.state.rewards}</Text></ScrollView>
              </Overlay><Overlay isVisible={this.state.subscribersVisible} onBackdropPress={() => {this.toggleSubscribersOverlayBack()}}><ScrollView><SubscriberList subObj={this.state.subscriberNames}/></ScrollView></Overlay></View>
                )
                })}
                

            </View>       
                 </ScrollView>

    )};
};

class PersonalizedScreen extends Component{
    constructor(){
        super();
        this.state = {postArray:[], subscribedPosts:[], ch: "0", visible: false, subscribersVisible: false, subscriberNames: [], description: "", rewards: 0, tasks: [], category: []};
    }

    componentDidMount(){
        const id = firebase.auth().currentUser.uid
        firebase.database().ref('posts/').on('value',(snapshot)=>
        {
            if(snapshot.val() == null) {
                this.setState({postArray:[]})
            }
            else {
                this.setState({postArray: Object.values(snapshot.val())});
            }
        })
        firebase.database().ref('users/followers/'+id+`/subscribedPosts`).on('value',(snapshot)=>
        {
            if(snapshot.val() == null) {
                this.setState({subscribedPosts:[]})
            }
            else {
                this.setState({subscribedPosts: Object.values(snapshot.val())});
            }
        })
        firebase.database().ref('users/followers/'+id+`/Interests`).on('value',(snapshot)=>
        {
            if(snapshot.val() == null) {
                this.setState({category:[]})
            }
            else {
                this.setState({category: Object.values(snapshot.val())});
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

    onSubscribe = (post) => {
        let postLen = post.tasks.length
        var tasks = []
        for(let m = 0; m < postLen; m++) {
            tasks[m] = false
        }
        const fid = firebase.auth().currentUser.uid;
        let subscribedUsers = []
        if(post.subscribedUsers != undefined) {
            subscribedUsers = post.subscribedUsers
        }
        subscribedUsers.push(fid)
        firebase.database().ref(`posts/`+post.datetime).update({subscribedUsers})
        let subscribedPosts = this.state.subscribedPosts
        subscribedPosts.push(post.datetime)
        firebase.database().ref(`users/followers/`+fid).update({subscribedPosts})
        firebase.database().ref(`users/followers/`+fid+`/subscribedPostTasks/`+post.datetime).set({tasks})
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
        this.setState({visible: !this.state.visible});
      }
      
      toggleOverlayBack = () => {
        this.setState({tasksCompleted: [], description: "", rewards: 0})
        this.setState({visible: !this.state.visible});
      };

    render(){
        if(this.state.ch == "0") {
            setTimeout (() => this.componentDidMount(), 250 )
            this.setState({ch: "1"})
            }
        const act = "1"
        const fuid = firebase.auth().currentUser.uid;
    return (
        
      <ScrollView>
            <View style={{ flex: 1,
        backgroundColor: '#fff', padding: 15}}>
                {this.state.postArray.map((post, i) => {
            return (
                <View>{post.active==act ? this.state.category.includes(post.category) ?<Card>
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
        {post.subscribedUsers == undefined? <CardButton
       onPress={() => {this.onSubscribe(post)}}
        title="SUBSCRIBE"
        color="#fff"
        style={{backgroundColor:"orange"}}
      />:post.subscribedUsers.includes(fuid)?
    <CardButton
    onPress={() => {this.onUnsubscribe(post)}}
     title="UNSUBSCRIBE"
     color="#fff"
     style={{backgroundColor:"gray"}}
   />:
       <CardButton
       onPress={() => {this.onSubscribe(post)}}
        title="SUBSCRIBE"
        color="#fff"
        style={{backgroundColor:"orange"}}
      />}
    </View>
    <View style={{flexDirection:"row", alignSelf:"stretch"}}>
              {post.subscribedUsers != undefined ?<CardButton
              onPress={() => {this.toggleSubscribersOverlay(post.subscribedUsers)}}
               title={`Subscribers (` + post.subscribedUsers.length + `)`}
               color="#fff"
               style={{backgroundColor:"orange"}}
             />: <CardButton
             onPress={() => {}}
              title={"Subscribers (0)"}
              color="#fff"
              style={{backgroundColor:"orange"}}
            />}
             <CardButton
              onPress={() => {this.toggleOverlay(post)}}
              title="Tasks"
              color="#fff"
              style={{backgroundColor:"violet"}}
              />
              </View>
    
  </Card>:<View></View>:<View></View>}
        <Overlay isVisible={this.state.visible} onBackdropPress={this.toggleOverlayBack}><ScrollView><Text h4 style={{marginHorizontal: 15}}>Description:</Text><Text style={{marginBottom: 20, marginHorizontal: 15}}>{this.state.description}</Text><Text h4 style={{marginHorizontal: 15}}>Tasks:</Text>{this.state.tasks.map((task, i) => {return (<Text style={{marginHorizontal: 15}}>{task}</Text>
  )})}<Text h4 style={{marginHorizontal: 15, marginTop: 20}}>Rewards:</Text><Text style={{marginBottom: 20, marginHorizontal: 15}}>{this.state.rewards}</Text></ScrollView>
              </Overlay><Overlay isVisible={this.state.subscribersVisible} onBackdropPress={() => {this.toggleSubscribersOverlayBack()}}><ScrollView><SubscriberList subObj={this.state.subscriberNames}/></ScrollView></Overlay></View>
                )
                })}
                

            </View>       
                 </ScrollView>

    )};
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2c3e50',
        padding: 10
    },
});

function AppTabView(props) {
    const tabs = [
      { key: 'Feed', label: 'Feed', barColor: '#00695C', icon: 'movie' },
      { key: 'Filter', label: 'Filter', barColor: '#1565C0', icon: 'book' },
      { key: 'Personalized', label: 'Personalized', barColor: '#6A1B9A', icon: 'music-note' },
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
    Feed: FeedScreen,
    Filter: { screen: FilterScreen },
    Personalized: {screen: PersonalizedScreen}
  })
  
  const AppNavigator = createNavigator(AppTabView, AppTabRouter, {})
  
  export default AppNavigator
