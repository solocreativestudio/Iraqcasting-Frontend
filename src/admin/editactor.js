import React, {
  Component
} from 'react';

var pubsub = require('pubsub-js');
let pressTimer;

import ReactCSSTransitionGroup  from 'react-addons-css-transition-group';


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
import './editactor.css';
import '../../semantic/dist/semantic.min.css';

import * as firebase from 'firebase';
var Dropzone = require('react-dropzone');
var _ = require('underscore');
var moment = require('moment');

var validate = require("validate.js");

const contstraints = {
  fields: {
    presence: {
      message: "يرجى تحديد المجال الذي ترغب في العمل فيه"
    }
  },
  gender: {
    presence: {
      message: "يرجى تحديد الجنس"
    }
  },
  hadPreviousExperience: {
    presence: {
      message: "يرجى تحديد فيما لو قد قمت بأعمال بالسابق او لا"
    }
  },
  trainedBefore: {
    presence: {
      message: "يرجى تحديد فيما لو كان قد تدريبك في السابق على التمثيل"
    }
  },
  readyToBeTrained: {
    presence: {
      message: "يرجى تحديد اذا كنت ترغب في الحصول على تدريب"
    }
  },
  fullname: {
    presence: {
      meesage: "يرجى كتابة اسمك الكامل"
    }
  },
  nickname: {
    presence: {
      message: "يرجى كتابه اسمك الفني"
    }
  },
  birthdate: {
    presence: {
      message: "يرجى تحديد تأريخ الميلاد"
    }
  },
  email: {
    presence: {
      message: "يرجى كتابة البريد الالكتروني"
    },
    email:{
      message: "يرجى كتابه البريد الاكتروني بطريقة صحيحة"
    }
  },
  phone1: {
    presence: {
      message: "يرجى كتابه رقم الهاتف الرئيسي"
    }
  },
  rolesList: {
    presence: {
      message: "يرجى كتابه ماهي الادوار التي خضتها من قبل"
    }
  },
  goodAtRoles: {
    presence: {
      message: "يرجى كتابة ماهي الادوار التي تعتقد انك تجيدها"
    }
  },
  goalsAndAmbitions: {
    presence: {
      message: "يرجى كتابه لماذا تريد ان تكون ممثلا"
    }
  },
  city: {
    presence: {
      message: "يرجى تحديد المدينه"
    }
  },
  // images: {
  //   presence: {
  //     message: "يرجى اختيار صور شكلك الكامل"
  //   }
  // },

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
      modalImage:'',
      showModalImage:false,
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

          firebase.database().ref('/profiles').orderByKey().equalTo(ths.props.params.id).on('value', (snap)=>{

            let tmpActor = snap.val()[ths.props.params.id];
            console.log(tmpActor);
            ths.setState({actor:tmpActor, isloading:false})

            let user = firebase.auth().currentUser;
            firebase.database().ref('/activties').push({
              user: user.displayName,
              photo: user.photoURL,
              operation:'checked',
              talentName: tmpActor.fullname,
              talentId: ths.props.params.id,
              on: moment().valueOf()
            })


          })

        } else {
          browserHistory.push('/admin')
        }
      });


    var beforePrint = function() {
        console.log('Functionality to run before printing.');
    };

    var afterPrint = function() {
    
        let user = firebase.auth().currentUser;
        firebase.database().ref('/activties').push({
              user: user.displayName,
              photo: user.photoURL,
              operation:'print',
              talentName: ths.state.actor.fullname,
              talentId: ths.props.params.id,
              on: moment().valueOf()
        })
    };

    if (window.matchMedia) {
        var mediaQueryList = window.matchMedia('print');
        mediaQueryList.addListener(function(mql) {
            if (mql.matches) {
                beforePrint();
            } else {
                afterPrint();
            }
        });
    }
  }

  success(attributes) {

    console.log(this.props.params)
      var database = firebase.database();
      database.ref('/profiles').child(this.props.params.id).update({
        fields: this.state.serializedForm.fields,
        gender: this.state.serializedForm.gender,
        hadPreviousExperience: this.state.serializedForm.hadPreviousExperience,
        trainedBefore: this.state.serializedForm.trainedBefore,
        readyToBeTrained: this.state.serializedForm.readyToBeTrained,
        fullname: this.state.serializedForm.fullname,
        nickname: this.state.serializedForm.nickname,
        birthdate: this.state.serializedForm.birthdate,
        email: this.state.serializedForm.email,
        phone1: this.state.serializedForm.phone1,
        phone2: this.state.serializedForm.phone2,
        rolesList: this.state.serializedForm.rolesList,
        goodAtRoles: this.state.serializedForm.goodAtRoles,
        goalsAndAmbitions: this.state.serializedForm.goalsAndAmbitions,
        images: this.state.imageUrls.concat(this.state.actor.images),
        profilePicture: this.state.actor.profilePicture,
        city: this.state.serializedForm.city,

        catagory: this.state.serializedForm.catagory || '',
        length: this.state.serializedForm.length || '',
        weight: this.state.serializedForm.weight || '',
        dimension: this.state.serializedForm.dimension || '',
        appearance: this.state.serializedForm.appearance || '',
        workplaceandavailability: this.state.serializedForm.workplaceandavailability || '',
        arabic: this.state.actor.arabic || '',
        iraqi: this.state.actor.iraqi || '',
        noteaboutlangauge: this.state.serializedForm.noteaboutlangauge || '',
        hijab: this.state.serializedForm.hijab || '',
        trainable: this.state.serializedForm.trainable || '',
        notes: this.state.serializedForm.notes || '',
        rating: this.state.actor.rating || '',
        dealtwith: this.state.serializedForm.dealtwith,
        professional: this.state.serializedForm.professional




      })

      this.setState({modalOpen:true, formError: false})
      let ths = this;

      let user = firebase.auth().currentUser;
      firebase.database().ref('/activties').push({
        user: user.displayName,
        photo: user.photoURL,
        operation:'update',
        talentName: ths.state.serializedForm.fullname,
        talentId: ths.props.params.id,
        on: Date.now()
      })

      setTimeout(function(){

        ths.setState({modalOpen:false})
      }, 2000);







  }


  error(errors) {


    // this.refs.form._form.reset();

    this.setState({
      formError: true
    })

    let diffArray = ["city", "profilePicture", "images", "goalsAndAmbitions", "goodAtRoles", "rolesList", "phone1",
      "email", "birthdate", "nickname", "fullname", "readyToBeTrained", "trainedBefore", "hadPreviousExperience", "gender", "fields"
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

  handleFileChange = (evt) => {
    let ths = this;
    var metadata = {
      contentType: 'image/jpeg',
    };

    let reader = new FileReader();
    reader.readAsDataURL(evt.target.files[0]);
    reader.onload = function() {
      let guid = ths.guid()
      ths.setState({
        profilePictureData: {
          name: guid,
          data: reader.result
        }
      })




      var storageRef = firebase.storage().ref('/profile/').child(guid + '.png');
      var message = reader.result.substring(23);
      var uploadTask = storageRef.putString(message, 'base64', metadata);

      uploadTask.on('state_changed', function(snapshot) {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        ths.setState({
          progress: progress
        })
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            console.log('Upload is paused');
            break;
          case firebase.storage.TaskState.RUNNING: // or 'running'
            console.log('Upload is running');
            break;
        }
      }, function(error) {
        // Handle unsuccessful uploads
      }, function() {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        let downloadURL = uploadTask.snapshot.downloadURL;



        let tmpState = ths.state;
        tmpState.actor.profilePicture = downloadURL;
        tmpState.profilePictureData.path = downloadURL;

        ths.setState(tmpState)


      });




    };





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

  backtoactorslist=(e)=>{
    e.preventDefault();
    browserHistory.push('/admin/actors');
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



  removeOnMouseUp = (id, e) => {

    clearTimeout(pressTimer);

    return false;


  }

  removeOnMouseDown = (id, e) => {

    pressTimer = setTimeout(()=>{

      let tmpState = this.state.actor;

      tmpState.images = _.filter(this.state.actor.images, function(image){ return image !== id; });


      this.setState({
        actor: tmpState
      })



    }, 1000)


    return false; 

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


  enlargeImage = (id, e) => {
    this.setState({
      modalImage:id,
      showModalImage: true
    })
  }

  render() {
    const { modalOpen, serializedForm, value, activeItem, errorMessages, inputError } = this.state

    const { active } = this.state


    return (
      <div>
      <Form ref="form" error={this.state.formError} onSubmit={this.handleSubmit}>
      <a className='signout' onClick={()=>{firebase.auth().signOut()}}><Icon name='sign out'/>خروج</a>
      <a target="_blank" href={`https://iraqcasting.com/talents/${this.state.actor.actorid}`} className='copylink'><Icon name='external share'/>رابط الزبون</a>


      <Modal onClick={()=>{this.setState({showModalImage: false})}} open={this.state.showModalImage} basic size='small'>
        <Image src={this.state.modalImage}/>
      </Modal>





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


      <Container>

        <Grid>
          <Grid.Row>
          <Grid.Column width={16}>

          <Breadcrumb>
        <Breadcrumb.Section href="/" >الرئيسية</Breadcrumb.Section>
        <Breadcrumb.Divider />
        <Breadcrumb.Section href="/admin/actors" >المواهب</Breadcrumb.Section>
        <Breadcrumb.Divider />
        <Breadcrumb.Section active>{this.state.actor.fullname}</Breadcrumb.Section>
      </Breadcrumb>
      </Grid.Column>

          </Grid.Row>
          <Grid.Row>
          <Grid.Column width={4}>
          <Card id="parent">
              <div onClick={this.handleProfilePicture.bind(this)} id="hover-content">
                اضغط لتغيير الصورة
              </div>
            <Image className="profilePic" src={this.state.actor.profilePicture} onClick={this.handleProfilePicture.bind(this)}/>
            <input accept="image/*" name="profilePicture" style={{display: 'none'}} onChange={this.handleFileChange.bind(this)} ref="fil" type="file" />

            <Card.Content>
              <Card.Header>
                {this.state.actor.fullname} <br/>
                {this.state.actor.actorid}
              </Card.Header>
              <Card.Meta>
                <span className='date'>
                  مواليد   {this.state.actor.birthdate}
                </span>
              </Card.Meta>
              <Card.Description>
                يعيش في {this.state.actor.city}
              </Card.Description>
            </Card.Content>
            <Card.Content extra>
              <Rating name="rating" rating={this.state.actor.rating} onRate={this.handleRate.bind(this, "rating")} icon='star'  maxRating={5} />
            </Card.Content>
          </Card>


          </Grid.Column>
          <Grid.Column  width={12}>


          <Grid>

        {/*

        <Grid.Column  width={4}>
          <Segment>


          <Dimmer.Dimmable
                  as={Image}
                  dimmed={active}
                  dimmer={{ active, content }}
                  onMouseEnter={this.handleShow}
                  onMouseLeave={this.handleHide}
                  size='medium'
                  src= {this.state.profilePictureData.data}
                  style={{height:160, overflow:'hidden'}}
                />
                </Segment>

          </Grid.Column>

          */}

          <Grid.Column width={16}>

            <Form.Field error={inputError.fullname}>
              <Form.Input value={this.state.actor.fullname} onChange={this.onChange.bind(this, "fullname")} label='الاسم الكامل' name='fullname' placeholder='' />
            </Form.Field>
             <Form.Group widths='equal'>
              <Form.Field error={inputError.nickname}>
               <Form.Input value={this.state.actor.nickname} onChange={this.onChange.bind(this, "nickname")} label='الاسم الفني' name='nickname' placeholder='' />
              </Form.Field>
              <Form.Field error={inputError.birthdate}>
                <label>تاريخ الميلاد</label>
                <input value={this.state.actor.birthdate} onChange={this.onChange.bind(this, "birthdate")}  type="date" name="birthdate" />
              </Form.Field>
            </Form.Group>

                          <Form.Group  inline>
                          <label>الجنس:</label>
                            <Form.Radio checked={this.state.actor.gender === 'male'}  onChange={this.onChange.bind(this, "gender")} error={inputError.gender} label='ذكر' name='gender' value='male'  />
                            <Form.Radio checked={this.state.actor.gender === 'female'} onChange={this.onChange.bind(this, "gender")} error={inputError.gender} label='انثى' name='gender' value='female'  />
                          </Form.Group>

            </Grid.Column>

            </Grid>






            <h4 className="header dividing">معلومات الاتصال</h4>

            <Form.Group widths='equal'>
              <Form.Field value={this.state.actor.email} onChange={this.onChange.bind(this, "email")} error={inputError.email} control={Input} name='email' label='البريد الالكتروني '  />
              <Form.Field value={this.state.actor.phone1} onChange={this.onChange.bind(this, "phone1")} error={inputError.phone1} control={Input} name='phone1' label='الهاتف الرئيسي' />
              <Form.Field value={this.state.actor.phone2} onChange={this.onChange.bind(this, "phone2")} control={Input} name='phone2' label='الهاتف الثانوي'  />
            </Form.Group>


            <Form.Select value={this.state.actor.city} onChange={this.onChange.bind(this, "city")} error={inputError.city} label='المحافظة' options={cities}  name='city' />

            <h4 className="header dividing">المعلومات الفنية</h4>

            <Form.Field error={inputError.fields}>
              <label>اي المجالات التالية ترغب في المشاركة فيها:</label>
              <Form.Group>
                <Form.Checkbox checked={_.contains(this.state.actor.fields, "drama")} onChange={this.onChange.bind(this, "fields")} label='الدرامية القصيرة والطويلة ' name='fields' value='drama' />
                <Form.Checkbox checked={_.contains(this.state.actor.fields, "commercials")} onChange={this.onChange.bind(this, "fields")} label='الاعلانات التجارية' name='fields' value='commercials' />
                <Form.Checkbox checked={_.contains(this.state.actor.fields, "photography")} onChange={this.onChange.bind(this, "fields")} label='التصوير الفوتوغرافي' name='fields' value='photography' />
              </Form.Group>
            </Form.Field>

            <Form.Field error={inputError.hadPreviousExperience}>
              <label>هل لديك تجربة سابقة في التمثيل؟</label>
              <Form.Group inline>
                <Form.Radio checked={this.state.actor.hadPreviousExperience === 'yes'} onChange={this.onChange.bind(this, "hadPreviousExperience")} label='نعم' name='hadPreviousExperience' value='yes'  />
                <Form.Radio checked={this.state.actor.hadPreviousExperience === 'no'} onChange={this.onChange.bind(this, "hadPreviousExperience")} label='كلا' name='hadPreviousExperience' value='no'  />
              </Form.Group>
            </Form.Field>

            <Form.TextArea value={this.state.actor.rolesList} onChange={this.onChange.bind(this, "rolesList")} error={inputError.rolesList} name='rolesList' label='ان كانت لديك تجربة سابقة في التمثيل، ما هي الاعمال، وما هو دورك فيها؟' placeholder='Anything else we should know?' rows='6' />


            <Form.Field error={inputError.trainedBefore}>
              <label>هل دخلت سابقا في دورات او ورش تدريب على التمثيل؟</label>
              <Form.Group  inline>
                <Form.Radio checked={this.state.actor.trainedBefore === 'yes'} onChange={this.onChange.bind(this, "trainedBefore")} label='نعم' name='trainedBefore' value='yes'   />
                <Form.Radio checked={this.state.actor.trainedBefore === 'no'} onChange={this.onChange.bind(this, "trainedBefore")} label='كلا' name='trainedBefore' value='no'   />
              </Form.Group>
            </Form.Field>

            <Form.Field error={inputError.readyToBeTrained}>
              <label>هل انت مستعد للدخول في دورات او ورش تدريب على التمثيل؟ </label>
              <Form.Group inline>
                <Form.Radio checked={this.state.actor.readyToBeTrained === 'yes'}  onChange={this.onChange.bind(this, "readyToBeTrained")} label='نعم' name='readyToBeTrained' value='yes'  />
                <Form.Radio checked={this.state.actor.readyToBeTrained === 'no'}  onChange={this.onChange.bind(this, "readyToBeTrained")} label='كلا' name='readyToBeTrained' value='no'   />
              </Form.Group>
            </Form.Field>


            <Form.TextArea value={this.state.actor.goodAtRoles} onChange={this.onChange.bind(this, "goodAtRoles")} error={inputError.goodAtRoles} name='goodAtRoles' label='اي أدوار تعتقد نفسك ستكون جيداً في اداءها؟' placeholder='Anything else we should know?' rows='6' />
            <Form.TextArea  value={this.state.actor.goalsAndAmbitions} onChange={this.onChange.bind(this, "goalsAndAmbitions")} error={inputError.goalsAndAmbitions} name='goalsAndAmbitions' label='ان احببت، تحدث لنا عن سبب رغبتك في التمثيل، وما هي طموحاتك في هذا المجال ' placeholder='Anything else we should know?' rows='6' />

            <Form.Field>
        <ReactCSSTransitionGroup
          transitionName="example"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={300}>

              {


                this.state.actor.images ? (this.state.actor.images.map((item, id)=>{
                  return (

                    <Image src={item} onClick={this.enlargeImage.bind(this, item)} onMouseDown={this.removeOnMouseDown.bind(this, item)} onMouseUp={this.removeOnMouseUp.bind(this, item)} key={id} size='small' spaced shape='rounded'/>


                  )
                })) : ''

              }
           </ReactCSSTransitionGroup>

            </Form.Field>

            <Form.Field>
              <FirebaseDropzone location='/actors' onStateChanged={this.handleStateChanged.bind(this)} onUrlsUpdate={this.handleUrlsUpdate.bind(this)}/>
            </Form.Field>


            <Form.Field>
            <label>الفئة</label>
              <Form.Group  inline>
                <Form.Radio checked={this.state.actor.catagory === 'مسن'} onChange={this.onChange.bind(this, "catagory")} label='مسن' name='catagory' value='مسن'   />
                <Form.Radio checked={this.state.actor.catagory === 'رجل'} onChange={this.onChange.bind(this, "catagory")} label='رجل' name='catagory' value='رجل'   />
                <Form.Radio checked={this.state.actor.catagory === 'شاب'} onChange={this.onChange.bind(this, "catagory")} label='شاب' name='catagory' value='شاب'   />
                <Form.Radio checked={this.state.actor.catagory === 'مراهق'} onChange={this.onChange.bind(this, "catagory")} label='مراهق' name='catagory' value='مراهق'   />
                <Form.Radio checked={this.state.actor.catagory === 'طفل'} onChange={this.onChange.bind(this, "catagory")} label='طفل' name='catagory' value='طفل'   />
              </Form.Group>
            </Form.Field>

            <Form.Group widths='equal'>
             <Form.Field>
              <Form.Input value={this.state.actor.length} onChange={this.onChange.bind(this, "length")} label='الطول' name='length' placeholder='' />
             </Form.Field>
             <Form.Field>
              <Form.Input value={this.state.actor.weight} onChange={this.onChange.bind(this, "weight")} label='الوزن' name='weight' placeholder='' />
             </Form.Field>
             <Form.Field>
              <Form.Input value={this.state.actor.dimension} onChange={this.onChange.bind(this, "dimension")} label='الابعاد' name='dimension' placeholder='' />
             </Form.Field>
           </Form.Group>


           <Form.Field>
            <Form.Input value={this.state.actor.appearance} onChange={this.onChange.bind(this, "appearance")} label='المظهر' name='appearance' placeholder='' />
           </Form.Field>

           <Form.Field>
            <Form.Input value={this.state.actor.workplaceandavailability} onChange={this.onChange.bind(this, "workplaceandavailability")} label='مكان العمل ومقدار التفرغ' name='workplaceandavailability' placeholder='' />
           </Form.Field>

           <Form.Field >
              <label>الفصحى</label>
              <Rating rating={this.state.actor.arabic} onRate={this.handleArabic.bind(this, "arabic")} icon='star' maxRating={5} />
           </Form.Field>

                      <Form.Field >
                         <label>العامية</label>
                         <Rating rating={this.state.actor.iraqi} onRate={this.handleIraqi.bind(this, "iraqi")} icon='star' maxRating={5} />
                      </Form.Field>

           <Form.Field>
            <Form.Input value={this.state.actor.noteaboutlangauge} onChange={this.onChange.bind(this, "noteaboutlangauge")} label='ملاحظات بخصوص اللغة' name='noteaboutlangauge' placeholder='' />
           </Form.Field>


           <Form.Field>
           <label>الحجاب</label>
             <Form.Group  inline>
               <Form.Radio checked={this.state.actor.hijab === 'محجبة'} onChange={this.onChange.bind(this, "hijab")} label='محجبة' name='hijab' value='محجبة'   />
               <Form.Radio checked={this.state.actor.hijab === 'غير محجبة'} onChange={this.onChange.bind(this, "hijab")} label='غير محجبة' name='hijab' value='غير محجبة'   />
               <Form.Radio checked={this.state.actor.hijab === 'تقبل الاثنين'} onChange={this.onChange.bind(this, "hijab")} label='تقبل الاثنين' name='hijab' value='تقبل الاثنين'   />
               <Form.Radio checked={this.state.actor.hijab === 'لا ينطبق'} onChange={this.onChange.bind(this, "hijab")} label='لا ينطبق' name='hijab' value='لا ينطبق'   />
             </Form.Group>
           </Form.Field>


           <Form.Field>
           <label>يصلح للمشاركة في ورش المشروع</label>
            <Form.Group  inline>
               <Form.Radio checked={this.state.actor.trainable === 'yes'} onChange={this.onChange.bind(this, "trainable")} label='نعم' name='trainable' value='yes'   />
               <Form.Radio checked={this.state.actor.trainable === 'no'} onChange={this.onChange.bind(this, "trainable")} label='كلا' name='trainable' value='no'   />
             </Form.Group>
           </Form.Field>


           <Form.Field>
           <label>تعامل معنا من قبل؟</label>
            <Form.Group  inline>
               <Form.Radio checked={this.state.actor.dealtwith === 'yes'} onChange={this.onChange.bind(this, "dealtwith")} label='نعم' name='dealtwith' value='yes'   />
               <Form.Radio checked={this.state.actor.dealtwith === 'no'} onChange={this.onChange.bind(this, "dealtwith")} label='كلا' name='dealtwith' value='no'   />
             </Form.Group>
           </Form.Field>

           <Form.Field>
           <label>محترف</label>
            <Form.Group  inline>
               <Form.Radio checked={this.state.actor.professional === 'yes'} onChange={this.onChange.bind(this, "professional")} label='نعم' name='professional' value='yes'   />
               <Form.Radio checked={this.state.actor.professional === 'no'} onChange={this.onChange.bind(this, "professional")} label='كلا' name='professional' value='no'   />
             </Form.Group>
           </Form.Field>

           <Form.Field>
            <Form.Input value={this.state.actor.notes} onChange={this.onChange.bind(this, "notes")} label='ملاحظات المؤسسة' name='notes' placeholder='' />
           </Form.Field>

           <Form.Field>
           <label>التقييم العام</label>
            <Rating name="rating" rating={this.state.actor.rating} onRate={this.handleRate.bind(this, "rating")} icon='star' maxRating={5} />
           </Form.Field>

            <Message
              error
              header='يرجى التأكد من معلوماتك مرة ثانية'
              list={
                errorMessages
              }
            />

            <Button primary type='submit'>تحديث</Button>
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
