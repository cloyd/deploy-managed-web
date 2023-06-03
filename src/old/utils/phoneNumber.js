import { PhoneNumberFormat, PhoneNumberUtil } from 'google-libphonenumber';

export const formatPhoneNumber = (value) => {
  // 0123456789 gets formatted to 0123 456 789

  // Return the value if it does not exist.
  if (!value) return value;

  // Remove any non-digit characters from the string.
  const phoneNumber = value.replace(/[^\d+]/g, '');

  // phoneNumberLength is used to know when to apply our formatting for the phone number
  const phoneNumberLength = phoneNumber.length;

  // for international phone numbers
  // format is +XX XXXX XXX XXX
  if (phoneNumber.includes('+')) {
    // return the value with no formatting if its less then 4 digits
    if (phoneNumberLength < 4) return phoneNumber;

    // if phoneNumberLength is greater than 3 and less the 8 we format to
    if (phoneNumberLength < 8) {
      return `${phoneNumber.slice(0, 3)} ${phoneNumber.slice(3)}`;
    }

    // if phoneNumberLength is greater than 7 and less the 11 we format to
    if (phoneNumberLength < 11) {
      return `${phoneNumber.slice(0, 3)} ${phoneNumber.slice(
        3,
        7
      )} ${phoneNumber.slice(7)}`;
    }

    // finally, if the phoneNumberLength is greater then 10, we add the last
    // bit of formatting and return it.
    if (phoneNumberLength > 10) {
      return `${phoneNumber.slice(0, 3)} ${phoneNumber.slice(
        3,
        7
      )} ${phoneNumber.slice(7, 10)} ${phoneNumber.slice(10)}`;
    }
  } else {
    // format is XXXX XXX XXX
    // return the value with no formatting if its less then five digits
    if (phoneNumberLength < 5) return phoneNumber;

    // if phoneNumberLength is greater than 4 and less the 8 we start to return
    // the formatted number
    if (phoneNumberLength < 8) {
      return `${phoneNumber.slice(0, 4)} ${phoneNumber.slice(4)}`;
    }

    // finally, if the phoneNumberLength is greater then seven, we add the last
    // bit of formatting and return it.
    if (phoneNumberLength > 7) {
      return `${phoneNumber.slice(0, 4)} ${phoneNumber.slice(
        4,
        7
      )} ${phoneNumber.slice(7, 10)}`;
    }
  }
};

export const removeSpaces = (phoneNumber) => phoneNumber.replace(/\s/g, '');

const phoneUtil = PhoneNumberUtil.getInstance();

const E164_INTERNATIONAL_PREFIX = '+';
const E164_COUNTRY_CODE = '61';

// mobile numbers are default set to 0 when a primary tenant is created without specifying a number
export const validatePhoneNumber = ({ mobileNumber = '' }) => {
  if (!mobileNumber.length || mobileNumber === '0') {
    return {
      isValid: false,
      value: mobileNumber,
      error: 'No phone number provided',
    };
  }

  try {
    // remove all non digits and remove leading 0s
    const parsedNumber = mobileNumber.replace(/[^0-9]/g, '').replace(/^0+/, '');
    // append +61 to all numbers with 9 or less numbers, this is to assume that all legacy numbers are AUS
    const phone =
      parsedNumber.length > 9 || parsedNumber.startsWith(E164_COUNTRY_CODE)
        ? `${E164_INTERNATIONAL_PREFIX}${parsedNumber}`
        : `${E164_INTERNATIONAL_PREFIX}${E164_COUNTRY_CODE}${parsedNumber}`;
    const number = phoneUtil.parse(phone);
    const isValid = phoneUtil.isValidNumber(number);

    return {
      isValid,
      value: phoneUtil.format(number, PhoneNumberFormat.INTERNATIONAL),
      error: !isValid
        ? `Phone number invalid (${formatPhoneNumber(mobileNumber)})`
        : '',
    };
  } catch (e) {
    console.error('Invalid phone format');
    return {
      isValid: false,
      value: formatPhoneNumber(mobileNumber),
      error: `Phone number invalid (${formatPhoneNumber(mobileNumber)})`,
    };
  }
};

/**
 * function formats Australian mobile numbers for international/local use
 * standards taken from: https://www.stylemanual.gov.au/grammar-punctuation-and-conventions/numbers-and-measurements/telephone-numbers
 * @param {string} mobileNumber number value
 * @param {string} format standard to format (loc/int)
 * @returns {string} formatted mobile number
 * TODO: can extend
 */
export const formatPhoneNumberForDisplay = ({
  mobileNumber,
  format = 'loc',
}) => {
  const prefix =
    format === 'int'
      ? `+61 ${mobileNumber.slice(1, 4)}`
      : mobileNumber.slice(0, 4);

  return `${prefix} ${mobileNumber.slice(4, 7)} ${mobileNumber.slice(7, 10)}`;
};
