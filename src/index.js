import React, { Component } from 'react';
import { render } from 'react-dom';
import FancySlider from './FancySlider';
import './style.scss';

class App extends Component {
  constructor() {
    super();
    this.state = {
      name: 'React'
    };
    this.state = {value: ''};
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(value) {
    //console.log(value)
  }

  render() {
    return (
      <div>
      <FancySlider onChange={this.handleChange} />
      </div>
    );
  }
}

render(<App />, document.getElementById('root'));

