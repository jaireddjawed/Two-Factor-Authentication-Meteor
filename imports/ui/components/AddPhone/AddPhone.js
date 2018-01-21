import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, ControlLabel, Button } from 'react-bootstrap';
import CountryList from 'country-list';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Bert } from 'meteor/themeteorchef:bert';
import validate from '../../../modules/validate';

class AddPhone extends React.Component {
  componentDidMount() {
    const component = this;
    validate(component.form, {
      rules: {
        phone: {
          required: true,
        },
        country: {
          required: true,
        },
      },
      messages: {
        phone: {
          required: 'Please enter your phone number.',
        },
        country: {
          required: 'Please select the country you reside in.',
        },
      },
      submitHandler() {
        component.handleSubmit();
      },
    });
  }

  handleSubmit() {
    const phoneInfo = {
      phoneNumber: this.phoneNumber.value,
      country: this.country.value,
      method: 'sms', // the first verification code will be sent by text
    };

    Meteor.call('users.addPhoneNumber', phoneInfo, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Successfully added phone number', 'success');
      }
    });
  }

  render() {
    const { countries, user } = this.props;
    const { phone } = user;

    return (
      <div className="AddPhone">
        <h3 className="page-header">Add Phone</h3>
        <form
          ref={form => (this.form = form)}
          onSubmit={event => event.preventDefault()}
        >
          <FormGroup>
            <ControlLabel>Phone Number</ControlLabel>
            <input
              type="tel"
              ref={phoneNumber => (this.phoneNumber = phoneNumber)}
              name="phone"
              placeholder="(555)-555-5555"
              className="form-control"
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Country</ControlLabel>
            <select
              name="country"
              ref={country => (this.country = country)}
              className="form-control"
            >
              <option />
              {countries.map(country => <option key={country.code}>{country.name}</option>)}
            </select>
          </FormGroup>
          <FormGroup>
            <Button type="submit" bsStyle="success">{ phone ? 'Save Changes' : 'Add Phone Number' }</Button>
          </FormGroup>
        </form>
      </div>
    );
  }
}

AddPhone.propTypes = {
  countries: PropTypes.array.isRequired,
  user: PropTypes.object.isRequired,
};

export default withTracker(() => {
  const countries = CountryList().getData();
  const user = Meteor.user();

  return {
    countries,
    user,
  };
})(AddPhone);
