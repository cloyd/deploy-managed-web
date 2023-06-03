/* eslint-disable react/jsx-no-bind */
import PropTypes from 'prop-types';
import React, { useCallback, useMemo, useReducer } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row } from 'reactstrap';

import { PropertyLeaseLog } from '../../containers/Property';
import {
  modifyRent,
  selectIsLeaseLoading,
  updateLease,
} from '../../redux/lease';
import { ButtonIcon, ButtonIncrease, ButtonTerminate } from '../Button';
import { CardPlain } from '../Card';
import {
  LeaseFormAdjust,
  LeaseFormBond,
  LeaseFormDates,
  LeaseFormFrequency,
  LeaseFormTerminate,
} from './Form';

const initialState = {
  frequency: false,
  rent: false,
  dates: false,
  bond: false,
  terminate: false,
  auditLog: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case action.type:
      return {
        ...initialState,
        [action.type]: !state[action.type],
      };
    default:
      return initialState;
  }
};

export const LeaseActions = ({
  hasError,
  lease,
  handleChangeLeaseEnd,
  isExistingRenewalTaskComplete,
  isShowAuditLog,
  handleToggleAuditLog,
  ...props
}) => {
  const dispatch = useDispatch();
  const isLoading = useSelector(selectIsLeaseLoading);

  const [state, toggle] = useReducer(reducer, initialState);

  const colClassName = 'flex-fill pt-2 pt-lg-0 text-left text-sm-center';

  const handleToggleAction = useCallback(
    (type) => {
      toggle({ type });
      if (isShowAuditLog) {
        handleToggleAuditLog(false);
      }
    },
    [handleToggleAuditLog, isShowAuditLog]
  );

  const actionButtons = useMemo(
    () => [
      {
        key: 'frequency',
        name: 'Adjust Frequency',
        handleClick: () => handleToggleAction('frequency'),
        hidden: !lease.canAdjustFrequency,
      },
      {
        key: 'rent',
        name: 'Adjust Rent',
        handleClick: () => handleToggleAction('rent'),
      },
      {
        key: 'dates',
        name: 'Adjust Dates',
        handleClick: () => handleToggleAction('dates'),
      },
      {
        key: 'bond',
        name: 'Bond',
        handleClick: () => handleToggleAction('bond'),
      },
      {
        key: 'terminate',
        name: 'Terminate Lease',
        handleClick: () => handleToggleAction('terminate'),
        button: (
          <ButtonTerminate onClick={() => handleToggleAction('terminate')}>
            Terminate Lease
          </ButtonTerminate>
        ),
        hidden: lease.isTerminating,
      },
      {
        key: 'auditLog',
        name: isShowAuditLog ? 'View Lease Information' : 'View Audit Log',
        handleClick: () => {
          toggle({ type: 'auditLog' });
          handleToggleAuditLog(!isShowAuditLog);
        },
      },
    ],
    [
      handleToggleAction,
      handleToggleAuditLog,
      toggle,
      isShowAuditLog,
      lease.canAdjustFrequency,
      lease.isTerminating,
    ]
  );

  const handleCancelTermination = useCallback(() => {
    dispatch(
      updateLease({
        id: lease.id,
        terminationDate: '',
        terminationReason: '',
      })
    );
  }, [dispatch, lease.id]);

  const handleUpdateLease = useCallback(
    (data) => {
      dispatch(updateLease(data));
    },
    [dispatch]
  );

  const handleModifyRent = useCallback(
    (data) => {
      dispatch(modifyRent(data));
    },
    [dispatch]
  );

  return (
    <CardPlain {...props}>
      <Row className="text-center d-flex">
        {actionButtons.map((actionButton) => {
          return !actionButton.hidden ? (
            <Col
              key={actionButton.key}
              className={colClassName}
              sm={{ size: 'auto' }}>
              {actionButton.button ? (
                actionButton.button
              ) : (
                <ButtonIncrease onClick={actionButton.handleClick}>
                  {actionButton.name}
                </ButtonIncrease>
              )}
            </Col>
          ) : null;
        })}
        {lease.isTerminating && (
          <Col className={colClassName} sm={{ size: 'auto' }}>
            <ButtonIcon icon={['far', 'ban']} onClick={handleCancelTermination}>
              Cancel Termination
            </ButtonIcon>
          </Col>
        )}
      </Row>

      {state.frequency && (
        <FormWrapper title="Adjust Rent Frequency">
          <LeaseFormFrequency
            hasError={hasError}
            isLoading={isLoading}
            lease={lease}
            onCancel={() => toggle({ type: 'frequency' })}
            onComplete={() => toggle({ type: 'frequency' })}
            onSubmit={handleUpdateLease}
          />
        </FormWrapper>
      )}

      {state.rent && (
        <FormWrapper title="Adjust Rent">
          <LeaseFormAdjust
            hasError={hasError}
            isLoading={isLoading}
            lease={lease}
            onCancel={() => toggle({ type: 'rent' })}
            onComplete={() => toggle({ type: 'rent' })}
            onSubmit={handleModifyRent}
          />
        </FormWrapper>
      )}

      {state.dates && (
        <FormWrapper title="Adjust Dates">
          <LeaseFormDates
            hasError={hasError}
            isLoading={isLoading}
            lease={lease}
            onCancel={() => toggle({ type: 'dates' })}
            onComplete={() => toggle({ type: 'dates' })}
            onSubmit={handleUpdateLease}
            handleChangeLeaseEnd={handleChangeLeaseEnd}
            isExistingRenewalTaskComplete={isExistingRenewalTaskComplete}
          />
        </FormWrapper>
      )}

      {state.bond && (
        <FormWrapper title="Adjust Bond Id">
          <LeaseFormBond
            hasError={hasError}
            isLoading={isLoading}
            lease={lease}
            onCancel={() => toggle({ type: 'bond' })}
            onComplete={() => toggle({ type: 'bond' })}
            onSubmit={handleUpdateLease}
          />
        </FormWrapper>
      )}

      {state.terminate && (
        <FormWrapper title="Terminate Lease">
          <LeaseFormTerminate
            hasError={hasError}
            isLoading={isLoading}
            lease={lease}
            onCancel={() => toggle({ type: 'terminate' })}
            onComplete={() => toggle({ type: 'terminate' })}
            onSubmit={handleUpdateLease}
          />
        </FormWrapper>
      )}

      {state.auditLog && isShowAuditLog && (
        <FormWrapper>
          <PropertyLeaseLog
            leaseId={lease.id}
            payFrequency={lease.payFrequency}
          />
        </FormWrapper>
      )}
    </CardPlain>
  );
};

LeaseActions.propTypes = {
  onTerminate: PropTypes.func,
  lease: PropTypes.object,
  hasError: PropTypes.bool,
  isLoading: PropTypes.bool,
  onAdjustBond: PropTypes.func,
  onAdjustFrequency: PropTypes.func,
  onAdjustRent: PropTypes.func,
  onAdjustDates: PropTypes.func,
  handleChangeLeaseEnd: PropTypes.func,
  isExistingRenewalTaskComplete: PropTypes.bool,
  handleToggleAuditLog: PropTypes.func,
  isShowAuditLog: PropTypes.bool,
};

LeaseActions.defaultProps = {};

export default LeaseActions;

const FormWrapper = ({ title, children }) => (
  <Row>
    <Col>
      <hr />
      <p>
        <strong>{title}</strong>
      </p>
      {children}
    </Col>
  </Row>
);

FormWrapper.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
};
