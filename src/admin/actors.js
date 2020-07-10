import React, { Component } from 'react';
import './actors.css';
import '../../semantic/dist/semantic.min.css';
var _ = require('underscore');
var axios = require('axios');

var Fuse = require('fuse.js');
// var pdf = require('jspdf');

var moment = require('moment');
var papa = require('papaparse');

var rasterizeHTML = require('rasterizehtml');



import * as firebase from 'firebase';

import querybase from 'querybase';

import { Rating, Card, Segment,  Image, Dropdown, Container, Button, Checkbox, Form, Input, Message, Radio, Select, TextArea, Dimmer, Loader, Grid, Search, Table, Icon, Menu, Feed } from 'semantic-ui-react'
import { Link, Router, Route, browserHistory, applyRouterMiddleware } from 'react-router'

var Dropzone = require('react-dropzone');

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

    this.fuse = {}

    this.state = {
      city:['Baghdad'],
      type:'',
      from:'1900-01-01',
      to: moment().format('YYYY-MM-DD'),
      searchvalue: '',
      mode:'grid',
      gender:'all',
      all:'yes',
      disableFields: true,
      fields:['drama'],
      readyToBeTrained:'yes',
      hadPreviousExperience: 'yes',
      trainedBefore: 'yes',
      loading: false,
      drama:'no',
      
      catagory:'شاب',
      rating:1,
      arabic:1,
      iraqi:1,
      professional:'no',
      dealtwith:'no',

      photography:'yes',
      commercials:'yes',
      results: [],
      fullTextResults:[],
      showSearchResults:false,
      expertOptions:'no',
      disableExpertOptions: false,
      more_cat:'no',
      more_dealt:'no',
      more_pro:'no',
      more_overall:'no',
      more_ar:'no',
      more_local:'no',
      disableCat: true,
      disableDealt: true,
      disablePro: true,
      disableOverall: true,
      disableAr: true,
      disableLocal: true



    }

  }



  checkSearchResult = () => {


      if(this.state.fullTextResults.length === 0) {
        return false
      } else {
        if(this.state.showSearchResults === true){

        return <div className="search-result">
          { this.state.fullTextResults.map((item)=>{
            return <div className="search-item" key={item.id}>

              <div className="search-details">
            <Link  to={`/admin/actors/${item.id}`}>
                <h3>{item.fullname}</h3>
                <p>{item.actorid}</p>
            </Link>

              </div>


              <div className="search-img">
                <Image shape='rounded' src={item.profilePicture}/>
              </div> 

            </div>
          })}
        </div>


        }



      }


  }


  checkMode = ()=>{

    if(this.state.results.length === 0){
      return (<h1 className="centernoresults">لا توجد نتائج</h1>)
    }


    if(this.state.mode === 'list'){

        return         <Table color="blue" >

          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>الاسم والبريد الاكتروني</Table.HeaderCell>
              <Table.HeaderCell>تأريخ الميلاد</Table.HeaderCell>
              <Table.HeaderCell>رقم الهاتف</Table.HeaderCell>
              <Table.HeaderCell>المدينه</Table.HeaderCell>
              <Table.HeaderCell></Table.HeaderCell>


            </Table.Row>
          </Table.Header>

          <Table.Body>
        {
          this.state.results.map((item)=>{
            return (<Table.Row key={item.key}>
              <Table.Cell>
              <Icon name={item.gender === 'male' ? 'male' : 'female'} />

              <Link to={`/admin/actors/${item.key}`} >{item.fullname}</Link>

              </Table.Cell>
              <Table.Cell>{item.birthdate}</Table.Cell>
              <Table.Cell>{item.phone1}</Table.Cell>
              <Table.Cell>{item.city}</Table.Cell>
              <Table.Cell width={1}><Button onClick={this.deleteActor.bind(this, item.key)} size='mini' color="red"><Icon name='trash outline'/></Button></Table.Cell>

            </Table.Row>)
          })
        }

          </Table.Body>
        </Table>

    }



    if(this.state.mode === 'grid'){

        return    <Container >
         <Card.Group itemsPerRow={4}>
      


        {
          this.state.results.map((item)=>{

            return (
              <Card key={item.key}>
              <Link to={`/admin/actors/${item.key}`}>

                 <Image src={item.profilePicture} />
                 </Link>

                 <Card.Content>

                   <Card.Header>{item.fullname}</Card.Header>
                   <Card.Meta>{item.city}</Card.Meta>
                   <Card.Description>{item.address}</Card.Description>
                   <Card.Description>{item.why}</Card.Description>

                 </Card.Content>

                 <Card.Content extra>

                  <div className='ui two buttons'>
                    <Button onClick={this.deleteActor.bind(this, item.key)}  basic color='red'>حذف</Button>
                    <Button onClick={this.exportActor.bind(this, item)}  basic color='green'>تصدير</Button>
                  </div>

                 </Card.Content>


               </Card>

            )




          })



        }

        </Card.Group>
        </Container >


    }

  }

  onClickMode = (evt, {value})=> {

    this.setState({ mode: value })

  }


  onChangeDrama = (evt, {value})=> {

    let drama = this.state.drama;
    let commercials = this.state.commercials;
    let photography = this.state.photography;

    this.setState({fields:[]})

        let tmpFields = [];

        if (drama === 'no' && tmpFields.indexOf('drama') === -1 ) {
          tmpFields.push('drama')
        }

        if (commercials === 'yes' && tmpFields.indexOf('commercials') === -1) {
          tmpFields.push('commercials')
        }

        if (photography === 'yes' && tmpFields.indexOf('photography') === -1) {
          tmpFields.push('photography')
        }

        this.setState({fields:tmpFields})


    if(value === 'yes'){
      value = 'no'

    } else {
      value = 'yes'
    }


    this.setState({ drama:  value})


    this.setState({results: []});
    this.request(this.state.city);



  }


  onChangeCommercials = (evt, {value})=> {
    if(value === 'yes'){
      value = 'no'
    } else {
      value = 'yes'
    }


    this.setState({ commercials:  value})

    let drama = this.state.drama;
    let commercials = this.state.commercials;
    let photography = this.state.photography;

    this.setState({fields:[]})

        let tmpFields = [];

        if (drama === 'yes' && tmpFields.indexOf('drama') === -1 ) {
          tmpFields.push('drama')
        }

        if (commercials === 'no' && tmpFields.indexOf('commercials') === -1) {
          tmpFields.push('commercials')
        }

        if (photography === 'yes' && tmpFields.indexOf('photography') === -1) {
          tmpFields.push('photography')
        }

        this.setState({fields:tmpFields})

        this.setState({results: []});
        this.request(this.state.city);

  }

  onChangeExpertOptions = (evt, {value}) =>{


    if(value === 'yes'){
      value = 'no'
      this.setState({ disableExpertOptions:  true});

    } else {
      value = 'yes'
      this.setState({ disableExpertOptions:  false});

    }

    this.setState({ expertOptions:  value});
    this.setState({results: []});
    this.request(this.state.city);


  }



  onChangePhotography = (evt, {value})=> {
    if(value === 'yes'){
      value = 'no'
    } else {
      value = 'yes'
    }

    this.setState({ photography:  value})

    let drama = this.state.drama;
    let commercials = this.state.commercials;
    let photography = this.state.photography;


    this.setState({fields:[]})

        let tmpFields = [];

        if (drama === 'yes' && tmpFields.indexOf('drama') === -1 ) {
          tmpFields.push('drama')
        }

        if (commercials === 'yes' && tmpFields.indexOf('commercials') === -1) {
          tmpFields.push('commercials')
        }

        if (photography === 'no' && tmpFields.indexOf('photography') === -1) {
          tmpFields.push('photography')
        }

        this.setState({fields:tmpFields})

        this.setState({results: []});
        this.request(this.state.city);

  }

  onChangeAll = (evt, {value})=>{

    if(value === 'yes'){
      value = 'no'
      this.setState({ disableFields:  false});
    } else {
      value = 'yes'
      this.setState({ disableFields:  true});
    }

    this.setState({ all:  value});
    this.setState({results: []});
    this.request(this.state.city);

  }


  onChangeCat = (evt, {value})=>{

    if(value === 'yes'){
      value = 'no'
      this.setState({ disableCat:  true});
    } else {
      value = 'yes'
      this.setState({ disableCat:  false});
    }

    this.setState({ more_cat:  value});
    this.setState({results: []});
    this.request(this.state.city);

  }


  onChangeDealt = (evt, {value})=>{

    if(value === 'yes'){
      value = 'no'
      this.setState({ disableDealt:  true});
    } else {
      value = 'yes'
      this.setState({ disableDealt:  false});
    }

    this.setState({ more_dealt:  value});
    this.setState({results: []});
    this.request(this.state.city);

  }

  onChangePro = (evt, {value})=>{

    if(value === 'yes'){
      value = 'no'
      this.setState({ disablePro:  true});
    } else {
      value = 'yes'
      this.setState({ disablePro:  false});
    }

    this.setState({ more_pro:  value});
    this.setState({results: []});
    this.request(this.state.city);

  }

  onChangeOverall = (evt, {value})=>{

    if(value === 'yes'){
      value = 'no'
      this.setState({ disableOverall:  true});
    } else {
      value = 'yes'
      this.setState({ disableOverall:  false});
    }

    this.setState({ more_overall:  value});
    this.setState({results: []});
    this.request(this.state.city);

  }


  onChangeAr = (evt, {value})=>{

    if(value === 'yes'){
      value = 'no'
      this.setState({ disableAr:  true});
    } else {
      value = 'yes'
      this.setState({ disableAr:  false});
    }

    this.setState({ more_ar:  value});
    this.setState({results: []});
    this.request(this.state.city);
  }

    onChangeLocal = (evt, {value})=>{

    if(value === 'yes'){
      value = 'no'
      this.setState({ disableLocal:  true});
    } else {
      value = 'yes'
      this.setState({ disableLocal:  false});
    }

    this.setState({ more_local:  value});
    this.setState({results: []});
    this.request(this.state.city);
  }

  request = (value)=> {


    this.setState({
      loading:true
    })

    let ths = this;
    // for multiple cities we loop throup each city and add its results to the end of the list
    value.map((value)=>{
      const databaseRef = firebase.database().ref().child('profiles');
      databaseRef.orderByChild("city").equalTo(value).once("value", function(snapshot) {



        let tmpArr = [];

        for (var obj in snapshot.val()) {
          if (snapshot.val().hasOwnProperty(obj)) {

            let key = obj;
            let item = snapshot.val()[obj];
            item["key"] = key;

            // gender filteration
            if(ths.state.gender === 'all'){
              tmpArr.push(item);
            } else if(ths.state.gender === ths.state.gender){
              if(item["gender"] === ths.state.gender){
                tmpArr.push(item);
              }
            }

          }
        }


        // Construction Area
        // امانه بغداد
        // نأسف لازعاجكم نعمل لخدمتكم
        let filtered = []

        if(ths.state.all === 'yes'){


          filtered = tmpArr.filter((item)=>{

            return moment(item.birthdate).isBetween(ths.state.from, ths.state.to) 
             && ((ths.state.commercials === 'yes' ? _.contains(item.fields, "commercials") : false)
                          || (ths.state.drama === 'yes' ? _.contains(item.fields, "drama") : false)
                          || (ths.state.photography === 'yes' ? _.contains(item.fields, "photography") : false))

          
          })




        } else if(ths.state.all === 'no'){

          let filtered = tmpArr.filter((item)=>{
            return moment(item.birthdate).isBetween(ths.state.from, ths.state.to) &&
                    (item.hadPreviousExperience == ths.state.hadPreviousExperience) &&
                    (item.trainedBefore === ths.state.trainedBefore) &&
                    (item.readyToBeTrained === ths.state.readyToBeTrained)
                    && ((ths.state.commercials === 'yes' ? _.contains(item.fields, "commercials") : false)
                           || (ths.state.drama === 'yes' ? _.contains(item.fields, "drama") : false)
                           || (ths.state.photography === 'yes' ? _.contains(item.fields, "photography") : false))

          })


        }


        if (ths.state.more_ar  === 'yes') {
            filtered = filtered.filter((item)=>{
              return item.arabic === ths.state.arabic
           })
        }
        if (ths.state.more_local  === 'yes') {
            filtered = filtered.filter((item)=>{
              return item.iraqi === ths.state.iraqi
           })          
        }
        if (ths.state.more_overall  === 'yes') {
            filtered = filtered.filter((item)=>{
              return item.rating === ths.state.rating
           })            
        }
        if (ths.state.more_dealt  === 'yes') {
            filtered = filtered.filter((item)=>{
              return item.dealtwith === ths.state.dealtwith
           })            
        }
        if (ths.state.more_pro  === 'yes') {
            filtered = filtered.filter((item)=>{
              return item.professional === ths.state.professional
           })  
        }
        if (ths.state.more_cat === 'yes') {
           filtered = filtered.filter((item)=>{
              return item.catagory === ths.state.catagory
           })
        }










        ths.setState({results: ths.state.results.concat(filtered)});

        ths.setState({
          loading:false
        })


      });
    })

  }


  offlineFilter = () => {

      let ths = this;

      let tmpArr = ths.state.results;

      let filtered = tmpArr.filter((item)=>{

      let inrange = moment(item.birthdate).isBetween(ths.state.from, ths.state.to)
          // let noDiff = _.difference(item.fields, ths.state.fields).length === 0
          // _.contains(item.fields, ths.state.fields[0], ths.state.fields[1], ths.state.fields[2]




          if(ths.state.all === 'yes' && ths.state.expertOptions === 'yes')
          {

            return inrange && ((ths.state.commercials === 'yes' ? _.contains(item.fields, "commercials") : false)
                          || (ths.state.drama === 'yes' ? _.contains(item.fields, "drama") : false)
                          || (ths.state.photography === 'yes' ? _.contains(item.fields, "photography") : false))
                          && item.rating === ths.state.rating
                          && item.arabic === ths.state.arabic
                          && item.iraqi === ths.state.iraqi
                          && item.dealtwith === ths.state.dealtwith
                          && item.professional === ths.state.professional 
                          && item.catagory === ths.state.catagory 


          } else if (ths.state.all === 'no' && ths.state.expertOptions === 'no'){
            return inrange &&
                    (item.hadPreviousExperience == ths.state.hadPreviousExperience) &&
                    (item.trainedBefore === ths.state.trainedBefore) &&
                    (item.readyToBeTrained === ths.state.readyToBeTrained)
                    && ((ths.state.commercials === 'yes' ? _.contains(item.fields, "commercials") : false)
                           || (ths.state.drama === 'yes' ? _.contains(item.fields, "drama") : false)
                           || (ths.state.photography === 'yes' ? _.contains(item.fields, "photography") : false))

          } else if (ths.state.all === 'yes' && ths.state.expertOptions === 'no'){

            return inrange && ((ths.state.commercials === 'yes' ? _.contains(item.fields, "commercials") : false)
                          || (ths.state.drama === 'yes' ? _.contains(item.fields, "drama") : false)
                          || (ths.state.photography === 'yes' ? _.contains(item.fields, "photography") : false))


          } else if (ths.state.all === 'no' && ths.state.expertOptions === 'yes'){



            return inrange &&
                    (item.hadPreviousExperience == ths.state.hadPreviousExperience) &&
                    (item.trainedBefore === ths.state.trainedBefore) &&
                    (item.readyToBeTrained === ths.state.readyToBeTrained)
                    && ((ths.state.commercials === 'yes' ? _.contains(item.fields, "commercials") : false)
                           || (ths.state.drama === 'yes' ? _.contains(item.fields, "drama") : false)
                           || (ths.state.photography === 'yes' ? _.contains(item.fields, "photography") : false))
                          && item.rating === ths.state.rating
                          && item.arabic === ths.state.arabic
                          && item.iraqi === ths.state.iraqi
                          && item.dealtwith === ths.state.dealtwith
                          && item.professional === ths.state.professional 
                          && item.catagory === ths.state.catagory 




          }

        })





        ths.setState({results: ths.state.results.concat(filtered)});

        ths.setState({
          loading:false
        })

  }



  onChangeCity = (evt, {value})=> {

    let ths = this;

    ths.setState({results: [], city: value});
    this.request(value);

  }

  componentDidMount = () => {






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
  

    ths.setState({results: []});
    ths.request(ths.state.city);

    firebase.database().ref('/profiles').once("value", (snapshot)=>{

      let tmpArr = [];
      for (var obj in snapshot.val()) {
        if (snapshot.val().hasOwnProperty(obj)) {

          let key = obj;
          let item = snapshot.val()[obj];
          item["id"] = key;
          item["title"] = item.fullname;
          item["description"] = item.city;
          item["image"] = item.profilePicture;
          // delete item.city
          // delete item.fullname
          // delete item.profilePicture

          delete item.agreement
          delete item.birthdate
          delete item.email
          delete item.fields
          delete item.goodAtRoles
          delete item.gender
          delete item.goalsAndAmbitions
          delete item.hadPreviousExperience
          delete item.nickname
          delete item.phone1
          delete item.phone2
          delete item.readyToBeTrained
          delete item.rolesList
          delete item.trainedBefore


          tmpArr.push(item);

        }
      }

      var options = {
        include: ["matches"],
        shouldSort: true,
        threshold: 0.6,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 1,
        keys: [
          "fullname",
          "actorid"
      ]
      };

      ths.fuse = new Fuse(tmpArr, options)


    })



        } else {
          browserHistory.push('/admin')
        }
      });






  }

  handleResultSelect = (e, result) => {
    alert('done')
    // this.setState({ value: result.title })
  }


  handleItemClick = (e, { name }) => {

      if (name == 'المواهب') {
        browserHistory.push('/admin/actors')
      } else if (name == 'الاماكن') {
        browserHistory.push('/admin/places')
      } else if (name == 'الاصوات') {
        browserHistory.push('/admin/voices')
      } else if (name == 'الانشطة') {
        browserHistory.push('/admin/feed')
      } else if (name == 'التحليلات') {
        browserHistory.push('/admin/analytics')
      } else if (name == 'الاعضاء') {
        browserHistory.push('/admin/users')
      }

    }


    handleSearchChange = (evt)=> {


      let ths = this;
      let value = evt.target.value;

      ths.setState({searchvalue:value})



      let arr = []
      _.each(ths.fuse.search(value), (item)=>{
        delete item.item.arabic;
        delete item.item.appearance;
        delete item.item.catagory;
        delete item.item.dimension;
        delete item.item.hijab;
        delete item.item.iraqi;
        delete item.item.length;
        delete item.item.noteaboutlangauge;
        delete item.item.notes;
        delete item.item.rating;
        delete item.item.trainable;
        delete item.item.weight;
        delete item.item.image;
        delete item.item.images;
        delete item.item.workplaceandavailability;
        // delete item.item.fullname;
        // delete item.item.city;
        // delete item.item.profilePicture;


        console.log(item.item);

        arr.push(item.item)
      })

      this.setState({fullTextResults:arr})
    }

    onClickGender = (evt, {value})=> {

      this.setState({ gender: value })
      this.setState({results: []});
      this.request(this.state.city);

    }



    onClickCatagory = (evt, {value})=> {

      this.setState({ catagory: value })
      this.setState({results: []});
      this.request(this.state.city);

    }

    onClickPro = (evt, {value})=> {

      this.setState({ professional: value })
      this.setState({results: []});
      this.request(this.state.city);

    }



    onClickDealtwith = (evt, {value})=> {

      this.setState({ dealtwith: value })
      this.setState({results: []});
      this.request(this.state.city);

    }


    onClickRating = (v, e, o)=> {

      this.setState({ rating: e.rating })
      this.setState({results: []});
      this.request(this.state.city);

    }


    onClickArabic = (v, e, o)=> {

      this.setState({ arabic: e.rating })
      this.setState({results: []});
      this.request(this.state.city);

    }


    onClickIraqi = (v, e, o)=> {

      this.setState({ iraqi: e.rating })
      this.setState({results: []});
      this.request(this.state.city);


    }








    onClickFields = (evt, {value})=> {
      console.log(value);
      // this.setState({ gender: value })
    }

    onChangeDateFrom = (evt) => {
      this.setState({ from: evt.target.value })
      this.setState({results: []});
      this.request(this.state.city);

    }

    onChangeDateTo = (evt) => {
      this.setState({ to: evt.target.value })
      this.setState({results: []});
      this.request(this.state.city);

    }


    onChangeHadPreviousExperience = (evt, {value}) => {
      if(value === 'yes'){
        value = 'no'
      } else {
        value = 'yes'
      }
      this.setState({ hadPreviousExperience:  value})


      this.setState({results: []});
      this.request(this.state.city);

    }

    onChangeTrainedBefore = (evt, {value}) => {
      if(value === 'yes'){
        value = 'no'
      } else {
        value = 'yes'
      }
      this.setState({ trainedBefore:  value})

      this.setState({results: []});
      this.request(this.state.city);



    }


    onChangeReadyToBeTrained = (evt, {value}) => {
      if(value === 'yes'){
        value = 'no'
      } else {
        value = 'yes'
      }
      this.setState({ readyToBeTrained:  value})

      this.setState({results: []});
      this.request(this.state.city);




    }


    saveAsCSV =(e)=> {
      e.preventDefault()
      // console.log();

      let CSV = papa.unparse(
        this.state.results
      )

      //Generate a file name
var fileName = "Iraq Casting";
//this will remove the blank-spaces from the title and replace it with an underscore
fileName += moment().format('MMMM Do YYYY dddd');

//Initialize file format you want csv or xls
var uri = 'data:text/csv;charset=utf-8,' + encodeURI(CSV);

// Now the little tricky part.
// you can use either>> window.open(uri);
// but this will not work in some browsers
// or you will not get the correct file extension

//this trick will generate a temp <a /> tag
var link = document.createElement("a");
link.href = uri;

//set the visibility hidden so it will not effect on your web-layout
link.style = "visibility:hidden";
link.download = fileName + ".csv";

//this part will append the anchor tag and remove it after automatic click
document.body.appendChild(link);
link.click();
document.body.removeChild(link);



            let user = firebase.auth().currentUser;
            firebase.database().ref('/activties').push({
              user: user.displayName,
              operation:'csv',
              on: Date.now()
            })
       



    }

 deleteActor = (key, evt)=>{

  let tmpResults = this.state.results;
  let ths = this;
  var updatedResults = _.filter(tmpResults, function(item){ return item.key != key });
  this.setState({results: updatedResults});

  _.each(this.state.results, function(item){

    if(item.key === key) {
        let user = firebase.auth().currentUser;
        firebase.database().ref('/activties').push({
          user: user.displayName,
          photo: user.photoURL,
          operation:'delete',
          talentName: item.fullname,
          talentId: key,
          on: Date.now()
        })
    }
 
  })


  firebase.database().ref('/profiles').child(key).remove();





 }

 onFocus = () => {
    this.setState({showSearchResults: true})
  
 }

 onBlur = () => {
  setTimeout(()=>{
  this.setState({showSearchResults: false})
    
  }, 200)
 }

 exportActor = (item, e) => {
   console.log(e);
   console.log(item);
    
    let html = `
    <!DOCTYPE html> 
<html lang="en">
<head>
<meta charset="UTF-8">
    <link href="https://fonts.googleapis.com/css?family=Harmattan|Lalezar|Lemonada|Changa|Scheherazade|Cairo" rel="stylesheet">

<Style>


  div > div {
    font-weight:bold;
  }

  body {
    text-align:right; 
    font-family:Cairo !important;
  }
</Style>
</head>
<body> 
  <img style="tex-align:center" width="200px" src="${item.profilePicture}"/>
  <h1>${item.fullname}</h1>
  <div>
    <div>الرقم المميز</div>
    <p>${item.actorid || 'غير محدد'}</p>
  </div>
  <div>
    <div>المظهر</div>
    <p>${item.appearance || 'غير محدد'}</p>
  </div>

  <div>
    <div>اللغة العربية الفصحى</div>
    <p>${item.arabic  || 'غير محدد' }</p>
  </div>

  <div>
    <div>تأريخ الميلاد</div>
    <p>${item.birthdate  || 'غير محدد'}</p>
  </div>

  <div>
    <div>الاصناف</div>
    <p>${item.catagory  || 'غير محدد'}</p>
  </div>

  <div>
    <div>المدينه</div>
    <p>${item.city  || 'غير محدد'}</p>
  </div>


  <div>
    <div>تعاملنا معه</div>
    <p>${item.dealtwith  || 'غير محدد' }</p>
  </div>


  <div>
    <div>الابعاد</div>
    <p>${item.dimension  || 'غير محدد' }</p>
  </div>


  <div>
    <div>البريد الالكتروني</div>
    <p>${item.email  || 'غير محدد'}</p>
  </div>

  <div>
    <div>المجالات التي ترغب في المل بها</div>
    <p>${item.fields  || 'غير محدد'}</p>
  </div>


  <div>
    <div>الجنس</div>
    <p>${item.gender  || 'غير محدد'}</p>
  </div>

  <div>
    <div>الاسم الفني</div>
    <p>${item.nickname  || 'غير محدد'}</p>
  </div>

  <div>
    <div>الطول</div>
    <p>${item.length  || 'غير محدد'}</p>
  </div>



  <div>
    <div>الحجاب</div>
    <p>${item.hijab  || 'غير محدد'}</p>
  </div>

  <div>
    <div>رقم الهاتف الاول</div>
    <p>${item.phone1  || 'غير محدد'}</p>
  </div>

  <div>
    <div>رقم الهاتف الثاني</div>
    <p>${item.phone2  || 'غير محدد'}</p>
  </div>

  <div>
    <div>التقييم</div>
    <p>${item.rating  || 'غير محدد'}</p>
  </div>
  
  <div>
    <div>الوزن</div>
    <p>${item.weight  || 'غير محدد'}</p>
  </div>

  <div>
    <div>سبق له التمثيل من قبل</div>
    <p>${item.hadPreviousExperience  || 'غير محدد'}</p>
  </div>


  <div>
    <div>الاعمال التي قام بها ودوره فيها</div>
    <p>${item.rolesList  || 'غير محدد'}</p>
  </div>

  <div>
    <div>دخل في ورش تدريب على التثميل من قبل</div>
    <p>${item.trainedBefore  || 'غير محدد'}</p>
  </div>


  <div>
    <div>مستعد للدخول بدورات تدريبيه</div>
    <p>${item.readyToBeTrained  || 'غير محدد'}</p>
  </div>

  <div>
    <div>ادوار يعتقد انه سيكون جيدا فيها </div>
    <p>${item.goodAtRoles  || 'غير محدد'}</p>
  </div>

  <div>
    <div>لماذا يرغب في التمثيل </div>
    <p>${item.goalsAndAmbitions  || 'غير محدد'}</p>
  </div>

  <div>
    <div>الفئة </div>
    <p>${item.catagory  || 'غير محدد'}</p>
  </div>

  <div>
    <div>مكان العمل ومقدار التفرغ </div>
    <p>${item.workplaceandavailability  || 'غير محدد'}</p>
  </div>



  <div>
    <div>ملاحظات بخصوص اللغة </div>
    <p>${item.noteaboutlangauge  || 'غير محدد'}</p>
  </div>


  <div>
    <div>ملاحظات عامة </div>
    <p>${item.notes  || 'غير محدد'}</p>
  </div>

  <div>
    <div>محترف</div>
    <p>${item.professional  || 'غير محدد'}</p>
  </div>

</body>
</html>

    `

    let ths = this;

      axios.post('https://icapi.herokuapp.com/generate', {
        html: html,
        filename: item.actorid,
      })
      .then(function (response) {
        window.open(`https://icapi.herokuapp.com/${item.actorid}.pdf`)

        _.each(ths.state.results, function(itm){
        if(itm.key === item.key) {
            let user = firebase.auth().currentUser;
            firebase.database().ref('/activties').push({
              user: user.displayName,
              photo: user.photoURL,
              operation:'export',
              talentName: item.fullname,
              talentId: item.key,
              on: Date.now()
            })
          }
       
        })



      })
      .catch(function (error) {
        console.log(error.errorMessage);
      });



 }


  renderIfAdmin(){

        if(this.state.type === 'admin'){ return <span><Menu.Item icon='feed' name='الانشطة' active={false} onClick={this.handleItemClick} />
        <Menu.Item icon='pie chart' name='التحليلات' active={false} onClick={this.handleItemClick} />
        <Menu.Item icon='users' name='الاعضاء' active={false} onClick={this.handleItemClick} /></span>}

  }

  render() {
    const { gender, mode, fields, hadPreviousExperience, trainedBefore } = this.state


    return (

      <Container>


      <Grid>

      <Grid.Column width={4}>

      <Menu pointing secondary vertical>

        <Menu.Item icon='user' name='المواهب' active={true} onClick={this.handleItemClick} />
        <Menu.Item icon='world' name='الاماكن' active={false} onClick={this.handleItemClick} />
        <Menu.Item icon='sound' name='الاصوات' active={false} onClick={this.handleItemClick} />
        {this.renderIfAdmin()}

      </Menu>

      <a className='signout' onClick={()=>{firebase.auth().signOut()}}><Icon name='sign out'/>خروج</a>


      </Grid.Column>
      <Grid.Column width={12}>
     
      <div className="ui icon input sp">
        <input onFocus={this.onFocus.bind(this)} onBlur={this.onBlur.bind(this)} onChange={this.handleSearchChange.bind(this)}  className="search-input" type="text" />

        {this.checkSearchResult()}




      </div>


      <br/>
      <Form loading={this.state.loading}>
      <Form.Group widths='equal'>
      <Form.Field>
        <label>المدينه</label>

        <Dropdown  value={this.state.city} placeholder='اختر مدينه او عدة مدن' multiple onChange={this.onChangeCity.bind(this)} fluid  search selection options={cities} />
      </Form.Field>



       <Form.Field>
         <label>من </label>
         <input type="date" value={this.state.from} onChange={this.onChangeDateFrom.bind(this)}/>
       </Form.Field>
       <Form.Field>
         <label>الى</label>
         <input type="date"  value={this.state.to} onChange={this.onChangeDateTo.bind(this)}/>
       </Form.Field>
     </Form.Group>

     <Form.Group widths='equal'>



     <Form.Field>
     <label>الجنس</label>

       <Form.Group inline>

         <Form.Radio label='ذكر' name='gender' checked={gender === 'male'} onClick={this.onClickGender.bind(this)} value='male'  />
         <Form.Radio label='انثى' name='gender' checked={gender === 'female'} onClick={this.onClickGender.bind(this)} value='female'  />
         <Form.Radio label='الكل' name='gender' checked={gender === 'all'} onClick={this.onClickGender.bind(this)} value='all'  />

       </Form.Group>
     </Form.Field>

     <Form.Field >
     <label>العرض</label>

       <Form.Group inline>

         <Form.Radio label='شبكة' name='mode' checked={mode === 'grid'} onClick={this.onClickMode.bind(this)} value='grid'  />
         <Form.Radio label='قائمة' name='mode' checked={mode === 'list'} onClick={this.onClickMode.bind(this)} value='list'  />

       </Form.Group>
     </Form.Field>
     <Form.Field>
     <label>  </label>
     <Button onClick={this.saveAsCSV.bind(this)} content='Export as CSV' icon='download' color='green' labelPosition='right' />

     </Form.Field>





     </Form.Group>

    






     <Form.Group widths='equal'>

     <Form.Field>
     <label>المجالات</label>
       <Form.Group>
       <Form.Checkbox label='الدرامية القصيرة والطويلة '  onChange={this.onChangeDrama.bind(this)} name='drama'  value={this.state.drama}  checked={this.state.drama === 'yes'} />
       <Form.Checkbox label='الاعلانات التجارية'  onChange={this.onChangeCommercials.bind(this)} name='commercials' value={this.state.commercials} checked={this.state.commercials === 'yes'} />
       <Form.Checkbox label='التصوير الفوتوغرافي'   onChange={this.onChangePhotography.bind(this)} name='photography' value={this.state.photography} checked={this.state.photography === 'yes'} />
       </Form.Group>
     </Form.Field>
     <Form.Field>
     <label>الخبرات</label>

       <Form.Group>
       <Form.Checkbox label='الكل'   onChange={this.onChangeAll.bind(this)} name='all' value={this.state.all} checked={this.state.all === 'yes'} />

       <Form.Checkbox disabled={this.state.disableFields} label='  لديه تجربه سابقه '  onChange={this.onChangeHadPreviousExperience.bind(this)} name='hadPreviousExperience' value={this.state.hadPreviousExperience}  checked={this.state.hadPreviousExperience === 'yes'} />
       <Form.Checkbox disabled={this.state.disableFields} label='تم تدريبه'  onChange={this.onChangeTrainedBefore.bind(this)} name='trainedBefore' value={this.state.trainedBefore}  checked={this.state.trainedBefore === 'yes'}/>
       <Form.Checkbox disabled={this.state.disableFields} label='لايمانع ان يتم تدريبه'   onChange={this.onChangeReadyToBeTrained.bind(this)} name='readyToBeTrained' value={this.state.readyToBeTrained} checked={this.state.readyToBeTrained === 'yes'} />

       </Form.Group>
     </Form.Field>


     </Form.Group>


       




          <Form.Group widths='equal'>

            <Form.Field disabled={this.state.disableExpertOptions}>
            <label>
                <Form.Checkbox label='الفئة'   onChange={this.onChangeCat.bind(this)} name='more_cat' value={this.state.more_cat} checked={this.state.more_cat === 'yes'} />
            </label>
              <Form.Group inline >
                <Form.Radio disabled={this.state.disableCat} checked={this.state.catagory === 'مسن'}  onClick={this.onClickCatagory.bind(this)}  label='مسن' name='catagory' value='مسن'   />
                <Form.Radio disabled={this.state.disableCat} checked={this.state.catagory === 'رجل'} onClick={this.onClickCatagory.bind(this)} label='رجل' name='catagory' value='رجل'   />
                <Form.Radio disabled={this.state.disableCat} checked={this.state.catagory === 'شاب'} onClick={this.onClickCatagory.bind(this)}  label='شاب' name='catagory' value='شاب'   />
                <Form.Radio disabled={this.state.disableCat} checked={this.state.catagory === 'مراهق'} onClick={this.onClickCatagory.bind(this)} label='مراهق' name='catagory' value='مراهق'   />
                <Form.Radio disabled={this.state.disableCat} checked={this.state.catagory === 'طفل'}  onClick={this.onClickCatagory.bind(this)} label='طفل' name='catagory' value='طفل'   />
              </Form.Group>
            </Form.Field>


           <Form.Field disabled={this.state.disableExpertOptions}>
           <label>
                <Form.Checkbox label='تعامل معنا من قبل؟' onChange={this.onChangeDealt.bind(this)}   name='more_dealt' value={this.state.more_dealt} checked={this.state.more_dealt === 'yes'} />
           </label>
            <Form.Group  inline>
               <Form.Radio disabled={this.state.disableDealt} checked={this.state.dealtwith === 'yes'} onClick={this.onClickDealtwith.bind(this)} label='نعم' name='dealtwith' value='yes'   />
               <Form.Radio disabled={this.state.disableDealt} checked={this.state.dealtwith === 'no'}  onClick={this.onClickDealtwith.bind(this)} label='كلا' name='dealtwith' value='no'   />
             </Form.Group>
           </Form.Field>

           <Form.Field disabled={this.state.disableExpertOptions}>
           <label>
                <Form.Checkbox label='محترف'   onChange={this.onChangePro.bind(this)} name='more_pro' value={this.state.more_pro} checked={this.state.more_pro === 'yes'} />
           </label>
            <Form.Group  inline>
               <Form.Radio disabled={this.state.disablePro} checked={this.state.professional === 'yes'} onClick={this.onClickPro.bind(this)}  label='نعم' name='professional' value='yes'   />
               <Form.Radio  disabled={this.state.disablePro} checked={this.state.professional === 'no'} onClick={this.onClickPro.bind(this)} label='كلا' name='professional' value='no'   />
             </Form.Group>
           </Form.Field>



     </Form.Group>
    
     <Form.Group widths='equal'>

           <Form.Field disabled={this.state.disableExpertOptions}>
            <label>
              <Form.Checkbox label='التقييم العام'   onChange={this.onChangeOverall.bind(this)} name='more_overall' value={this.state.more_overall} checked={this.state.more_overall === 'yes'} />
            </label>
            <Rating name="rating" disabled={this.state.disableOverall} rating={this.state.rating}  onRate={this.onClickRating.bind(this)} icon='star' maxRating={5} />
           </Form.Field>

            <Form.Field disabled={this.state.disableExpertOptions} >
            <label>

            <Form.Checkbox label='الفصحى'   onChange={this.onChangeAr.bind(this)} name='more_ar' value={this.state.more_ar} checked={this.state.more_ar === 'yes'} />
            </label>
              
              <Rating disabled={this.state.disableAr}  rating={this.state.arabic} onRate={this.onClickArabic.bind(this)} icon='star' maxRating={5} />
           </Form.Field>

          <Form.Field disabled={this.state.disableExpertOptions} >
            <label>

            <Form.Checkbox label='العامية'   onChange={this.onChangeLocal.bind(this)} name='more_local' value={this.state.more_local} checked={this.state.more_local === 'yes'} />
            </label>
            
            <Rating rating={this.state.iraqi} disabled={this.state.disableLocal}  icon='star' onRate={this.onClickIraqi.bind(this)} maxRating={5} />
          </Form.Field>


     </Form.Group>

     </Form>


     {
       this.checkMode()
     }






      </Grid.Column>

      </Grid>
      </Container>



    );
  }
}

export default Main;
