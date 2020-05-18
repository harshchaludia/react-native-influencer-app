import React, { Component, Fragment } from 'react'
import { StyleSheet, Picker, SafeAreaView, View, TouchableOpacity, KeyboardAvoidingView, ScrollView } from 'react-native'
import { Button, CheckBox } from 'react-native-elements'
import { Ionicons } from '@expo/vector-icons'
import { Formik } from 'formik'
import * as Yup from 'yup'
import FormInput from '../components/FormInput'
import FormButton from '../components/FormButton'
import ErrorMessage from '../components/ErrorMessage'
import { withFirebaseHOC } from '../config/Firebase'
import * as firebase from 'firebase';

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .label('Name')
    .required()
    .min(2, 'Must have at least 2 characters'),
  email: Yup.string()
    .label('Email')
    .email('Enter a valid email')
    .required('Please enter a registered email'),
  password: Yup.string()
    .label('Password')
    .required()
    .min(6, 'Password should be at least 6 characters '),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Confirm Password must matched Password')
    .required('Confirm Password is required'),
  check: Yup.boolean().oneOf([true], 'Please check the agreement')
})

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = { gender: ""};
  }

  state = {
    passwordVisibility: true,
    confirmPasswordVisibility: true,
    passwordIcon: 'ios-eye',
    confirmPasswordIcon: 'ios-eye'
  }
  

  goToLogin = () => this.props.navigation.navigate('Login')

  handlePasswordVisibility = () => {
    this.setState(prevState => ({
      passwordIcon:
        prevState.passwordIcon === 'ios-eye' ? 'ios-eye-off' : 'ios-eye',
      passwordVisibility: !prevState.passwordVisibility
    }))
  }

  handleConfirmPasswordVisibility = () => {
    this.setState(prevState => ({
      confirmPasswordIcon:
        prevState.confirmPasswordIcon === 'ios-eye' ? 'ios-eye-off' : 'ios-eye',
      confirmPasswordVisibility: !prevState.confirmPasswordVisibility
    }))
  }




  handleSignup =  async (values) => {
    const { email, password } = values
    let type = this.state.gender

      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)

      const uid = firebase.auth().currentUser.uid;

        let num="0"
        firebase.database().ref('users/'+type+'/'+ uid).set({type,num })
       
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

  handleOnSignup = async (values, actions) => {
    const { email, password } = values
    let type = this.state.gender
    
    
    try {
      const response = await this.props.firebase.signupWithEmail(
        email,
        password
      )
      const uid = response.user.uid
      this.props.firebase.typeSet(
        uid,
        type
      )
      
     
        

    } catch (error) {
      // console.error(error)
      actions.setFieldError('general', error.message)
    } finally {
      actions.setSubmitting(false)
    }
  
  }

  render() {
    const {
      passwordVisibility,
      confirmPasswordVisibility,
      passwordIcon,
      confirmPasswordIcon
    } = this.state
    return (
      <SafeAreaView
        style={styles.container}
        enabled
        behavior='padding'

      >
        <ScrollView>
          <Formik
            initialValues={{
              name: '',
              email: '',
              password: '',
              confirmPassword: '',
              check: false
            }}
            /* onSubmit={(values) => {
              this.handleSignup(values)
            }}
*/
           onSubmit={(values, actions) => {
              this.handleOnSignup(values, actions)
            }}
            validationSchema={validationSchema}>
            {({
              handleChange,
              values,
              handleSubmit,
              errors,
              isValid,
              touched,
              handleBlur,
              isSubmitting,
              setFieldValue
            }) => (
                <Fragment>
                  <FormInput
                    name='name'
                    value={values.name}
                    onChangeText={handleChange('name')}
                    placeholder='Enter your full name'
                    iconName='md-person'
                    iconColor='#2C384A'
                    onBlur={handleBlur('name')}
                  />
                  <ErrorMessage errorValue={touched.name && errors.name} />
                  <FormInput
                    name='email'
                    value={values.email}
                    onChangeText={handleChange('email')}
                    placeholder='Enter email'
                    autoCapitalize='none'
                    iconName='ios-mail'
                    iconColor='#2C384A'
                    onBlur={handleBlur('email')}
                  />
                  <ErrorMessage errorValue={touched.email && errors.email} />
                  <FormInput
                    name='password'
                    value={values.password}
                    onChangeText={handleChange('password')}
                    placeholder='Enter password'
                    iconName='ios-lock'
                    iconColor='#2C384A'
                    onBlur={handleBlur('password')}
                    secureTextEntry={passwordVisibility}
                    rightIcon={
                      <TouchableOpacity onPress={this.handlePasswordVisibility}>
                        <Ionicons name={passwordIcon} size={28} color='grey' />
                      </TouchableOpacity>
                    }
                  />
                  <ErrorMessage errorValue={touched.password && errors.password} />
                  <FormInput
                    name='password'
                    value={values.confirmPassword}
                    onChangeText={handleChange('confirmPassword')}
                    placeholder='Confirm password'
                    iconName='ios-lock'
                    iconColor='#2C384A'
                    onBlur={handleBlur('confirmPassword')}
                    secureTextEntry={confirmPasswordVisibility}
                    rightIcon={
                      <TouchableOpacity
                        onPress={this.handleConfirmPasswordVisibility}>
                        <Ionicons
                          name={confirmPasswordIcon}
                          size={28}
                          color='grey'
                        />
                      </TouchableOpacity>
                    }
                  />
                  <ErrorMessage
                    errorValue={touched.confirmPassword && errors.confirmPassword}
                  />
                  <CheckBox
                    containerStyle={styles.checkBoxContainer}
                    checkedIcon='check-box'
                    iconType='material'
                    uncheckedIcon='check-box-outline-blank'
                    title='Agree to terms and conditions'
                    checkedTitle='You agreed to our terms and conditions'
                    checked={values.check}
                    onPress={() => setFieldValue('check', !values.check)}
                  />

          <Picker        
          label = "Gender"
          style={styles.pickerStyle}  
          selectedValue = {this.state.gender}
          style={{marginBottom:20}}
          selectedValue={this.state.gender}  
          onValueChange={(itemValue, itemPosition) =>  
          this.setState({gender: itemValue, choosenIndex: itemPosition})}  
                    >  
                    <Picker.Item label="Select User type.." value="" />  
                    <Picker.Item label="Follower" value="followers" />  
                    <Picker.Item label="Brand" value="brand" />  
                    <Picker.Item label="Mandor" value="mandor" />  


         </Picker>  
                  <View style={styles.buttonContainer}>
                    <FormButton
                      buttonType='outline'
                      onPress={handleSubmit}
                      title='SIGNUP'
                      buttonColor='#F57C00'
                      disabled={!isValid || isSubmitting}
                      loading={isSubmitting}
                    />
                  </View>
                  <ErrorMessage errorValue={errors.general} />

                </Fragment>
              )}
          </Formik>
          <Button
            title='Have an account? Login'
            onPress={this.goToLogin}
            titleStyle={{
              color: '#039BE5'
            }}
            type='clear'
          />
        </ScrollView>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 50,
  },
  logoContainer: {
    marginBottom: 15,
    alignItems: 'center'
  },
  buttonContainer: {
    margin: 25
  },
  checkBoxContainer: {
    backgroundColor: '#fff',
    borderColor: '#fff'
  }
})

export default withFirebaseHOC(Signup)
