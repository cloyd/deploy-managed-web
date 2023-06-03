import { useMemo } from 'react';

import {
  hasDisbursementAccount,
  hasPaymentAccount,
} from '../../../redux/profile';
import { fullName } from '../../../utils';

export const useTaskParties = ({
  acceptedQuote,
  bpayBillers,
  bpayOutProviders,
  expiredLeases,
  property,
  tenant,
  userAgency,
  upcomingLease,
  hasAllowedBpayBillerAsCreditor,
}) => {
  const defaultOptions = useMemo(() => {
    const { agency, primaryOwner } = property || {};
    const options = [];

    if (agency?.id) {
      options.push(taskOption(agency, 'Agency', 'Agent'));
    }

    if (primaryOwner?.id) {
      options.push(taskOption(primaryOwner, 'Owner'));
    }

    if (tenant?.id) {
      options.push(taskOption(tenant, 'Tenant', 'Tenant', property.leaseId));
    }

    return options;
  }, [property, tenant]);

  const debtors = useMemo(
    () => [...defaultOptions].filter(hasPaymentAccount), // Debtors require a payment account
    [defaultOptions]
  );

  const creditors = useMemo(() => {
    const options = [...defaultOptions];

    if (bpayBillers) {
      bpayBillers.map((bpayBiller) => {
        options.push(taskOption(bpayBiller, 'BpayBiller', 'BPay'));
      });
    }

    if (userAgency?.isBpayOutViaAssembly && !hasAllowedBpayBillerAsCreditor) {
      options.push(...bpayOutProviders);
    }

    if (acceptedQuote?.tradie?.id) {
      options.push(
        taskOption(
          acceptedQuote?.tradie,
          'ExternalCreditor',
          'External Creditor'
        )
      );
    }

    // Creditors require a disbursent account
    return options.filter(hasDisbursementAccount);
  }, [
    acceptedQuote,
    bpayBillers,
    bpayOutProviders,
    defaultOptions,
    hasAllowedBpayBillerAsCreditor,
    userAgency,
  ]);

  const pastTenants = useMemo(() => {
    let options = [];

    expiredLeases.forEach((lease) => {
      if (lease.primaryTenant) {
        options.push(
          taskOption(lease.primaryTenant, 'Tenant', 'Tenant', lease.id)
        );
      }
    });

    return options
      .filter(hasPaymentAccount)
      .filter((user) => user.id !== tenant.id);
  }, [expiredLeases, tenant.id]);

  const upcomingTenants = useMemo(() => {
    let options = [];

    if (upcomingLease.primaryTenant) {
      options.push(
        taskOption(
          upcomingLease.primaryTenant,
          'Tenant',
          'Tenant',
          upcomingLease.id
        )
      );
    }
    return options
      .filter(hasPaymentAccount)
      .filter((user) => user.id !== tenant.id);
  }, [upcomingLease, tenant.id]);

  return { creditors, debtors, pastTenants, upcomingTenants };
};

const taskOption = (user, type, typeOf, leaseId) => {
  const {
    billerCode,
    bpayBillerCode,
    gstIncluded,
    id,
    isDefaultPaymentAccountSet,
    isDisbursementAccountSet,
    isDefaultMtechAccountSet,
    name,
    tradingName,
    company,
  } = user;

  return {
    billerCode,
    gstIncluded,
    id,
    isDefaultPaymentAccountSet,
    isDisbursementAccountSet,
    isDefaultMtechAccountSet,
    type,
    isBpaySet: !!bpayBillerCode,
    name: name || tradingName || company?.legalName || fullName(user),
    typeOf: user.typeOf || typeOf || type,
    leaseId: leaseId,
  };
};
