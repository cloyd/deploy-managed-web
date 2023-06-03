import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { connect } from 'react-redux';
import { PulseLoader } from 'react-spinners';
import { Col, Container, Row } from 'reactstrap';

import { Alert } from '..';
import { useFetchInterval, useIsOpen } from '../../hooks';
import { BillieAttachmentList, BilliePreview } from '../../modules/Billie';
import { FormBillieTask } from '../../modules/Form';
import { ModalConfirm } from '../../modules/Modal';
import {
  fetchAgencyAttachments,
  getAttachment,
  getAttachments,
  markAttached,
  updateAttachmentTask,
  updateAttachments,
} from '../../redux/attachment';
import { fetchLeases, getLeaseActive } from '../../redux/lease';
import { hasError, hideAlert } from '../../redux/notifier';
import {
  getProfile,
  hasDisbursementAccount,
  hasPaymentAccount,
} from '../../redux/profile';
import {
  fetchProperties,
  fetchProperty,
  getProperty,
  getPropertyList,
  resetProperty,
} from '../../redux/property';
import {
  createTask,
  decorateTaskParty,
  fetchBpayBillers,
  fetchSimilarTasks,
  fetchTaskMeta,
  getSimilarTasksForProperty,
  getTask,
  getTaskMeta,
  updateTask,
} from '../../redux/task';
import {
  fetchBpayBiller,
  fetchBpayOutProviders,
  fetchExternalCreditor,
  getBpayBiller,
  getBpayOutProviders,
  getExternalCreditor,
  getManagerPrimaryAgency,
} from '../../redux/users';
import { toQueryObject } from '../../utils';

const defaultTask = { type: 'bill', invoice: {} };

const notAttached = (attachment) => !attachment.isAttached;

