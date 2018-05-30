import React, {Component} from 'react';
import timeData from './../d3/datasets/datasetmockup.json';
import Timeknots from './../d3/timeknots';
import {
  Header,
  TimelineModal
} from './common';
import $ from 'jquery';
import Button from '@material-ui/core/Button';
import {
  WIDTH,
  HEIGHT
} from './../utils';

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: timeData,
      ids: new Set(),
      modal: false,
      id: "104",
      queuedId: "104"
    }
  }

  componentDidMount() {
    this.getIds();
  }

  //removes the last timeline svg
  removeTimelineElements = () => {
    $('.timeline-svg').each((i, e) => {
      $(e).remove();
    });
  }

  //confirms the new id that was selected
  onConfirmClicked(self) {
    self.setState({id: self.state.queuedId, modal: false})
  }

  //changes modal state
  onModalChange(self) {
    self.setState({modal: !self.state.modal})
  }

  //changes the id of the queuedId
  onRadioCheck(event, self) {
    self.setState({queuedId: event.target.value})
  };

  //gets all possible ids
  getIds = () => {
    const {data} = this.state;
    var retSet = new Set();
    data.map(e => {
      retSet.add(e.id);
    });
    this.setState({ids: retSet});
  }

  //checked if the date is passed the expected graduation date
  checkPassed(day, month, year) {
    if ((month == 5 && day > 3 && year == 2012) || (month > 5 && year == 2012) || year > 2012) {
      return false;
    }
    return true;
  }

  //creates the timeline
  configTimeline() {
    const { data, id } = this.state;
    var idArr = [];
    const checkPassed = this.checkPassed;
    data.map(function(e, i) {
      if(!idArr.includes(e['id'])) {
        idArr.push(e['id']);
      }
      const date = new Date(e.timestamp);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).length < 2 ? '0' + (date.getMonth() + 1) : String(date.getMonth() + 1);
      const day = String(date.getDate()).length < 2 ? '0' + date.getDate() : String(date.getDate());
      const fullDate = year + '-' + month + '-' + day;
      e.timestamp = fullDate;
      e.date = fullDate;
      const token = checkPassed(day, month, year);
      if (token) {
        if (e.event == 'Start') {
          e.color = 'blue'
          //e.image = './blue-start.png';
          e.class = 'smooth'
        }else if (e.event == 'Acad Plan') {
          e.color = 'orange';
          //e.image = './orange-warning.png';
          e.class = 'warning'
        }else if (e.event == 'Completion') {
          e.color = 'green';
          //e.image = './green-check.png';
          e.class = 'success';
        }
      }else{
        e.color = 'red';
        e.image = './red-warning.png';
        e.class = 'danger';
      }
    });
    var maxDate = this.getMaxDate(id);
    const createTimeline = this.createTimeline;
    this.removeTimelineElements();
    return createTimeline(id, maxDate, true, data)
  }

  //finds the max date from all the events
  getMaxDate(id) {
    var maxDate = 0;
    const {data} = this.state
    data.map(function(e, i) {
      if (id == e.id) {
        if(maxDate == 0) {
          maxDate = e.date;
        }else if (Date.parse(maxDate) < Date.parse(e.date)) {
          maxDate = e.date;
        }
      }
    });
    return maxDate;
  }

  //creates the timeline
  createTimeline(id, maxDate, showLabels, data) {
    data = data.filter(function(e) {
      if (e.id == id) {
        return e
      }
    });
    //add image: './blue-start.png', later
    const start = {
      id: id,
      event: 'Start',
      timestamp: '2008-08-13',
      date: '2008-08-13',
      color: '#ADD8E6',
      class: 'smooth'
    };
    const EXPECTED_GRAD = {
      id: id,
      event: 'Expected Graduation',
      timestamp: '2012-05-03',
      date: '2012-05-03',
      color: '#ADD8E6',
      class: 'smooth'
    };
    data.unshift(start);
    Timeknots.draw("#timeline", data, {horizontalLayout: false, dateFormat: "%B %Y", labelFormat: "%Y", radius: 20, globalMax: maxDate, globalMin: '2008-08-13', showLabels: showLabels, displacement: showLabels ? 0.2 : 0, width: showLabels ? 850 : 720, expectedGrad: EXPECTED_GRAD});
    return <div id="timeline"></div>;
  }

  render() {
    const {
      ids,
      id
    } = this.state;
    return (
      <div>
        <Header
          self={this}
          id={id}
          onNewStudentClicked={this.onModalChange}
        />
        <TimelineModal
          ids={ids}
          open={this.state.modal}
          self={this}
          pickedId={id}
          onBackdropClick={this.onModalChange}
          value={this.state.queuedId}
          onRadioCheck={this.onRadioCheck}
          onButtonClick={this.onConfirmClicked}
        />
        {this.configTimeline()}
      </div>
    )
  }
}

export default Main
