/* eslint-disable prefer-arrow-callback, no-underscore-dangle */
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

Meteor.publish('users.editProfile', function usersProfile() {
  return Meteor.users.find(this.userId, {
    fields: {
      emails: 1,
      profile: 1,
      services: 1,
    },
  });
});

Meteor.publish('users.editPhoneNumber', function usersEditPhoneNumber() {
  return Meteor.users.find(this.userId, {
    fields: {
      phone: 1,
    },
  });
});

Meteor.publish('users.toggleTwoFactorAuthentication', function usersToggleTwoFactorAuth() {
  return Meteor.users.find(this.userId, {
    fields: {
      twoFactorAuthenticationEnabled: 1,
    },
  });
});

/**
 *  Publishes the verification status of the current connection's login token
 *  If unverified, we ask the user to verify the code we sent to their phone
 */
Meteor.publish('users.checkAuthenticationStatus', function usersCheckAuthStatus() {
  // gets the login token used in the current connection
  const loginToken = Accounts._getLoginToken(this.connection.id);
  if (loginToken) {
    return Meteor.users.find({ _id: this.userId, 'services.resume.loginTokens.hashedToken': loginToken }, {
      fields: {
        'services.resume.loginTokens.$.verified': 1,
      },
    });
  }

  return this.ready();
});