const BillieFormComponent = (props) => {
  const {
    attachment,
    attachments,
    bpayBiller,
    bpayOutProviders,
    createTask,
    externalCreditor,
    fetchAgencyAttachments,
    fetchBpayBiller,
    fetchBpayBillers,
    fetchBpayOutProviders,
    fetchExternalCreditor,
    fetchLeases,
    fetchProperty,
    fetchProperties,
    fetchSimilarTasks,
    fetchTaskMeta,
    hasAllowedBpayBillerAsCreditor,
    hasError,
    hideAlert,
    history,
    isLoadingAttachments,
    isLoadingTask,
    userAgency,
    markAttached,
    property,
    propertySearchResults,
    similarTasks,
    taskMeta,
    taskStored,
    tenant,
    updateAttachments,
    updateAttachmentTask,
    updateTask,
    resetProperty,
  } = props;
  const [invoiceCategory, setInvoiceCategory] = useState(null);
  const [task, setTask] = useState({ ...defaultTask });
  const [hasPointerEvent, setHasPointerEvent] = useState(true); // Stops Preview embed from capturing pointer events
  const [isOpen, actions] = useIsOpen();

  const isComplete = useMemo(
    () => !attachments.find(notAttached),
    [attachments]
  );

  const isFetchAttachments = useMemo(
    () =>
      !!userAgency.id &&
      !!attachments.find((attachment) => !attachment.urls.thumb),
    [userAgency.id, attachments]
  );

  const taskParties = useMemo(() => {
    // Set debtors/creditors
    let debtors = [];
    let creditors = [];

    if (property.id && invoiceCategory) {
      const allParties = [];
      const owner = property.primaryOwner || {};

      property.agency &&
        allParties.push(decorateTaskParty(property.agency, 'Agency'));
      owner.id && allParties.push(decorateTaskParty(owner, 'Owner'));
      tenant.id && allParties.push(decorateTaskParty(tenant, 'Tenant'));

      debtors = [...allParties].filter(hasPaymentAccount);
      creditors = [...allParties].filter(hasDisbursementAccount);

      if (!hasAllowedBpayBillerAsCreditor && bpayOutProviders?.length > 0) {
        // If Agency is set to BPay Out, then list out BPay Out providers
        bpayOutProviders.map((creditor) =>
          creditors.push(decorateTaskParty(creditor, 'ExternalCreditor'))
        );
      } else {
        // Else add returned BPay Biller
        bpayBiller.id &&
          creditors.push(decorateTaskParty(bpayBiller, 'BpayBiller'));
      }

      externalCreditor.id &&
        creditors.push(decorateTaskParty(externalCreditor, 'ExternalCreditor'));
    }

    return {
      creditors,
      debtors,
    };
  }, [
    bpayBiller,
    bpayOutProviders,
    externalCreditor,
    hasAllowedBpayBillerAsCreditor,
    invoiceCategory,
    property.id,
    property.primaryOwner,
    property.agency,
    tenant,
  ]);

  useFetchInterval({
    isFetch: isFetchAttachments,
    fetchAction: () =>
      fetchAgencyAttachments({ agencyId: userAgency.id, isLoading: false }),
    interval: 5000,
  });

  const handleClick = useCallback(
    (attachment) => {
      const { id, propertyId, taskId } = attachment || {};

      if (id && propertyId && taskId) {
        window.open(`/property/${propertyId}/tasks/${taskId}`); // Open task associated to attachment in a new tab
      } else {
        history.push(id ? `/billie?attachment_id=${id}` : `/billie`);
        setTask({ ...defaultTask });
        setInvoiceCategory(null);
        actions.handleClose();
        resetProperty();
        hideAlert();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [actions, hideAlert, history]
  );

  const handleClickTemplate = useCallback(
    (template, { isUpdate }) => {
      const {
        category,
        description,
        followedByOwner,
        followedByTenant,
        invoice,
        title,
        type,
      } = template;

      // Update form task
      setTask({
        category,
        description,
        followedByOwner,
        followedByTenant,
        invoice,
        title,
        type,
        id: isUpdate ? task.id : null,
        status: taskMeta.bill ? taskMeta.bill.statuses[0].key : null,
      });
    },
    [task.id, taskMeta.bill]
  );

  const handleChangeInvoiceCategory = useCallback(
    (category) => setInvoiceCategory(category),
    [setInvoiceCategory]
  );

  const handleChangeProperty = useCallback(
    (propertyChoice) => {
      propertyChoice
        ? fetchProperty({ propertyId: propertyChoice.value })
        : resetProperty();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fetchProperty]
  );

  const handleComplete = useCallback(() => {
    setTask({ ...taskStored });
    actions.handleToggle();
  }, [actions, taskStored]);

  const handleMouseUp = useCallback(() => setHasPointerEvent(true), []);

  const handleSearchProperty = useCallback(
    (address) => fetchProperties({ address }),
    [fetchProperties]
  );

  const handleNext = useCallback(() => {
    const currentIndex = attachments.findIndex(
      ({ id }) => id === attachment.id
    );

    // Looks for next unattached attachment in the list, if
    // it can't find it will start from the beginning of the list
    const nextAttachment =
      attachments.slice(currentIndex + 1).find(notAttached) ||
      attachments.find(notAttached);

    if (nextAttachment) {
      handleClick(nextAttachment);
      actions.handleToggle();
      resetProperty();
    }
  }, [actions, attachment.id, attachments, handleClick, resetProperty]);

  const handleSubmit = useCallback(
    ({ attachmentId, ...values }) => {
      if (values.taskId && values.propertyId) {
        updateTask(values);
        updateAttachmentTask({
          attachmentId,
          propertyId: values.propertyId,
          taskId: values.taskId,
        });
      } else {
        createTask(values);
      }
      markAttached(attachmentId);
    },
    [createTask, markAttached, updateAttachmentTask, updateTask]
  );

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (Object.keys(taskMeta).length === 0) {
      fetchTaskMeta({
        propertyId: property.id,
      });
    }
  }, [taskMeta]);

  useEffect(() => {
    if (property.id) {
      fetchLeases({ propertyId: property.id });
      setInvoiceCategory(null);
    }
  }, [property.id]);

  useEffect(() => {
    if (property.id && invoiceCategory && task.type) {
      fetchSimilarTasks({
        invoiceCategory,
        propertyId: property.id,
        type: task.type,
      });
    }
  }, [invoiceCategory]);

  useEffect(() => {
    const invoice = task.invoice || {};

    if (invoice.creditorType === 'BpayBiller') {
      fetchBpayBiller({ id: invoice.creditorId });
    } else if (invoice.creditorType === 'ExternalCreditor') {
      fetchExternalCreditor({ id: invoice.creditorId });
    }
  }, [task.invoice]);

  useEffect(() => {
    // Update completed attachment with ID of newly created task
    if (
      taskStored.id &&
      taskStored.attachments &&
      taskStored.attachments.length > 0
    ) {
      updateAttachmentTask({
        attachmentId: taskStored.attachments[0].id,
        propertyId: taskStored.propertyId,
        taskId: taskStored.id,
      });
    }
  }, [taskStored.id]);

  useEffect(() => {
    if (userAgency.id) {
      fetchAgencyAttachments({ agencyId: userAgency.id });
    }
  }, [userAgency.id]);

  useEffect(() => {
    if (userAgency && userAgency?.isBpayOutViaAssembly) {
      fetchBpayOutProviders();
    }
  }, [userAgency]);
  /* eslint-enable react-hooks/exhaustive-deps */

  return (
    <>
      <Alert className="mb-0" />
      <Container
        fluid={true}
        className="bg-white py-3"
        onMouseUp={handleMouseUp}>
        {isLoadingAttachments || !userAgency.id ? (
          <PulseLoader color="#dee2e6" />
        ) : (
          <BillieAttachmentList
            attachableId={userAgency.id}
            attachableType="Agency"
            attachments={attachments}
            onClick={handleClick}
            onDestroyComplete={updateAttachments}
            selected={attachment}
          />
        )}
      </Container>
      <Container
        fluid={true}
        className="d-flex flex-grow-1"
        onMouseUp={handleMouseUp}>
        <Row className="flex-grow-1">
          <Col
            md={8}
            className="d-none d-md-block py-3 text-center"
            style={{ pointerEvents: hasPointerEvent ? 'auto' : 'none' }}>
            {isLoadingAttachments ? (
              <PulseLoader color="#dee2e6" />
            ) : (
              <BilliePreview
                attachableId={userAgency.id}
                attachableType="Agency"
                attachment={attachment}
                onUploaderComplete={updateAttachments}
              />
            )}
          </Col>
          <Col md={4} className="py-3 bg-300">
            {attachment.id && (
              <FormBillieTask
                attachment={attachment}
                creditorList={taskParties.creditors}
                debtorList={taskParties.debtors}
                defaultBPayOutProvider={bpayOutProviders[0]}
                hasAllowedBpayBillerAsCreditor={hasAllowedBpayBillerAsCreditor}
                hasError={hasError}
                isLoading={isLoadingTask}
                isMarketplaceEnabled={props.isMarketplaceEnabled}
                fetchBpayBillers={fetchBpayBillers}
                userAgency={userAgency}
                onChangeProperty={handleChangeProperty}
                onChangeInvoiceCategory={handleChangeInvoiceCategory}
                onClickTemplate={handleClickTemplate}
                onComplete={handleComplete}
                onSearchProperty={handleSearchProperty}
                onSubmit={handleSubmit}
                property={property}
                propertySearchResults={propertySearchResults}
                setHasPointerEvent={setHasPointerEvent}
                task={task}
                taskMeta={taskMeta}
                tasksCompleted={
                  similarTasks[invoiceCategory]
                    ? similarTasks[invoiceCategory].completed
                    : []
                }
                tasksDrafted={
                  similarTasks[invoiceCategory]
                    ? similarTasks[invoiceCategory].draft
                    : []
                }
              />
            )}
          </Col>
        </Row>
        <ModalConfirm
          isOpen={isOpen}
          size="md"
          btnCancel={{ text: 'Close' }}
          btnSubmit={{ text: isComplete ? 'Close' : 'Next attachment' }}
          onCancel={isComplete ? null : handleClick}
          onSubmit={isComplete ? handleClick : handleNext}>
          <h5>
            Task {'created'}
            <FontAwesomeIcon
              icon={['far', 'check']}
              className="ml-2 text-success"
            />
          </h5>
          <hr />
          {isComplete && <p>There are no more attachments left in the list</p>}
        </ModalConfirm>
      </Container>
    </>
  );
};

