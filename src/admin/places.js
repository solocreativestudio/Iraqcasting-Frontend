import React, { Component } from 'react';
import './actors.css';
import '../../semantic/dist/semantic.min.css';
var _ = require('underscore');

var Fuse = require('fuse.js');

var moment = require('moment');

import * as firebase from 'firebase';

import querybase from 'querybase';

import { Card, Image, Header, Dropdown, Container, Button, Checkbox, Form, Input, Message, Radio, Select, TextArea, Dimmer, Loader, Grid, Search, Table, Icon, Menu, Feed } from 'semantic-ui-react'
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
      mode: 'grid',
      loading: false,
      results: []
    }

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


  request = (value)=> {



    let ths = this;
    // for multiple cities we loop throup each city and add its results to the end of the list
    value.map((value)=>{
      const databaseRef = firebase.database().ref().child('places');
      databaseRef.orderByChild("city").equalTo(value).once("value", function(snapshot) {
        let tmpArr = [];

        for (var obj in snapshot.val()) {
          if (snapshot.val().hasOwnProperty(obj)) {

            let key = obj;
            let item = snapshot.val()[obj];
            item["key"] = key;
            tmpArr.push(item);

          }
        }


        ths.setState({results: ths.state.results.concat(tmpArr)});

      });
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

    firebase.database().ref('/places').once("value", (snapshot)=>{

      let tmpArr = [];
      for (var obj in snapshot.val()) {
        if (snapshot.val().hasOwnProperty(obj)) {

          let key = obj;
          let item = snapshot.val()[obj];
          item["id"] = key;
          item["title"] = item.title;
          item["description"] = item.why;
          item["image"] = item.images[0];
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
          "title",
          "address"
      ]
      };

      ths.fuse = new Fuse(tmpArr, options)


    })





        } else {
          browserHistory.push('/admin')
        }
      });





  }


  deletePlace = (key, evt)=>{
   console.log(key);
   console.log(this.state.results);

   let tmpResults = this.state.results;

   var updatedResults = _.filter(tmpResults, function(item){ return item.key != key });
   this.setState({results: updatedResults});

   firebase.database().ref('/places').child(key).remove();
   //
   // let user = firebase.auth().currentUser;
   // firebase.database().ref('/activties').push({
   //   user: user.displayName,
   //   photo: user.photoURL,
   //   operation:'deleted',
   //   talentName: tmpActor.fullname,
   //   talentId: this.props.params.id,
   //   on: Date.now()
   // })


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

    checkMode = ()=>{
          if(this.state.results.length === 0){
            return (<h1 className="centernoresults">لا توجد نتائج</h1>)
          }

      if(this.state.mode === 'list'){

          return   <Table color="blue" >

            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>اسم المكان</Table.HeaderCell>
                <Table.HeaderCell>المدينه</Table.HeaderCell>
                <Table.HeaderCell>لماذا</Table.HeaderCell>
                <Table.HeaderCell>رقم الهاتف</Table.HeaderCell>
                <Table.HeaderCell>الاسم</Table.HeaderCell>
                <Table.HeaderCell></Table.HeaderCell>


              </Table.Row>
            </Table.Header>

            <Table.Body>
          {
            this.state.results.map((item)=>{

              return (
                <Table.Row key={item.key}>
                <Table.Cell><Link to={`/admin/places/${item.key}`}>{item.title}</Link></Table.Cell>
                <Table.Cell>{item.city}</Table.Cell>
                <Table.Cell>{item.why}</Table.Cell>
                <Table.Cell>{item.phone}</Table.Cell>
                <Table.Cell>{item.fullname}</Table.Cell>
                <Table.Cell width={1}><Button onClick={this.deletePlace.bind(this, item.key)} size='mini' color="red"><Icon name='trash outline'/></Button></Table.Cell>

              </Table.Row>
              )





            })



          }

            </Table.Body>
          </Table>


      }



      if(this.state.mode === 'grid'){

          return     <Card.Group itemsPerRow={3}>


          {
            this.state.results.map((item)=>{

              return (
                <Card key={item.key}>
                <Link to={`/admin/places/${item.key}`}>

                   <Image src={item.images[0]} />
                   </Link>

                   <Card.Content>

                     <Card.Header>{item.title}</Card.Header>
                     <Card.Meta>{item.city} <br/><span className="address">{item.address}</span></Card.Meta>
                     <Card.Description></Card.Description>
                     <Card.Description>{item.why}</Card.Description>

                   </Card.Content>

                   <Card.Content extra>
                   <a onClick={this.deletePlace.bind(this, item.key)}>
                     <Icon name='trash' color='red' />
                     حذف
                    </a>
                   </Card.Content>


                 </Card>

              )




            })



          }

          </Card.Group>



      }

    }


    handleSearchChange = (evt, value)=> {


      let arr = []
      _.each(this.fuse.search(value), (item)=>{
        console.log(item.item);
        arr.push(item.item)
      })

      this.setState({fullTextResults:arr})
    }

    onClickMode = (evt, {value})=> {

      this.setState({ mode: value })

    }


      renderIfAdmin(){

        if(this.state.type === 'admin'){ return <span><Menu.Item icon='feed' name='الانشطة' active={false} onClick={this.handleItemClick} />
        <Menu.Item icon='pie chart' name='التحليلات' active={false} onClick={this.handleItemClick} />
        <Menu.Item icon='users' name='الاعضاء' active={false} onClick={this.handleItemClick} /></span>}

  }


  render() {
    const { mode } = this.state;

    return (

      <Container>


      <Grid>

      <Grid.Column width={4}>

      <Menu pointing secondary vertical>
        <Menu.Item icon='user' name='المواهب' active={false} onClick={this.handleItemClick} />
        <Menu.Item icon='world' name='الاماكن' active={true} onClick={this.handleItemClick} />
        <Menu.Item icon='sound' name='الاصوات' active={false} onClick={this.handleItemClick} />
        {this.renderIfAdmin()}
      </Menu>

      </Grid.Column>
      <Grid.Column width={12}>


      <Form loading={this.state.loading}>
      <Form.Group>
      <Form.Field width={10}>
        <label>المدينه</label>

        <Dropdown  value={this.state.city} placeholder='اختر مدينه او عدة مدن' multiple onChange={this.onChangeCity.bind(this)} fluid  search selection options={cities} />
      </Form.Field>


      <Form.Field width={6}>
      <label>العرض</label>

        <Form.Group inline>

          <Form.Radio label='شبكة' name='mode' checked={mode === 'grid'} onClick={this.onClickMode.bind(this)} value='grid'  />
          <Form.Radio label='قائمة' name='mode' checked={mode === 'list'} onClick={this.onClickMode.bind(this)} value='list'  />

        </Form.Group>
      </Form.Field>
      </Form.Group>
      <a className='signout' onClick={()=>{firebase.auth().signOut()}}><Icon name='sign out'/>خروج</a>



     </Form>



     {this.checkMode()}




      </Grid.Column>

      </Grid>

      </Container>



    );
  }
}

export default Main;
