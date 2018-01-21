/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import './ToggleSwitch.scss';

class ToggleSwitch extends React.Component {
  constructor(props) {
    super(props);
    const initialToggleState = props.toggled;
    this.state = { toggled: initialToggleState };
    this.toggleSwitch = this.toggleSwitch.bind(this);
  }

  toggleSwitch() {
    const { toggled } = this.state;
    this.setState({ toggled: !toggled });
    this.checkbox.checked = !toggled;
    this.props.onToggle();
  }

  render() {
    const { onLabel, offLabel } = this.props;
    const { toggled } = this.state;
    return (
      <div
        className={`ToggleSwitch ${toggled ? 'yes' : 'no'}`}
        onClick={this.toggleSwitch}
      >
        <input
          ref={checkbox => (this.checkbox = checkbox)}
          type="checkbox"
          hidden
          defaultChecked={toggled}
        />
        <div className="handle">
          <span className="handle-label">
            { toggled ? onLabel || 'On' : offLabel || 'Off' }
          </span>
        </div>
      </div>
    );
  }
}

ToggleSwitch.defaultProps = {
  onLabel: '',
  offLabel: '',
};

ToggleSwitch.propTypes = {
  toggled: PropTypes.bool.isRequired,
  onLabel: PropTypes.string,
  offLabel: PropTypes.string,
  onToggle: PropTypes.func.isRequired,
};

export default ToggleSwitch;
