import React,  { Component } from 'react';
import './actors.css';
import '../../semantic/dist/semantic.min.css';
import * as firebase from 'firebase';


import { Button, Checkbox, Form, Input, Message, Radio, Select, TextArea, Dimmer, Loader, Grid, Search, Table, Icon, Menu, Feed } from 'semantic-ui-react'
import {Link, browserHistory} from 'react-router';

var Dropzone = require('react-dropzone');



class Main extends Component {


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

      componentDidMount() {


      let ths = this;

      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {


            firebase.database().ref().child('/users').orderByChild('uid').equalTo(user.uid).once("value",(snapshot)=>{

                let type = snapshot.val()[Object.keys(snapshot.val())].type
                if(type === 'staff' || type === 'expert'){
                   browserHistory.push('/admin/actors')
                } else if(type === 'client'){
                     browserHistory.push('/notallowed')
                }

              })


      

        } else {
          browserHistory.push('/admin')
        }
      });

      }


  render() {
    return (
      <div className="ui container">


      <Grid>

      <Grid.Column width={4}>


      <Menu pointing secondary vertical>
        <Menu.Item icon='user' name='المواهب' active={false} onClick={this.handleItemClick} />
        <Menu.Item icon='world' name='الاماكن' active={false} onClick={this.handleItemClick} />
        <Menu.Item icon='sound' name='الاصوات' active={false} onClick={this.handleItemClick} />
        <Menu.Item icon='feed' name='الانشطة' active={false} onClick={this.handleItemClick} />
        <Menu.Item icon='pie chart' name='التحليلات' active={true} onClick={this.handleItemClick} />
        <Menu.Item icon='users' name='الاعضاء' active={false} onClick={this.handleItemClick} />

      </Menu>


      <a className='signout' onClick={()=>{firebase.auth().signOut()}}><Icon name='sign out'/>خروج</a>


 
      </Grid.Column>
      <Grid.Column width={12} className="centercolumn">

        <h1>قريبا</h1>  

      </Grid.Column>

      </Grid>



      </div>
    );
  }
}

export default Main;
