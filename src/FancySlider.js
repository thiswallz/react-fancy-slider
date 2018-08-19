import React, {Component} from 'react';
import {render} from 'react-dom';
import PropTypes from 'prop-types';
import './fancy-slider.scss';

function noOp() {}

export default class FancySlider extends Component {
  static propTypes = {
    min: PropTypes.number,
    max: PropTypes.number,
    step: PropTypes.number,
    value: PropTypes.number,
    onChange: PropTypes.func,
    showAlwaysValue: PropTypes.bool,
    disableTrack: PropTypes.bool,
    sliderColor: PropTypes.string,
    trackColor: PropTypes.string,
    thumbColor: PropTypes.string,
    sliderWidth: PropTypes.number,
    thumbSize: PropTypes.number,
    id: PropTypes.string,
  };

  static defaultProps = {
    min: 0,
    value: 50,
    max: 100,
    step: 10,
    onChange: noOp,
    showAlwaysValue: true,
    disable: false,
    sliderColor: '#B9B9B9',
    trackColor: '#009688',
    thumbColor: '#009688',
    sliderSize: 300,
    id: null,
  };

  constructor(props) {
    super(props);

    this.initialFigureWith = 0;
    this.leftFigure = 0;
    this.figureInstanceWidth = 0;
    this.instanceWidth = 0;
    this.selectorWidth = 0;
    this.lfigureWidth = 0;
    this.rfigureWidth = 0;

    this.state = {
      max: this.props.max,
      min: this.props.min,
      step: this.props.step,
      value: this.props.value,
      offset: [0, 0],
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
    this.setValue(
      this.getCirclePositionByValue(
        this.state.step + parseFloat(this.state.value),
      ),
    );
  }

  handleClickStepSubstract() {
    this.setValue(
      this.getCirclePositionByValue(
        parseFloat(this.state.value) - this.state.step,
      ),
    );
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

  handleMouseup(e) {
    this.hideIt();
  }

  handleMouseleave(e) {
    this.hideIt();
  }

  hideIt() {
    this.setState({
      isDown: false,
      figureDisplay:
        this.props.showAlwaysValue === false ? 'hidden' : 'visible',
    });
  }

  componentDidUpdate(prevProps, prevState) {
    this.props.onChange(prevState.value);
  }

  componentDidMount() {
    this.calculateWidths();
    const diff = this.instanceWidth / 2 + 1;
    this.initialFigureWith = this.figureInstanceWidth;
    this.setState({
      leftFigure: -(this.figureInstanceWidth / 2) + diff,
    });
    this.setState({...this.getCirclePositionByValue(this.state.value)});
  }

  getSelectorDifference = () =>
    this.selectorWidth - (this.instanceWidth + 2 / 2);

  getCirclePositionByValue(newValue) {
    let left = 0;
    const diff = this.getSelectorDifference();
    const diffMax = this.instanceWidth + 2 / 2;

    if (this.state.min < 0) {
      left =
        ((newValue - this.state.min) * diff) /
        (this.state.max - this.state.min);
    } else if (this.state.min > 0) {
      left =
        ((newValue - this.state.min) * diff) /
        (this.state.max - this.state.min);
    } else if (this.state.min === 0) {
      left = (newValue * diff) / this.state.max;
    }
    let value = newValue.toFixed(2);

    if (parseFloat(value) >= this.state.max) {
      value = this.state.max;
      left = this.selectorWidth - diffMax;
    }

    if (parseFloat(value) > this.state.min) {
      return {
        figureDisplay: 'visible',
        value,
        left,
      };
    } else {
      return {
        value: this.state.min,
        left: 0,
      };
    }
  }

  getCirclePositionByMouseX(clientWindowX, diff) {
    let left = clientWindowX - this.selectorLeft + this.state.offset[0];
    let value = 0;
    if (this.state.min === 0) {
      value = (left * this.state.max) / diff;
    } else if (this.state.min > 0) {
      value =
        (left * (this.state.max - this.state.min)) / diff + this.state.min;
    } else if (this.state.min < 0) {
      value =
        (left * (this.state.max + Math.abs(this.state.min))) / diff +
        this.state.min;
    }
    value = value.toFixed(2);
    if (parseFloat(value) >= this.state.max) {
      left = diff;
      value = this.state.max;
    }

    if (parseInt(value, 10) > this.state.min) {
      return {
        figureDisplay: 'visible',
        value,
        left,
      };
    } else {
      return {
        value: this.state.min,
        left: 0,
      };
    }
  }

  getNewState = newState => (this.props.disable === false ? newState : {});

  setValue(state) {
    this.setState({
      ...this.getNewState(state),
    });
  }

  compute(e) {
    this.calculateWidths();
    const diff = this.getSelectorDifference();
    this.setValue(this.getCirclePositionByMouseX(e.clientX, diff));
  }

  computeFigure() {
    this.calculateWidths();
    const diff = this.instanceWidth / 2 + 1;
    const fleft =
      this.state.left - this.figureInstanceWidth / 2 + this.instanceWidth / 2;
    if (parseInt(this.state.value, 10) >= this.state.max) {
      this.leftFigure = this.getSelectorDifference() - diff;
    } else if (parseInt(this.state.value, 10) > this.state.min) {
      this.leftFigure = parseFloat(fleft);
    } else {
      this.leftFigure = -(this.initialFigureWith / 2) + diff;
    }
  }

  calculateWidths() {
    this.figureInstanceWidth = this.figureInstance.getBoundingClientRect().width;
    this.instanceWidth = this.instance.getBoundingClientRect().width;

    this.selectorLeft = this.selectorInstance.getBoundingClientRect().left;
    this.selectorWidth = this.selectorInstance.getBoundingClientRect().width;

    this.lfigureWidth = this.lfigureInstance.getBoundingClientRect().width;
    this.rfigureWidth = this.rfigureInstance.getBoundingClientRect().width;
  }

  render() {
    this.figureInstance && this.computeFigure();

    const {sliderSize, disable, trackColor, thumbColor} = this.props;

    const pointStyle = {
      cursor: 'pointer',
      zIndex: '200',
      height: '10px',
      width: '10px',
      position: 'absolute',
      top: '31px',
      backgroundColor: thumbColor,
      borderRadius: '100%',
      boxShadow: '0 0 0 2px #1d1d1d',
    };

    return (
      <div className="fancy-slider" {...this.props.sliderProps}>
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
              style={{left: this.state.left, ...pointStyle}}
              onMouseDown={this.handleMousedown}
            />
          </div>
        </div>
      </div>
    );
  }
}
