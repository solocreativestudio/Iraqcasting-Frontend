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
import './clientArea.css';
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
                
                }

              })

          firebase.database().ref('/profiles').orderByChild('actorid').equalTo(ths.props.params.id).on('value', (snap)=>{

            console.log(snap.val());
            let tmpActor = snap.val()[Object.keys(snap.val())];
            ths.setState({actor:tmpActor, isloading:false})


          })

        } else {
          browserHistory.push('/admin')
        }
      });



  }








  render() {


    return (
      <div className="centercolumn">
        
          <Card id="parent">

            <Image className="profilePic" src={this.state.actor.profilePicture}/>

            <Card.Content>
              <Card.Header>
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
          </Card>

      <a className='signout' onClick={()=>{firebase.auth().signOut()}}><Icon name='sign out'/>خروج</a>

        </div>
    );
  }

  }

  export default Main;
