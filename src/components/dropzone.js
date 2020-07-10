import React, { Component } from 'react';
var _ = require('underscore')
import './dropzone.css';

import ImageItem from './imageitem'
import '../../semantic/dist/semantic.min.css';


import {  Icon } from 'semantic-ui-react'
var pubsub = require('pubsub-js');

class FirebaseDropzone extends Component{

  constructor(props) {
    super(props);
    this.state = {
      images:[], // {name, data}
      imagesUrls:[] // [] path
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
    this.refs.fil.click()
  }



  componentDidMount(){

    var newItem = pubsub.subscribe( 'NEW ITEM', (id, item)=>{



      console.log(item);

      let tmpImages = this.state.images;

      _.each(tmpImages, (itm, i)=>{


        if(tmpImages[i].name == item.id){
          tmpImages[i].loaded = true;
        }

      })

      let loadingState = tmpImages.every((itm)=>{
          return itm.loaded === true;
      });

      this.props.onStateChanged(loadingState);


      this.setState({images: tmpImages});
      this.setState({imagesUrls: this.state.imagesUrls.concat([item.path])})
      this.props.onUrlsUpdate(this.state.imagesUrls);
    });


    var delItem = pubsub.subscribe( 'DELETE ITEM', (id, item)=>{

      const imagesState = this.state.images;

      let newArray = imagesState.filter(function(el) {
          return el.name !== item.name;
      });

      this.setState({images: newArray})


      const newState = this.state.imagesUrls;
      if (newState.indexOf(item.path) > -1) {
        newState.splice(newState.indexOf(item.path), 1);
        this.setState({imagesUrls: newState})
      }

      this.props.onUrlsUpdate(this.state.imagesUrls);

      let tmpImages = this.state.images;
      let loadingState = tmpImages.every((itm)=>{
          return itm.loaded === true;
      });

      this.props.onStateChanged(loadingState);


    });


  }




  onchange(evt){



    let ths = this;

    for (var i = 0; i < evt.target.files.length; i++) {
      let reader = new FileReader();
      reader.readAsDataURL(evt.target.files[i] );
      reader.onload = function () {
        ths.setState({
          // guid origin
          images: ths.state.images.concat([{name: ths.guid(), data: reader.result, loaded: false}])
        })


        let tmpImages = ths.state.images;
        let loadingState = tmpImages.every((itm)=>{
            return itm.loaded === true;
        });
        ths.props.onStateChanged(loadingState);

      };
    }


  }



  render(){
    return(

      <div>


        <div onClick={this.onclick.bind(this)}  className="image-grid">





      {

        this.state.images.map((item)=>{

          return <ImageItem location={this.props.location} key={item.id} src={item} />

        })

      }
      <div className="image-add">
        <Icon size='huge' name='add' />
      </div>
      </div>


        <input accept="image/*" style={{visibility: 'hidden'}} onChange={this.onchange.bind(this)} name="imageitem" ref="fil" type="file" multiple />

      </div>


    )
  }


}

// FirebaseDropzone.propTypes = {
//   onUrlsUpdate: React.PropTypes.func,
// };
//

export default FirebaseDropzone;
