import React, {
  Component
} from 'react';

var Chance = require('chance');
var chance = new Chance();

import {
  Menu,
  Divider,
  Modal,
  Button,
  Form,
  Input,
  Message,
  Dimmer,
  Image,
  Grid,
  Header,
  Segment,
  Container
} from 'semantic-ui-react'
import {
  browserHistory,
} from 'react-router'

import FirebaseDropzone from './components/dropzone';
import './actors.css';
import '../semantic/dist/semantic.min.css';

import * as firebase from 'firebase';
var _ = require('underscore');

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
  profilePicture: {
    presence: {
      message: "يرجى اختيار صورة لملفك الشخصي"
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
      profilePictureData: {
        name: '',
        data: 'https://firebasestorage.googleapis.com/v0/b/iraq-casting.appspot.com/o/assets%2Fusers%2Fmatthew.png?alt=media&token=cd1e2f1b-b60b-48f8-8183-9e7d0b39af68' // final
      },
      actor:{},
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


  success(attributes) {

    if(this.state.finishedUpload === true && this.state.imageUrls.length > 0){

      var database = firebase.database();
      database.ref('/profiles').push({
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
        images: this.state.imageUrls,
        profilePicture: this.state.profilePictureData.path,
        city: this.state.serializedForm.city,
        professional: 'yes',

        actorid: chance.hash({length:10})

      })

      this.setState({modalOpen:true, profilePictureData: {
              name: '',
              data: 'https://firebasestorage.googleapis.com/v0/b/iraq-casting.appspot.com/o/assets%2Fusers%2Fmatthew.png?alt=media&token=cd1e2f1b-b60b-48f8-8183-9e7d0b39af68' // final
            },formError: false, inputError: {
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
            }, actor: {
               fields: '',
               gender: '',
               hadPreviousExperience: '',
               trainedBefore: '',
               readyToBeTrained: '',
               fullname: '',
               nickname: '',
               birthdate: '',
               email: '',
               phone1: '',
               phone2: '',
               rolesList: '',
               goodAtRoles: '',
               goalsAndAmbitions: '',
               profilePicture: '',
               city: ''
            }})

            let ths = this;
            setTimeout(function(){

              ths.setState({modalOpen:false})
              window.location.reload()
            }, 3000);

      // this.refs.form._form.reset();


    } else {
      alert('يرجى رفع صور لشكلك بالكامل')
    }





  }


  error(errors) {



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
    if (name === 'المواهب') {
      browserHistory.push('actors')
    } else if (name === 'الاماكن') {
      browserHistory.push('places')
    } else if (name === 'الاصوات') {
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



        ths.state.profilePictureData.path = downloadURL;


      });




    };





  }


  onChange=(value, e, o)=>{
    let tmp = this.state.inputError;
    tmp[value] = false;
    this.setState({inputError: tmp});


    let tmpProp =  this.state.actor;
    tmpProp[value] = e.target.value || o.value;

    console.log(o.value);

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
    const content = (

      <div className="profilepix" onClick={this.handleProfilePicture.bind(this)}>
        <Header as='h5' inverted>صورة شخصية</Header>
        <input accept="image/*" name="profilePicture" style={{visibility: 'hidden'}} onChange={this.handleFileChange.bind(this)} ref="fil" type="file" />
      </div>
    )


    return (
      <div>

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


      <Container>
        <Grid centered>


          <Grid.Row>





          <Grid.Column  width={12}>
          <Divider horizontal>استمارة المحترفين</Divider>

          <Form ref="form" error={this.state.formError} onSubmit={this.handleSubmit}>

          <Grid>
          <Grid.Row className="computer only grid">
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
                  style={{height:160, width: 200,overflow:'hidden'}}
                />
                </Segment>

          </Grid.Column>
          <Grid.Column width={12}>

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
                          <Form.Radio checked={this.state.actor.gender === 'male'} onChange={this.onChange.bind(this, "gender")} error={inputError.gender} label='ذكر' name='gender' value='male'  />
                          <Form.Radio checked={this.state.actor.gender === 'female'} onChange={this.onChange.bind(this, "gender")} error={inputError.gender} label='انثى' name='gender' value='female'  />
                          </Form.Group>

            </Grid.Column>
            </Grid.Row>
            <Grid.Row centered className="mobile tablet only grid">
            <Grid.Column width={16}>
            <Segment className="tabletfix">


            <Dimmer.Dimmable
                    as={Image}
                    dimmed={active}
                    dimmer={{ active, content }}
                    onMouseEnter={this.handleShow}
                    onMouseLeave={this.handleHide}
                    size='medium'
                    width="200"
                    src= {this.state.profilePictureData.data}
                    style={{height:160, width:200, overflow:'hidden'}}
                  />
                  </Segment>

            </Grid.Column>
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
                              <Form.Radio checked={this.state.actor.gender === 'male'} onChange={this.onChange.bind(this, "gender")} error={inputError.gender} label='ذكر' name='gender' value='male'  />
                              <Form.Radio checked={this.state.actor.gender === 'female'} onChange={this.onChange.bind(this, "gender")} error={inputError.gender} label='انثى' name='gender' value='female'  />
                            </Form.Group>

              </Grid.Column>
              </Grid.Row>



            </Grid>

            <Divider horizontal> معلومات الاتصال</Divider>

            <Form.Group widths='equal'>
              <Form.Field value={this.state.actor.email} onChange={this.onChange.bind(this, "email")} error={inputError.email} control={Input} name='email' label='البريد الالكتروني '  />
              <Form.Field value={this.state.actor.phone1} onChange={this.onChange.bind(this, "phone1")} error={inputError.phone1} control={Input} name='phone1' label='الهاتف الرئيسي' />
              <Form.Field value={this.state.actor.phone2} onChange={this.onChange.bind(this, "phone2")} control={Input} name='phone2' label='الهاتف الثانوي'  />
            </Form.Group>


            <Form.Select value={this.state.actor.city} onChange={this.onChange.bind(this, "city")} error={inputError.city} label='المحافظة' options={cities}  name='city' />

            <Divider horizontal> المعلومات الفنية</Divider>


            <Form.Field error={inputError.fields}>
              <label>اي المجالات التالية ترغب في المشاركة فيها:</label>
              <Form.Group>
                <Form.Checkbox onChange={this.onChange.bind(this, "fields")} label='الدرامية القصيرة والطويلة ' name='fields' value='drama' />
                <Form.Checkbox onChange={this.onChange.bind(this, "fields")} label='الاعلانات التجارية' name='fields' value='commercials' />
                <Form.Checkbox onChange={this.onChange.bind(this, "fields")} label='التصوير الفوتوغرافي' name='fields' value='photography' />
              </Form.Group>
            </Form.Field>

            <Form.Field error={inputError.hadPreviousExperience}>
              <label>هل لديك تجربة سابقة في التمثيل؟</label>
              <Form.Group inline>
                <Form.Radio checked={this.state.actor.hadPreviousExperience === 'yes'} onChange={this.onChange.bind(this, "hadPreviousExperience")} label='نعم' name='hadPreviousExperience' value='yes'  />
                <Form.Radio checked={this.state.actor.hadPreviousExperience === 'no'} onChange={this.onChange.bind(this, "hadPreviousExperience")} label='كلا' name='hadPreviousExperience' value='no'  />
              </Form.Group>
            </Form.Field>

            <Form.TextArea value={this.state.actor.rolesList} onChange={this.onChange.bind(this, "rolesList")} error={inputError.rolesList} name='rolesList' label='ان كانت لديك تجربة سابقة في التمثيل، ما هي الاعمال، وما هو دورك فيها؟ ارفق روابط ان وجدت'  rows='3' />


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
                <Form.Radio checked={this.state.actor.readyToBeTrained === 'yes'} onChange={this.onChange.bind(this, "readyToBeTrained")} label='نعم' name='readyToBeTrained' value='yes'  />
                <Form.Radio checked={this.state.actor.readyToBeTrained === 'no'} onChange={this.onChange.bind(this, "readyToBeTrained")} label='كلا' name='readyToBeTrained' value='no'   />
              </Form.Group>
            </Form.Field>


            <Form.TextArea value={this.state.actor.goodAtRoles} onChange={this.onChange.bind(this, "goodAtRoles")} error={inputError.goodAtRoles} name='goodAtRoles' label='اي أدوار تعتقد نفسك ستكون جيداً في اداءها؟'  rows='3' />
            <Form.TextArea value={this.state.actor.goalsAndAmbitions} onChange={this.onChange.bind(this, "goalsAndAmbitions")} error={inputError.goalsAndAmbitions} name='goalsAndAmbitions' label='ان احببت، تحدث لنا عن سبب رغبتك في التمثيل، وما هي طموحاتك في هذا المجال '  rows='3' />



            <Form.Field>
              <FirebaseDropzone location='/actors' onStateChanged={this.handleStateChanged.bind(this)} onUrlsUpdate={this.handleUrlsUpdate.bind(this)}/>
            </Form.Field>


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



      </div>
    );
  }

  }

  export default Main;
