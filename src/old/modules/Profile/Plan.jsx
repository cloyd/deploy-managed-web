import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import React, { useCallback, useMemo } from 'react';
import {
  Badge,
  Button,
  Card,
  Col,
  CustomInput,
  FormGroup,
  FormText,
  Input,
  InputGroup,
  InputGroupAddon,
  Label,
} from 'reactstrap';

import { centsToDollar, formatDate } from '@app/utils';

const isNumber = (value) => typeof value === 'number';

export const ProfilePlan = ({
  formik,
  hasScheduled,
  minTradieServiceFee,
  plan,
}) => {
  const isActive = useMemo(() => {
    return plan.status === 'active';
  }, [plan.status]);

  const isDirty = useMemo(() => {
    return plan.id && formik.dirty;
  }, [plan.id, formik.dirty]);

  const isInvalid = useMemo(() => {
    return formik.dirty && !formik.isValid;
  }, [formik.dirty, formik.isValid]);

  const isScheduled = useMemo(() => {
    return plan.id && plan.status === 'scheduled';
  }, [plan.id, plan.status]);

  const isEditingDisabled = useMemo(() => {
    return isActive && hasScheduled;
  }, [isActive, hasScheduled]);

  const buttonLabel = useMemo(() => {
    if (isActive) {
      return 'Your agency is using this plan';
    } else if (isScheduled) {
      return 'Cancel switch to this plan';
    } else {
      return 'Switch to this plan';
    }
  }, [isScheduled, isActive]);

  const className = useMemo(() => {
    const classNames = ['p-3', 'h-100'];

    if (isScheduled) {
      classNames.push('border', 'border-primary');
    }

    return classNames.join(' ');
  }, [isScheduled]);

  const handleUpdate = useCallback(() => {
    // This is the only way to update a value without triggering
    // formik's internal state updates.

    // Only a scheduled plan can update. An active plan will POST and create
    // a new scheduled plan
    formik.setFormikState((state) => {
      const values = {
        ...state.values,
        action: isScheduled ? 'patch' : 'post',
      };

      return { ...state, values };
    });

    formik.submitForm();
  }, [formik, isScheduled]);

  return (
    <Card className={className}>
      <div className="mb-2 d-flex justify-content-between">
        <h5>
          {isActive && (
            <FontAwesomeIcon
              icon={['fas', 'check-circle']}
              className="mr-2 text-success"
            />
          )}
          {plan.title}
        </h5>
        {isActive ? (
          <div>
            <Badge pill className="text-uppercase" color="success">
              Active
            </Badge>
          </div>
        ) : isScheduled ? (
          <div>
            <Badge pill className="text-uppercase" color="primary">
              Start Next Month
            </Badge>
          </div>
        ) : null}
      </div>
      <div className="mb-3 border-bottom">
        <p style={{ minHeight: '70px' }}>{plan.description}</p>
      </div>
      <div className="mb-3 border-bottom">
        <h5 className="font-weight-bold mb-3">Platform fees</h5>
        <p className="d-flex justify-content-between font-weight-bold mb-1">
          <span>Fee per property</span>
          {isNumber(plan.perPropertyFeeCents) ? (
            <span>{centsToDollar(plan.perPropertyFeeCents, true)}</span>
          ) : (
            <span className="text-uppercase text-owner">Free</span>
          )}
        </p>
        <p className="d-flex justify-content-between small mb-2">
          <span>Minimum spend per month</span>
          <span>
            {centsToDollar(plan.perPropertyFeeMinimumSpendCents, true)}
          </span>
        </p>
        <hr className="border-dashed" />
        <Card className="bg-lavender p-3 mb-3">
          <FormGroup className="d-flex">
            <CustomInput
              id={`${plan.type}-managed-plus`}
              name="managedPlus"
              type="checkbox"
              disabled={isEditingDisabled}
              checked={formik.values.managedPlus}
              onChange={formik.handleChange}
            />
            <div className="w-100 ml-2">
              <Label
                for={`${plan.type}-managed-plus`}
                className="font-weight-bold text-primary">
                Managed+
              </Label>
              <ul className="list-inline small mb-3">
                <li>
                  <FontAwesomeIcon
                    className="text-primary mx-2"
                    icon={['fas', 'check']}
                  />
                  Digital ingoing reports
                </li>
                <li>
                  <FontAwesomeIcon
                    className="text-primary mx-2"
                    icon={['fas', 'check']}
                  />
                  Digital routine inspections
                </li>
                <li>
                  <FontAwesomeIcon
                    className="text-primary mx-2"
                    icon={['fas', 'check']}
                  />
                  Commercial property management
                </li>
                <li>
                  <FontAwesomeIcon
                    className="text-primary mx-2"
                    icon={['fas', 'check']}
                  />
                  Custom task types
                </li>
                <li>
                  <FontAwesomeIcon
                    className="text-primary mx-2"
                    icon={['fas', 'check']}
                  />
                  Data reports
                </li>
              </ul>
              <p className="d-flex justify-content-between font-weight-bold mb-2">
                <span>Additional fee per property</span>
                <span>
                  {centsToDollar(plan.managedPlusPerPropertyFeeCents, true)}
                </span>
              </p>
              <p className="d-flex justify-content-between small m-0">
                <span>Minimum spend per month</span>
                <span>
                  {centsToDollar(plan.managedPlusMinimumSpendCents, true)}
                </span>
              </p>
            </div>
          </FormGroup>
        </Card>
      </div>
      <div className="mb-3 border-bottom">
        <h5 className="font-weight-bold mb-3">Tradie invoice fees</h5>
        <FormGroup row className="justify-content-between">
          <Col sm={8}>
            <Label className="font-weight-bold mb-0">Admin fee</Label>
            <p className="small mb-0">
              A flat rate tradies get charged per invoice
            </p>
          </Col>
          <Col sm={4}>
            {isNumber(plan.tradieAdminFeeCents) ? (
              <InputGroup>
                <InputGroupAddon addonType="prepend">$</InputGroupAddon>
                <Input
                  name="tradieAdminFee"
                  type="number"
                  min={0}
                  disabled={isEditingDisabled}
                  value={formik.values.tradieAdminFee}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </InputGroup>
            ) : (
              <strong className="float-right text-uppercase text-owner">
                NA.
              </strong>
            )}
          </Col>
        </FormGroup>
        <hr className="border-dashed" />
        <FormGroup row className="justify-content-between">
          <Col sm={8}>
            <Label className="font-weight-bold mb-0">Service fee</Label>
            <p className="small mb-0">
              Your team can override these settings per invoice. However if they
              do, the fees that the tradie would have paid will be charged to
              the agency at the end of the month.
            </p>
          </Col>
          <Col sm={4}>
            {isNumber(plan.percentageTradieServiceFee) ? (
              <>
                <InputGroup>
                  <Input
                    name="tradieServiceFee"
                    type="number"
                    min="6"
                    disabled={isEditingDisabled}
                    value={formik.values.tradieServiceFee}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <InputGroupAddon addonType="append">%</InputGroupAddon>
                </InputGroup>
                <FormText>
                  <span className={isInvalid ? 'text-danger' : 'text-muted'}>
                    Min of {minTradieServiceFee}%.
                  </span>
                </FormText>
              </>
            ) : (
              <strong className="float-right text-uppercase text-owner">
                NA.
              </strong>
            )}
          </Col>
        </FormGroup>
        <hr className="border-dashed" />
        <FormGroup row className="justify-content-between">
          <Col sm={8}>
            <Label className="font-weight-bold mb-0">Marketplace fee</Label>
            <p className="small mb-0">
              A fee paid to Managed by the tradesperson for originating the
              work.
            </p>
          </Col>
          <Col sm={4}>
            <strong className="float-right text-uppercase">
              {plan.percentageTradieMarketplaceFee}
            </strong>
          </Col>
        </FormGroup>
      </div>
      <div className="py-3">
        {isDirty ? (
          <div className="d-flex">
            <input type="hidden" name="action" value="patch" />
            <Button
              className="mr-1 flex-fill"
              color={'danger'}
              onClick={formik.handleReset}>
              Cancel
            </Button>
            <Button
              className="ml-1 flex-fill"
              color={'primary'}
              disabled={formik.isSubmitting || isInvalid}
              onClick={handleUpdate}>
              Update Plan
            </Button>
          </div>
        ) : (
          <Button
            className="w-100"
            color={isScheduled ? 'danger' : 'primary'}
            disabled={formik.isSubmitting || isActive || isInvalid}
            onClick={formik.handleSubmit}>
            {buttonLabel}
          </Button>
        )}
      </div>
      {isScheduled && (
        <p className="small m-0">
          This plan will take effect on {formatDate(plan.startsOn, 'au')}
        </p>
      )}
    </Card>
  );
};

ProfilePlan.propTypes = {
  formik: PropTypes.object.isRequired,
  hasScheduled: PropTypes.bool.isRequired,
  minTradieServiceFee: PropTypes.number.isRequired,
  plan: PropTypes.object.isRequired,
};
