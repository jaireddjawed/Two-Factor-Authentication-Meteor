import { Accounts } from 'meteor/accounts-base';
import sendWelcomeEmail from '../../../api/Users/server/send-welcome-email';

Accounts.onCreateUser((options, user) => {
  const userToCreate = user;
  if (options.profile) userToCreate.profile = options.profile;

  // two factor authentication is automatically off since the user hasn't set a phone number
  userToCreate.twoFactorAuthenticationEnabled = false;

  sendWelcomeEmail(options, user);
  return userToCreate;
});
