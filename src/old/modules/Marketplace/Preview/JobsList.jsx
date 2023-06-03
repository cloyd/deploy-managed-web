import PropTypes from 'prop-types';
import React, { useCallback, useMemo } from 'react';

import { useIsMobile } from '../../../hooks';
import { Pagination } from '../../Pagination';
import { PreviewCard } from './Card';

export const PreviewJobsList = ({ jobs, name, onClick, selectedJobId }) => {
  const isMobile = useIsMobile();

  const isShowingPreview = useMemo(() => {
    return !isMobile && !!selectedJobId;
  }, [isMobile, selectedJobId]);

  const getClassName = useCallback(
    (job) => {
      const isSelected = selectedJobId && selectedJobId === String(job.id);

      return `text-dark ${
        isSelected ? 'alert-secondary' : job.isEmergency ? 'alert-danger' : ''
      }`;
    },
    [selectedJobId]
  );

  return (
    <>
      {jobs.length > 0 ? (
        jobs.map((job) => (
          <button
            type="button"
            className="d-block w-100 border-0 p-0 mb-2 bg-transparent no-focus"
            data-testid={`${name}-preview-card`}
            key={`task-${job.id}`}
            onClick={onClick(job.id)}>
            <PreviewCard
              className={getClassName(job)}
              job={job}
              isShowingPreview={isShowingPreview}
            />
          </button>
        ))
      ) : (
        <p className="py-4 text-center">
          There are currently no jobs matching your query.
        </p>
      )}
      <Pagination className="mt-3" name={name} isReload={false} />
    </>
  );
};

PreviewJobsList.propTypes = {
  jobs: PropTypes.array,
  name: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  selectedJobId: PropTypes.string,
};

PreviewJobsList.defaultProps = {
  jobs: [],
};
