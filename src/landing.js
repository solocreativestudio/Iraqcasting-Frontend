import React, {
  Component
} from 'react';

var pubsub = require('pubsub-js');

import {
  Menu,
  Divider,
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


import './landing.css';
import '../semantic/dist/semantic.min.css';

import * as firebase from 'firebase';
var _ = require('underscore');






  





class Main extends Component {

  constructor(props) {
    super(props);
    this.state = {}


  }

gotopro = () => {
  browserHistory.push('/pro')
}

gotoactor = () => {
  browserHistory.push('/actors')
}

gotoFB = () => {
  window.location = 'https://fb.com/iraqcasting'
}

  





  render() {



    return (
      <div className="background">
        <img className="logo" width="120px" src="https://firebasestorage.googleapis.com/v0/b/iraq-casting.appspot.com/o/assets%2Flogoawj.png?alt=media&token=50e2d46c-ade3-4754-85db-8677f341e5c0"/>
        <div className="copy1">

          <div className="line1">سجل موهبتك, طوّر مهاراتك</div>
          <div className="line2">وأحصل على فرص أكثر.</div>
          <br/>  
          <br/>  


          <Button onClick={this.gotopro.bind(this)} basic color='grey'>المحترفين</Button>
          <Button onClick={this.gotoactor.bind(this)} color='orange'>الهواة</Button>

        </div>
        <div className="copy2">
          <p>اذا كنت تبحث عن موهبة لعملك القادم اتصل على 07707711454</p>
        </div>

        <div className="tri1">
          
          <svg width="300" height="300">
          <defs>
              <linearGradient id="grad1">
                  <stop offset="0%" stopColor="#f2644b"/>
                  <stop offset="100%" stopColor="#c89e41"/>
              </linearGradient>
          </defs>
          <path d="M 0,300 L 150,0 L 300,300" fill="url(#grad1)"/>          

          </svg>
    
        </div>
        <div className="tri2">
            <img width="300px" src="https://firebasestorage.googleapis.com/v0/b/iraq-casting.appspot.com/o/assets%2Fawjicon2.png?alt=media&token=9ec086f5-cedc-410b-8b42-7d6a18433b91" />
        </div>

        <Icon onClick={this.gotoFB.bind(this)} className="fb" size="large" name='facebook square' />
        
        <div className="awj">
          powered by <a href="https://fb.com/ALAWJMEDIA">AlAwj Media</a>
        </div>

        <div className="solo">
          developed by <a href="https://fb.com/solocreativestudio">SoloStudio.co</a>
        </div>

      </div>
    );
  }

  }

  export default Main;
