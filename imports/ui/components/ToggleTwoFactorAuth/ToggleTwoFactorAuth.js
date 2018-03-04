import React from 'react';
import PropTypes from 'prop-types';
import { Panel, Table } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import { withTracker } from 'meteor/react-meteor-data';
import ToggleSwitch from '../ToggleSwitch/ToggleSwitch';

class ToggleTwoFactorAuth extends React.Component {
  constructor(props) {
    super(props);
    this.handleToggle = this.handleToggle.bind(this);
  }

  handleToggle() {
    Meteor.call('users.toggleTwoFactorAuthentication', (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      }
    });
  }

  render() {
    const { loading, user } = this.props;
    const { twoFactorAuthenticationEnabled } = user;

    if (loading) {
      return <div />;
    }

    return (
      <div className="ToggleTwoFactorAuth">
        <Panel
          header="Two-Factor Authentication"
        >
          <Table bordered className="borderless">
            <tbody>
              <tr>
                <td className="center-vertical text-left">Toggle Two-Factor Authentication</td>
                <td className="center-vertical text-right">
                  <ToggleSwitch
                    toggled={twoFactorAuthenticationEnabled}
                    onToggle={this.handleToggle}
                  />
                </td>
              </tr>
            </tbody>
          </Table>
        </Panel>
      </div>
    );
  }
}

ToggleTwoFactorAuth.defaultProps = {
  user: {},
};

ToggleTwoFactorAuth.propTypes = {
  loading: PropTypes.bool.isRequired,
  user: PropTypes.object,
};

export default withTracker(() => {
  const subscription = Meteor.subscribe('users.toggleTwoFactorAuthentication');

  return {
    loading: !subscription.ready(),
    user: Meteor.user(),
  };
})(ToggleTwoFactorAuth);
