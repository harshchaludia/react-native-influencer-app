import * as firebase from 'firebase'
import 'firebase/auth'
import 'firebase/firestore'
import firebaseConfig from './firebaseConfig'
// Initialize Firebase
firebase.initializeApp(firebaseConfig)

const Firebase = {
  // auth
  loginWithEmail: (email, password) => {
    return firebase.auth().signInWithEmailAndPassword(email, password)
  },
  signupWithEmail: (email, password) => {
    return firebase.auth().createUserWithEmailAndPassword(email, password)
  },
  typeSet: (uid, type) => {
	let num="0"
  firebase.database().ref('users/'+type+'/'+ uid).set({
    type,num })
    if(uid){
      if(type == "followers") {
        this.props.navigation.navigate('App')
      }
      else if(type == "brand") {
        this.props.navigation.navigate('BrandIndex')
      }
      else if(type == "mandor") {
        this.props.navigation.navigate('MandorIndex')
      }
    }
  },
  getUid: () => {
    return firebase.auth().currentUser.uid
  },
  signOut: () => {
    return firebase.auth().signOut()
  },
  checkUserAuth: user => {
    return firebase.auth().onAuthStateChanged(user)
  },
  passwordReset: email => {
    return firebase.auth().sendPasswordResetEmail(email)
  },
  // firestore
  createNewUser: userData => {
    return firebase
      .firestore()
      .collection('users')
      .doc(`${userData.uid}`)
      .set(userData)
  }
}

export default Firebase
