import React, { Component } from 'react';
import './actors.css';
import '../../semantic/dist/semantic.min.css';
var _ = require('underscore');

var Fuse = require('fuse.js');
var validate = require("validate.js");


var moment = require('moment');
var axios = require('axios');

import * as firebase from 'firebase';

import querybase from 'querybase';

import { Modal, Card, Image, Dropdown, Container, Button, Checkbox, Form, Input, Message, Radio, Select, TextArea, Dimmer, Loader, Grid, Search, Table, Icon, Menu, Feed } from 'semantic-ui-react'
import { Link, Router, Route, browserHistory, applyRouterMiddleware } from 'react-router'



const users = [
{
  text: 'موظف',
  value: 'staff'
},{
  text: 'خبير',
  value: 'expert'
},{
  text: 'زبون',
  value: 'client'
}]

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
  },
  type: {
    presence: {
      message:  "الرجاء تحديد نوع الصلاحيات"
    }
  },
  username: {
    presence: {
      message:  "الرجاء ادخال الاسم"
    }
  },
}

class Main extends Component {
  constructor(props) {
    super(props);

    this.fuse = {}

    this.state = {
      results: [],
      open: false,
      formError:false,
      isloading: false,
      user: {
        email:'',
        username:'',
        type:'',
        password: ''
      },
      inputError:{
        email: false,
        username: false,
        password: false,
        type: false
      }
    }

  }



  error = (errors)=>{

    let diffArray = ["email", "password", "type", "username"];

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
    validate.async({email: this.state.user.email, type: this.state.user.type, username: this.state.user.username, password: this.state.user.password}, contstraints).then(this.success.bind(this), this.error.bind(this));
  }

  handleEmail = (evt, {value}) => {
    this.checkValidity()
    let user = this.state.user;
    user.email = value;
    this.setState({user: user})
  }


  handleUsername = (evt, {value}) => {
    this.checkValidity()
    let user = this.state.user;
    user.username = value;
    this.setState({user: user})
  }

  handlePassword = (evt, {value}) => {
    this.checkValidity()
    let user = this.state.user;
    user.password = value;
    this.setState({user: user})
  }

  handleType = (evt, {value}) => {
    console.log(value);
    this.checkValidity()
    let user = this.state.user;
    user.type = value;
    this.setState({user: user})
  }

  addNewUser =()=>{
    this.setState({ open: true })
  }


  submitSuccess = ()=>{
    let ths = this;
    this.setState({errorMessages: [], formError:false});


    axios.post('https://icapi.herokuapp.com/users', {
        email: this.state.user.email,
        password: this.state.user.password,
        type: this.state.user.type,
        displayName: this.state.user.username,
      })
      .then(function (response) {
        console.log(response);
        ths.setState({
          user: {
            email:'',
            username:'',
            type:'',
            password: '',
          },
          open: false
        })


      })
      .catch(function (error) {
        console.log(error.errorMessage);

        ths.setState({errorMessages: ths.state.errorMessages.concat([error.message]), formError:true});
      });








  }


