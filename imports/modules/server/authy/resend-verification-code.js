import { Meteor } from 'meteor/meteor';
import { startPhoneVerification } from './index';

/**
 *
 * @summary Resends the verification code
 * @param {String} userId The current user's id
 * @param {String} method The method for the code to be sent, allowed values are 'sms' and 'call'
 * @param {Promise} promise
 */

let action;

const resendVerificationCode = (userId, method, promise) => {
  try {
    action = promise;

    const findUser = Meteor.users.findOne(userId);
    if (!findUser) {
      throw new Error('User not found.');
    }

    const { phone } = findUser;

    startPhoneVerification({ countryCode: phone.country.code, phone: phone.number, via: method })
      .then(response => response)
      .catch(error => console.log(error));

    action.resolve();
  } catch (exception) {
    action.reject(`[resendVerificationCode] ${exception}`);
  }
};

export default (userId, method) =>
  new Promise((resolve, reject) =>
    resendVerificationCode(userId, method, { resolve, reject }));
