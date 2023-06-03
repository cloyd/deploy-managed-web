import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import startCase from 'lodash/fp/startCase';
import PropTypes from 'prop-types';
import React, { useCallback, useMemo, useState } from 'react';
import {
  Col,
  CustomInput,
  FormGroup,
  FormText,
  InputGroupAddon,
  InputGroupText,
  Row,
} from 'reactstrap';

import { UserSearchSelect } from '@app/modules/User';

import { DEFAULT_FOLLOWERS, isSearchableCreditor } from '../../../redux/task';
import {
  EXTERNAL_CREDITOR_CLASSIFICATIONS,
  USER_TYPES,
} from '../../../redux/users';
import {
  isNotSameKey,
  isSameKey,
  joinKey,
  removeSeparators,
  splitKey,
  toDollars,
} from '../../../utils';
import { DividerDouble } from '../../Divider';
import {
  FormField,
  FormFollowers,
  FormLabel,
  FormOptionsGroup,
  FormOptionsList,
} from '../../Form';

const MAX_PAYMENT_COUNT = 2;

const formatUser = (user) => {
  const { bpayOutProvider, id, name, type, typeOf } = user;
  const typeLabel = bpayOutProvider ? '' : `(${typeOf})`;
  return {
    label: `${startCase(name)} ${typeLabel} ${
      user.type === 'Tenant' ? `(Lease ID: ${user.leaseId})` : ''
    }`,
    value: joinKey(id, type),
  };
};

const getFieldName = (index, attributeName) => {
  return `payments[${index}].${attributeName}`;
};

const updateArrayState = (value, index, array, setArray) => {
  const newArray = [...array];
  newArray[index] = value;
  setArray(newArray);
};

