import React, { Component } from 'react';

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

class App extends Component {
  constructor() {
    super()
    this.state = {
      value : 0,
    };
  }

  render() {
    return (
      <div className="App">
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

export default App;
