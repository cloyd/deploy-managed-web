import * as Yup from 'yup';

import { toDollars, toWeeklyFromYear } from '.';

function equalTo(ref, message) {
  return this.test({
    name: 'equalTo',
    exclusive: false,
    message: message || '${path} must not be the same as ${refPath}', // eslint-disable-line no-template-curly-in-string
    params: {
      refPath: ref.path,
    },
    test(valueA) {
      const valueB = this.resolve(ref);

      return (
        valueA !== undefined &&
        valueB !== undefined &&
        valueA.toISOString() !== valueB.toISOString()
      );
    },
  });
}

function lessThanWeekly(ref, message) {
  return this.test({
    name: 'lessThanWeekly',
    exclusive: false,
    message: message || '${path} must be less than ${refPath}', // eslint-disable-line no-template-curly-in-string
    params: {
      refPath: ref.path,
    },
    test(valueA) {
      const valueB = this.resolve(ref);

      return (
        valueA !== undefined &&
        valueB !== undefined &&
        valueA <= toDollars(toWeeklyFromYear(valueB))
      );
    },
  });
}

function minAmount(message) {
  return this.test({
    name: 'minAmount',
    exclusive: false,
    message: message || '${path} must be greater than $10', // eslint-disable-line no-template-curly-in-string
    test(val) {
      return val === 0 || val >= 10;
    },
  });
}

Yup.addMethod(Yup.date, 'equalTo', equalTo);
Yup.addMethod(Yup.number, 'minAmount', minAmount);
Yup.addMethod(Yup.number, 'lessThanWeekly', lessThanWeekly);
