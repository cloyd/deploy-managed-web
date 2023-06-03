import { USER_TYPES } from '../constants';
import {
  getBpayBiller,
  getBpayBillers,
  getBpayOutProviders,
  getExternalCreditor,
  getExternalCreditorFinancials,
  getExternalCreditors,
  getManager,
  getManagerPrimaryAgency,
  getManagers,
  getManagersAsFilters,
  getOwner,
  getOwnerFinancials,
  getUser,
  getUserByType,
  getUserPropertyAccountIds,
  getUserPropertyIds,
  getUsers,
} from '../selectors';

describe('users/selectors', () => {
  const state = {
    bpayBiller: { data: {}, results: [] },
    corporateUsers: { data: {}, results: [] },
    externalCreditor: { data: {}, results: [] },
    financials: {},
    isLoading: false,
    manager: {
      data: {
        11: { firstName: 'Foo', lastName: 'Manager', agency: { id: 777 } },
        22: { firstName: 'Bar', lastName: 'Manager', agency: { id: 555 } },
      },
      results: [11, 22],
    },
    owner: {
      data: {
        11: { firstName: 'Foo', lastName: 'Owner' },
        22: { firstName: 'Bar', lastName: 'Owner' },
      },
      results: [11, 22],
    },
    tenant: { data: {}, results: [] },
  };

  //
  // Basic store selectors
  describe('getUser', () => {
    it('should return correct user', () => {
      const profile = { id: 22, role: USER_TYPES.owner };
      const received = getUser(state, profile);
      const expected = state[USER_TYPES.owner].data[22];
      expect(received).toEqual(expected);
    });

    it('should return empty object if missing id', () => {
      const received = getUser(state, {});
      const expected = {};
      expect(received).toEqual(expected);
    });
  });

  describe('getUserByType', () => {
    it('should return correct user', () => {
      const received = getUserByType(state, 22, USER_TYPES.owner);
      const expected = state[USER_TYPES.owner].data[22];
      expect(received).toEqual(expected);
    });

    it('should return empty object if missing id', () => {
      const received = getUserByType(state, null, USER_TYPES.owner);
      const expected = {};
      expect(received).toEqual(expected);
    });

    it('should return empty object if missing role', () => {
      const received = getUserByType(state, 1, null);
      const expected = {};
      expect(received).toEqual(expected);
    });
  });

  describe('getUsers', () => {
    it('should return array of users', () => {
      const received = getUsers(state, USER_TYPES.manager);
      const expected = [
        { firstName: 'Foo', lastName: 'Manager', agency: { id: 777 } },
        { firstName: 'Bar', lastName: 'Manager', agency: { id: 555 } },
      ];
      expect(received).toEqual(expected);
    });

    it('should return empty array if missing role', () => {
      const received = getUsers(state, null);
      const expected = [];
      expect(received).toEqual(expected);
    });
  });

  //
  // Other selectors
  describe('getBpayBiller', () => {
    const billerState = {
      bpayBiller: { data: { 1: 'bpayBiller' }, results: [1] },
    };

    it('should return the bpayBiller', () => {
      const received = getBpayBiller(billerState, 1);
      const expected = 'bpayBiller';

      expect(received).toBe(expected);
    });

    it('should return an empty object when undefined', () => {
      const received = getBpayBiller(billerState, 2);
      const expected = {};

      expect(received).toEqual(expected);
    });
  });

  describe('getBpayBillers', () => {
    it('should return the bpayBillers', () => {
      const received = getBpayBillers({
        bpayBiller: { data: { 1: 'a', 2: 'b' }, results: [1, 2] },
      });
      const expected = ['a', 'b'];

      expect(received).toEqual(expected);
    });

    it('should return an empty array when undefined', () => {
      const received = getBpayBillers({ bpayBiller: {} });
      const expected = [];

      expect(received).toEqual(expected);
    });
  });

  describe('getBpayOutProviders', () => {
    it('should decoratee and return the BPay out providers', () => {
      const state = {
        externalCreditor: {
          data: {
            1: {
              id: 1,
              bpayOutProvider: true,
            },
            2: {
              id: 2,
              bpayOutProvider: false,
            },
            3: {
              id: 3,
              bpayOutProvider: true,
            },
          },
          results: [1, 2, 3],
        },
      };

      const received = getBpayOutProviders(state);
      const expected = [
        {
          id: 1,
          bpayOutProvider: true,
          type: 'ExternalCreditor',
        },
        {
          id: 3,
          bpayOutProvider: true,
          type: 'ExternalCreditor',
        },
      ];

      expect(received).toEqual(expected);
    });

    it('should return an empty array when undefined', () => {
      const received = getBpayOutProviders({ externalCreditor: {} });
      const expected = [];

      expect(received).toEqual(expected);
    });
  });

  describe('getExternalCreditor', () => {
    const creditorState = {
      externalCreditor: {
        data: { 1: USER_TYPES.externalCreditor },
        results: [1],
      },
    };

    it('should return the creditor', () => {
      const received = getExternalCreditor(creditorState, 1);
      const expected = USER_TYPES.externalCreditor;

      expect(received).toBe(expected);
    });

    it('should return an empty object when undefined', () => {
      const received = getExternalCreditor(creditorState, 2);
      const expected = {};

      expect(received).toEqual(expected);
    });
  });

  describe('getExternalCreditorFinancials', () => {
    it('should return creditor financials in the correct order', () => {
      const received = getExternalCreditorFinancials(
        {
          financials: {
            1: {
              taskIntentions: [
                { id: 1, paymentFlaggedAt: '2019-10-08T09:15:11.704+11:00' },
                { id: 2, paymentFlaggedAt: '2019-09-23T10:33:05.539+10:00' },
                { id: 3, paymentFlaggedAt: '2019-10-04T10:19:10.962+10:00' },
              ],
            },
          },
        },
        1
      );
      const expected = {
        taskIntentions: [
          { id: 1, paymentFlaggedAt: '2019-10-08T09:15:11.704+11:00' },
          { id: 3, paymentFlaggedAt: '2019-10-04T10:19:10.962+10:00' },
          { id: 2, paymentFlaggedAt: '2019-09-23T10:33:05.539+10:00' },
        ],
      };

      expect(received).toEqual(expected);
    });
  });

  describe('getExternalCreditors', () => {
    const creditorState = {
      externalCreditor: { data: { 1: 'a', 2: 'b' }, results: [1, 2] },
    };

    it('should return the creditors', () => {
      const received = getExternalCreditors(creditorState);
      const expected = ['a', 'b'];
      expect(received).toEqual(expected);
    });

    it('should return an empty array when undefined', () => {
      const received = getExternalCreditors({ externalCreditor: {} });
      const expected = [];
      expect(received).toEqual(expected);
    });
  });

  describe('getManagerPrimaryAgency', () => {
    it('should return correct agency', () => {
      const received = getManagerPrimaryAgency(state, 22);
      const expected = { id: 555 };
      expect(received).toEqual(expected);
    });
  });

  describe('getManager', () => {
    const testState = {
      manager: { data: { 1: 'a', 2: 'b' }, results: [1, 2] },
    };

    it('should return the manager', () => {
      const received = getManager(testState, 2);
      const expected = 'b';
      expect(received).toBe(expected);
    });

    it('should return an empty object when undefined', () => {
      const received = getManager(testState, 5);
      const expected = {};
      expect(received).toEqual(expected);
    });
  });

  describe('getManagers', () => {
    it('should return the managers', () => {
      const received = getManagers({
        manager: { data: { 1: 'a', 2: 'b' }, results: [1, 2] },
      });
      const expected = ['a', 'b'];
      expect(received).toEqual(expected);
    });

    it('should return an empty array when undefined', () => {
      const received = getManagers({ manager: {} });
      const expected = [];
      expect(received).toEqual(expected);
    });
  });

  describe('getManagersAsFilters', () => {
    it('should return the active managers as filters', () => {
      const received = getManagersAsFilters({
        manager: {
          data: {
            1: { id: 1, firstName: 'hello', lastName: 'world', active: true },
            2: {
              id: 2,
              firstName: 'second',
              lastName: 'manager',
              active: true,
            },
            3: {
              id: 3,
              firstName: 'inactive',
              lastName: 'manager',
              active: false,
            },
          },
          results: [1, 2, 3],
        },
      });
      const expected = [
        { value: 1, label: 'hello world' },
        { value: 2, label: 'second manager' },
      ];
      expect(received).toEqual(expected);
    });

    it('should return an empty array when undefined', () => {
      const received = getManagersAsFilters({ manager: {} });
      const expected = [];

      expect(received).toEqual(expected);
    });
  });

  describe('getOwner', () => {
    const testState = { owner: { data: { 1: 'owner' }, results: [1] } };

    it('should return the owner', () => {
      const received = getOwner(testState, 1);
      const expected = 'owner';
      expect(received).toBe(expected);
    });

    it('should return an empty object when undefined', () => {
      const received = getOwner(testState, 2);
      const expected = {};
      expect(received).toEqual(expected);
    });
  });

  describe('getOwnerFinancials', () => {
    const received = getOwnerFinancials(
      {
        financials: {
          1: {
            income: {
              0: {
                category: 'Rental Income',
                export_due_or_duration: '29 Feb 2020 - 06 Mar 2020',
                export_title: 'Rent',
                id: 6,
                owner_company: 'Owners ltd',
                paid_at: '21 Feb 2020',
                property_address: '239 Rupert Dr., Georgetown, nsw, 2146',
                property_id: 4,
                status: 'completed',
                status_display_text: 'Paid',
                title: 'Rent (29 Feb 2020 - 06 Mar 2020)',
                total: 60000,
              },
            },
            expenses: {
              0: {
                category: 'Management fees',
                creditor_name: 'Agency 1',
                export_due_or_duration: '29 Feb 2020 - 06 Mar 2020',
                gst: 54,
                id: 6,
                owner_company: 'Owners ltd',
                paid_at: '21 Feb 2020',
                payment_method: '',
                property_address: '239 Rupert Dr., Georgetown, nsw, 2146',
                property_id: 4,
                status: 'completed',
                status_display_text: 'Paid',
                title: 'Agency Fees',
                total: 600,
              },
            },
          },
        },
      },
      1
    );
    const expected = {
      income: {
        0: {
          category: 'Rental Income',
          export_due_or_duration: '29 Feb 2020 - 06 Mar 2020',
          export_title: 'Rent',
          id: 6,
          owner_company: 'Owners ltd',
          paid_at: '21 Feb 2020',
          property_address: '239 Rupert Dr., Georgetown, nsw, 2146',
          property_id: 4,
          status: 'completed',
          status_display_text: 'Paid',
          title: 'Rent (29 Feb 2020 - 06 Mar 2020)',
          total: 60000,
        },
      },
      expenses: {
        0: {
          category: 'Management fees',
          creditor_name: 'Agency 1',
          export_due_or_duration: '29 Feb 2020 - 06 Mar 2020',
          gst: 54,
          id: 6,
          owner_company: 'Owners ltd',
          paid_at: '21 Feb 2020',
          payment_method: '',
          property_address: '239 Rupert Dr., Georgetown, nsw, 2146',
          property_id: 4,
          status: 'completed',
          status_display_text: 'Paid',
          title: 'Agency Fees',
          total: 600,
        },
      },
    };

    expect(received).toEqual(expected);
  });

  describe('getUserPropertyAccountIds', () => {
    let state;

    beforeEach(() => {
      state = {
        owner: {
          data: {
            22: {
              properties: [
                {
                  id: 12,
                  disbursementAccountId: 34,
                  paymentBankAccountId: 'abc',
                },
                {
                  id: 34,
                  disbursementAccountId: 78,
                  paymentCardAccountId: '111111',
                },
                {
                  id: 88,
                  disbursementAccountId: 76,
                  paymentBankAccountId: 'xyz',
                  paymentCardAccountId: '222222',
                },
              ],
            },
          },
          results: [22],
        },
      };
    });

    it('should return disbursement and payment account IDs mapped to property IDs', () => {
      const received = getUserPropertyAccountIds(state, 22, USER_TYPES.owner);
      const expected = {
        12: {
          disbursementAccountId: 34,
          paymentBankAccountId: 'abc',
        },
        34: {
          disbursementAccountId: 78,
          paymentCardAccountId: '111111',
        },
        88: {
          disbursementAccountId: 76,
          paymentBankAccountId: 'xyz',
          paymentCardAccountId: '222222',
        },
      };

      expect(received).toEqual(expected);
    });
  });

  describe('getUserPropertyIds', () => {
    const testState = {
      owner: {
        data: {
          11: {
            properties: [{ id: 1 }],
          },
          22: {
            properties: [{ id: 12 }, { id: 34 }, { id: 88 }],
          },
        },
        results: [11, 22],
      },
      tenant: {
        data: {
          33: {
            properties: [{ id: 34 }, { id: 56 }],
          },
          44: {
            properties: [{ id: 1 }],
          },
        },
        results: [33, 44],
      },
    };

    it('should return the properties owned by an owner', () => {
      const received = getUserPropertyIds(testState, 22, USER_TYPES.owner);
      const expected = [12, 34, 88];
      expect(received).toEqual(expected);
    });

    it('should return the properties leased by a tenant', () => {
      const received = getUserPropertyIds(testState, 33, USER_TYPES.tenant);
      const expected = [34, 56];
      expect(received).toEqual(expected);
    });
  });
});
