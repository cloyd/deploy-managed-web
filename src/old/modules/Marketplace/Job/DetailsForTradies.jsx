import { startCase } from 'lodash';
import PropTypes from 'prop-types';
import React, { memo, useMemo } from 'react';
import { Button, Col, Container, Row } from 'reactstrap';

import { AttachmentsList } from '@app/modules/Attachments';
import { ContentWithLabel } from '@app/modules/Content';
import {
  JobQuoteStatus,
  useMarketplaceTagsToString,
} from '@app/modules/Marketplace';
import { useRolesContext } from '@app/modules/Profile';
import { useTaskAppointments } from '@app/modules/Task';
import { centsToDollar } from '@app/utils';

import { Contacts } from './Contacts';

/**
 * Job details as viewed by Tradies - includes agency and task details
 */
export const JobDetailsForTradies = ({ isPreview, job, onClickQuote }) => {
  const tags = useMarketplaceTagsToString(job.tagIds);
  const appointments = useTaskAppointments(job.task);
  const { isExternalCreditor } = useRolesContext();

  const attachments = useMemo(() => {
    return job.attachments || job.taskAttachments
      ? [...job.attachments, ...job.taskAttachments]
      : [];
  }, [job.attachments, job.taskAttachments]);

  const hasAppointments = useMemo(() => {
    return !isPreview && appointments?.length > 0;
  }, [appointments, isPreview]);

  const hasAttachments = useMemo(() => {
    return attachments?.length > 0;
  }, [attachments]);

  const hasTags = useMemo(() => {
    return !isPreview && !!tags.length;
  }, [isPreview, tags]);

  const hasWorkOrder = useMemo(() => {
    return isExternalCreditor && job.hasWorkOrder;
  }, [isExternalCreditor, job.hasWorkOrder]);

  const hasAgency = useMemo(() => {
    return !!job.agency?.phoneNumber;
  }, [job.agency]);

  const propertyManager = useMemo(
    () => (job.manager ? [job.manager] : []),
    [job.manager]
  );

  const hasTenantAccess = useMemo(() => {
    return job.task?.hasAccess && job.tenants;
  }, [job]);

  return (
    <Container className="details-for-tradies">
      <Row className="mb-3 border-bottom">
        {hasTags && (
          <Col className="p-0" sm={6}>
            <strong>Tags</strong>
            <p>{tags}</p>
          </Col>
        )}
        <Col className="p-0" sm={6}>
          <ContentWithLabel
            className="mr-3"
            label={job.hasWorkOrder ? 'Job limit' : 'Budget'}
            value={centsToDollar(job.budgetCents)}
          />
        </Col>
        {!isPreview && hasWorkOrder && (
          <Col className="p-0">
            <p>
              If your invoice will be greater than the{' '}
              <strong>job limit</strong>, then{' '}
              <Button
                color="link"
                className="align-baseline p-0"
                onClick={onClickQuote}>
                click here to specify
              </Button>
              .
            </p>
          </Col>
        )}
        {isPreview && (
          <Col className="p-0">
            <JobQuoteStatus job={job} />
          </Col>
        )}
      </Row>
      {!isPreview && (
        <Row className="mb-3 border-bottom">
          <Col className="p-0">
            <ContentWithLabel
              label="Priority"
              value={startCase(job.priority)}
            />
          </Col>
        </Row>
      )}
      <Row className="mb-3 border-bottom">
        <Col className="p-0">
          <ContentWithLabel label="Description" value={job.description} />
        </Col>
      </Row>
      {!isPreview && (
        <Row className="mb-3 border-bottom">
          <Col className="p-0" sm={6}>
            <ContentWithLabel
              label="Tenant allows access?"
              value={job.task?.hasAccess}
            />
          </Col>
          <Col className="p-0" sm={6}>
            <ContentWithLabel
              label="Area"
              value={startCase(job.task?.location)}
            />
          </Col>
        </Row>
      )}
      {hasAppointments && (
        <Row className="mb-3 border-bottom">
          <Col className="p-0">
            <ContentWithLabel label="Preferred day and time">
              <dl>
                {appointments.map((appointment, i) => (
                  <dd key={`appointment-${i}`}>{appointment}</dd>
                ))}
              </dl>
            </ContentWithLabel>
          </Col>
        </Row>
      )}
      {hasAttachments && (
        <Row className="mb-3 border-bottom">
          <Col className="p-0">
            <strong>Files</strong>
            {attachments.length > 0 && (
              <AttachmentsList
                attachments={attachments}
                canShowFileName={false}
                className="p-0 mt-2"
                md={isPreview ? 6 : 3}
              />
            )}
          </Col>
        </Row>
      )}
      {!isPreview && (
        <Row className="mb-3 border-bottom">
          <Col className="p-0" sm={4}>
            <ContentWithLabel
              label="Dogs on premises?"
              value={job.task?.hasDogs}
            />
          </Col>
          <Col className="p-0" sm={4}>
            <ContentWithLabel
              label="Have the keys changed?"
              value={job.task?.keysChanged}
            />
          </Col>
          <Col className="p-0" sm={4}>
            <ContentWithLabel label="Alarm code?" value={job.task?.alarmCode} />
          </Col>
          <Col className="p-0">
            <ContentWithLabel
              label="Access instructions"
              value={job.task?.accessInstructions}
            />
          </Col>
        </Row>
      )}
      {hasAgency && (
        <Row className="mb-3 border-bottom">
          <Col className="p-0" sm={isPreview ? 12 : 6}>
            <ContentWithLabel label="Agency phone">
              <p>
                <a href={`tel:${job.agency.phoneNumber}`}>
                  {job.agency.phoneNumber || '-'}
                </a>
              </p>
            </ContentWithLabel>
          </Col>
          <Col className="p-0" sm={isPreview ? 12 : 6}>
            <ContentWithLabel label="Agency email">
              <p>
                <a href={`mailto:${job.agency.email}`}>
                  {job.agency.email || '-'}
                </a>
              </p>
            </ContentWithLabel>
          </Col>
        </Row>
      )}

      <Contacts title="Manager" list={propertyManager} />
      <Row className="mb-3 border-bottom" />
      {hasTenantAccess ? (
        <Contacts title="Tenant" list={job.tenants} />
      ) : (
        <Row>
          <Col className="p-0">
            <p>Tenant details unavailable. Contact agency for access.</p>
          </Col>
        </Row>
      )}
    </Container>
  );
};

JobDetailsForTradies.propTypes = {
  isPreview: PropTypes.bool,
  job: PropTypes.object,
  onClickQuote: PropTypes.func,
};

JobDetailsForTradies.defaultProps = {
  isPreview: false,
  job: {},
};

export default memo(JobDetailsForTradies);
