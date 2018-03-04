import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Button } from 'react-bootstrap';

import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import AddPhone from '../../components/AddPhone/AddPhone';
import VerifyPhoneNumber from '../../components/VerifyPhoneNumber/VerifyPhoneNumber';
import ResendCode from '../../components/ResendCode/ResendCode';
import ToggleTwoFactorAuth from '../../components/ToggleTwoFactorAuth/ToggleTwoFactorAuth';

class PhoneSettings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      renderAddPhoneForm: false,
      renderResendVerificationCode: false,
    };

    this.toggleAddPhoneForm = this.toggleAddPhoneForm.bind(this);
    this.toggleResendVerificationCodeForm = this.toggleResendVerificationCodeForm.bind(this);
  }

  toggleAddPhoneForm() {
    const { renderAddPhoneForm } = this.state;
    this.setState({ renderAddPhoneForm: !renderAddPhoneForm });
  }

  toggleResendVerificationCodeForm() {
    const { renderResendVerificationCode } = this.state;
    this.setState({ renderResendVerificationCode: !renderResendVerificationCode });
  }

  renderResendVerificationCode() {
    const { renderResendVerificationCode } = this.state;
    return <ResendCode show={renderResendVerificationCode} onClose={this.toggleResendVerificationCodeForm} />;
  }

  renderToggleTwoFactorAuthentication() {
    return (
      <div className="ToggleTwoFactorAuth">
        <ToggleTwoFactorAuth />
        <Button
          bsStyle="link"
          onClick={this.toggleAddPhoneForm}
        >
          Change Phone Number
        </Button>
      </div>
    );
  }

  renderVerifyPhoneNumber() {
    return (
      <div className="VerifyPhone">
        <VerifyPhoneNumber />
        <Button
          bsStyle="link"
          onClick={this.toggleResendVerificationCodeForm}
        >
          Resend Verification Code
        </Button>
      </div>
    );
  }

  renderPhoneSettings() {
    const { renderAddPhoneForm } = this.state;
    const { user } = this.props;
    const { phone } = user;

    if (!phone || renderAddPhoneForm) {
      return <AddPhone />;
    }

    if (!phone.verified) {
      return this.renderVerifyPhoneNumber();
    }

    return this.renderToggleTwoFactorAuthentication();
  }

  render() {
    const { loading } = this.props;

    return !loading ? (
      <div className="PhoneSettings">
        <Row>
          <Col xs={12} sm={6} md={4}>
            {this.renderResendVerificationCode()}
            {this.renderPhoneSettings()}
          </Col>
        </Row>
      </div>
    ) : <div />;
  }
}

PhoneSettings.defaultProps = {
  user: {},
};

PhoneSettings.propTypes = {
  loading: PropTypes.bool.isRequired,
  user: PropTypes.object,
};

export default withTracker(() => {
  const subscription = Meteor.subscribe('users.editPhoneNumber');

  return {
    loading: !subscription.ready(),
    user: Meteor.user(),
  };
})(PhoneSettings);
