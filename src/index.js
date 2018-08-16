import React, {Component} from 'react';
import {render} from 'react-dom';
import Hello from './Hello';
import './style.scss';

//TODO Fixed and Popup style w accept round botton in the corner

class App extends Component {
  constructor() {
    super();

    this.initialFigureWith = 0;
    this.leftFigure = 0;
    this.figureInstanceWidth = 0;
    this.instanceWidth = 0;
    this.selectorWidth = 0;
    this.lfigureWidth = 0;
    this.rfigureWidth = 0;
    this.step = 2;
    this.max = 50;
    this.min = 10;

    this.state = {
      name: 'Slider',
      offset: [0, 0],
      value: this.min,
      left: 0,
      isDown: false,
      figureDisplay: 'hidden',
    };
    this.handleMouseup = this.handleMouseup.bind(this);
    this.handleMousedown = this.handleMousedown.bind(this);
    this.handleMousemove = this.handleMousemove.bind(this);
    this.handleMouseleave = this.handleMouseleave.bind(this);
    this.handleClickStepSubstract = this.handleClickStepSubstract.bind(this);
    this.handleClickStepAdd = this.handleClickStepAdd.bind(this);
  }

  handleClickStepAdd() {
    this.calculateCircleByNumber(this.step + parseFloat(this.state.value));
  }

  handleClickStepSubstract() {
    this.calculateCircleByNumber(parseFloat(this.state.value) - this.step);
  }

  componentDidMount() {
    this.calculateWidths();
    const diff = this.instanceWidth / 2 + 1;
    this.initialFigureWith = this.figureInstanceWidth;
    this.setState({
      leftFigure: -(this.figureInstanceWidth / 2) + diff,
    });
  }

  calculateWidths() {
    this.figureInstanceWidth = this.figureInstance.getBoundingClientRect().width;
    this.instanceWidth = this.instance.getBoundingClientRect().width;
    this.selectorLeft = this.selectorInstance.getBoundingClientRect().left;
    this.selectorWidth = this.selectorInstance.getBoundingClientRect().width;
    this.lfigureWidth = this.lfigureInstance.getBoundingClientRect().width;
    this.rfigureWidth = this.rfigureInstance.getBoundingClientRect().width;
  }

  handleMouseup(e) {
    this.setState({
      isDown: false,
      //figureDisplay: 'hidden',
    });
  }

  handleMouseleave(e) {
    this.setState({
      isDown: false,
      //figureDisplay: 'hidden',
    });
  }

  calculateCircleByNumber(num) {
    let left = 0;
    const diff = this.selectorWidth - (this.instanceWidth + 1 / 2);
    const diffMax = this.instanceWidth + 2 / 2;

    if (this.min < 0) {
      left = ((num - this.min) * diff) / (this.max - this.min);
    } else if (this.min > 0) {
      left = ((num - this.min) * diff) / (this.max - this.min);
    } else if (this.min === 0) {
      left = (num * diff) / this.max;
    }
    let value = num.toFixed(2);

    if (parseFloat(value) >= this.max) {
      value = this.max;
      left = this.selectorWidth - diffMax;
    }

    if (parseInt(value, 10) > this.min) {
      this.setState({
        figureDisplay: 'visible',
        value: value,
        left,
      });
    } else {
      this.setState({
        value: this.min,
        left: 0,
      });
    }
  }

  getSelectorDifference() {
    return this.selectorWidth - (this.instanceWidth + 2 / 2);
  }

  calculateCircle(clientX) {
    const diff = this.getSelectorDifference();

    let left = clientX - this.selectorLeft + this.state.offset[0];
    let value = 0;
    if (this.min === 0) {
      value = (left * this.max) / diff;
    } else if (this.min > 0) {
      value = (left * (this.max - this.min)) / diff + this.min;
    } else if (this.min < 0) {
      value = (left * (this.max + Math.abs(this.min))) / diff + this.min;
    }
    value = value.toFixed(2);
    if (parseFloat(value) >= this.max) {
      left = diff;
      value = this.max;
    }

    if (parseInt(value, 10) > this.min) {
      this.setState({
        figureDisplay: 'visible',
        value: value,
        left,
      });
    } else {
      this.setState({
        value: this.min,
        left: 0,
      });
    }
  }

  compute(e) {
    this.calculateWidths();
    this.calculateCircle(e.clientX);
  }

  computeFigure() {
    this.calculateWidths();
    let fleft = 0;
    const diff = this.instanceWidth / 2 + 1;
    fleft =
      this.state.left - this.figureInstanceWidth / 2 + this.instanceWidth / 2;
    if (parseInt(this.state.value, 10) > this.min) {
      this.leftFigure = parseFloat(fleft);
    } else {
      this.leftFigure = -(this.initialFigureWith / 2) + diff;
    }
  }

  handleMousemove(e) {
    e.preventDefault();
    if (this.state.isDown) {
      this.compute(e);
    }
  }

  handleMousedown(e) {
    this.setState({
      isDown: true,
      offset: [
        this.instance.getBoundingClientRect().left - e.clientX,
        this.instance.getBoundingClientRect().top - e.clientY,
      ],
    });
  }

  render() {
    this.figureInstance && this.computeFigure();
    return (
      <div className="fancy-slider">
        {this.state.value}
        <div
          onMouseMove={this.handleMousemove}
          onMouseUp={this.handleMouseup}
          onMouseLeave={this.handleMouseleave}
          className="selector">
          <div
            className="triangle-left"
            onClick={this.handleClickStepSubstract}
          />
          <div className="triangle-right" onClick={this.handleClickStepAdd} />
          <div
            ref={el => (this.selectorInstance = el)}
            className="selector-inner">
            <div
              ref={el => (this.lfigureInstance = el)}
              style={{
                left: -(this.lfigureWidth / 2 > 15
                  ? 15
                  : this.lfigureWidth / 2),
              }}
              className="lfigure">
              {this.min}
            </div>
            <div
              ref={el => (this.rfigureInstance = el)}
              style={{
                right: -(this.rfigureWidth / 2 > 15
                  ? 15
                  : this.rfigureWidth / 2),
              }}
              className="rfigure">
              {this.max}
            </div>
            <div className="line" />
            <div className="lef-line" />
            <div className="center-line" />
            <div className="right-line" />
            <div
              ref={el => (this.figureInstance = el)}
              style={{
                left: this.leftFigure,
                visibility: this.state.figureDisplay,
              }}
              className="figure-container">
              <div className="arrow-down" />
              <span className="figure">{this.state.value}</span>
            </div>
            <span
              ref={el => (this.instance = el)}
              style={{left: this.state.left}}
              className="point"
              onMouseDown={this.handleMousedown}
            />
          </div>
        </div>
      </div>
    );
  }
}

render(<App />, document.getElementById('root'));
