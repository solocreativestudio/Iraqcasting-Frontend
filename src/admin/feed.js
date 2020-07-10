import React, { Component } from 'react';
import './feed.css';
import '../../semantic/dist/semantic.min.css';
import * as firebase from 'firebase';

var moment = require('moment');

import { Segment, Image,Button, Checkbox, Form, Input, Message, Radio, Select, TextArea, Dimmer, Loader, Grid, Search, Table, Icon, Menu, Feed } from 'semantic-ui-react'
import {Link, browserHistory} from 'react-router';

var Dropzone = require('react-dropzone');

moment().get('date');



class Main extends Component {

    constructor(props){
      super(props);

      this.state = {
        activties:[],
        isloading: true,
        from: moment().subtract(1, "days").format('YYYY-MM-DD'),
        to: moment().format('YYYY-MM-DD'),
      }

    }


    onChangeDateFrom = (evt) => {

      this.setState({from: evt.target.value })
      this.setState({activties: [], isloading: true})
      this.request();

    }

    onChangeDateTo = (evt) => {
      this.setState({ to: evt.target.value })
      this.setState({activties: [], isloading: true})
      this.request();
    }



    request = () => {
      let ths = this;
    
      let from = moment(this.state.from).subtract(2, "days").valueOf();
      let to = moment(this.state.to).add(2, "days").valueOf();


      // let from = this.state.from;
      // let to = this.state.to;


      // let from = Date.parse(this.state.from)
      // let to = Date.parse(this.state.to)


      console.log(from, to);



      firebase.database().ref().child('activties')
      .orderByChild("on")
      .startAt(from)
      .endAt(to)
      .once("value", function(snapshot) {

        console.log(snapshot.val());

        let tmpArr = [];

        for (var obj in snapshot.val()) {
          if (snapshot.val().hasOwnProperty(obj)) {

            let key = obj;
            let item = snapshot.val()[obj];
            item["key"] = key;

            tmpArr.push(item);

          }
        }


        tmpArr.reverse()
        ths.setState({activties: tmpArr, isloading: false})



      })


    }





    componentDidMount = ()=>{

      let ths = this;

      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {



            firebase.database().ref().child('/users').orderByChild('uid').equalTo(user.uid).once("value",(snapshot)=>{

                console.log(snapshot.val())

                if (snapshot.val() === null) {
                  ths.setState({
                    type: "admin" 
                  })


                } else {
                  let type = snapshot.val()[Object.keys(snapshot.val())].type

                  if(type === 'staff' || type === 'expert'){
                     browserHistory.push('/admin/actors')
                  } else if(type === 'client'){
                       browserHistory.push('/notallowed')
                  }
                }




              })


      

        } else {
          browserHistory.push('/admin')
        }
      });

      ths.request();


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


      printType = (item) => {
          
          if(item.operation === 'print') {
          return <Feed.Summary>قام  <Feed.User>{item.user}</Feed.User> بطباعة بيانات <Link to={`/admin/actors/${item.talentId}`}>{item.talentName}</Link>
          <Feed.Date>{moment(item.on).fromNow()}</Feed.Date></Feed.Summary>


          } else if(item.operation === 'checked'){
             return <Feed.Summary>قام  <Feed.User>{item.user}</Feed.User> بمشاهدة بيانات <Link to={`/admin/actors/${item.talentId}`}>{item.talentName}</Link>
          <Feed.Date>{moment(item.on).fromNow()}</Feed.Date></Feed.Summary>
          } else if(item.operation === 'delete'){
             return <Feed.Summary>قام  <Feed.User>{item.user}</Feed.User> بحذف بيانات <Link to={`/admin/actors/${item.talentId}`}>{item.talentName}</Link>
            <Feed.Date>{moment(item.on).fromNow()}</Feed.Date></Feed.Summary>
          } else if(item.operation === 'update'){
             return <Feed.Summary>قام  <Feed.User>{item.user}</Feed.User> بتحديث بيانات <Link to={`/admin/actors/${item.talentId}`}>{item.talentName}</Link>
            <Feed.Date>{moment(item.on).fromNow()}</Feed.Date></Feed.Summary>
          } else if(item.operation === 'export'){
             return <Feed.Summary>قام  <Feed.User>{item.user}</Feed.User> بتصدير بيانات <Link to={`/admin/actors/${item.talentId}`}>{item.talentName}</Link>
            <Feed.Date>{moment(item.on).fromNow()}</Feed.Date></Feed.Summary>
          } if(item.operation === 'csv'){
             return <Feed.Summary>قام  <Feed.User>{item.user}</Feed.User> بتصدير بيانات مجموعة من المواهب
            <Feed.Date>{moment(item.on).fromNow()}</Feed.Date></Feed.Summary>
          }
      
      }

      imageType = (item) => {

          if(item.operation === 'print') {
            return <Icon name="print" color="blue"/>
          } else if(item.operation === 'checked') {
            return <Icon name="low vision" color="green"/>
          } else if(item.operation === 'delete') {
            return <Icon name="remove" color="red"/>
          } else if(item.operation === 'update') {
            return <Icon name="save" color="yellow"/>
          } else if(item.operation === 'export') {
            return <Icon name="file pdf outline" color="paige"/>
          } else if(item.operation === 'csv') {
            return <Icon name="file excel outline" color="paige"/>
          }
       
      }


  render() {
    return (
      <div className="ui container">


      <Grid>

      <Grid.Column width={4}>


      <Menu pointing secondary vertical>
        <Menu.Item icon='user' name='المواهب' active={false} onClick={this.handleItemClick} />
        <Menu.Item icon='world' name='الاماكن' active={false} onClick={this.handleItemClick} />
        <Menu.Item icon='sound' name='الاصوات' active={false} onClick={this.handleItemClick} />
        <Menu.Item icon='feed' name='الانشطة' active={true} onClick={this.handleItemClick} />
        <Menu.Item icon='pie chart' name='التحليلات' active={false} onClick={this.handleItemClick} />
        <Menu.Item icon='users' name='الاعضاء' active={false} onClick={this.handleItemClick} />

      </Menu>




      </Grid.Column>
      <Grid.Column width={12}>

      <Form>
      <Form.Group widths='equal'>
       <Form.Field>
         <label>من </label>
         <input type="date" value={this.state.from} onChange={this.onChangeDateFrom.bind(this)}/>
       </Form.Field>
       <Form.Field>
         <label>الى</label>
         <input type="date"  value={this.state.to} onChange={this.onChangeDateTo.bind(this)}/>
       </Form.Field>
     </Form.Group>
    </Form>

      <Segment  className="segmentfix" vertical>
          <Dimmer inverted active={this.state.isloading}>
            <Loader  inverted content='جاري التحميل' />
          </Dimmer>
          <Feed>

        {
          this.state.activties.map((item,id)=>{
            return (
              <Feed.Event key={item.key}>
                <Feed.Label>
                  {this.imageType(item)}
                </Feed.Label>
                <Feed.Content>
                  {this.printType(item)}
                </Feed.Content>
              </Feed.Event>
            )
          })
        }
        </Feed>


      </Segment>







      </Grid.Column>

      </Grid>


      <a className='signout' onClick={()=>{firebase.auth().signOut()}}><Icon name='sign out'/>خروج</a>

      </div>
    );
  }
}

export default Main;
