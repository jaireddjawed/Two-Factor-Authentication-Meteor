import { Meteor } from 'meteor/meteor';
import phone from 'phone';
import countrylist from 'country-list';
import { startPhoneVerification } from './index';

let action;

/**
 *
 * @summary Add's a phone number to a user's account and sends a verification code
 * @param {String} userId the current user's Id
 * @param {String} phoneNumber The phone number entered by the user
 * @param {String} country The country the user registered their phone number
 * @param {String} method The method the verification code should be sent, allowed options are 'sms' and 'call'
 * @param {Promise} promise
 */

const addPhoneNumber = (userId, phoneNumber, country, method, promise) => {
  try {
    action = promise;

    // take the phone number the user entered and convert it to international format
    const formattedPhoneNumber = phone(phoneNumber, country); // example output: ['+15555555555', 'USA']

    // we need to check if the phone number entered is already associated with another user
    const findExistingUserByPhoneNumber = Meteor.users.findOne({ 'phone.number': formattedPhoneNumber[0] });
    if (findExistingUserByPhoneNumber) {
      // if so, we throw an error to the user
      throw new Error('A user is already associated with this phone number.');
    }

    // gets the country code of the current user's country, for 'United States', the country code would be 'US'
    const countries = countrylist();
    const countryCode = countries.getCode(country);

    // sends phone info to Twilio so they can send the verification code
    startPhoneVerification({ countryCode, phone: phoneNumber, via: method })
      .then(response => response)
      .catch((error) => {
        action.reject(`[addPhoneNumber] ${error}`);
      });

    // add the phone number to the user's account
    Meteor.users.update(userId, {
      $set: {
        phone: {
          number: formattedPhoneNumber[0],
          verified: false, // we set verified to false until the user verifies the code sent to their phone
          country: {
            name: country,
            code: countryCode,
          },
        },
      },
    });
    action.resolve();
  } catch (exception) {
    action.reject(`[addPhoneNumber] ${exception}`);
  }
};

export default (userId, phoneNumber, country, method) =>
  new Promise((resolve, reject) =>
    addPhoneNumber(userId, phoneNumber, country, method, { resolve, reject }));
