/* eslint-disable no-underscore-dangle */
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { startPhoneVerification } from '../../../modules/server/authy/index';

Accounts.onLogin(({ type, user, connection }) => {
  /**
   * When the user logs in, we set the login token used as unverified until the current user
   * verifies the code sent to their phone unless two factor authentication isn't enabled
   */

  // If the user hasn't logged in yet with this token, we set it as unverified and send a verification code to the user
  if (type !== 'resume') {
    const { _id, twoFactorAuthenticationEnabled, phone } = user;

    Meteor.users.update({ _id, 'services.resume.loginTokens.hashedToken': Accounts._getLoginToken(connection.id) }, {
      $set: {
        'services.resume.loginTokens.$.verified': !twoFactorAuthenticationEnabled, // if two factor authentication isn't enabled, set the login token as verified
      },
    });

    if (twoFactorAuthenticationEnabled) {
      startPhoneVerification({
        countryCode: phone.country.code,
        phone: phone.number,
        via: 'sms', // the default method to send a verification code
      })
        .then(response => response)
        .catch((exception) => {
          throw new Meteor.Error('500', exception);
        });
    }
  }
});
