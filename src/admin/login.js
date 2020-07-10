import React, { Component } from 'react';
import './login.css';
import '../../semantic/dist/semantic.min.css';
var validate = require("validate.js");
var _ = require('underscore');
import * as firebase from 'firebase';

import {
  Router,
  Route,
  browserHistory,
  applyRouterMiddleware
} from 'react-router'


const contstraints = {
  email: {
    presence: {
      message: "يرجى ادخال بريدك الالكتروني"
    },
    email:{
      message:'يرجى كتابة الايميل بطريقة صحيحة'
    }
  },
  password: {
    presence: {
      message:  "يرجى ادخال الرمز السري"
    },
    length: {
      minimum: 6,
      message: "الرمز السري لا يقل عن ٦ خانات"
    }
  }
}


import { Button, Header, Container, Checkbox, Form, Input, Message, Radio, Select, TextArea, Dimmer, Loader, Grid, Search, Table, Icon, Menu, Feed } from 'semantic-ui-react'
import {Link} from 'react-router';

var Dropzone = require('react-dropzone');




class Main extends Component {
  constructor(props){
    super(props);
    this.state = {
      email:'',
      password:'',
      formError: false,
      errorMessages: [],
      inputError:{
        email:false,
        password: false
      }
    }
  }


  componentWillMount=()=>{

    let ths = this;
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        // User is signed in.

                     // browserHistory.push('/admin/actors')



        firebase.database().ref().child('/users').orderByChild('uid').equalTo(user.uid).once("value",(snapshot)=>{
                if(snapshot.val() === null){
                  ths.setState({type:'admin'})
                  browserHistory.push('admin/actors')
                } else {
                  ths.setState({type: snapshot.val()[Object.keys(snapshot.val())].type})
                if(snapshot.val()[Object.keys(snapshot.val())].type === 'client'){
                     browserHistory.push('helloclient')
                  }
                if(snapshot.val()[Object.keys(snapshot.val())].type === 'staff'){
                     browserHistory.push('admin/actors')
                  }
                if(snapshot.val()[Object.keys(snapshot.val())].type === 'expert'){
                     browserHistory.push('admin/actors')
                  }




                }
        
          })
        



      } else {
        // No user is signed in.
      }
    });

  }

  error = (errors)=>{

    let diffArray = ["email", "password"];

    this.setState({
      formError: true
    })


    if (errors instanceof Error) {
      // This means an exception was thrown from a validator
      console.err("An error ocurred", errors);
    } else {

      let errorMessages = [];

      for (var key in errors) {
        var error = errors[key];
        errorMessages.push(error[0])
      }



      this.setState({errorMessages: errorMessages})


    }

  }


  success = ()=>{
    this.setState({errorMessages: [], formError:false})
  }


  checkValidity = () => {
    validate.async({email: this.state.email, password: this.state.password}, contstraints).then(this.success.bind(this), this.error.bind(this));
  }

  handleEmail = (evt, {value}) => {
    this.checkValidity()
    this.setState({email: value})
  }

  handlePassword = (evt, {value}) => {
    this.checkValidity()

    this.setState({password: value})
  }

  submitSuccess = ()=>{
    let ths = this;
    this.setState({errorMessages: [], formError:false});



    firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(error.code);
      console.log(error.message);

      ths.setState({errorMessages: ths.state.errorMessages.concat([error.message]), formError:true});


    });



  }


  handleSubmit = (evt, serializedForm) => {
    evt.preventDefault();
    validate.async({email: this.state.email, password: this.state.password}, contstraints).then(this.submitSuccess.bind(this), this.error.bind(this));
  }



  render() {
    return (
      <Container>


      <Grid centered>

      <Grid.Column  width={6}>
      <Header textAlign='center' size='medium'>
      مواهب العراق

      <Header.Subheader>
          ادخل معلومات حسابك
      </Header.Subheader>
      </Header>

      <Form onSubmit={this.handleSubmit.bind(this)} error={this.state.formError} className="segment">
      <Form.Field error={this.state.inputError.email}>
      <Input name="email" onChange={this.handleEmail.bind(this)} value={this.state.email} icon='mail' iconPosition='left' placeholder='البريد الالكتروني...' />

      </Form.Field>
      <Form.Field error={this.state.inputError.password}>
      <Input name="password" onChange={this.handlePassword.bind(this)} value={this.state.password} icon='lock' iconPosition='left' placeholder='الرمز السري...' />

      </Form.Field>
      <Button color="blue" fluid>دخول</Button>


                  <Message
                    error

                    list={
                      this.state.errorMessages
                    }
                  />
      </Form>



      </Grid.Column>

      </Grid>



      </Container>
    );
  }
}

export default Main;
