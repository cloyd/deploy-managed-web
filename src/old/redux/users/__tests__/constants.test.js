/* eslint-disable no-undef */
import { EXTERNAL_CREDITOR_TYPES } from '../constants';

describe('users/constants', () => {
  it('should return the creditor types', () => {
    const received = Object.keys(EXTERNAL_CREDITOR_TYPES);
    const expected = [
      'air_conditioning',
      'appliance_repair',
      'arborists',
      'bathroom_renovation',
      'blinds_and_curtains',
      'bricklayer',
      'carpenter',
      'cleaning',
      'decking',
      'demolition',
      'doors',
      'electrical',
      'flooring',
      'garage_door',
      'gardening_and_landscaping',
      'guttering',
      'handyman',
      'kitchens_and_joiners',
      'locksmith',
      'new_appliances',
      'painting',
      'pest_control',
      'plumbing',
      'pool_compliance',
      'pool_maintenance',
      'roofing',
      'security',
      'smoke_alarm',
      'solar_power',
      'tiling',
      'waterproofing',
      'windows_and_glass',
      'other',
    ];

    expect(received).toEqual(expected);
  });
});
