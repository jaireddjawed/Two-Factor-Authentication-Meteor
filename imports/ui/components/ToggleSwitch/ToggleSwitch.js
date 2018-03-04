/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
import React from 'react';
import PropTypes from 'prop-types';
import './ToggleSwitch.scss';

class ToggleSwitch extends React.Component {
  constructor(props) {
    super(props);
    const { toggled } = this.props;
    this.state = { toggled };
    this.toggleSwitch = this.toggleSwitch.bind(this);
  }

  toggleSwitch() {
    const { toggled } = this.state;
    const { onToggle } = this.props;
    this.setState({ toggled: !toggled });
    this.checkbox.checked = !toggled;
    onToggle();
  }

  render() {
    const { toggled } = this.state;
    const { onLabel, offLabel } = this.props;

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
