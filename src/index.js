import React, {Component} from 'react';
import {render} from 'react-dom';
import Hello from './Hello';
import './style.scss';

class FancySlider extends Component {
  constructor() {
    super();
    this.initialFigureWith = 0;
    this.leftFigure = 0;
    this.figureInstanceWidth = 0;
    this.instanceWidth = 0;
    this.selectorWidth = 0;
    this.lfigureWidth = 0;
    this.rfigureWidth = 0;

    this.state = {
      max: 200,
      min: 100,
      name: 'Slider',
      offset: [0, 0],
      value: -20,
      left: 0,
      isDown: false,
      figureDisplay: 'hidden',
    };
    this.handleMouseup = this.handleMouseup.bind(this);
    this.handleMousedown = this.handleMousedown.bind(this);
    this.handleMousemove = this.handleMousemove.bind(this);
    this.handleMouseleave = this.handleMouseleave.bind(this);
  }

  componentDidMount() {
    this.calculateWidths();
    const diff = this.instanceWidth / 2 + 1;
    this.initialFigureWith = this.figureInstanceWidth;
    this.setState({
      leftFigure: -(this.figureInstanceWidth / 2) + diff,
    });
    console.log(null, this.lfigureWidth);
  }

  calculateWidths() {
    this.figureInstanceWidth = this.figureInstance.getBoundingClientRect().width;
    this.instanceWidth = this.instance.getBoundingClientRect().width;
    this.selectorWidth = this.selectorInstance.getBoundingClientRect().width;
    this.lfigureWidth = this.lfigureInstance.getBoundingClientRect().width;
    this.rfigureWidth = this.rfigureInstance.getBoundingClientRect().width;
  }

  handleMouseup(e) {
    this.setState({
      isDown: false,
      figureDisplay: 'hidden',
    });
  }

  handleMouseleave(e) {
    this.setState({
      isDown: false,
      figureDisplay: 'hidden',
    });
  }

  compute(e) {
    this.calculateWidths();
    let left =
      e.clientX -
      this.selectorInstance.getBoundingClientRect().left +
      this.state.offset[0];

    let value = 0;

    if (this.state.min === 0) {
      value =
        (left * this.state.max) /
        (this.selectorWidth - (this.instanceWidth + 2 / 2));
    } else if (this.state.min > 0) {
      value =
        (left * (this.state.max - this.state.min)) /
          (this.selectorWidth - (this.instanceWidth + 2 / 2)) +
        this.state.min;
    } else if (this.state.min < 0) {
      value =
        (left * (this.state.max + Math.abs(this.state.min))) /
          (this.selectorWidth - (this.instanceWidth + 2 / 2)) +
        this.state.min;
    }

    value = value.toFixed(2);

    if (parseFloat(value) >= this.state.max) {
      left = this.selectorWidth - (this.instanceWidth + 2 / 2);
      value = this.state.max;
      console.log(2);
    }

    if (parseInt(value, 10) > this.state.min) {
      this.setState({
        figureDisplay: 'visible',
        value: value,
        left: left,
      });
    } else {
      console.log(1);
      this.setState({
        value: this.state.min,
        left: 0,
      });
    }
  }

  computeFigure() {
    this.calculateWidths();
    let fleft = 0;
    const diff = this.instanceWidth / 2 + 1;
    fleft =
      this.state.left - this.figureInstanceWidth / 2 + this.instanceWidth / 2;
    console.log(this.figureInstanceWidth, this.initialFigureWith);
    if (parseInt(this.state.value, 10) > this.state.min) {
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
      <div>
        {this.state.value}
        <div
          onMouseMove={this.handleMousemove}
          onMouseUp={this.handleMouseup}
          onMouseLeave={this.handleMouseleave}
          className="selector">
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
              {this.state.min}
            </div>
            <div
              ref={el => (this.rfigureInstance = el)}
              style={{
                right: -(this.rfigureWidth / 2 > 15
                  ? 15
                  : this.rfigureWidth / 2),
              }}
              className="rfigure">
              {this.state.max}
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

export default FancySlider;
