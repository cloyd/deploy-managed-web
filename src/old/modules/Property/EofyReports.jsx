import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { PulseLoader } from 'react-spinners';
import { Col, Container } from 'reactstrap';

import { useIsMobile } from '../../hooks';
import { CardLight } from '../../modules/Card';
import { Header } from '../../modules/Header';
import { aggregateByYear } from '../../utils';

export const EofyReports = ({ isLoading, property }) => {
  const isMobile = useIsMobile();

  const eofyReports = useMemo(
    () =>
      property.attachments.filter(
        (report) => report.attachableCategory === 'eofy_statement'
      ),
    [property.attachments]
  );

  /* Map eofy reports attachments to:
    {
      year: [pdf, csv],
    }
  */
  const eofyReportsMap = useMemo(
    () => (eofyReports.length ? aggregateByYear(eofyReports) : {}),
    [eofyReports]
  );

  return (
    <>
      <Header
        color="none"
        isLoading={isLoading}
        title="EOFY Reports"
        className="mb-0"
      />
      <Container>
        {isLoading && (
          <Col className="py-5 text-center">
            <PulseLoader color="#dee2e6" />
          </Col>
        )}
        <CardLight
          className={`w-${isMobile ? 100 : 50} p-4`}
          style={
            eofyReports.length
              ? {
                  display: 'grid',
                  gridTemplateColumns: `repeat(${isMobile ? 2 : 3}, 1fr)`,
                  gridTemplateRows: `repeat(${isMobile ? 3 : 2}, 1fr)`,
                  gridAutoFlow: 'column',
                  rowGap: '1rem',
                }
              : null
          }>
          {eofyReports.length
            ? Object.entries(eofyReportsMap).map(([year, reports]) => {
                const pdf = reports.find(
                  (report) => report.contentType === 'application/pdf'
                );
                const csv = reports.find(
                  (report) => report.contentType === 'text/csv'
                );
                return (
                  <div key={year}>
                    <strong>{year}</strong>
                    <div>
                      <a
                        href={pdf?.urls.original}
                        className="btn-link py-1 text-truncate"
                        target="_blank"
                        rel="noopener noreferrer">
                        PDF
                      </a>{' '}
                      <a
                        href={csv?.urls.original}
                        className="btn-link py-1 text-truncate"
                        target="_blank"
                        rel="noopener noreferrer">
                        CSV
                      </a>
                    </div>
                  </div>
                );
              })
            : 'No available data'}
        </CardLight>
      </Container>
    </>
  );
};

EofyReports.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  property: PropTypes.object.isRequired,
};
