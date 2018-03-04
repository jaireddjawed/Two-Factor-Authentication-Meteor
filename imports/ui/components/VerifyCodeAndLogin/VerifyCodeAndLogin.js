import React from 'react';
import { FormGroup, ControlLabel, HelpBlock, Modal, Button } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import ResendCode from '../ResendCode/ResendCode';
import validate from '../../../modules/validate';

class VerifyCodeAndLogin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      renderResendVerificationCode: false,
    };

    this.toggleResendVerificationCodeForm = this.toggleResendVerificationCodeForm.bind(this);
  }

  componentDidMount() {
    const component = this;
    validate(component.form, {
      rules: {
        'verification-code': {
          required: true,
        },
      },
      messages: {
        'verification-code': {
          required: 'Please enter the verification code we sent to your phone.',
        },
      },
      submitHandler() {
        component.handleSubmit();
      },
    });
  }

  toggleResendVerificationCodeForm() {
    const { renderResendVerificationCode } = this.state;
    this.setState({ renderResendVerificationCode: !renderResendVerificationCode });
  }

  handleSubmit() {
    const verificationCode = this.verificationCode.value;
    Meteor.call('users.verifyCodeAndLogin', verificationCode, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      }
    });
  }

  renderResendVerificationCode() {
    const { renderResendVerificationCode } = this.state;
    return <ResendCode show={renderResendVerificationCode} onClose={this.toggleResendVerificationCodeForm} />
  }

  render() {
    return (
      <div className="VerifyCodeAndLogin">
        <h3 className="page-header">Verify It&#39;s Really You</h3>
        <form
          ref={form => (this.form = form)}
          onSubmit={event => event.preventDefault()}
        >

          <FormGroup>
            <ControlLabel>Verification Code</ControlLabel>
            <input
              type="text"
              ref={verificationCode => (this.verificationCode = verificationCode)}
              name="verification-code"
              className="form-control"
            />
            <HelpBlock>Enter the verification code we sent to your phone.</HelpBlock>
          </FormGroup>
          <FormGroup>
            <Button type="submit" bsStyle="success">Submit</Button>
          </FormGroup>
        </form>

        {this.renderResendVerificationCode()}
        <Button bsStyle="link" onClick={this.toggleResendVerificationCodeForm}>Didn&#39;t Recieve Your Code?</Button>
      </div>
    );
  }
}

export default VerifyCodeAndLogin;
