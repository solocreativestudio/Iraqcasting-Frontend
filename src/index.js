import React from 'react';
import ReactDOM from 'react-dom';
import * as firebase from 'firebase';


import LandingPage from './landing';
import NotAllowed from './admin/notallowed';
import HelloClient from './admin/helloclient';


import Actors from './actors';
import Pro from './pro';
import Places from './places';
import Voices from './voices';



import Profile from './admin/profile';
import ActorsList from './admin/actors';
import EditActor from './admin/editactor';
import Users from './admin/users';


import editPlace from './admin/editPlace';
import editVoice from './admin/editVoice';



import Feed from './admin/feed';
import AdminPlaces from './admin/places';
import AdminVoices from './admin/voices';
import Analytics from './admin/analytics';


import ClientArea from './admin/clientArea';



import Login from './admin/login';




import './index.css';

import { Router, Route, browserHistory, applyRouterMiddleware } from 'react-router'
import {useTransitions, withTransition} from 'react-router-transitions';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';



// Initialize Firebase
var config = {
  apiKey: "AIzaSyBKMq0wB-wijy9DBskhP8849CdjDBgprvs",
  authDomain: "iraq-casting.firebaseapp.com",
  databaseURL: "https://iraq-casting.firebaseio.com",
  storageBucket: "iraq-casting.appspot.com",
  messagingSenderId: "94247365337"
};
firebase.initializeApp(config);



ReactDOM.render(
  <Router
    history={browserHistory}>
    <Route path="/" component={LandingPage} />
    <Route path="/talents/:id" component={ClientArea} />
    <Route path="/notallowed" component={NotAllowed} />
    <Route path="/helloclient" component={HelloClient} />

    <Route path="/admin" component={Login} />
    <Route path="/admin/actors" component={ActorsList} />
    <Route path="/admin/actors/:id" component={EditActor} />

    <Route path="/admin/feed" component={Feed} />
    <Route path="/admin/places" component={AdminPlaces} />
    <Route path="/admin/places/:id" component={editPlace} />

    <Route path="/admin/voices" component={AdminVoices} />
    <Route path="/admin/voices/:id" component={editVoice} />

    <Route path="/admin/analytics" component={Analytics} />


    <Route path="/admin/users" component={Users} />

    <Route path="/actors" component={Actors} />
    <Route path="/pro" component={Pro} />
    <Route path="/places" component={Places}/>
    <Route path="/voices" component={Voices}/>



  </Router>,
  document.getElementById('root')
);
