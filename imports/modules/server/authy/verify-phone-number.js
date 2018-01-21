import { Meteor } from 'meteor/meteor';
import { checkPhoneVerification } from './index';

let action;

/**
 *
 * @summary Confirms the verification code sent to the user's phone
 * @param {String} userId The current user's id
 * @param {String} verificationCode the verification code entered by the current user
 * @param {Promise} promise
 */

const verifyPhoneNumber = (userId, verificationCode, promise) => {
  try {
    action = promise;

    // find the user so we can send their phone number to Twilio
    const findUser = Meteor.users.findOne(userId);
    if (!findUser) {
      throw new Error('User not found');
    }

    // get the country dial code so we can pass it to Twilio
    const { number, country } = findUser.phone;
    const { code } = country;

    // send code, number, and country dial code to Twilio
    checkPhoneVerification({ countryCode: code, phone: number, token: verificationCode })
      .then(response => response)
      .catch((error) => {
        action.reject(`[verifyPhoneNumber] ${error}`);
      });

    // set the phone's verification status as true
    Meteor.users.update(userId, {
      $set: {
        'phone.verified': true,
      },
    });
    action.resolve();
  } catch (exception) {
    action.reject(`[verifyPhoneNumber] ${exception}`);
  }
};

export default (userId, verificationCode) =>
  new Promise((resolve, reject) =>
    verifyPhoneNumber(userId, verificationCode, { resolve, reject }));
