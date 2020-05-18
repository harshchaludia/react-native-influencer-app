# React Native Influencer App



This application is created for an influencer. It basically recommends local/ global places. These places could be shops, restaurants, beaches, etc. It will also provide services for brands. This will help the brands get more followers and profits. Followers will see the recommendations as posts on their home page. Points will be exchanged for giftcards and coupons. This application is under the field of Android/IOS applications and category of Local/Travel.

Following entities were implemented:
  - Mandor
    - This entity will be the sole influencer.
    - Mandor can chat with brands with realtime messaging implemented with realtime firebase.
    - It will recommend followers with places and reward them points, coupons, and deals on completing tasks posted by mandor for an event.
    - Mandor can assign points/tasks to an event.
    - Mandor can change settings, and edit profile image as well.
    - Mandor can see total number of posts, brands, and recent activity of people subscribing to events.
    - Mandor can grant access to brands, so that the brand can function with full capabilities.
  - Brand
    - This entity can be multiple.
    - Brand can chat with mandor realtime.
    - Brands can ask mandor to start an event.
    - Brands have to select a pricing plan with mandor
    - Pricing plan includes Text, Video, and Text+Video.
    - Brands can update their profile data.
  - Follower
    - This entity can be multiple.
    - Follower can complete tasks posted by mandor for an event.
    - Earn points, coupons and deals after completing tasks.
    - Followers can update their profile data.
    - Followers can categorize events with current, past and future events.
    - Followers can filter events by category.
    - Followers have a feed of mandor events.

## Mandor Recomienda

> Ever been to a country and don’t know where to go or what to do? Then, this app will definitely solve that! ‘Mandor Recomienda’ will allow followers to know more about places and help travelers know what to do! Mandor is a famous influencer that will provide her users with her own recommendations and also help services get more costumers. Followers can also visit places which Mandor recommends and earn points, coupons and gift cards

## Authentication Screens:

<p align="center">
  <img src="https://github.com/harshchaludia/React-Native-Influencer-App/blob/master/screenshots/login.jpg" width="20%" height="auto">
  <img src="https://github.com/harshchaludia/React-Native-Influencer-App/blob/master/screenshots/register.jpg" width="20%" height="auto">
  <img src="https://github.com/harshchaludia/React-Native-Influencer-App/blob/master/screenshots/forgotpassword.jpg" width="20%" height="auto">

</p>

## Follower Screens:

<p align="center">
  <img src="https://github.com/harshchaludia/React-Native-Influencer-App/blob/master/screenshots/dashboardFollower.jpg" width="16%" height="auto">
  <img src="https://github.com/harshchaludia/React-Native-Influencer-App/blob/master/screenshots/dealFollower.jpg" width="16%" height="auto">
  <img src="https://github.com/harshchaludia/React-Native-Influencer-App/blob/master/screenshots/filterFollower.jpg" width="16%" height="auto">
   <img src="https://github.com/harshchaludia/React-Native-Influencer-App/blob/master/screenshots/followerEvent.jpg" width="16%" height="auto">
<img src="https://github.com/harshchaludia/React-Native-Influencer-App/blob/master/screenshots/personalizedFollower.jpg" width="16%" height="auto">
 <img src="https://github.com/harshchaludia/React-Native-Influencer-App/blob/master/screenshots/settingsFollower.jpg" width="16%" height="auto">
</p>

## Brand Screens:

<p align="center">
  <img src="https://github.com/harshchaludia/React-Native-Influencer-App/blob/master/screenshots/brandDashboard.jpg" width="16%" height="auto">
  <img src="https://github.com/harshchaludia/React-Native-Influencer-App/blob/master/screenshots/brandDashboard2.jpg" width="16%" height="auto">
  <img src="https://github.com/harshchaludia/React-Native-Influencer-App/blob/master/screenshots/brandMessage.jpg" width="16%" height="auto">
   <img src="https://github.com/harshchaludia/React-Native-Influencer-App/blob/master/screenshots/brandPricingPlan.jpg" width="16%" height="auto">
