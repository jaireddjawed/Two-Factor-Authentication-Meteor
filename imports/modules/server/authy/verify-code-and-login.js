/* eslint-disable no-underscore-dangle */
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { checkPhoneVerification } from './index';

let action;

/**
 *
 * @summary confirms the verification code sent to the user's phone and set's the user's login token as verified
 * @param {Object} currentUser The current user's id
 * @param {String} verificationCode The verification code sent to the user's phone
 * @param {Promise} promise
 */

const verifyCodeAndLogin = (currentUser, verificationCode, promise) => {
  try {
    action = promise;

    const findUser = Meteor.users.findOne(currentUser.userId);
    if (!findUser) {
      throw new Error('User not found.');
    }

    const { phone } = findUser;

    // sends the verification code to Twilio so we can determine if the verification code is verified
    checkPhoneVerification({
      countryCode: phone.country.code,
      phone: phone.number,
      token: verificationCode,
    })
      .then(response => response)
      .catch((error) => {
        action.reject(`[verifyCodeAndLogin] ${error}`);
      });

    // mark the current login session as verified
    const loginToken = Accounts._getLoginToken(currentUser.connection.id);
    Meteor.users.update({ _id: currentUser.userId, 'services.resume.loginTokens.hashedToken': loginToken }, {
      $set: {
        'services.resume.loginTokens.$.verified': true,
      },
    });
    action.resolve();
  } catch (exception) {
    action.reject(`[verifyCodeAndLogin] ${exception}`);
  }
};

export default (currentUser, verificationCode) =>
  new Promise((resolve, reject) =>
    verifyCodeAndLogin(currentUser, verificationCode, { resolve, reject }));

