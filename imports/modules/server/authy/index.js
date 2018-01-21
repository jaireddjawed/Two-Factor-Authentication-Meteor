import { Meteor } from 'meteor/meteor';
import { Client } from 'authy-client';

const client = new Client({ key: Meteor.settings.private.authy });

/**
 *
 * @summary sends verification code to user's phone number
 * @param {Object} args the required arguments object
 * @param {String} args.countryCode the user's phone country code in ISO 3166 alpha 2 format (recommended format, e.g. 'US') or a numeric country calling code (for USA, the calling code would be '1'); use at your own risk
 * @param {String} args.phone The user's phone number to verify
 * @param {String} args.via the mechanism used to send the verification code ('sms' or 'call')
 * @param {Function} callback a callback, otherwise a Promise will be returned
 */

export const startPhoneVerification = args =>
  client.startPhoneVerification(args);

/**
 *
 * @summary verifies a phone number based off of a verification code
 * @param {Object} args the required arguments object
 * @param {String} args.countryCode the user's phone country code in ISO 3166 alpha 2 format (recommended format, e.g. 'US') or a numeric country calling code (for USA, the calling code would be '1'); use at your own risk
 * @param {String} args.phone the user's phone number to verify
 * @param {String} args.token the token submitted by the user to verify the phone
 * @param {Function} callback a callback, otherwise a Promise is returned
 */

export const checkPhoneVerification = args =>
  client.verifyPhone(args);
