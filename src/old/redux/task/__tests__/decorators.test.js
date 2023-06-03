import {
  decorateTask,
  decorateTaskCreditorData,
  decorateTaskParty,
} from '../decorators';

describe('task/decorators', () => {
  describe('decorateTask', () => {
    it('should define creatorName with a default', () => {
      const received = decorateTask({
        creatorName: null,
        taskType: { key: '' },
      }).creatorName;
      const expected = 'System';
      expect(received).toEqual(expected);
    });

    it('should define creatorType with a default', () => {
      const received = decorateTask({
        creatorType: null,
        taskType: { key: '' },
      }).creatorType;
      const expected = 'manager';
      expect(received).toEqual(expected);
    });

    it('should define isArrear as true', () => {
      const received = decorateTask({ taskType: { key: 'arrear' } }).isArrear;
      const expected = true;
      expect(received).toEqual(expected);
    });

    it('should define isBill as true', () => {
      const received = decorateTask({ taskType: { key: 'bill' } }).isBill;
      const expected = true;
      expect(received).toEqual(expected);
    });

    it('should define isBillable as true', () => {
      const received = decorateTask({
        invoice: { creditorId: 1, debtorId: 2 },
        taskType: { key: '' },
      }).isBillable;
      const expected = true;
      expect(received).toEqual(expected);
    });

    it('should define isIntentionComplete as true', () => {
      const received = decorateTask({
        invoice: { intentionStatus: 'completed' },
        taskType: { key: '' },
      }).isIntentionComplete;
      const expected = true;
      expect(received).toEqual(expected);
    });

    it('should define isIntentionDraft as true', () => {
      const received = decorateTask({
        invoice: { intentionStatus: 'draft' },
        taskType: { key: '' },
      }).isIntentionDraft;
      const expected = true;
      expect(received).toEqual(expected);
    });

    it('should define isIntentionFailed as true', () => {
      const received = decorateTask({
        invoice: {
          intentionStatus: 'draft',
          intentionSupersedingReason: 'invoice failed',
        },
        taskType: { key: '' },
      }).isIntentionFailed;
      const expected = true;
      expect(received).toEqual(expected);
    });

    it('should define isIntentionPending as true', () => {
      const received = decorateTask({
        invoice: { intentionStatus: 'pending_owner' },
        taskType: { key: '' },
      }).isIntentionPending;
      const expected = true;
      expect(received).toEqual(expected);
    });

    it('should define isMaintenance as true', () => {
      const received = decorateTask({
        taskType: { key: 'maintenance' },
      }).isMaintenance;
      const expected = true;
      expect(received).toEqual(expected);
    });
  });

  describe('decorateTaskCreditorData', () => {
    it('should return data with label attribute', () => {
      const received = decorateTaskCreditorData([
        {
          id: 1,
          name: 'Bob Test',
          promisepayUserPromisepayCompanyLegalName: 'Foo Company',
        },
        {
          id: 2,
          name: 'Kate Tester',
          promisepayUserPromisepayCompanyLegalName: 'Foo Company',
        },
        {
          id: 3,
          name: 'Kim Test',
          promisepayUserPromisepayCompanyLegalName: 'Bar Company',
        },
      ]);
      const expected = [
        {
          id: 1,
          name: 'Bob Test',
          promisepayUserPromisepayCompanyLegalName: 'Foo Company',
          label: 'Foo Company - Bob Test',
        },
        {
          id: 2,
          name: 'Kate Tester',
          promisepayUserPromisepayCompanyLegalName: 'Foo Company',
          label: 'Foo Company - Kate Tester',
        },
        {
          id: 3,
          name: 'Kim Test',
          promisepayUserPromisepayCompanyLegalName: 'Bar Company',
          label: 'Bar Company - Kim Test',
        },
      ];
      expect(received).toEqual(expected);
    });
  });

  describe('decorateTaskParty', () => {
    it('should decorate a tenant', () => {
      const user = {
        id: 123,
        firstName: 'Super',
        lastName: 'Foo',
        typeOf: 'tenant',
      };

      const received = decorateTaskParty(user, 'Tenant');
      const expected = {
        id: 123,
        name: 'Super Foo',
        type: 'Tenant',
        typeOf: 'tenant',
        isBpaySet: false,
        label: 'Super Foo (Tenant)',
        value: '123::Tenant',
      };

      expect(received).toEqual(expected);
    });

    it('should decorate a BPay out provider', () => {
      const user = {
        id: 123,
        firstName: 'Super',
        lastName: 'Foo',
        typeOf: 'ExternalCreditor',
        bpayOutProvider: true,
      };

      const received = decorateTaskParty(user, 'ExternalCreditor');
      const expected = {
        id: 123,
        name: 'Super Foo',
        type: 'ExternalCreditor',
        typeOf: 'ExternalCreditor',
        isBpayOutProvider: true,
        isBpaySet: false,
        label: 'Super Foo ',
        value: '123::ExternalCreditor',
      };

      expect(received).toEqual(expected);
    });
  });
});
