import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Col, Container, Row } from 'reactstrap';

import { CardLight } from '@app/modules/Card';
import { ExternalCreditorHeader } from '@app/modules/ExternalCreditor';
import {
  CardBusinessDetails,
  CardPrimaryContact,
  CardRecommendations,
} from '@app/modules/Marketplace';
import { UploaderFiles } from '@app/modules/Uploader';
import { fetchAttachments, getAttachments } from '@app/redux/attachment';
import { fetchCompany, getCompany } from '@app/redux/company';
import { fetchExternalCreditor, getExternalCreditor } from '@app/redux/users';

export const MarketplaceTradieProfile = () => {
  const dispatch = useDispatch();
  const { tradieId } = useParams();

  const attachments = useSelector((state) => {
    return getAttachments(state.attachment);
  });

  const company = useSelector((state) => {
    return getCompany(state.company, 'ExternalCreditor', tradieId);
  });

  const tradie = useSelector((state) => {
    return getExternalCreditor(state.users, tradieId);
  });

  useEffect(() => {
    if (tradieId) {
      dispatch(
        fetchExternalCreditor({
          id: tradieId,
        })
      );

      dispatch(
        fetchCompany({
          ownerId: tradieId,
          ownerType: 'ExternalCreditor',
        })
      );

      dispatch(
        fetchAttachments({
          attachableType: 'ExternalCreditor',
          attachableId: tradieId,
        })
      );
    }
  }, [dispatch, tradieId]);

  return tradie?.id ? (
    <>
      <ExternalCreditorHeader tradie={tradie} />
      <Container className="py-4">
        <Row>
          <Col lg={6}>
            <CardBusinessDetails
              className="mb-4"
              company={company}
              tradie={tradie}
            />
            <CardLight title="Insurance and License documents">
              <UploaderFiles
                attachments={attachments}
                attachableType="ExternalCreditor"
                attachableId={tradie.id}
              />
            </CardLight>
          </Col>
          <Col lg={6}>
            <CardPrimaryContact className="mb-4" tradie={tradie} />
            <CardRecommendations
              className="mb-4"
              recommendations={tradie.recommendations}
            />
          </Col>
        </Row>
      </Container>
    </>
  ) : null;
};
