import React, {
  Component
} from 'react';

var pubsub = require('pubsub-js');

import {
  Menu,
  Modal,
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
  Container
} from 'semantic-ui-react'
import {
  Link,
  Router,
  Route,
  browserHistory,
  applyRouterMiddleware
} from 'react-router'

import FirebaseDropzone from './components/dropzone';
import './actors.css';
import '../semantic/dist/semantic.min.css';

import * as firebase from 'firebase';
var Dropzone = require('react-dropzone');
var _ = require('underscore');

var validate = require("validate.js");

const contstraints = {
  fullname: {
    presence: {
      meesage: "يرجى كتابة اسمك الكامل"
    }
  },
  phone: {
    presence: {
      meesage: "يرجى كتابة اسمك الكامل"
    }
  },
  email: {
    presence: {
      meesage: "يرجى كتابة اسمك الكامل"
    },
    email:{
      message: "يرجى كتابه البريد الاكتروني بطريقة صحيحة"
    }
  },
  city: {
    presence: {
      meesage: "يرجى كتابة اسمك الكامل"
    }
  },
  urls: {
    presence: {
      meesage: "يرجى كتابة اسمك الكامل"
    }
  },
}

const cities = [{
  text: 'بغداد',
  value: 'Baghdad'
}, {
  text: 'بصره',
  value: 'Basra'
}, {
  text: 'دهوك',
  value: 'Dahuk'
}, {
  text: 'نينوى',
  value: 'Nineveh'
}, {
  text: 'اربيل',
  value: 'Erbil'
}, {
  text: 'كركوك',
  value: 'Kirkuk'
}, {
  text: 'سليمانية',
  value: 'As Sulaymaniyah'
}, {
  text: 'صلاح الدين',
  value: 'Salahad Din'
}, {
  text: 'ديالى',
  value: 'Diyala'
}, {
  text: 'الانبار',
  value: 'Al Anber'
}, {
  text: 'كربلاء',
  value: 'Karbala'
}, {
  text: 'بابل',
  value: 'Babil'
}, {
  text: 'واسط',
  value: 'Wasit'
}, {
  text: 'ميسان',
  value: 'Maysan'
}, {
  text: 'نجف',
  value: 'An Najaf'
}, {
  text: 'القادسية',
  value: 'Al Qadisiyah'
}, {
  text: 'ذي قار',
  value: 'Dhiqar'
}, {
  text: 'المثنى',
  value: 'Al Muthanna'
}, {
  text: 'حلبچه',
  value: 'Halabcha'
}, ]





class Main extends Component {

  constructor(props) {
    super(props);
    this.state = {
      actor:{},
      serializedForm: {}, // final
      activeItem: 'الاصوات',
      errorMessages: [], //
      formError: false,
      modalOpen: false,
      finishedUpload: false,
      inputError: {
        fullname: false,
        email: false,
        phone: false,
        city: false,
        why: false,
        urls: false
      }
    }
  }

  handleClose = (e) => this.setState({
    modalOpen: false,
  })




  onChange=(value, e)=>{
    let tmp = this.state.inputError;
    tmp[value] = false;
    this.setState({inputError: tmp});
  }



  success(attributes) {

    this.setState({formError: false})


      var database = firebase.database();
      database.ref('/voices').push({
        fullname: this.state.serializedForm.fullname,
        phone: this.state.serializedForm.phone,
        email: this.state.serializedForm.email,
        city: this.state.serializedForm.city,
        urls: this.state.serializedForm.urls
      })


      this.setState({modalOpen:true, formError: false, inputError: {
              fullname: false,
              email: false,
              phone: false,
              city: false,
              urls: false,
            }, actor: {
              fullname: '',
              email: '',
              phone: '',
              city: '',
              urls: '',
            }})

      let ths = this;
      setTimeout(function(){

        ths.setState({modalOpen:false})
      }, 2000);






  }


  error(errors) {

    this.setState({
      formError: true
    })

    let diffArray = ["fullname", "email", "phone", "city", "urls"];

    if (errors instanceof Error) {
      // This means an exception was thrown from a validator
      console.err("An error ocurred", errors);
    } else {

      let errorsArray = [];
      for (var error in errors) {
        if (errors.hasOwnProperty(error)) {
          this.state.inputError[error] = true;
          errorsArray.push(error);
        }
      }


      let validityArray = _.difference(diffArray, errorsArray);

      for (var i = 0; i < validityArray.length; i++) {
        this.state.inputError[validityArray[i]] = false;
      }



      let errorMessages = []

      for (var key in errors) {
        var error = errors[key];
        errorMessages.push(error[0])
      }


      this.setState({
        errorMessages
      })
    }



  }