BillieFormComponent.propTypes = {
  attachment: PropTypes.object,
  attachmentId: PropTypes.number,
  attachments: PropTypes.array,
  bpayBiller: PropTypes.object,
  bpayOutProviders: PropTypes.array,
  createTask: PropTypes.func.isRequired,
  externalCreditor: PropTypes.object,
  fetchAgencyAttachments: PropTypes.func.isRequired,
  fetchBpayBiller: PropTypes.func.isRequired,
  fetchBpayBillers: PropTypes.func.isRequired,
  fetchBpayOutProviders: PropTypes.func.isRequired,
  fetchExternalCreditor: PropTypes.func.isRequired,
  fetchLeases: PropTypes.func.isRequired,
  fetchProperty: PropTypes.func.isRequired,
  fetchProperties: PropTypes.func.isRequired,
  fetchSimilarTasks: PropTypes.func.isRequired,
  fetchTaskMeta: PropTypes.func.isRequired,
  hasAllowedBpayBillerAsCreditor: PropTypes.bool,
  hasError: PropTypes.bool.isRequired,
  hideAlert: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  isLoadingAttachments: PropTypes.bool.isRequired,
  isLoadingTask: PropTypes.bool.isRequired,
  isMarketplaceEnabled: PropTypes.bool,
  markAttached: PropTypes.func.isRequired,
  properties: PropTypes.array,
  property: PropTypes.object,
  propertySearchResults: PropTypes.array,
  similarTasks: PropTypes.object,
  taskMeta: PropTypes.object,
  taskStored: PropTypes.object,
  tenant: PropTypes.object,
  updateAttachments: PropTypes.func.isRequired,
  updateAttachmentTask: PropTypes.func.isRequired,
  updateTask: PropTypes.func.isRequired,
  userAgency: PropTypes.object,
  resetProperty: PropTypes.func.isRequired,
};