<img src="https://github.com/harshchaludia/React-Native-Influencer-App/blob/master/screenshots/brandSettings.jpg" width="16%" height="auto">
 <img src="https://github.com/harshchaludia/React-Native-Influencer-App/blob/master/screenshots/brandLogout.jpg" width="16%" height="auto">
</p>


## Mandor Screens:

<p align="center">
  <img src="https://github.com/harshchaludia/React-Native-Influencer-App/blob/master/screenshots/MandorDasboard.jpg" width="20%" height="auto">
  <img src="https://github.com/harshchaludia/React-Native-Influencer-App/blob/master/screenshots/MandorBrandList.jpg" width="20%" height="auto">
  <img src="https://github.com/harshchaludia/React-Native-Influencer-App/blob/master/screenshots/MandorMessages.jpg" width="20%" height="auto">
   <img src="https://github.com/harshchaludia/React-Native-Influencer-App/blob/master/screenshots/MandorPostList.jpg" width="20%" height="auto">
<img src="https://github.com/harshchaludia/React-Native-Influencer-App/blob/master/screenshots/MandorPostNew.jpg" width="20%" height="auto">
 
</p>

<p align="center">
  <img src="https://github.com/harshchaludia/React-Native-Influencer-App/blob/master/screenshots/MandorSettings1.jpg" width="20%" height="auto">
  <img src="https://github.com/harshchaludia/React-Native-Influencer-App/blob/master/screenshots/MandorSettings2.jpg" width="20%" height="auto">
 

 
</p>


## Package.json

| Package Name | Version |
| ------ | ------ |
|@expo/vector-icons| ^10.0.6|
|buffer| ^5.6.0|
|expo| ^36.0.0|
|expo-asset| ~8.0.0|
|expo-font| ~8.0.0|
|expo-image-picker| ~8.0.1|
|firebase| 6.6.0|
|formik| 2.1.4|
|react| 16.9.0|
|react-dom| 16.9.0|
|react-native| https|//github.com/expo/react-native/archive/sdk-36.0.1.tar.gz|
|react-native-cards| ^1.1.4|
|react-native-datepicker| ^1.7.2|
|react-native-elements| 1.2.0|
|react-native-form-validator| ^0.3.2|
|react-native-gesture-handler| ~1.5.0|
|react-native-hide-with-keyboard| 1.2.1|
|react-native-material-bottom-navigation| ^1.0.5|
|react-native-paper| ^3.8.0|
|react-native-reanimated| ~1.4.0|
|react-native-screens| 2.0.0-alpha.12|
|react-native-sectioned-multi-select| ^0.7.6|
|react-native-uuid| ^1.4.9|
|react-native-vector-icons| ^6.6.0|
|react-navigation| 4.0.0|
|react-navigation-drawer| ^2.4.7|
|react-navigation-material-bottom-tabs| ^2.2.11|
|react-navigation-stack| 1.5.1|
|react-navigation-tabs| ^2.8.7|
|yup| 0.27.0|

## Installation

This application requires [Node.js] to run.
This app is built with expo.

Generate a firebaseConfig file under the directory path as following:

> React-Native-Influencer-App\config\Firebase\firebaseConfig.js

> export default {
   // attach your firebase config details here
};

Next,
Install the dependencies and devDependencies and start the server.



```sh
$ cd folder-name
$ npm install 
$ npm start --reset-cache
```



### Development

- [EXPO LINK](https://exp.host/@harshchaludia/mandor-recomienda)
- [APK LINK](https://drive.google.com/file/d/1LtGodmyPYUs2fPpnOyiBNartObJ0W8se/view?usp=sharing)


### Todos

 - Write MORE Tests
 - Add Night Mode

License
----

MIT


## Useful links
Official guides:
- [Using React Native SDK guide](https://voximplant.com/blog/using-react-native-sdk)

## Have a question ?

- contact us via `reactnative6@gmail.com`
- send email with a specific subject
>
