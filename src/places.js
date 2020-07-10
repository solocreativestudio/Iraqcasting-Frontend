import React, {
  Component
} from 'react';

var pubsub = require('pubsub-js');

import {
  Menu,
  Modal,
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
  // five constarint fullname, phone, email, city, why, address
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
  why: {
    presence: {
      meesage: "يرجى كتابة اسمك الكامل"
    }
  },
  address: {
    presence: {
      meesage: "يرجى كتابة اسمك الكامل"
    }
  },
  title: {
    presence: {
      meesage: "يرجى كتابه اسم للمكان"
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
      serializedForm: {}, // final
      activeItem: 'الاماكن',
      errorMessages: [], //
      formError: false,
      modalOpen: false,
      voiceUrls:[],
      imageUrls:[],
      finishedUpload: false,
      inputError: {
        fullname: false,
        email: false,
        phone: false,
        city: false,
        why: false,
        address: false,
        title: false
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

    if(this.state.finishedUpload === true && this.state.imageUrls.length > 0){

      var database = firebase.database();
      database.ref('/places').push({
        fullname: this.state.serializedForm.fullname,
        phone: this.state.serializedForm.phone,
        email: this.state.serializedForm.email,
        address: this.state.serializedForm.address,
        city: this.state.serializedForm.city,
        why: this.state.serializedForm.why,
        images: this.state.imageUrls,
        title: this.state.serializedForm.title
      })



            this.setState({modalOpen:true, formError: false, inputError: {
                    fullname: false,
                    email: false,
                    phone: false,
                    city: false,
                    why: false,
                    address: false
                  }, actor: {
                    fullname: '',
                    email: '',
                    phone: '',
                    city: '',
                    why: '',
                    address: ''
                  }})

                  let ths = this;
                  setTimeout(function(){
                    ths.setState({modalOpen:false})
                    window.location.reload()
                  }, 2000);




    } else {
      alert('يرجى اختيار صور للمكان المرشح')
    }

  }


  error(errors) {

    this.setState({
      formError: true
    })

    let diffArray = ["fullname", "email", "phone", "city", "address", "why"];

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
        <Menu.Item  name='الاماكن' active={true} onClick={this.handleItemClick} />
        <Menu.Item  name='الاصوات' active={false} onClick={this.handleItemClick} />
        </Menu>

        </Grid.Column>

          <Grid.Row centered>
          <Grid.Column className="computer only grid" width={4}>
          <Menu pointing secondary vertical>
          <Menu.Item icon='user' name='المواهب' active={false} onClick={this.handleItemClick} />
          <Menu.Item icon='world' name='الاماكن' active={true} onClick={this.handleItemClick} />
          <Menu.Item icon='sound' name='الاصوات' active={false} onClick={this.handleItemClick} />
          </Menu>


          </Grid.Column>
          <Grid.Column  width={12}>

          <Form error={this.state.formError} onSubmit={this.handleSubmit}>

          <Form.Field error={inputError.title}>
           <Form.Input onChange={this.onChange.bind(this, "title")} label='اسم المكان' name='title' placeholder='' />
          </Form.Field>


          <Form.Group widths='equal'>
          <Form.Select  onChange={this.onChange.bind(this, "city")} error={inputError.city} label='المحافظة' options={cities}  name='city' />

           <Form.Field error={inputError.address}>
            <Form.Input onChange={this.onChange.bind(this, "address")} label='العنوان' name='address' placeholder='' />
           </Form.Field>
         </Form.Group>

          <Form.Group widths='equal'>
          <Form.TextArea  onChange={this.onChange.bind(this, "why")} error={inputError.why} name='why' label='ما الذي يميز هذا الموقع؟'  rows='3' />

         </Form.Group>


                          <Form.Group  inline>
                            <FirebaseDropzone location='/places' onStateChanged={this.handleStateChanged.bind(this)} onUrlsUpdate={this.handleUrlsUpdate.bind(this)}/>

                          </Form.Group>


                          <Form.Group widths='equal'>
                           <Form.Field error={inputError.fullname}>
                            <Form.Input onChange={this.onChange.bind(this, "fullname")} label='الاسم الكامل' name='fullname' placeholder='' />
                           </Form.Field>
                           <Form.Field error={inputError.email}>
                            <Form.Input onChange={this.onChange.bind(this, "email")}  label='البريد الالكتروني' name='email' placeholder='' />
                           </Form.Field>

                          <Form.Field error={inputError.phone}>
                           <Form.Input onChange={this.onChange.bind(this, "phone")} label='رقم الهاتف' name='phone' placeholder='' />
                          </Form.Field>
                        </Form.Group>


                        <Message
                          error
                          header='يرجى التأكد من معلوماتك مرة ثانية'
                          list={
                            errorMessages
                          }
                        />


            <Button primary type='submit'>ارسال</Button>


            </Form>


          </Grid.Column>
          </Grid.Row>

        </Grid>


        </Container>




    );
  }

  }




  export default Main;
