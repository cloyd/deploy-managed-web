import camelCase from 'lodash/fp/camelCase';
import { useCallback, useEffect, useState } from 'react';

import { DEFAULT_FOLLOWERS } from '../../../redux/task';
import { toDollars } from '../../../utils';
import { useRolesContext } from '../../Profile';
import { mapBillFieldsProps, mapMaintenanceFieldsProps } from '../Fields';

export const useTaskFormState = ({
  handleChange,
  isCreate = false,
  setFieldValue,
  taskMeta,
  values = {},
}) => {
  const { isManager, isOwner, isTenant } = useRolesContext();

  const [state, setState] = useState({
    categories: [],
    creditorType: [],
    defaultFollowers: [],
    invoiceCategories: [],
    statuses: [],
  });

  const handleChangeFollowers = useCallback(
    (value, e) => {
      const followersField = e.name;
      if (e.action === 'select-option' || e.action === 'remove-value') {
        setFieldValue(followersField, value);
      } else if (e.action === 'clear') {
        setFieldValue(followersField, DEFAULT_FOLLOWERS);
      }
    },
    [setFieldValue]
  );

  const handleChangeTaskType = useCallback(
    (debtorList) => (e) => {
      const isBill = e.currentTarget?.value === 'bill';
      const isMaintenance = e.currentTarget?.value === 'maintenance';

      setFieldValue('isBill', isBill);
      setFieldValue('isMaintenance', isMaintenance);

      if (isBill) {
        setFieldValue('amountDollars', toDollars(100));
        setFieldValue('payments', mapBillFieldsProps({}, debtorList).payments);
      }

      if (isMaintenance && isCreate && !values.appointments) {
        const props = mapMaintenanceFieldsProps({
          hasAccess: true,
        });

        for (let key of Object.keys(props)) {
          setFieldValue(key, props[key]);
        }
      }

      handleChange(e);
    },
    [handleChange, isCreate, setFieldValue, values.appointments]
  );

  const handleUpdateState = useCallback(
    (key = '') =>
      (value) =>
        setState({ ...state, [key]: value }),
    [state]
  );

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    const metaType =
      values.type === 'arrears' ? 'arrear' : camelCase(values.type);
    const meta = taskMeta[metaType] || {};
    const categories = meta.categories || [];
    const invoiceCategories = taskMeta.invoice?.categories || [];
    const statuses = meta.statuses || [];
    const defaultStatus = isManager ? statuses[0]?.key : statuses[1]?.key;
    const defaultFollowers = DEFAULT_FOLLOWERS;

    const followersField = values.isBill
      ? 'payments[0].followers'
      : 'followers';
    !isCreate
      ? setFieldValue(followersField, defaultFollowers.concat(values.followers))
      : isOwner
      ? setFieldValue(
          followersField,
          defaultFollowers.concat([{ label: 'Owners', value: 'owners' }])
        )
      : isTenant
      ? setFieldValue(
          followersField,
          defaultFollowers.concat([{ label: 'Tenants', value: 'tenants' }])
        )
      : setFieldValue(followersField, defaultFollowers);

    setFieldValue('status', defaultStatus);

    setState({
      ...state,
      categories,
      defaultFollowers,
      invoiceCategories,
      statuses,
    });
  }, [taskMeta, values.type]);
  /* eslint-enable react-hooks/exhaustive-deps */

  return [
    {
      ...state,
      showDefaultFields: !!values.type,
    },
    {
      handleChangeFollowers,
      handleChangeTaskType,
      handleUpdateState,
    },
  ];
};
