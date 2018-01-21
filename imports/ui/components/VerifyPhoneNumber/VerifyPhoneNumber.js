import React from 'react';
import { FormGroup, ControlLabel, HelpBlock, Button } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import validate from '../../../modules/validate';

class VerifyPhoneNumber extends React.Component {
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
          required: 'Please enter the verification code sent to your phone.',
        },
      },
      submitHandler() {
        component.handleSubmit();
      },
    });
  }

  handleSubmit() {
    const verificationCode = this.verificationCode.value;
    Meteor.call('users.verifyPhoneNumber', verificationCode, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Successfully verified phone number!', 'success');
      }
    });
  }

  render() {
    return (
      <div className="VerifyPhoneNumber">
        <h3 className="page-header">Verify Phone Number</h3>
        <form
          ref={form => (this.form = form)}
          onSubmit={event => event.preventDefault()}
        >
          <FormGroup>
            <ControlLabel>Verification Code</ControlLabel>
            <input
              type="text"
              name="verification-code"
              ref={verificationCode => (this.verificationCode = verificationCode)}
              className="form-control"
            />
            <HelpBlock>Enter the verification code sent to your phone.</HelpBlock>
          </FormGroup>
          <FormGroup>
            <Button type="submit" bsStyle="success">Verify Phone Number</Button>
          </FormGroup>
        </form>
      </div>
    );
  }
}

export default VerifyPhoneNumber;
