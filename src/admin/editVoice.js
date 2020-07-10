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
import './editPlace.css';
import '../../semantic/dist/semantic.min.css';

import * as firebase from 'firebase';
var Dropzone = require('react-dropzone');
var _ = require('underscore');
var moment = require('moment');

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
  urls: {
    presence: {
      meesage: "يرجى كتابة الروبط"
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
      actor:{images:[]},
      serializedForm: {}, // final
      profilePictureData: {
        name: '',
        data: 'http://semantic-ui.com/images/avatar2/large/matthew.png' // final
      },
      isloading:true,
      modalOpen: false,
      imageUrls:[],
      activeItem: 'المواهب',
      errorMessages: [], //
      formError:false,
      finishedUpload: false,
      inputError: {
        fields: false,
        gender: false,
        hadPreviousExperience: false,
        trainedBefore: false,
        readyToBeTrained: false,
        fullname: false,
        nickname: false,
        birthdate: false,
        email: false,
        phone1: false,
        rolesList: false,
        goodAtRoles: false,
        goalsAndAmbitions: false,
        profilePicture: false,
        city: false
      }
    }
  }

  componentDidMount = () =>{


      let ths = this;

      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {

                firebase.database().ref().child('/users').orderByChild('uid').equalTo(user.uid).once("value",(snapshot)=>{
                if(snapshot.val() === null){
                  ths.setState({type:'admin'})
                } else {

                  ths.setState({type: snapshot.val()[Object.keys(snapshot.val())].type})
                
                  if(snapshot.val()[Object.keys(snapshot.val())].type === 'client'){
                     browserHistory.push('/notallowed')
                  }
                }

              })

    firebase.database().ref('/voices').orderByKey().equalTo(ths.props.params.id).on('value', (snap)=>{

      let tmpActor = snap.val()[ths.props.params.id];
      ths.setState({actor:tmpActor, isloading:false})

      let user = firebase.auth().currentUser;
      firebase.database().ref('/activties').push({
        user: user.displayName,
        photo: user.photoURL,
        operation:'checked',
        talentName: tmpActor.fullname,
        talentId: ths.props.params.id,
        on: Date.now()
      })


    })


        } else {
          browserHistory.push('/admin')
        }
      });




  }

  success(attributes) {


      var database = firebase.database();
      database.ref('/voices').child(this.props.params.id).update({
        fullname: this.state.serializedForm.fullname,
        email: this.state.serializedForm.email,
        phone: this.state.serializedForm.phone,
        city: this.state.serializedForm.city,
        urls: this.state.serializedForm.urls,

        rating: this.state.actor.rating || '',





      })

      this.setState({modalOpen:true, formError: false})
      let ths = this;
      setTimeout(function(){

        ths.setState({modalOpen:false})
      }, 2000);







  }


  error(errors) {


    // this.refs.form._form.reset();

    this.setState({
      formError: true
    })

    let diffArray = ["city", "phone",
      "email", "fullname", "urls"
    ];


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


  handleSubmit = (e, serializedForm) => {
    e.preventDefault()



    validate.async(serializedForm, contstraints).then(this.success.bind(this), this.error.bind(this))

    this.setState({
      serializedForm
    })


  }





  handleUrlsUpdate = (urls)=>{

    this.setState({
      imageUrls: urls
    })
  }

  handleItemClick = (e, {
    name
  }) => {
    console.log(name);
    if (name == 'المواهب') {
      browserHistory.push('/')
    } else if (name == 'الاماكن') {
      browserHistory.push('places')
    } else if (name == 'الاصوات') {
      browserHistory.push('voices')
    }

    this.setState({
      activeItem: name
    })
  }

  handleShow = () => this.setState({
    active: true
  })
  handleHide = () => this.setState({
    active: false
  })

  handleProfilePicture = (evt) => {
    evt.stopPropagation();
    this.refs.fil.click();
  }


  handleRate = (v, e, o)=>{
    let tmpProp =  this.state.actor;
    tmpProp["rating"] =  o.rating;

    this.setState({
      actor: tmpProp
    })
  }

  handleArabic = (v, e, o)=>{
    let tmpProp =  this.state.actor;
    tmpProp["arabic"] =  o.rating;

    this.setState({
      actor: tmpProp
    })
  }

  handleIraqi = (v, e, o)=>{
    let tmpProp =  this.state.actor;
    tmpProp["iraqi"] =  o.rating;

    this.setState({
      actor: tmpProp
    })
  }

  backtoactorslist = (e) => {
    e.preventDefault();
    browserHistory.push('/admin/voices');
  }


  onChange=(value, e, o)=>{
    let tmp = this.state.inputError;
    tmp[value] = false;
    this.setState({inputError: tmp});


    let tmpProp =  this.state.actor;
    tmpProp[value] = e.target.value || o.value;


    this.setState({
      actor: tmpProp
    })

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


  handleStateChanged = (state)=>{
    console.log("loading state",state);
    this.setState({finishedUpload: state});
  }



  handleOpen = (e) => this.setState({
    modalOpen: true,
  })

  handleClose = (e) => this.setState({
    modalOpen: false,
  })


  render() {
    const { modalOpen, serializedForm, value, activeItem, errorMessages, inputError } = this.state

    const { active } = this.state


    return (
      <div>
      <Form ref="form" error={this.state.formError} onSubmit={this.handleSubmit}>

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

      <Modal
        open={this.state.isloading}
        onClose={this.handleClose}
        basic
        size='small'
      >


        <Modal.Content style={{textAlign:"center", transition:"1s all"}}>
          <img width="215px" loop="1" src="https://firebasestorage.googleapis.com/v0/b/iraq-casting.appspot.com/o/assets%2Fanimat-search-color.gif?alt=media&token=1dc211a8-8c59-429a-a45e-b958f6f592d5"/>
          <Header style={{color:"white"}}>  جاري تحميل البيانات</Header>
        </Modal.Content>

      </Modal>

      <a className='signout' onClick={()=>{firebase.auth().signOut()}}><Icon name='sign out'/>خروج</a>

      <Container>

        <Grid>
          <Grid.Row>
          <Grid.Column width={16}>

          <Breadcrumb>
        <Breadcrumb.Section href="/" link>الرئيسية</Breadcrumb.Section>
        <Breadcrumb.Divider />
        <Breadcrumb.Section href="/admin/voices" link>الاصوات</Breadcrumb.Section>
        <Breadcrumb.Divider />
        <Breadcrumb.Section active>{this.state.actor.fullname}</Breadcrumb.Section>
      </Breadcrumb>
      </Grid.Column>

          </Grid.Row>
          <Grid.Row>
          <Grid.Column width={4}>
          <Card>
            <Card.Content>
              <Card.Header>
                {this.state.actor.fullname}
              </Card.Header>
              <Card.Meta>
                <span className='date'>
                 {this.state.actor.city}
                </span>
              </Card.Meta>
            </Card.Content>
            <Card.Content extra>
              <Rating name="rating" rating={this.state.actor.rating} onRate={this.handleRate.bind(this, "rating")} icon='star'  maxRating={5} />
            </Card.Content>
          </Card>


          </Grid.Column>
          <Grid.Column  width={12}>



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

            <Button onClick={this.backtoactorslist.bind(this)}>الغاء ورجوع</Button>





          </Grid.Column>
          </Grid.Row>

        </Grid>


        </Container>
        </Form>



      </div>
    );
  }

  }

  export default Main;
