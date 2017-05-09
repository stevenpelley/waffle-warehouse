import React, { Component } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { RadioGroup, RadioButton } from 'react-radio-buttons';
import ReactList from 'react-list';

class WaffleSelector extends Component {
  constructor() {
    super()
    this.state = {
      whichWaffle : 1,
    };
  }

  setNumWaffles(arg) {
    this.setState({whichWaffle : parseInt(arg)});
  }

  onWafflesDone() {
    // generate UUIDs.  From stackoverflow
    var id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
    var requestId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
    var obj = {
      RequestId : requestId,
      Id : id,
      FoodType : "waffle",
      ActionType : "create",
      Time : new Date().getTime() * 1000000,
      Count : this.state['whichWaffle'],
    }
    console.log(JSON.stringify(obj))

    // submit to server
    fetch('http://localhost:1323/waffle/event/' + id, {
      headers : {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method : 'PUT',
      body : JSON.stringify(obj)
    }).then(function(response) {
      if (response.ok) {
        return
      }
      throw new Error('Network response not ok');
    }).catch(function(error) {
      console.log('problem PUTting event: ' + error.message);
    });
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
      <button className="MakeWaffles" onClick={() => this.onWafflesDone()}>Waffles Done</button>
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

  refreshEvents() {
    fetch('http://localhost:1323/waffle/allEvents') 
      .then(result => result.json())
      .then(json => this.setAllEvents(json))
      .catch(err => {
        console.log('problem getting all events: ' + err.message);
      });
  }

  setAllEvents(events) {
    this.setState({events : events});
  }

  renderItem(index, key) {
    return <div key={key}>{JSON.stringify(this.state.events[index])}</div>;
  }

  render() {
    return (
      <div className="WaffleEvents">
      <button className="RefreshEvents" onClick={() => this.refreshEvents()}>refresh</button>
      <div className="WaffleEventsScroll" style={{overflow:'auto', maxHeight: 200}}>
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
  render() {
    return (
      <div className="WafflePanel">
      <WaffleSelector />
      <WaffleEvents />
      </div>
    );
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
