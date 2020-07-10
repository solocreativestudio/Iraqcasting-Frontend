import React, {
  Component
} from 'react';

var pubsub = require('pubsub-js');

import {
  Menu,
  Modal,
  Divider,
  Icon,
  Button,
  Checkbox,
  Form,
  Input,
  Message,
  Radio,
  Select,
  TextArea,
  Dimmer,
  Loader,
  Progress,
  Card,
  Image,
  Grid,
  Header,
  Segment,
  Container,
  Breadcrumb,
  Rating
} from 'semantic-ui-react'
import {
  Link,
  Router,
  Route,
  browserHistory,
  applyRouterMiddleware
} from 'react-router'

import FirebaseDropzone from '../components/dropzone';
import './notallowed.css';
import '../../semantic/dist/semantic.min.css';

import * as firebase from 'firebase';
var Dropzone = require('react-dropzone');
var _ = require('underscore');
var moment = require('moment');



class Main extends Component {

  constructor(props) {
    super(props);
  
    this.state = {};
  }

  componentDidMount = () =>{


    firebase.auth().onAuthStateChanged(function(user) {

        if (user) {


        } else {
          browserHistory.push('/admin')
        }

    })

  }








  render() {

    return (
      <div className="centercolumn">

            <h1>غير مسموح لك بالوصول الى هذه المساحة</h1>

      <a className='signout' onClick={()=>{firebase.auth().signOut()}}><Icon name='sign out'/>خروج</a>

        </div>
    );
  }

  }

  export default Main;
