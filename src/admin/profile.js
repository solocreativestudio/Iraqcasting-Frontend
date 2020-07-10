import React, { Component } from 'react';
import './actors.css';
import '../../semantic/dist/semantic.min.css';
var _ = require('underscore');

var Fuse = require('fuse.js');

var moment = require('moment');

import * as firebase from 'firebase';

import querybase from 'querybase';

import { Dropdown, Container, Button, Checkbox, Form, Input, Message, Radio, Select, TextArea, Dimmer, Loader, Grid, Search, Table, Icon, Menu, Feed } from 'semantic-ui-react'
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
      activeItem:'المواهب',
      city:['Baghdad'],
      from:'2016-12-01',
      to:'2016-12-15',
      gender:'all',
      all:'yes',
      disableFields: true,
      fields:[],
      readyToBeTrained:'yes',
      hadPreviousExperience: 'yes',
      trainedBefore: 'yes',
      loading: false,
      drama:'no',
      photography:'no',
      commercials:'no',
      results: []
    }

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


  request = (value)=> {
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


        let filtered = tmpArr.filter((item)=>{

          let inrange = moment(item.birthdate).isBetween(ths.state.from, ths.state.to)
          // let noDiff = _.difference(item.fields, ths.state.fields).length === 0
          // _.contains(item.fields, ths.state.fields[0], ths.state.fields[1], ths.state.fields[2]




          if(ths.state.all === 'yes')
          {

            return inrange

          } else {
            return inrange &&
                    (item.hadPreviousExperience == ths.state.hadPreviousExperience) &&
                    (item.trainedBefore === ths.state.trainedBefore) &&
                    (item.readyToBeTrained === ths.state.readyToBeTrained)
          }

        })





        ths.setState({results: ths.state.results.concat(filtered)});

      });
    })

  }

  onChangeCity = (evt, {value})=> {

    let ths = this;

    ths.setState({results: [], city: value});
    this.request(value);

  }

  componentDidMount = () => {



    this.setState({results: []});
    this.request(this.state.city);

    firebase.database().ref('/profiles').once("value", (snapshot)=>{

      let tmpArr = [];
      for (var obj in snapshot.val()) {
        if (snapshot.val().hasOwnProperty(obj)) {

          let key = obj;
          let item = snapshot.val()[obj];
          item["id"] = key;

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
          "city"
      ]
      };

      this.fuse = new Fuse(tmpArr, options)


    })




  }


  handleItemClick = (e, { name }) => {

      if (name == 'المواهب') {
        browserHistory.push('/')
      } else if (name == 'الاماكن') {
        browserHistory.push('places')
      } else if (name == 'الاصوات') {
        browserHistory.push('voices')
      } else if (name == 'الانشطة') {
        browserHistory.push('feed')
      } else if (name == 'التحليلات') {
        browserHistory.push('analytics')
      }

      this.setState({ activeItem: name })
    }


    handleSearchChange = (evt, value)=> {

      console.log(value);
      console.log(this.fuse.search(value));

    }

    onClickGender = (evt, {value})=> {

      this.setState({ gender: value })
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




  render() {
    const { activeItem, gender, fields, hadPreviousExperience, trainedBefore } = this.state


    return (

      <Container>


      <Grid>

      <Grid.Column width={4}>

      <Menu pointing secondary vertical>
        <Menu.Item icon='feed' name='الانشطة' active={activeItem === 'الانشطة'} onClick={this.handleItemClick} />

        <Menu.Item icon='user' name='المواهب' active={activeItem === 'المواهب'} onClick={this.handleItemClick} />
        <Menu.Item icon='world' name='الاماكن' active={activeItem === 'الاماكن'} onClick={this.handleItemClick} />
        <Menu.Item icon='sound' name='الاصوات' active={activeItem === 'الاصوات'} onClick={this.handleItemClick} />
        <Menu.Item icon='pie chart' name='التحليلات' active={activeItem === 'التحليلات'} onClick={this.handleItemClick} />

      </Menu>


        <div className="contact-us">
          اذا كنت تبحث عن موهبة لعملك القادم
           اتصل بنا على الرقم : +٩٦٤٧٧٢٢٢٥٠٠٤٢
        </div>
        <div className="developer">
          تطوير سولو ستوديو
        </div>

      </Grid.Column>
      <Grid.Column width={12}>

      <Search   onSearchChange={this.handleSearchChange.bind(this)} />

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

     </Form>



      <Table color="blue" >

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

      {item.fullname}

      </Table.Cell>
      <Table.Cell>{item.birthdate}</Table.Cell>
      <Table.Cell>{item.phone1}</Table.Cell>
      <Table.Cell>{item.city}</Table.Cell>
      <Table.Cell><Button size='mini' color="red"><Icon name='trash outline'/></Button></Table.Cell>

    </Table.Row>)
  })
}

  </Table.Body>
</Table>



<Menu pagination>
  <Menu.Item name='1'  />
  <Menu.Item name='2'  />
  <Menu.Item name='3'  />
  <Menu.Item name='4'  />
  <Menu.Item name='5'  />

</Menu>

      </Grid.Column>

      </Grid>

      </Container>



    );
  }
}

export default Main;
