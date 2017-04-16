import React, { Component } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { RadioGroup, RadioButton } from 'react-radio-buttons';
import ReactList from 'react-list';

class TimeButton extends Component {
  render() {
    return (
      <button className="timeButton" onClick={this.props.onClick}>click</button>
    );
  }
}

class TimeText extends Component {
  render() {
    return (
      <div className="timeText">{this.props.value}</div>
    );
  }
}

class WaffleSelector extends Component {
  constructor() {
    super()
    this.state = {
      whichWaffle : 1,
      lastWaffle : 'asdf',
    };
  }

  setNumWaffles(arg) {
    this.setState({whichWaffle : arg});
  }

  onWafflesDone() {
    var obj = {
      selectedWaffles : this.state['whichWaffle'],
      timeMs : new Date().getTime(),
    }
    console.log(JSON.stringify(obj))
    this.setState({lastWaffle : obj});
  }

  render() {
    return (
      <div className="WaffleSelector">
      <RadioGroup onChange={(arg) => this.setNumWaffles(arg)} horizontal>
        <RadioButton value="1">1</RadioButton>
        <RadioButton value="2">2</RadioButton>
        <RadioButton value="3">3</RadioButton>
        <RadioButton value="4">4</RadioButton>
      </RadioGroup>
      <button className="makeWaffles" onClick={() => this.onWafflesDone()}>Waffles Done</button>
      <div className="waffleValue">{this.state.whichWaffle}</div>
      <div className="lastWaffle">lastWaffle: {JSON.stringify(this.state.lastWaffle)}</div>
      </div>
    )
  }
}

class WaffleEvents extends Component {
  constructor() {
    super();
    this.state = {
      events : [],
    };
  }

  createTimeEvent() {
    fetch('http://localhost:1323/waffle/time') 
      .then(result => result.text())
      .then(text => this.addEvent(text))
  }

  addEvent(e) {
    var newEvents = this.state.events.slice();
    newEvents.unshift(e)
    this.setState({events : newEvents});
  }

  renderItem(index, key) {
    return <div key={key}>{JSON.stringify(this.state.events[index])}</div>;
  }

  render() {
    return (
      <div className="WaffleEvents">
      <button className="WaffleEventButton" onClick={() => this.createTimeEvent()}>add event</button>
      <div className="WaffleEventsScroll" style={{overflow:'auto', maxHeight: 100}}>
      <ReactList
        itemRenderer={(index, key) => this.renderItem(index, key)}
        length={this.state.events.length}
      />
      </div>
      </div>
    );
  }
}

class WafflePanel extends Component {
  constructor() {
    super()
    this.state = {
      value : 0,
    };
  }

  render() {
    return (
      <div className="WafflePanel">
      <WaffleSelector />
      <WaffleEvents />
      <TimeButton onClick={() => this.updateTime()} />
      <TimeText value={this.state.value} />
      </div>
    );
  }

  updateTime() {
    fetch('http://localhost:1323/waffle/time') 
      .then(result => result.text())
      .then(text => this.setState({value : text}))
  }
}

class App extends Component {
  render() {
    return (

      <Tabs>
        <TabList>
          <Tab>Waffles</Tab>
          <Tab>Eggs</Tab>
          <Tab>Hash Browns</Tab>
        </TabList>

        <TabPanel>
          <WafflePanel />
        </TabPanel>
        <TabPanel>
          <h2>Hello from Eggs</h2>
        </TabPanel>
        <TabPanel>
          <h2>Hello from Hash Browns</h2>
        </TabPanel>
      </Tabs>
    );
  }
}

export default App;