  componentDidMount = () => {

    let ths = this;

    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        // User is signed in.

            firebase.database().ref().child('/users').orderByChild('uid').equalTo(user.uid).once("value",(snapshot)=>{

                console.log(snapshot.val())

                if (snapshot.val() === null) {
                  ths.setState({
                    type: "admin" 
                  })
                } else {
                  let type = snapshot.val()[Object.keys(snapshot.val())].type

                  if(type === 'staff' || type === 'expert'){
                     browserHistory.push('/admin/actors')
                  } else if(type === 'client'){
                       browserHistory.push('/notallowed')
                  }
                }




              })


      firebase.database().ref().child('users')
      .on("value", function(snapshot) {
        ths.setState({results: [], isloading: true})
        

        let tmpArr = [];

        for (var obj in snapshot.val()) {
          if (snapshot.val().hasOwnProperty(obj)) {

            let key = obj;
            let item = snapshot.val()[obj];
            item["key"] = key;

            tmpArr.push(item);

          }
        }


        ths.setState({results: tmpArr, isloading: false})





      })
      } else {
        browserHistory.push('/admin')
      }
    });





  }


  onChange = (value, e, o)=>{
    let tmpProp =  this.state.user;
    tmpProp[value] = e.target.value || o.value;

    this.setState({
      user: tmpProp
    })
  }


  deleteUsers = (uid, key, evt)=>{

   let tmpResults = this.state.results;



    axios.post('https://icapi.herokuapp.com/users/delete', {
        uid: uid,
        key: key
      })
      .then(function (response) {

      })
      .catch(function (error) {
        console.log(error.errorMessage);
      });


  }



  handleItemClick = (e, { name }) => {

      if (name == 'المواهب') {
        browserHistory.push('/admin/actors')

      } else if (name == 'الاماكن') {
        browserHistory.push('/admin/places')
      } else if (name == 'الاصوات') {
        browserHistory.push('/admin/voices')
      } else if (name == 'الانشطة') {
        browserHistory.push('/admin/feed')
      } else if (name == 'التحليلات') {
        browserHistory.push('/admin/analytics')
      } else if (name == 'الاعضاء') {
        browserHistory.push('/admin/users')
      }

    }

    renderList = ()=>{

          return  <Table color="blue" >

            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>الاسم</Table.HeaderCell>
                <Table.HeaderCell>البريد الالكتروني</Table.HeaderCell>
                <Table.HeaderCell>الصلاحيات</Table.HeaderCell>

                <Table.HeaderCell></Table.HeaderCell>

              </Table.Row>
            </Table.Header>

            <Table.Body>
          {
            this.state.results.map((item)=>{

              return (
                <Table.Row key={item.key}>
                <Table.Cell>{item.displayName}</Table.Cell>
                <Table.Cell>{item.email}</Table.Cell>
                <Table.Cell>{item.type}</Table.Cell>

                <Table.Cell width={1}><Button onClick={this.deleteUsers.bind(this, item.uid, item.key)} size='mini' color="red"><Icon name='trash outline'/></Button></Table.Cell>
              </Table.Row>
              )





            })


}
            </Table.Body>
          </Table>







    }




    close = () => this.setState({ open: false })

    createUser = () => {
    
    validate.async({email: this.state.user.email, type: this.state.user.type, username: this.state.user.username, password: this.state.user.password}, contstraints).then(this.submitSuccess.bind(this), this.error.bind(this));



    }

  render() {
    const { mode } = this.state;

    return (

      <Container>

      <Modal size='small' open={this.state.open} onClose={this.close}>
        <Modal.Header>
            عضو جديد
        </Modal.Header>
        <Modal.Content>
        <Form error={this.state.formError} ref="userform">
          <Form.Field>
           <Form.Input value={this.state.user.username} onChange={this.handleUsername.bind(this)} error={this.state.inputError.username} label='الاسم' name='username' placeholder='' />
          </Form.Field>
          <Form.Field>
            <Form.Select value={this.state.user.type}  onChange={this.handleType.bind(this)} error={this.state.inputError.type} label='النوع' options={users}  name='type' />
          </Form.Field>
          <Form.Field>
           <Form.Input value={this.state.user.email} onChange={this.handleEmail.bind(this)} error={this.state.inputError.email} label='البريد الالكتروني' name='email' placeholder='' />
          </Form.Field>
          <Form.Field>
           <Form.Input value={this.state.user.password} onChange={this.handlePassword.bind(this)} error={this.state.inputError.password} label='الرمز السري' name='password' placeholder='' />
          </Form.Field>
        </Form>
                  <Message
                    error={this.state.formError}
                    visible={this.state.formError}
                    list={
                      this.state.errorMessages
                    }
                  />
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={this.close.bind(this)} negative>
            الغاء
          </Button>
          <Button onClick={this.createUser.bind(this)} positive icon='checkmark' labelPosition='right' content='انشاء' />
        </Modal.Actions>
      </Modal>



      <Grid>

      <Grid.Column width={4}>

      <Menu pointing secondary vertical>
        <Menu.Item icon='user' name='المواهب' active={false} onClick={this.handleItemClick} />
        <Menu.Item icon='world' name='الاماكن' active={false} onClick={this.handleItemClick} />
        <Menu.Item icon='sound' name='الاصوات' active={false} onClick={this.handleItemClick} />
        <Menu.Item icon='feed' name='الانشطة' active={false} onClick={this.handleItemClick} />
        <Menu.Item icon='pie chart' name='التحليلات' active={false} onClick={this.handleItemClick} />
        <Menu.Item icon='users' name='الاعضاء' active={true} onClick={this.handleItemClick} />

      </Menu>

      </Grid.Column>
      <Grid.Column width={12}>



      <Button onClick={this.addNewUser.bind(this)} content='عضو جديد' icon='add' primary labelPosition='right' />

    



     {this.renderList()}



      </Grid.Column>

      </Grid>
      <a className='signout' onClick={()=>{firebase.auth().signOut()}}><Icon name='sign out'/>خروج</a>

      </Container>



    );
  }
}

export default Main;
