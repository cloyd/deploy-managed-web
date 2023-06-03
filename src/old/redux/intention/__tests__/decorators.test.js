/* eslint-disable no-undef */
import {
  decorateIntention,
  getCalculatedTotals,
  getCreditorFees,
  getDebtorFees,
  getFormattedCreditor,
  getFormattedDates,
  getFormattedDebtor,
  getOwnerNamesFromProperty,
} from '../decorators';

describe('intention/decorators', () => {
  let amount;
  let intention;

  beforeEach(() => {
    amount = 1000;
    intention = {
      adjustingItems: [],
      isPayByPaymentMethod: true,
      isTask: false,
      isRent: false,
      debtorFees: { fixed: 100, percentage: 150 },
      tenantFees: { fixed: 200, percentage: 150 },
      ownerFees: { fixed: 0, percentage: 0 },
      autoPayDate: '2018-1-1',
      reminderDate: '2018-1-1',
      dueDate: '2018-1-2',
      endDate: '2018-1-3',
      startDate: '2018-1-4',
      paidAt: '2018-09-10T15:41:26.680+10:00',
      payNoLaterThan: '2018-1-5',
    };
  });

  describe('decorateIntention', () => {
    it('should define isBpay as true when paymentMethod is bpay', () => {
      const received = decorateIntention({ paymentMethod: 'bpay' }).isBpay;
      const expected = true;
      expect(received).toEqual(expected);
    });

    it('should define isDD as true when paymentMethod is bank', () => {
      const received = decorateIntention({ paymentMethod: 'dd' }).isDD;
      const expected = true;
      expect(received).toEqual(expected);
    });

    it('should define isCC as true when paymentMethod is cc', () => {
      const received = decorateIntention({ paymentMethod: 'cc' }).isCC;
      const expected = true;
      expect(received).toEqual(expected);
    });

    it('should define isDeposit as true when type is deposit', () => {
      const received = decorateIntention({ type: 'deposit' }).isDeposit;
      const expected = true;
      expect(received).toEqual(expected);
    });

    it('should define isExpiredLease as true when lease status is expired', () => {
      const received = decorateIntention({
        lease: { status: 'expired' },
      }).isExpiredLease;
      const expected = true;
      expect(received).toEqual(expected);
    });

    it('should define isRent as true when type is rent', () => {
      const received = decorateIntention({ type: 'rent' }).isRent;
      const expected = true;
      expect(received).toEqual(expected);
    });

    it('should define isTask as true when type is task', () => {
      const received = decorateIntention({ type: 'task' }).isTask;
      const expected = true;
      expect(received).toEqual(expected);
    });

    it('should define isComplete as true when status is completed', () => {
      const received = decorateIntention({ status: 'completed' }).isComplete;
      const expected = true;
      expect(received).toEqual(expected);
    });

    it('should define isDraft as true when status is draft', () => {
      const received = decorateIntention({ status: 'draft' }).isDraft;
      const expected = true;
      expect(received).toEqual(expected);
    });

    it('should define isFailed as true when status contains failed', () => {
      const received = decorateIntention({ status: 'tenant_failed' }).isFailed;
      const expected = true;
      expect(received).toEqual(expected);
    });

    it('should define isPending as true when status contains pending', () => {
      const received = decorateIntention({
        status: 'tenant_pending',
      }).isPending;
      const expected = true;
      expect(received).toEqual(expected);
    });

    it('should define isPayByPaymentMethod as true when floatAmountCents === 0', () => {
      const received = decorateIntention({
        ...intention,
        floatAmountCents: 0,
      }).isPayByPaymentMethod;
      const expected = true;
      expect(received).toEqual(expected);
    });

    it('should define isPayByPaymentMethod as true when debtor is tenant', () => {
      const received = decorateIntention({
        ...intention,
        debtor: 'tenant',
        floatAmountCents: 1,
      }).isPayByPaymentMethod;
      const expected = true;
      expect(received).toEqual(expected);
    });

    it('should define isPayByPaymentMethod as false when debtor is not tenant & floatAmountCents is not 0', () => {
      const received = decorateIntention({
        ...intention,
        debtor: 'owner',
        floatAmountCents: 1,
      }).isPayByPaymentMethod;
      const expected = false;
      expect(received).toEqual(expected);
    });

    it('should define isPayByWallet as true when floatAmountCents < 0', () => {
      const received = decorateIntention({
        floatAmountCents: -1,
      }).isPayByWallet;
      const expected = true;
      expect(received).toEqual(expected);
    });

    it('should define isPayByWallet as false when debtor is tenant', () => {
      const received = decorateIntention({
        floatAmountCents: -1,
        debtor: 'tenant',
      }).isPayByWallet;
      const expected = false;
      expect(received).toEqual(expected);
    });

    it('should define formatted', () => {
      const received = decorateIntention(intention).formatted;
      const expected = {
        dates: expect.any(Object),
        debtor: expect.any(Object),
        creditor: expect.any(Object),
      };
      expect(received).toEqual(expected);
    });
  });

  describe('getCalculatedTotals', () => {
    it('should define amountCents as a positive number', () => {
      const received = getCalculatedTotals({ amountCents: -1 });
      const expected = 1;
      expect(received.amountCents).toBe(expected);
    });

    it('should define floatAmountCents as 0 by default', () => {
      const received = getCalculatedTotals({ floatAmountCents: undefined });
      const expected = 0;
      expect(received.floatAmountCents).toBe(expected);
    });

    it('should define floatAmountCents as 0 when positive', () => {
      const received = getCalculatedTotals({ floatAmountCents: 1 });
      const expected = 0;
      expect(received.floatAmountCents).toBe(expected);
    });

    it('should define floatAmountCents when negative', () => {
      const received = getCalculatedTotals({ floatAmountCents: -1 });
      const expected = -1;
      expect(received.floatAmountCents).toBe(expected);
    });

    it('should define adjustedAmountCents as sum of amountCents & floatAmountCents', () => {
      const received = getCalculatedTotals({
        amountCents: -10,
        floatAmountCents: -1,
      });
      const expected = 9;
      expect(received.adjustedAmountCents).toBe(expected);
    });

    it('should define originalAmountCents as a positive number', () => {
      const received = getCalculatedTotals({ originalAmountCents: -1 });
      const expected = 1;
      expect(received.originalAmountCents).toBe(expected);
    });

    it('should define fees', () => {
      const received = getCalculatedTotals({ amountCents: -1 });
      const expected = {
        amountCents: 0,
        fixed: 0,
        percentage: 0,
        taskBpayOutFixed: 0,
      };
      expect(received.fees).toEqual(expected);
    });

    it('should define totalCents as sum of amountCents & fees.amountCents', () => {
      const received = getCalculatedTotals({
        ...intention,
        amountCents: -1000,
        isTask: true,
      });
      const expected = 1115;
      expect(received.totalCents).toEqual(expected);
    });
  });

  describe('getDebtorFees', () => {
    it('should return no fees when isPayByPaymentMethod is false', () => {
      const received = getDebtorFees(
        { ...intention, isPayByPaymentMethod: false },
        amount
      );
      const expected = {
        fixed: 0,
        percentage: 0,
        amountCents: 0,
        taskBpayOutFixed: 0,
      };
      expect(received).toEqual(expected);
    });

    it('should return no fees when the amount is 0', () => {
      amount = 0;
      const received = getDebtorFees(
        { ...intention, isPayByPaymentMethod: true },
        amount
      );
      const expected = {
        fixed: 0,
        percentage: 0,
        amountCents: 0,
        taskBpayOutFixed: 0,
      };
      expect(received).toEqual(expected);
    });

    it('should return debtorFees when isTask is true', () => {
      const received = getDebtorFees({ ...intention, isTask: true }, amount);
      const expected = { fixed: 100, percentage: 1.5, amountCents: 115 };
      expect(received).toEqual(expected);
    });

    it('should return fees based on debtor role', () => {
      const received = getDebtorFees(
        { ...intention, debtor: 'tenant' },
        amount
      );
      const expected = { fixed: 200, percentage: 1.5, amountCents: 215 };
      expect(received).toEqual(expected);
    });
  });

  describe('getCreditorFees', () => {
    it('should return no fees when the amount is 0', () => {
      amount = 0;
      const ownerFees = { fixed: 100, percentage: 150 };
      const received = getCreditorFees(
        { ...intention, isPayByPaymentMethod: true, ownerFees: ownerFees },
        amount
      );
      const expected = {
        fixed: 0,
        percentage: 0,
        amountCents: 0,
        taskBpayOutFixed: 0,
      };
      expect(received).toEqual(expected);
    });

    it('should return creditorFees when isRent is true', () => {
      const ownerFees = { fixed: 100, percentage: 150 };
      const received = getCreditorFees(
        { ...intention, isRent: true, ownerFees: ownerFees },
        amount
      );
      const expected = { fixed: 100, percentage: 1.5, amountCents: 115 };
      expect(received).toEqual(expected);
    });

    it('should return zero when isRent is false', () => {
      const ownerFees = { fixed: 100, percentage: 150 };
      const received = getCreditorFees(
        { ...intention, isRent: false, ownerFees: ownerFees },
        amount
      );
      const expected = {
        fixed: 0,
        percentage: 0,
        amountCents: 0,
        taskBpayOutFixed: 0,
      };
      expect(received).toEqual(expected);
    });
  });

  describe('getFormattedCreditor', () => {
    beforeEach(() => {
      intention = {
        ...intention,
        type: 'task',
        amountCents: 30000,
        ownerAmountCents: 20000,
        floatAmountCents: 0,
        isComplete: true,
        paymentMethod: 'dd',
      };
    });

    it('should return amountCents as amount', () => {
      const received = getFormattedCreditor(intention).amount;
      const expected = '$300';
      expect(received).toEqual(expected);
    });

    it('should return ownerAmountCents as total', () => {
      const received = getFormattedCreditor(intention).total;
      const expected = '$200';
      expect(received).toEqual(expected);
    });

    it('should return lineItems', () => {
      const received = getFormattedCreditor(intention).lineItems;
      const expected = [
        {
          title: 'Invoice total',
          amount: '$300',
          numerator: null,
        },
        {
          title: 'Paid to owner',
          amount: '$200',
          numerator: '+',
        },
        {
          title: 'Payment method',
          amount: 'Bank Account',
        },
      ];

      expect(received).toEqual(expected);
    });

    it('should add `Agency fees` when not a task', () => {
      const received = getFormattedCreditor({
        ...intention,
        type: 'deposit',
        agencyAmountCents: 10000,
        paymentMethod: 'wallet',
      }).lineItems;

      const expected = [
        {
          title: 'Invoice total',
          amount: '$300',
          numerator: null,
        },
        {
          title: 'Agency fees',
          amount: '$100',
          numerator: '-',
        },
        {
          title: 'Paid to owner',
          amount: '$200',
          numerator: '+',
        },
        {
          title: 'Payment method',
          amount: 'Wallet',
        },
      ];

      expect(received).toEqual(expected);
    });

    it('should add `Paid to wallet` when floatAmountCents > 0', () => {
      const received = getFormattedCreditor({
        ...intention,
        ownerAmountCents: 20000,
        floatAmountCents: 10000,
        paymentMethod: 'cc',
      }).lineItems;

      const expected = [
        {
          title: 'Invoice total',
          amount: '$300',
          numerator: null,
        },
        {
          title: 'Paid to wallet',
          amount: '$100',
          numerator: '+',
        },
        {
          title: 'Paid to owner',
          amount: '$100',
          numerator: '+',
        },
        {
          title: 'Payment method',
          amount: 'Credit Card',
        },
      ];

      expect(received).toEqual(expected);
    });

    it('should show `Paid to owners` when owner credit splits', () => {
      const received = getFormattedCreditor({
        ...intention,
        ownerCreditSplits: [],
        ownerAmountCents: 20000,
        floatAmountCents: 10000,
        paymentMethod: 'wallet',
      }).lineItems;

      const expected = [
        {
          title: 'Invoice total',
          amount: '$300',
          numerator: null,
        },
        {
          title: 'Paid to wallet',
          amount: '$100',
          numerator: '+',
        },
        {
          title: 'Paid to owners',
          amount: '$100',
          numerator: '+',
        },
        {
          title: 'Payment method',
          amount: 'Wallet',
        },
      ];

      expect(received).toEqual(expected);
    });
  });

  describe('getFormattedDates', () => {
    it('should format autoPayDate as shortNoYear', () => {
      const received = getFormattedDates(intention).autoPay;
      const expected = 'Mon 1 Jan';
      expect(received).toEqual(expected);
    });

    it('should format dueDate as shortNoYear', () => {
      const received = getFormattedDates(intention).due;
      const expected = 'Tue 2 Jan';
      expect(received).toEqual(expected);
    });

    it('should format endDate as shortNoYear', () => {
      const received = getFormattedDates(intention).end;
      const expected = 'Wed 3 Jan';
      expect(received).toEqual(expected);
    });

    it('should format startDate as shortNoYear', () => {
      const received = getFormattedDates(intention).start;
      const expected = 'Thu 4 Jan';
      expect(received).toEqual(expected);
    });

    it('should format paidAt as shortNoYear', () => {
      const received = getFormattedDates(intention).paidAt;
      const expected = '10 Sep 2018';
      expect(received).toEqual(expected);
    });
  });

  describe('getFormattedDebtor', () => {
    beforeEach(() => {
      intention = {
        ...intention,
        amountCents: 30000,
        isTask: true,
        floatBalanceAmountCents: 50000,
        paymentMethod: 'cc',
      };
    });

    it('should return amountCents as amount', () => {
      const received = getFormattedDebtor(intention).amount;
      const expected = '$300';
      expect(received).toEqual(expected);
    });

    it('should return amountCents + fee.amountCents as total', () => {
      const received = getFormattedDebtor(intention).total;
      const expected = '$305.50';
      expect(received).toEqual(expected);
    });

    it('should return floatBalanceAmountCents as walletBalance', () => {
      const received = getFormattedDebtor(intention).walletBalance;
      const expected = '$500';
      expect(received).toEqual(expected);
    });

    it('should return fees.amount', () => {
      const received = getFormattedDebtor(intention).fees.amount;
      const expected = '$5.50';
      expect(received).toEqual(expected);
    });

    it('should return fees.fixed', () => {
      const received = getFormattedDebtor(intention).fees.fixed;
      const expected = '$1.00';
      expect(received).toEqual(expected);
    });

    it('should return fees.percentage', () => {
      const received = getFormattedDebtor(intention).fees.percentage;
      const expected = '1.5%';
      expect(received).toEqual(expected);
    });

    it('should return payBy.method for bpay', () => {
      const received = getFormattedDebtor({
        ...intention,
        paymentMethod: 'bpay',
      }).payBy.method;
      const expected = 'Direct Payment';
      expect(received).toEqual(expected);
    });

    it('should return payBy.method for cc', () => {
      const received = getFormattedDebtor({
        ...intention,
        paymentMethod: 'cc',
      }).payBy.method;
      const expected = 'Credit Card';
      expect(received).toEqual(expected);
    });

    it('should return payBy.method for dd', () => {
      const received = getFormattedDebtor({
        ...intention,
        paymentMethod: 'dd',
      }).payBy.method;
      const expected = 'Bank Account';
      expect(received).toEqual(expected);
    });

    describe('lineItems', () => {
      beforeEach(() => {
        intention = {
          amountCents: 30000,
        };
      });

      it('should return an empty array by default', () => {
        const received = getFormattedDebtor(intention).lineItems;
        const expected = [];
        expect(received).toEqual(expected);
      });

      it('should return Invoice total when amountCents !== amountCents + floatCents', () => {
        const received = getFormattedDebtor({
          ...intention,
          floatAmountCents: -1000,
          isComplete: true,
        }).lineItems;

        const expected = [
          {
            title: 'Invoice total',
            amount: '$300',
            numerator: null,
          },
        ];

        expect(received).toEqual(expected);
      });

      it('should return Paid via wallet when isPayByWallet', () => {
        const received = getFormattedDebtor({
          ...intention,
          isPayByWallet: true,
          isComplete: true,
          floatAmountCents: -1000,
          isTask: true,
          canApplyBpayOutFees: true,
          debtorFees: { taskBpayOutFixed: 25 },
        }).lineItems;

        const expected = [
          {
            title: 'Invoice total',
            amount: '$300.25',
            numerator: null,
          },
          {
            title: 'Paid via wallet',
            amount: '$10',
            numerator: '-',
          },
          {
            title: 'Transaction fee ($0.00)',
            amount: '$0.25',
            numerator: '-',
          },
          {
            title: 'Amount paid',
            amount: '$300.25',
            numerator: '-',
          },
        ];

        expect(received).toEqual(expected);
      });

      it('should return Paid via payBy.method when isPayByPaymentMethod', () => {
        const received = getFormattedDebtor({
          ...intention,
          isPayByPaymentMethod: true,
          isComplete: true,
          paymentMethod: 'bpay',
        }).lineItems;

        const expected = [
          {
            title: 'Paid via Direct Payment',
            amount: '$300',
            numerator: '-',
          },
        ];

        expect(received).toEqual(expected);
      });

      it('should return fees for cc when fees.amountCents > 0', () => {
        const received = getFormattedDebtor({
          ...intention,
          debtorFees: { fixed: 100, percentage: 150 },
          isPayByPaymentMethod: true,
          isTask: true,
          isCC: true,
          isComplete: true,
          paymentMethod: 'cc',
        }).lineItems;

        const expected = [
          {
            title: 'Paid via Credit Card',
            amount: '$300',
            numerator: '-',
          },
          {
            amount: '$5.50',
            numerator: '-',
            title: 'Transaction fees (1.5% + $1.00)',
          },
          {
            amount: '$305.50',
            numerator: '-',
            title: 'Amount paid',
          },
        ];

        expect(received).toEqual(expected);
      });

      it('should return fees for dd when fees.amountCents > 0', () => {
        const received = getFormattedDebtor({
          ...intention,
          debtorFees: { fixed: 100, percentage: 0 },
          isPayByPaymentMethod: true,
          isTask: true,
          isDD: true,
          isComplete: true,
          paymentMethod: 'dd',
        }).lineItems;

        const expected = [
          {
            title: 'Paid via Bank Account',
            amount: '$300',
            numerator: '-',
          },
          {
            amount: '$1.00',
            numerator: '-',
            title: 'Transaction fee ($1.00)',
          },
          {
            amount: '$301',
            numerator: '-',
            title: 'Amount paid',
          },
        ];

        expect(received).toEqual(expected);
      });
    });
  });

  describe('getOwnerNamesFromProperty', () => {
    let property;
    beforeEach(() => {
      property = {
        primaryOwner: { id: 1, firstName: 'John', lastName: 'Doe' },
        secondaryOwners: [],
      };
    });

    it("should return the owner's full name", () => {
      const {
        primaryOwner: { firstName, lastName },
      } = property;
      const received = getOwnerNamesFromProperty(property, 1);
      const expected = `${firstName} ${lastName}`;
      expect(received).toEqual(expected);
    });

    it("should return 'Owner' if the owner changed", () => {
      const received = getOwnerNamesFromProperty(property, 2);
      const expected = 'Owner';
      expect(received).toEqual(expected);
    });
  });
});
