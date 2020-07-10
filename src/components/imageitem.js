import React, {
  Component
} from 'react';

import './dropzone.css';

import '../../semantic/dist/semantic.min.css';

var pubsub = require('pubsub-js');

import {  Icon } from 'semantic-ui-react'


import * as firebase from 'firebase'

class ImageItem extends Component {

  constructor(props) {
    super(props);
    this.state = {
      images: [],
      progress:0,
      delete:false,
      name:'',
      path:''
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


  onclick(evt){
    evt.stopPropagation();
  }

  onmouseover(evt){
    this.setState({delete: true})
  }

  onmouseleave(evt){
    this.setState({delete: false})
  }

  deleteimage(guid, evt){
    console.log(this.state.path, this.state.name);

    pubsub.publish( 'DELETE ITEM', {name: guid, path: this.state.path, data: this.props.src.data });
  }


  componentDidMount(){
    // Base64 formatted string
    let ths = this;
    var metadata = {
    contentType: 'image/jpeg',
  };



    var storageRef = firebase.storage().ref(this.props.location).child( ths.props.src.name + '.png');
    var message = this.props.src.data.substring(23);
    var uploadTask = storageRef.putString(message, 'base64', metadata);
    pubsub.publish( 'ISLOADING', { isloading: true});

    uploadTask.on('state_changed', function(snapshot){
    // Observe state change events such as progress, pause, and resume
    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log('Upload is ' + progress + '% done');
    ths.setState({progress:progress})
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

    ths.setState({name: ths.props.src.name, path: downloadURL })

    pubsub.publish( 'NEW ITEM', {id: ths.props.src.name, path: downloadURL, loaded: true });
    // pubsub.publish( 'ISLOADING', { isloading: false});


  });
  }




  render() {
    return (

            <div>

            <div onMouseOver={this.onmouseover.bind(this)} onMouseLeave={this.onmouseleave.bind(this)} onClick={this.onclick.bind(this)} className="image-item">
              <img className="img" style={{filter: this.state.progress == 100 ? 'grayscale(0%)' : 'grayscale(100%)'}} src={this.props.src.data}/>
              <div className="progress-bar" style={{backgroundColor: this.state.progress == 100 ? '#21ba45' : 'cornflowerblue',
               width:this.state.progress + '%', transition:'all 1s'}}></div>

              <Icon  className="complete-icon" style={{opacity: this.state.progress == 100 ? (this.state.delete == true ? '0' : '1' ) : '0'}} size='huge' name='check circle' />
              <Icon  className="loading-icon" style={{opacity: this.state.progress == 100 || this.state.delete == true ? '0' : '1'}} size='huge' loading name='spinner' />


              <Icon onClick={this.deleteimage.bind(this, this.props.src.name)} style={{opacity: this.state.delete == true ? 1 : 0}} className="delete-icon"  size='huge' name='delete' />


            </div>

            </div>


    )
  }

}



export default ImageItem;