export const FormFieldsForPayment = ({
  setFieldValue,
  values,
  creditorList,
  debtorList,
  defaultFollowers,
  invoice,
  pastTenants,
  upcomingTenants,
  onUpdateCreditor,
  creditorType,
  isEditPage,
  isMarketplaceEnabled,
  hasBpayOptions,
  onChange,
  onChangeFollowers,
  arrayHelpers,
  property,
  hasAllowedBpayBillerAsCreditor,
  fetchBpayBillers,
}) => {
  const [isSplitBill, setIsSplitBill] = useState(false);
  const [showBpayAlert, setShowBpayAlert] = useState(false);
  const [creditorSearchLists, setCreditorSearchLists] = useState([]);
  const [bpayBillerNames, setBpayBillerNames] = useState([]);
  const isEditBillDisabled = invoice?.isIntentionTriggered; // Disable fields once invoice has been created

  const getTaskParties = useCallback(
    (index) => {
      const debtorKey = values.payments[index]?.debtorKey;

      let creditors = [...creditorList, ...creditorSearchLists];
      let debtors = [...debtorList];

      const { isDefaultMtechAccountSet, ...debtor } =
        debtorList.find(isSameKey(debtorKey)) || {};

      if (debtorKey) {
        creditors = creditors.filter(isNotSameKey(debtorKey)).filter(
          // Remove bpay if debtor has no mtech account
          (creditor) =>
            isDefaultMtechAccountSet || creditor.type !== 'BpayBiller'
        );
      }

      if (
        !invoice?.isBpayOut &&
        isSearchableCreditor(
          invoice?.creditorType,
          hasAllowedBpayBillerAsCreditor
        )
      ) {
        const key = joinKey(invoice?.creditorId, invoice?.creditorType);
        const isDuplicate = !!creditors.find(isSameKey(key));

        if (!isDuplicate) {
          creditors.push({
            id: invoice?.creditorId,
            name: invoice?.creditorName,
            type: invoice?.creditorType,
            typeOf: startCase(invoice?.creditorType),
          });
        }
      }

      setShowBpayAlert(!isDefaultMtechAccountSet && !debtor.type === 'Tenant');

      return {
        creditors,
        debtors,
      };
    },
    /* eslint-disable react-hooks/exhaustive-deps */
    [creditorList, debtorList, creditorSearchLists, values.payments]
  ); /* eslint-enable react-hooks/exhaustive-deps */

  const taskParties = useMemo(
    () =>
      Array(MAX_PAYMENT_COUNT)
        .fill({})
        .map((_, index) => getTaskParties(index)),
    [getTaskParties]
  );

  const getFormattedTaskParties = useCallback(
    (index) => ({
      creditors: taskParties[index].creditors.map((user) => formatUser(user)),
      debtors: taskParties[index].debtors.map((user) => formatUser(user)),
      pastTenants: pastTenants.map((user) => formatUser(user)),
      upcomingTenants: upcomingTenants.map((user) => formatUser(user)),
    }),
    [pastTenants, taskParties, upcomingTenants]
  );

  const formattedTaskParties = useMemo(
    () =>
      Array(MAX_PAYMENT_COUNT)
        .fill({})
        .map((_, index) => getFormattedTaskParties(index)),
    [getFormattedTaskParties]
  );

  const setBiller = useCallback(
    (index, value, biller) => {
      const creditor =
        biller || taskParties[index].creditors.find(isSameKey(value)) || {};

      setFieldValue(getFieldName(index, 'bpayBillerCode'), creditor.billerCode);
      setFieldValue(
        getFieldName(index, 'isBpayBiller'),
        !!creditor.billerCode || !!creditor.bpayOutProvider
      );
      setFieldValue(getFieldName(index, 'gstIncluded'), creditor.gstIncluded);
    },
    [setFieldValue, taskParties]
  );

  const updateCreditorType = useCallback(
    (type, index) => {
      updateArrayState(type, index, creditorType, onUpdateCreditor);
    },
    [creditorType, onUpdateCreditor]
  );

  const updateBpayBillerName = useCallback(
    (name, index) => {
      updateArrayState(name, index, bpayBillerNames, setBpayBillerNames);
    },
    [bpayBillerNames]
  );

  const onChangeCreditor = useCallback(
    (index) => (e) => {
      const value = e.currentTarget.value;

      e.preventDefault();

      if (isSearchableCreditor(value, hasAllowedBpayBillerAsCreditor)) {
        updateCreditorType(value, index);
      } else {
        updateCreditorType('', index);
        setBiller(index, value);
      }

      setFieldValue(getFieldName(index, 'creditorKey'), e.target.value);

      if (splitKey(value)[1] === 'BpayBiller') {
        setFieldValue(getFieldName(index, 'isBpayBiller'), true);
      } else {
        updateBpayBillerName('', index);
      }

      const invoiceKey = joinKey(invoice?.creditorId, invoice?.creditorType);

      if (invoiceKey === value && invoice?.creditorType === 'BpayBiller') {
        setFieldValue('bpayBillerCode', invoice.bpayBillerCode);
        setFieldValue('bpayReference', invoice.bpayReference);
      }
    } /* eslint-disable react-hooks/exhaustive-deps */,
    [
      hasAllowedBpayBillerAsCreditor,
      invoice?.bpayBillerCode,
      invoice?.bpayReference,
      invoice?.creditorId,
      invoice?.creditorType,
      setBiller,
      setFieldValue,
      updateBpayBillerName,
      updateCreditorType,
    ]
  ); /* eslint-enable react-hooks/exhaustive-deps */

  const onChangeDebtor = useCallback(
    (index) => (e) => {
      e.preventDefault();

      arrayHelpers.replace(index, {
        ...values.payments[index],
        creditorKey: '',
        bpayBillerCode: '',
        bpayReference: '',
        isBpayBiller: false,
        debtorKey: e.target.value,
      });
    },
    [arrayHelpers, values.payments]
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
      arrayHelpers.push({
        amountDollars: toDollars(100),
        bpayBillerCode: '',
        bpayReference: '',
        creditorKey: '',
        debtorKey: null,
        gstIncluded: false,
        isBpayBiller: false,
        isAgencyCoveringFees: false,
        referenceNumber: '',
        followers: DEFAULT_FOLLOWERS,
      });
    }
    setIsSplitBill(!isSplitBill);
  }, [arrayHelpers, isSplitBill]);

  const lookupBpayBiller = useCallback(
    (index) => (e) => {
      onChange(e);
      setFieldValue(getFieldName(index, 'bpayBillerId'), '');
      updateBpayBillerName('', index);

      if (e.target.value) {
        fetchBpayBillers({
          params: { 'q[biller_code_eq]': e.target.value },
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

    [fetchBpayBillers, onChange, setFieldValue, updateBpayBillerName]
  );

  const handleChangeCreditor = useCallback(
    ({ creditorIds, creditorType, index, users }) => {
      if (creditorIds.length) {
        const user = users[0];

        const key = joinKey(user.id, creditorType[index]);
        const isDuplicate = !!taskParties[index].creditors.find(isSameKey(key));

        const creditor = {
          ...user,
          type: creditorType[index],
          typeOf: startCase(creditorType[index]),
        };

        if (!isDuplicate) {
          setCreditorSearchLists([...creditorSearchLists, creditor]);
          const newCreditorType = [...creditorType];
          newCreditorType[index] = null;
          onUpdateCreditor(newCreditorType);
        }

        setFieldValue(getFieldName(index, 'creditorKey'), key);
        setBiller(index, key, creditor);
      }
    },
    [
      creditorSearchLists,
      onUpdateCreditor,
      setBiller,
      setFieldValue,
      taskParties,
    ]
  );

  return (
    <>
      {!isEditPage && (
        <Row>
          <Col className="pb-3">
            <CustomInput
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
      )}
      {values.payments.map((payment, index) => {
        const followersName = getFieldName(index, 'followers');
        const debtorKeyName = getFieldName(index, 'debtorKey');
        const amountDollarsName = getFieldName(index, 'amountDollars');
        const creditorKeyName = getFieldName(index, 'creditorKey');
        const gstIncludedName = getFieldName(index, 'gstIncluded');
        const bpayBillerCodeName = getFieldName(index, 'bpayBillerCode');
        const bpayReferenceName = getFieldName(index, 'bpayReference');
        const referenceNumberName = getFieldName(index, 'referenceNumber');

        const formattedTaskParty = formattedTaskParties[index];
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
            <Row>
              <Col>
                <FormGroup>
                  <FormLabel for={followersName} isRequired>
                    Task followers
                  </FormLabel>
                  <FormFollowers
                    value={followers}
                    disabled={isEditBillDisabled}
                    name={followersName}
                    onChange={onChangeFollowers}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={12} lg={5}>
                <FormGroup>
                  <FormLabel for={debtorKeyName} isRequired>
                    Who&apos;s paying?
                  </FormLabel>
                  <FormField
                    disabled={isEditBillDisabled}
                    name={debtorKeyName}
                    type="select"
                    onChange={onChangeDebtor(index)}>
                    <FormOptionsList
                      hasBlank={true}
                      name={getFieldName(index, 'debtor')}
                      options={formattedTaskParty.debtors}
                    />
                    {formattedTaskParty.pastTenants.length > 0 && (
                      <FormOptionsGroup
                        label="Past Tenants"
                        options={formattedTaskParty.pastTenants}
                      />
                    )}
                    {formattedTaskParty.upcomingTenants.length > 0 && (
                      <FormOptionsGroup
                        label="Upcoming Tenants"
                        options={formattedTaskParty.upcomingTenants}
                      />
                    )}
                  </FormField>
                  {showBpayAlert && hasBpayOptions && (
                    <FormText color="danger">
                      User needs to setup an account to pay BPAY billers
                    </FormText>
                  )}
                </FormGroup>
              </Col>
              <Col md={4} lg={2}>
                <FormGroup>
                  <FormLabel for={amountDollarsName} isRequired>
                    How much?
                  </FormLabel>
                  <FormField
                    disabled={isEditBillDisabled}
                    min="1"
                    name={amountDollarsName}
                    prepend="$"
                    step="any"
                    type="number"
                  />
                </FormGroup>
                <FormGroup>
                  <CustomInput
                    disabled={isEditBillDisabled}
                    checked={payment.gstIncluded}
                    id={gstIncludedName}
                    label="Collects GST"
                    name={gstIncludedName}
                    type="checkbox"
                    value={payment.gstIncluded}
                    onChange={onChange}
                  />
                </FormGroup>
              </Col>
              <Col md={8} lg={5}>
                <FormGroup>
                  <FormLabel for={creditorKeyName} isRequired>
                    To?
                  </FormLabel>
                  <FormField
                    disabled={isEditBillDisabled || !payment.debtorKey}
                    name={creditorKeyName}
                    type="select"
                    onChange={onChangeCreditor(index)}>
                    <FormOptionsList
                      hasBlank={true}
                      name={getFieldName(index, 'creditor')}
                      options={formattedTaskParty.creditors}
                    />
                    {hasAllowedBpayBillerAsCreditor && (
                      <option value="PayViaBpay::BpayBiller">
                        Pay via BPAY Biller
                      </option>
                    )}
                    <option value="ExternalCreditor">
                      Search for a Creditor
                    </option>
                  </FormField>
                  {creditorType[index] && (
                    <div className="mt-3">
                      <FormGroup>
                        <div className="d-flex mb-3">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText className="py-1">
                              <FontAwesomeIcon icon={['far', 'store-alt']} />
                            </InputGroupText>
                          </InputGroupAddon>
                          <UserSearchSelect
                            canSendInvite={true}
                            className="w-100"
                            isMulti={false}
                            searchParams={{
                              perPage: 6,
                              ...(isMarketplaceEnabled
                                ? {
                                    classification: [
                                      EXTERNAL_CREDITOR_CLASSIFICATIONS.tradie,
                                      EXTERNAL_CREDITOR_CLASSIFICATIONS.serviceProvider,
                                    ],
                                  }
                                : { agencyId: property.agencyId }),
                              propertyId: property.propertyId,
                            }}
                            type={USER_TYPES.externalCreditor}
                            // eslint-disable-next-line react/jsx-no-bind
                            onChange={(creditorIds, users) =>
                              handleChangeCreditor({
                                creditorIds,
                                users,
                                creditorType,
                                index,
                              })
                            }
                          />
                        </div>
                      </FormGroup>
                    </div>
                  )}
                </FormGroup>
              </Col>
            </Row>
            {payment.isBpayBiller ? (
              <Row>
                <Col md={4}>
                  <FormGroup>
                    <FormLabel for={bpayBillerCodeName} isShowRequired={true}>
                      BPay Biller Code
                    </FormLabel>
                    <FormField
                      name={bpayBillerCodeName}
                      type="string"
                      disabled={isEditBillDisabled}
                      onChange={lookupBpayBiller(index)}
                      onPaste={handlePasteRemoveSeparators(bpayBillerCodeName)}
                    />
                  </FormGroup>
                  <span className="h6-font-size small">
                    {bpayBillerName && `This BPay Biller is ${bpayBillerName}.`}
                  </span>
                </Col>
                <Col md={4} lg={5}>
                  <FormGroup>
                    <FormLabel for={bpayReferenceName} isShowRequired={true}>
                      BPay Reference
                    </FormLabel>
                    <FormField
                      name={bpayReferenceName}
                      disabled={isEditBillDisabled}
                      onPaste={handlePasteRemoveSeparators(bpayReferenceName)}
                    />
                  </FormGroup>
                </Col>
              </Row>
            ) : (
              <Row>
                <Col md={6} lg={4}>
                  <FormGroup>
                    <FormLabel for={referenceNumberName}>
                      Payment Reference
                    </FormLabel>
                    <FormField
                      name={referenceNumberName}
                      disabled={isEditBillDisabled}
                    />
                    <span className="h6-font-size small">
                      {'If left empty, property address will be used.'}
                    </span>
                  </FormGroup>
                </Col>
              </Row>
            )}
          </div>
        );
      })}
    </>
  );
};

FormFieldsForPayment.propTypes = {
  isEditPage: PropTypes.bool,
  isMarketplaceEnabled: PropTypes.bool,
  creditorList: PropTypes.array,
  debtorList: PropTypes.array,
  defaultFollowers: PropTypes.array,
  setFieldValue: PropTypes.func.isRequired,
  setHasPointerEvent: PropTypes.func,
  values: PropTypes.object.isRequired,
  isDisabled: PropTypes.bool,
  userAgency: PropTypes.object,
  arrayHelpers: PropTypes.object,
  invoice: PropTypes.object,
  defaultBPayOutProvider: PropTypes.object,
  pastTenants: PropTypes.array,
  upcomingTenants: PropTypes.array,
  onUpdateCreditor: PropTypes.func.isRequired,
  onChangeFollowers: PropTypes.func,
  creditorType: PropTypes.array,
  hasBpayOptions: PropTypes.bool,
  onChange: PropTypes.func,
  property: PropTypes.object,
  hasAllowedBpayBillerAsCreditor: PropTypes.bool,
  fetchBpayBillers: PropTypes.func,
};

FormFieldsForPayment.defaultProps = {
  creditorList: [],
  creditorType: [],
  debtorList: [],
  isEditPage: false,
  pastTenants: [],
  upcomingTenants: [],
  isMarketplaceEnabled: false,
};

export const Payments = ({
  isMarketplaceEnabled,
  creditorList,
  debtorList,
  defaultFollowers,
  setFieldValue,
  setHasPointerEvent,
  values,
  isDisabled,
  isEditPage,
  userAgency,
  invoice,
  defaultBPayOutProvider,
  pastTenants,
  upcomingTenants,
  onUpdateCreditor,
  creditorType,
  hasBpayOptions,
  onChange,
  onChangeFollowers,
  property,
  hasAllowedBpayBillerAsCreditor,
  fetchBpayBillers,
}) =>
  Object.assign(
    (arrayHelpers) => (
      <FormFieldsForPayment
        isMarketplaceEnabled={isMarketplaceEnabled}
        creditorList={creditorList}
        debtorList={debtorList}
        defaultFollowers={defaultFollowers}
        setFieldValue={setFieldValue}
        setHasPointerEvent={setHasPointerEvent}
        values={values}
        isDisabled={isDisabled}
        isEditPage={isEditPage}
        userAgency={userAgency}
        arrayHelpers={arrayHelpers}
        invoice={invoice}
        defaultBPayOutProvider={defaultBPayOutProvider}
        pastTenants={pastTenants}
        upcomingTenants={upcomingTenants}
        onUpdateCreditor={onUpdateCreditor}
        creditorType={creditorType}
        hasBpayOptions={hasBpayOptions}
        onChange={onChange}
        onChangeFollowers={onChangeFollowers}
        property={property}
        hasAllowedBpayBillerAsCreditor={hasAllowedBpayBillerAsCreditor}
        fetchBpayBillers={fetchBpayBillers}
      />
    ),
    { displayName: 'Payments' }
  );
