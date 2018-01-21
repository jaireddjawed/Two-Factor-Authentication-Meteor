import { Meteor } from 'meteor/meteor';

let action;

/**
 *
 * @summary Turns two factor authentication on and off when the current user requests.
 * @param {String} userId The current user's id.
 * @param {Promise} promise
 */

const toggleTwoFactorAuthentication = (userId, promise) => {
  try {
    action = promise;

    // find user by userId
    const findUser = Meteor.users.findOne(userId);
    if (!findUser) {
      throw new Error('User not found!');
    }

    // a user can't turn two factor authentication on if they don't have a phone number on file
    if (!findUser.phone) {
      throw new Error('You must have a phone number before turning on two factor authentication.');
    }

    // a user must verify their phone number before toggling two factor authentication
    const { verified } = findUser.phone;
    if (!verified) {
      throw new Error('Please verify your phone number before turning on two factor authentication.');
    }

    // get current two factor auth setting
    const { twoFactorAuthenticationEnabled } = findUser;

    // toggle the current status
    Meteor.users.update(userId, {
      $set: {
        twoFactorAuthenticationEnabled: !twoFactorAuthenticationEnabled,
      },
    });
    action.resolve();
  } catch (exception) {
    action.reject(`[toggleTwoFactorAuthentication] ${exception}`);
  }
};

export default userId =>
  new Promise((resolve, reject) =>
    toggleTwoFactorAuthentication(userId, { resolve, reject }));
