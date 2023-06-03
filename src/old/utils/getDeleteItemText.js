import capitalize from 'lodash/fp/capitalize';

import { fullName as getFullName } from './fullName';

export const getDeleteItemText = (item, type, property) => {
  let text = `This ${type} will be removed from this ${property}.`;

  if (item) {
    const fullName = getFullName(item);

    if (fullName) {
      text = `${capitalize(
        type
      )} "${fullName}" will be removed from this ${property}.`;
    }
  }
  return text;
};
