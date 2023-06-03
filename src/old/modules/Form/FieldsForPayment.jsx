import PropTypes from 'prop-types';
import React, { useCallback, useState } from 'react';
import { Col, CustomInput, FormGroup, FormText, Row } from 'reactstrap';

import {
  FormField,
  FormFollowers,
  FormLabel,
  FormOptionsList,
  FormTypeaheadUser,
} from '.';
import {
  DEFAULT_FOLLOWERS,
  decorateTaskParty,
  isSearchableCreditor,
  parseCreditorType,
} from '../../redux/task';
import { EXTERNAL_CREDITOR_CLASSIFICATIONS } from '../../redux/users';
import { isSameKey, joinKey, removeSeparators, toDollars } from '../../utils';
import { DividerDouble } from '../Divider';
import { useTaskBpayAlert, useTaskCreditors } from '../Task/hooks';

const MAX_PAYMENT_COUNT = 2;

const getFieldName = (index, attributeName) => {
  return `payments[${index}].${attributeName}`;
};

const updateArrayState = (value, index, array, setArray) => {
  const newArray = [...array];
  newArray[index] = value;
  setArray(newArray);
};

export const FormFieldsForPayment = (props) => {
  const {
    isMarketplaceEnabled,
    creditorList,
    debtorList,
    fetchBpayBillers,
    hasAllowedBpayBillerAsCreditor,
    property,
    setFieldValue,
    setHasPointerEvent,
    values,
    isDisabled,
    userAgency,
    arrayHelpers,
    invoice,
    defaultBPayOutProvider,
  } = props;

  const [creditorSearchLists, setCreditorSearchLists] = useState(
    Array(MAX_PAYMENT_COUNT).fill([])
  );
  const [creditorSearchTypes, setCreditorSearchTypes] = useState(
    Array(MAX_PAYMENT_COUNT)
  );
  const [bpayBillerNames, setBpayBillerNames] = useState(
    Array(MAX_PAYMENT_COUNT)
  );
  const [isSplitBill, setIsSplitBill] = useState(false);

  const creditors = [
    useTaskCreditors({
      creditorList,
      creditorSearchList: creditorSearchLists[0],
      debtorKey: values.payments[0].debtorKey,
      debtorList,
    }),
    useTaskCreditors({
      creditorList,
      creditorSearchList: creditorSearchLists[1],
      debtorKey: values.payments[1]?.debtorKey,
      debtorList,
    }),
  ];

  const updateCreditorSearchList = useCallback(
    (searchList, index) => {
      updateArrayState(
        searchList,
        index,
        creditorSearchLists,
        setCreditorSearchLists
      );
    },
    [creditorSearchLists]
  );

  const updateCreditorSearchType = useCallback(
    (searchType, index) => {
      updateArrayState(
        searchType,
        index,
        creditorSearchTypes,
        setCreditorSearchTypes
      );
    },
    [creditorSearchTypes]
  );

  const updateBpayBillerName = useCallback(
    (name, index) => {
      updateArrayState(name, index, bpayBillerNames, setBpayBillerNames);
    },
    [bpayBillerNames]
  );

  const showBpayAlert = useTaskBpayAlert({
    debtorKey: values.debtorKey,
    debtorList,
  });

  const findCreditor = useCallback(
    (key, index) =>
      [...creditorList, ...creditorSearchLists[index]].find(isSameKey(key)),
    [creditorList, creditorSearchLists]
  );

  const handleChangeCreditor = useCallback(
    (index) => (e) => {
      const creditorType = e.currentTarget.value;

      if (isSearchableCreditor(creditorType, hasAllowedBpayBillerAsCreditor)) {
        updateCreditorSearchType(creditorType, index);
      } else {
        updateCreditorSearchType(null, index);
      }

      const creditor =
        creditorList
          .concat(creditorSearchLists[index])
          .find(isSameKey(values.payments[index].creditorKey)) || {};

      arrayHelpers.replace(index, {
        ...values.payments[index],
        creditorKey: e.target.value,
        isBpayBiller:
          e.target.value === 'PayViaBpay::BpayBiller' ||
          !!creditor.billerCode ||
          creditor.isBpayOutProvider,
        gstIncluded: !!creditor.gstIncluded,
      });
    },
    [
      arrayHelpers,
      creditorList,
      creditorSearchLists,
      hasAllowedBpayBillerAsCreditor,
      updateCreditorSearchType,
      values.payments,
    ]
  );

  const handleChangeCreditorSearch = useCallback(
    (index) => (user) => {
      const creditorSearchType = creditorSearchTypes[index];
      const creditorKey = joinKey(user.id, creditorSearchType);

      // Add the creditor to the search list if they don't already exist
      let creditor = findCreditor(creditorKey, index);

      if (!creditor) {
        creditor = decorateTaskParty(user, creditorSearchType);
        updateCreditorSearchList(
          [...creditorSearchLists[index], creditor],
          index
        );
      }

      // Set the creditor key
      setFieldValue(getFieldName(index, 'creditorKey'), creditorKey);

      // Reset the search type
      updateCreditorSearchType(null, index);
    },
    [
      creditorSearchLists,
      creditorSearchTypes,
      findCreditor,
      setFieldValue,
      updateCreditorSearchList,
      updateCreditorSearchType,
    ]
  );

  const handleToggle = useCallback((e) => {
    const { name, checked } = e.target;
    setFieldValue(name, checked);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMouseDown = useCallback(
    // Stops Preview embed from capturing pointer events
    (e) => setHasPointerEvent(false),
    [setHasPointerEvent]
  );

  const handlePasteRemoveSeparators = useCallback(
    (fieldName) => (e) => {
      const value = removeSeparators(e.clipboardData.getData('Text'), ' ');
      setFieldValue(fieldName, value);
      e.preventDefault();
    },
    [setFieldValue]
  );

  const handleSplitBill = useCallback(() => {
    if (isSplitBill) {
      arrayHelpers.remove(1);
    } else {
      const tenant = debtorList.find(({ type }) => type === 'Tenant');
      arrayHelpers.push({
        debtorKey: joinKey(tenant?.id, tenant?.type),
        amountDollars: toDollars(invoice.amountCents || 100),
        // If Agency is set to BPay Out, then set creditor to default BPay Out provider
        creditorKey:
          invoice.isBPayOut && userAgency?.isBpayOutViaAssembly
            ? joinKey(defaultBPayOutProvider.id, invoice.creditorType)
            : invoice.creditorId
            ? joinKey(invoice.creditorId, invoice.creditorType)
            : '',
        gstIncluded: invoice.gstIncluded || false,
        bpayBillerCode: invoice.bpayBillerCode || '',
        bpayReference: invoice.bpayReference || '',
        referenceNumber: invoice.referenceNumber || '',
        isScheduledForAutoPayment: false,
        followers: DEFAULT_FOLLOWERS,
      });
    }
    setIsSplitBill(!isSplitBill);
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [
    arrayHelpers,
    debtorList,
    defaultBPayOutProvider,
    invoice,
    isSplitBill,
    userAgency?.isBpayOutViaAssembly,
    /* eslint-enable react-hooks/exhaustive-deps */
  ]);

  const lookupBpayBiller = useCallback(
    (index) => (e) => {
      const value = e.target.value;

      setFieldValue(getFieldName(index, 'bpayBillerCode'), value);
      setFieldValue(getFieldName(index, 'bpayBillerId'), '');
      updateBpayBillerName('', index);

      if (value) {
        fetchBpayBillers({
          params: { 'q[biller_code_eq]': value },
          onComplete: (data) => {
            if (data.length) {
              setFieldValue(
                getFieldName(index, 'bpayBillerId'),
                data[0].id.toString()
              );
              updateBpayBillerName(data[0].name, index);
            }
          },
        });
      }
    },
    [fetchBpayBillers, setFieldValue, updateBpayBillerName]
  );

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

  return (
    <>
      <Row>
        <Col>
          <CustomInput
            className="pb-3"
            checked={isSplitBill}
            id="splitBill"
            name="splitBill"
            label="Split Bill"
            type="checkbox"
            value={isSplitBill}
            onChange={handleSplitBill}
          />
        </Col>
      </Row>
      {values.payments.map((payment, index) => {
        const followersName = getFieldName(index, 'followers');
        const debtorKeyName = getFieldName(index, 'debtorKey');
        const amountDollarsName = getFieldName(index, 'amountDollars');
        const creditorKeyName = getFieldName(index, 'creditorKey');
        const gstIncludedName = getFieldName(index, 'gstIncluded');
        const bpayBillerCode = getFieldName(index, 'bpayBillerCode');
        const bpayReferenceName = getFieldName(index, 'bpayReference');
        const referenceNumberName = getFieldName(index, 'referenceNumber');
        const isScheduledForAutoPaymentName = getFieldName(
          index,
          'isScheduledForAutoPayment'
        );
        const creditorSearchType = creditorSearchTypes[index];
        const bpayBillerName = bpayBillerNames[index];
        const followers = values.payments[index].followers;

        return (
          <div key={`bill-${index + 1}`}>
            <DividerDouble />
            {isSplitBill && (
              <Row>
                <Col className="pb-3">
                  <strong>{`Bill ${index + 1}.`}</strong>
                </Col>
              </Row>
            )}
            <FormGroup>
              <FormLabel for={followersName} isRequired>
                Task followers
              </FormLabel>
              <FormFollowers
                value={followers}
                disabled={!property.id}
                name={followersName}
                onChange={handleChangeFollowers}
              />
            </FormGroup>
            <FormGroup>
              <FormLabel for={debtorKeyName} isRequired>
                Who’s paying?
              </FormLabel>
              <FormField
                disabled={isDisabled}
                name={debtorKeyName}
                type="select">
                <FormOptionsList
                  hasBlank={true}
                  name={getFieldName(index, 'debtor')}
                  options={debtorList}
                />
              </FormField>

              {showBpayAlert && !userAgency?.isBpayOutViaAssembly && (
                <FormText color="danger">
                  User needs to setup an account to pay BPAY billers
                </FormText>
              )}
            </FormGroup>

            <FormGroup>
              <FormLabel for={amountDollarsName} isRequired>
                How much?
              </FormLabel>
              <FormField
                disabled={isDisabled}
                min="1"
                name={amountDollarsName}
                prepend="$"
                step="any"
                type="number"
                onMouseDown={handleMouseDown}
              />
            </FormGroup>
            <FormGroup>
              <FormLabel for={creditorKeyName} isRequired>
                To?
              </FormLabel>
              <FormField
                disabled={isDisabled || !payment.debtorKey}
                name={creditorKeyName}
                type="select"
                onChange={handleChangeCreditor(index)}>
                <FormOptionsList
                  hasBlank={true}
                  name={getFieldName(index, 'creditor')}
                  options={creditors[index]}
                />
                {hasAllowedBpayBillerAsCreditor && (
                  <option value="PayViaBpay::BpayBiller">
                    Pay via BPAY Biller
                  </option>
                )}
                <option value="ExternalCreditor">Search for a Creditor</option>
              </FormField>
            </FormGroup>
            {creditorSearchType && (
              <FormGroup>
                <FormTypeaheadUser
                  placeholder="Start typing to search for a creditor..."
                  searchData={
                    isMarketplaceEnabled
                      ? {
                          classification: [
                            EXTERNAL_CREDITOR_CLASSIFICATIONS.tradie,
                            EXTERNAL_CREDITOR_CLASSIFICATIONS.serviceProvider,
                          ],
                          'q[bpay_out_provider_eq]':
                            hasAllowedBpayBillerAsCreditor ? false : null,
                        }
                      : {
                          agencyId: property.agencyId,
                        }
                  }
                  type={parseCreditorType(creditorSearchType)}
                  onChange={handleChangeCreditorSearch(index)}
                  onMouseDown={handleMouseDown}
                />
              </FormGroup>
            )}
            <FormGroup>
              <CustomInput
                checked={payment.gstIncluded}
                disabled={isDisabled}
                id={gstIncludedName}
                label="Collects GST"
                name={gstIncludedName}
                type="checkbox"
                onChange={handleToggle}
              />
            </FormGroup>
            {payment.isBpayBiller ? (
              <>
                <FormGroup>
                  <FormLabel for="bpayBillerCode" isRequired>
                    BPay Biller Code
                  </FormLabel>
                  <FormField
                    name={getFieldName(index, 'bpayBillerCode')}
                    type="string"
                    onChange={lookupBpayBiller(index)}
                    onPaste={handlePasteRemoveSeparators(bpayBillerCode)}
                  />
                  <span className="h6-font-size small">
                    {bpayBillerName && `This BPay Biller is ${bpayBillerName}.`}
                  </span>
                </FormGroup>
                <FormGroup>
                  <FormLabel for={bpayReferenceName} isRequired>
                    BPay Reference
                  </FormLabel>
                  <FormField
                    name={bpayReferenceName}
                    disabled={isDisabled}
                    onPaste={handlePasteRemoveSeparators(bpayReferenceName)}
                    onMouseDown={handleMouseDown}
                  />
                </FormGroup>
              </>
            ) : (
              <FormGroup>
                <FormLabel for={referenceNumberName}>
                  Payment Reference
                </FormLabel>
                <FormField
                  name={referenceNumberName}
                  disabled={isDisabled}
                  onMouseDown={handleMouseDown}
                />
                <span className="h6-font-size small">
                  {'If left empty, property address will be used.'}
                </span>
              </FormGroup>
            )}
            <FormGroup>
              <CustomInput
                checked={payment.isScheduledForAutoPayment}
                disabled={isDisabled}
                id={isScheduledForAutoPaymentName}
                label="Schedule for automatic payment"
                name={isScheduledForAutoPaymentName}
                type="checkbox"
                onChange={handleToggle}
              />
            </FormGroup>
          </div>
        );
      })}
    </>
  );
};

FormFieldsForPayment.propTypes = {
  isMarketplaceEnabled: PropTypes.bool,
  creditorList: PropTypes.array,
  debtorList: PropTypes.array,
  fetchBpayBillers: PropTypes.func,
  hasAllowedBpayBillerAsCreditor: PropTypes.bool,
  property: PropTypes.object,
  setFieldValue: PropTypes.func.isRequired,
  setHasPointerEvent: PropTypes.func,
  values: PropTypes.object.isRequired,
  isDisabled: PropTypes.bool,
  userAgency: PropTypes.object,
  arrayHelpers: PropTypes.object,
  invoice: PropTypes.object,
  defaultBPayOutProvider: PropTypes.object,
};

export const Payments = ({
  isMarketplaceEnabled,
  creditorList,
  debtorList,
  fetchBpayBillers,
  hasAllowedBpayBillerAsCreditor,
  property,
  setFieldValue,
  setHasPointerEvent,
  values,
  isDisabled,
  userAgency,
  invoice,
  defaultBPayOutProvider,
}) =>
  Object.assign(
    (arrayHelpers) => (
      <FormFieldsForPayment
        isMarketplaceEnabled={isMarketplaceEnabled}
        creditorList={creditorList}
        debtorList={debtorList}
        fetchBpayBillers={fetchBpayBillers}
        hasAllowedBpayBillerAsCreditor={hasAllowedBpayBillerAsCreditor}
        property={property}
        setFieldValue={setFieldValue}
        setHasPointerEvent={setHasPointerEvent}
        values={values}
        isDisabled={isDisabled}
        userAgency={userAgency}
        arrayHelpers={arrayHelpers}
        invoice={invoice}
        defaultBPayOutProvider={defaultBPayOutProvider}
      />
    ),
    { displayName: 'Payments' }
  );