BillieFormComponent.defaultProps = {
  similarTasks: {},
  taskMeta: {},
  userAgency: {},
};

const mapStateToProps = ({ attachment, task, ...state }, props) => {
  const params = toQueryObject(props.location.search);
  const attachmentId = params.attachmentId && parseInt(params.attachmentId, 10);
  const profile = getProfile(state.profile);
  const property = getProperty(state.property, state.property.result);
  const lease = getLeaseActive(state.lease, property.id);

  return {
    property,
    attachment: getAttachment(attachment, attachmentId),
    attachments: getAttachments(attachment),
    bpayBiller: getBpayBiller(state.users, state.users.result),
    bpayOutProviders: getBpayOutProviders(state.users),
    externalCreditor: getExternalCreditor(state.users, state.users.result),
    hasAllowedBpayBillerAsCreditor: state.settings.allowBpayBillerAsCreditor,
    hasError: hasError(state),
    isLoadingAttachments: attachment.isLoading,
    isLoadingTask: task.isLoading,
    isMarketplaceEnabled: profile.isMarketplaceEnabled,
    propertySearchResults: getPropertyList(state.property),
    similarTasks: getSimilarTasksForProperty(task, property.id),
    taskMeta: getTaskMeta(task),
    taskStored: getTask(task, task.result),
    tenant: lease.primaryTenant || {},
    userAgency: getManagerPrimaryAgency(state.users, profile.id),
  };
};

const mapDispatchToProps = {
  createTask,
  fetchAgencyAttachments,
  fetchBpayBiller,
  fetchBpayBillers,
  fetchBpayOutProviders,
  fetchExternalCreditor,
  fetchLeases,
  fetchProperty,
  fetchProperties,
  fetchSimilarTasks,
  fetchTaskMeta,
  hideAlert,
  markAttached,
  updateAttachments,
  updateAttachmentTask,
  updateTask,
  resetProperty,
};

export const BillieForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(BillieFormComponent);
