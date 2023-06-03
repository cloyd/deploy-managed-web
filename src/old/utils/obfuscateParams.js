export const obfuscateParams = (params = {}) => {
  const {
    accountNumber,
    cvv, // filter out this param
    number,
    routingNumber,
    ...otherParams
  } = params;
  let sanitizedParams = {};

  // Get account number into the format XXX456
  if (accountNumber) {
    sanitizedParams['accountNumber'] = accountNumber
      .replace(/\s/g, '')
      .replace(/(?!(\d{0,3}$))\d/g, 'X');
  }

  // Get routing number into the format XXXXX8
  if (routingNumber) {
    sanitizedParams['routingNumber'] = routingNumber
      .replace(/\s/g, '')
      .replace(/(?!(\d$))\d/g, 'X');
  }

  // Get card number into the format 4111-XXXX-XXXX-1111
  // We are slicing the string because some browsers don't support lookbehinds in regex
  if (number) {
    const leadDigits = number.slice(0, 4);
    const cardNumber = number.slice(4).replace(/\s/g, '-');
    sanitizedParams['number'] =
      leadDigits + cardNumber.replace(/(?!(\d{0,4}$))\d/g, 'X');
  }

  return { ...otherParams, ...sanitizedParams };
};

export const obfuscatePhoneNumber = (phoneNumber) => {
  const stripped = phoneNumber.replace(/\s+|-/g, '');
  // numbers with 10 or less numbers will be assumed as AU
  const areaCode = stripped.length <= 10 ? '+61' : stripped.slice(0, 3);
  const lastThreeDigits = stripped.slice(-3);

  return `${areaCode} **** *** ${lastThreeDigits}`;
};
