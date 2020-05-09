import React, { Component } from 'react';
import './App.css';


import TreeExample from './pages/TreeExample';
// import HookTest from './pages/HookExample';


export interface AppProps { compiler?: string; framework?: string; }

export default class App extends Component<AppProps, any> {
  render() {
      return <div className="App">
        {/* <h1>Hello from {this.props.compiler} and {this.props.framework}!</h1> */}
        <TreeExample/>
        {/* <HookTest/> */}
      </div>;
  }
}
