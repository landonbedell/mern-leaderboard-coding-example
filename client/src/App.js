import React, { Component } from 'react';
import './App.css';
import Leaderboard from './leaderboard/Leaderboard';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null
    };
  }

  render() {
    return (
      <div className="App">
        <header>
          <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" />
          <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" /> 
        </header>
        <Leaderboard className="Leaderboard"/>
        <p className="App-intro">{this.state.data}</p>
      </div>
    );
  }
}

export default App;
