/* eslint-disable no-underscore-dangle */
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Accounts } from 'meteor/accounts-base';
import editProfile from './edit-profile';
import rateLimit from '../../../modules/rate-limit';
import addPhoneNumber from '../../../modules/server/authy/add-phone-number';
import verifyPhoneNumber from '../../../modules/server/authy/verify-phone-number';
import resendVerificationCode from '../../../modules/server/authy/resend-verification-code';
import toggleTwoFactorAuthentication from '../../../modules/server/authy/toggle-two-factor';
import verifyCodeAndLogin from '../../../modules/server/authy/verify-code-and-login';

Meteor.methods({
  'users.sendVerificationEmail': function usersSendVerificationEmail() {
    return Accounts.sendVerificationEmail(this.userId);
  },
  'users.editProfile': function usersEditProfile(profile) {
    check(profile, {
      emailAddress: String,
      profile: {
        name: {
          first: String,
          last: String,
        },
      },
    });

    return editProfile({ userId: this.userId, profile })
      .then(response => response)
      .catch((exception) => {
        throw new Meteor.Error('500', exception);
      });
  },
  'users.addPhoneNumber': function usersAddPhoneNumber(options) {
    /**
     * Adds or changes the current user's phone number
     */

    check(options, {
      phoneNumber: String,
      country: String,
      method: String,
    });

    if (!this.userId) {
      throw new Meteor.Error('401', 'Please log in before adding a phone number to your account.');
    }

    return addPhoneNumber(this.userId, options.phoneNumber, options.country, options.method)
      .then(response => response)
      .catch((exception) => {
        throw new Meteor.Error('500', exception);
      });
  },
  'users.resendVerificationCode': function usersResendVerificationCode(method) {
    /**
     * Resends Verification Code If user was unable to obtain a previous one
     */

    check(method, String);

    if (!this.userId) {
      throw new Meteor.Error('401', 'You must be logged in before a verification code is sent.');
    }

    return resendVerificationCode(this.userId, method)
      .then(response => response)
      .catch((exception) => {
        throw new Meteor.Error('500', exception);
      });
  },
  'users.verifyPhoneNumber': function usersVerifyPhoneNumber(verificationCode) {
    /**
     * Verifies the user's current phone number
     */

    check(verificationCode, String);

    if (!this.userId) {
      throw new Meteor.Error('401', 'Please log in before verifying your phone number.');
    }

    return verifyPhoneNumber(this.userId, verificationCode)
      .then(response => response)
      .catch((exception) => {
        throw new Meteor.Error('500', exception);
      });
  },
  'users.toggleTwoFactorAuthentication': function usersToggleTwoFactorAuthentication() {
    /**
     * Changes the current two factor authentication method when the user requests
     */

    if (!this.userId) {
      throw new Meteor.Error('401', 'Please log in before changing two factor authentication settings.');
    }

    return toggleTwoFactorAuthentication(this.userId)
      .then(response => response)
      .catch((exception) => {
        throw new Meteor.Error('500', exception);
      });
  },
  'users.verifyCodeAndLogin': function usersVerifyCodeAndLogin(verificationCode) {
    /**
     * Confirms the verification code sent to the current user's phone and sets the
     * current login token as verified
     */

    check(verificationCode, String);

    if (!this.userId) {
      throw new Meteor.Error('401', 'You must be logged in before verifying the code sent to your phone.');
    }

    return verifyCodeAndLogin(this, verificationCode)
      .then(response => response)
      .catch((exception) => {
        throw new Meteor.Error('500', exception);
      });
  },
});

rateLimit({
  methods: [
    'users.sendVerificationEmail',
    'users.editProfile',
    'users.addPhoneNumber',
    'users.resendVerificationCode',
    'users.verifyPhoneNumber',
    'users.toggleTwoFactorAuthentication',
    'users.verifyCodeAndLogin',
  ],
  limit: 5,
  timeRange: 1000,
});
