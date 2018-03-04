import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Modal, FormGroup, ControlLabel, Radio, Button } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import validate from '../../../modules/validate';

class ResendCode extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sendMethod: 'call',
    };
    this.handleSendMethodChange = this.handleSendMethodChange.bind(this);
  }

  componentDidMount() {
    const component = this;
    validate(component.form, {
      rules: {
        'send-method': {
          required: true,
        },
      },
      messages: {
        'send-method': {
          required: "Please select the method you'd like to receive",
        },
      },
      submitHandler() {
        component.handleSubmit();
      },
    });
  }

  handleSendMethodChange(event) {
    const sendMethod = event.target.value;
    this.setState({
      sendMethod,
    });
  }

  handleSubmit() {
    const { sendMethod } = this.state;
    const { onClose } = this.props;

    Meteor.call('users.resendVerificationCode', sendMethod, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Successfully resent verification code!', 'success');
        onClose();
      }
    });
  }

  render() {
    const { show, onClose } = this.props;

    return (
      <div className="ResendCode">
        <Modal
          show={show}
          onHide={onClose}
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title">
              Resend Code
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <Col xs={12} sm={6} md={4}>
                <form
                  ref={form => (this.form = form)}
                  onSubmit={event => event.preventDefault()}
                >
                  <FormGroup>
                    <ControlLabel>Send Method</ControlLabel>
                    <Radio
                      name="send-method"
                      value="call"
                      onChange={this.handleSendMethodChange}
                      defaultChecked
                    >
                      Call
                    </Radio>
                    <Radio
                      name="send-method"
                      value="sms"
                      onChange={this.handleSendMethodChange}
                    >
                      SMS
                    </Radio>
                  </FormGroup>
                  <FormGroup>
                    <Button type="submit" bsStyle="success">Resend Verification Code</Button>
                  </FormGroup>
                </form>
              </Col>
            </Row>
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}

ResendCode.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ResendCode;