  handleStateChanged = (state)=>{
    console.log("loading state",state);
    this.setState({finishedUpload: state});
  }

  handleUrlsUpdate = (urls)=>{

    this.setState({
      imageUrls: urls
    })

  }

  handleSubmit = (e, serializedForm) => {
    e.preventDefault();

    validate.async(serializedForm, contstraints).then(this.success.bind(this), this.error.bind(this))

    this.setState({
      serializedForm
    })

  }



  componentDidMount = () =>{
    pubsub.subscribe('UPDATE LIST', (id, item)=>{
      this.setState({
        imageUrls: item
      })
    })
  }


  handleItemClick = (e, {
    name
  }) => {
    console.log(name);
    if (name == 'المواهب') {
      browserHistory.push('actors')
    } else if (name == 'الاماكن') {
      browserHistory.push('places')
    } else if (name == 'الاصوات') {
      browserHistory.push('voices')
    }
  }






  guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }

  handleOpen = (e) => this.setState({
    modalOpen: true,
  })

  handleClose = (e) => this.setState({
    modalOpen: false,
  })

  render() {
    const { serializedForm, value, activeItem, errorMessages, inputError } = this.state

    const { active } = this.state

    return (

      <Container>
      <Modal
        open={this.state.modalOpen}
        onClose={this.handleClose}
        basic
        size='small'
      >


        <Modal.Content style={{textAlign:"center", transition:"1s all"}}>
          <img width="215px" loop="1" src="https://firebasestorage.googleapis.com/v0/b/iraq-casting.appspot.com/o/assets%2Fanimat-checkmark-color.gif?alt=media&token=22a83db8-662e-49b8-8f4e-fd89b99a7fba"/>
          <Header style={{color:"white"}}>تمت العملية بنجاح</Header>
        </Modal.Content>

      </Modal>

        <Grid centered>

        <Grid.Column className="mobile tablet only grid" width={12}>

        <Menu  pointing secondary>
        <Menu.Item  name='المواهب' active={false} onClick={this.handleItemClick} />
        <Menu.Item  name='الاماكن' active={false} onClick={this.handleItemClick} />
        <Menu.Item  name='الاصوات' active={true} onClick={this.handleItemClick} />
        </Menu>

        </Grid.Column>


          <Grid.Row centered>
          <Grid.Column className="computer only grid" width={4}>
          <Menu pointing secondary vertical>
          <Menu.Item icon='user' name='المواهب' active={false} onClick={this.handleItemClick} />
          <Menu.Item icon='world' name='الاماكن' active={false} onClick={this.handleItemClick} />
          <Menu.Item icon='sound' name='الاصوات' active={true} onClick={this.handleItemClick} />
          </Menu>

          </Grid.Column>
          <Grid.Column  width={12}>

          <Form error={this.state.formError} onSubmit={this.handleSubmit}>



          <Form.Group widths='equal'>
           <Form.Field error={inputError.fullname}>
            <Form.Input value={this.state.actor.fullname} onChange={this.onChange.bind(this, "fullname")} label='الاسم الكامل' name='fullname' placeholder='' />
           </Form.Field>
           <Form.Field error={inputError.email}>
            <Form.Input value={this.state.actor.email} onChange={this.onChange.bind(this, "email")}  label='البريد الالكتروني' name='email' placeholder='' />
           </Form.Field>
         </Form.Group>
         <Form.Group widths='equal'>
          <Form.Field error={inputError.phone}>
           <Form.Input value={this.state.actor.phone} onChange={this.onChange.bind(this, "phone")} label='رقم الهاتف' name='phone' placeholder='' />
          </Form.Field>
          <Form.Select value={this.state.actor.city} onChange={this.onChange.bind(this, "city")} error={inputError.city} label='المحافظة' options={cities}  name='city' />
        </Form.Group>



                           <Form.TextArea value={this.state.actor.urls} onChange={this.onChange.bind(this, "urls")} error={inputError.urls} name='urls'  label='روابط' rows='3' />







                           <Message
                             error
                             header='يرجى التأكد من معلوماتك مرة ثانية'
                             list={
                               errorMessages
                             }
                           />


            <Button  primary type='submit'>ارسال</Button>


            </Form>


          </Grid.Column>
          </Grid.Row>

        </Grid>


        </Container>




    );
  }

  }

  export default Main;
