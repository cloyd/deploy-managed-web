import startCase from 'lodash/fp/startCase';
import React, { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { Col, Container, Row } from 'reactstrap';

import { useIsMobile, useLocationParams, useUpdateParam } from '@app/hooks';
import { ExternalCreditorButtonCTA } from '@app/modules/ExternalCreditor';
import { Filter } from '@app/modules/Filter';
import { Header } from '@app/modules/Header';
import {
  HeroTout,
  JobPreview,
  PreviewJobsList,
  useLabelValueOptions,
  useMarketplaceTags,
  useQuoteTradie,
} from '@app/modules/Marketplace';
import {
  JOB_TYPES,
  fetchJob,
  fetchJobs,
  fetchQuotesByJobId,
  getJob,
  getJobs,
  getQuotesByJobId,
  statusesForPath,
} from '@app/redux/marketplace';
import { getProfile } from '@app/redux/profile';
import { PRIORITIES } from '@app/redux/task';
import { getExternalCreditor } from '@app/redux/users';

export const MarketplaceMyJobs = () => {
  const dispatch = useDispatch();
  const isMobile = useIsMobile();
  const params = useLocationParams();
  const history = useHistory();
  const { type } = useParams();
  const { updateMultipleParams, updateSingleParam } = useUpdateParam();
  const { marketplaceTagFormOptions } = useMarketplaceTags();

  const isLoading = useSelector((state) => {
    return state.marketplace.isLoading;
  });

  const profile = useSelector((state) => {
    return getProfile(state.profile);
  });

  const tradieUser = useSelector((state) => {
    return getExternalCreditor(state.users, profile.id);
  });

  const jobs = useSelector((state) => {
    return getJobs(state.marketplace);
  });

  const job = useSelector((state) => {
    return getJob(state.marketplace, params.jobId);
  });

  const quotes = useSelector((state) => {
    return getQuotesByJobId(state.marketplace, job.id);
  });

  // This should be a selector.
  const quote = useQuoteTradie(profile.id, quotes);

  const pageTitle = useMemo(() => {
    return !type
      ? 'New Jobs'
      : type === 'my-jobs'
      ? 'Assigned to me'
      : startCase(type);
  }, [type]);

  const showPreview = useMemo(() => {
    return !isMobile && !!params.jobId;
  }, [isMobile, params.jobId]);

  const tradieAgencies = useCallback(() => {
    return (
      tradieUser?.accessibleAgencies?.map((agency) => ({
        label: agency.tradingName,
        value: agency.id,
      })) || []
    );
  }, [tradieUser]);

  const handleClear = useCallback(() => {
    history.replace(`${history.location.pathname}?page=1`);
  }, [history]);

  const handleClickQuote = useCallback(
    (jobId) => () => {
      if (isMobile) {
        history.push(`/marketplace/${jobId}`);
      } else {
        updateSingleParam('jobId')(jobId);
      }
    },
    [history, isMobile, updateSingleParam]
  );

  const handleClosePreview = useCallback(() => {
    updateMultipleParams({ jobId: undefined, page: params.page || 1 });
  }, [params.page, updateMultipleParams]);

  useEffect(() => {
    dispatch(fetchJobs({ ...params, type, jobId: undefined }));
  }, [dispatch, params, type]);

  useEffect(() => {
    // A race condition between fetchJob & fetchJobs results in extra details
    // fetchJob being overwritten by fetchJobs. Quick fix is to delay the query.
    // Proper fix is to correct the reducer or avoid state with useFetch.
    if (params.jobId) {
      const timeout = setTimeout(() => {
        dispatch(fetchJob(params.jobId));
        dispatch(fetchQuotesByJobId(params.jobId));
      }, 500);

      return () => clearTimeout(timeout);
    }
  }, [dispatch, params.jobId]);

  return (
    <Filter name={type || 'new-jobs'} defaultProps={{ page: 1 }} isSaved={true}>
      {!type && <HeroTout />}
      <Header className="mb-0" title={pageTitle} isLoading={isLoading}>
        <ExternalCreditorButtonCTA tradieUser={tradieUser} />
      </Header>
      <Container
        className="py-4"
        data-testid={`marketplace-${type || 'new-jobs'}`}>
        <Row className="mb-3 d-flex px-lg-0">
          <Col xs={6} md={4} lg={2} className="pb-2 pr-1 text-small">
            <Filter.TypeaheadSelect
              label="Job Type"
              name="jobType"
              values={useLabelValueOptions(JOB_TYPES)}
            />
          </Col>
          <Col xs={6} md={4} lg={2} className="pb-2 pr-1 text-small">
            <Filter.TypeaheadSelect
              label="Priority"
              name="priority"
              values={PRIORITIES}
            />
          </Col>
          <Col xs={6} md={4} lg={2} className="pb-2 pr-1 text-small">
            <Filter.TypeaheadSelect
              label="Tagged"
              name="tagId"
              values={marketplaceTagFormOptions}
            />
          </Col>
          <Col xs={6} md={4} lg={2} className="pb-2 pr-1 text-small">
            <Filter.TypeaheadSelect
              label="Status"
              name="status"
              values={useLabelValueOptions(statusesForPath(type))}
            />
          </Col>
          <Col xs={6} md={4} lg={2} className="pb-2 pr-1 text-small">
            <Filter.TypeaheadSelect
              label="Agency"
              name="agency"
              values={tradieAgencies()}
            />
          </Col>
          <Col xs={6} md={4} lg={1} className="pt-2 px-1 text-center">
            <Filter.Clear onClick={handleClear} />
          </Col>
          <Col
            xs={{ size: 8, offset: 2 }}
            lg={{ size: 1, offset: 0 }}
            className="pl-3 pl-md-1 flex-lg-fill text-center pl-lg-2">
            <Filter.Submit className="mt-1 w-100" color="primary" size="md">
              Filter
            </Filter.Submit>
          </Col>
        </Row>
        <Row>
          <Col lg={showPreview ? 7 : 12}>
            <PreviewJobsList
              isLoading={isLoading}
              jobs={jobs}
              name={type ? 'my-jobs' : 'tradie-jobs'}
              onClick={handleClickQuote}
              selectedJobId={params.jobId}
            />
          </Col>
          {showPreview && (
            <Col lg={5}>
              <JobPreview
                job={job}
                quote={quote}
                onClose={handleClosePreview}
              />
            </Col>
          )}
        </Row>
      </Container>
    </Filter>
  );
};
