import PropTypes from 'prop-types';
import React, { useCallback, useState } from 'react';
import { PulseLoader } from 'react-spinners';
import { Container } from 'reactstrap';

import { HeaderTitle } from '.';
import { Alert } from '../../containers';
import { Loading } from '../../containers/Loading';
import { toClassName } from '../../utils';
import { downloadFile } from '../../utils/downloadFile';
import { ButtonDownload, ButtonEmail, ButtonPrint } from '../Button';

export const Header = ({
  canDownload,
  canPrint,
  canSendEmail,
  children,
  className,
  color,
  downloadLinks,
  hasAlert,
  isLoading,
  title,
  onEmailRequest,
  subHeaderComponent,
  isManualDismiss,
}) => {
  const [reportDownloading, setReportDownloading] = useState(false);

  const hasChildren = !!children || canDownload || canPrint;

  // Add in default margin if no margin className exists.
  const classNames = toClassName(
    [!/m(b|-)/.test(className) ? 'mb-3' : ''],
    className
  );

  // Add in default padding if no padding className exists.
  const classNamesHeader = toClassName(
    [`bg-${color}`],
    !/p(y|-)/.test(className) && 'py-3'
  );

  const handleCSVDownload = useCallback(() => {
    setReportDownloading(true);
    const download = downloadLinks?.csv;
    downloadFile(download.url, download.filename, setReportDownloading);
  }, [downloadLinks]);

  const handlePDFDownload = useCallback(() => {
    setReportDownloading(true);
    const download = downloadLinks?.pdf;
    downloadFile(download.url, download.filename, setReportDownloading);
  }, [downloadLinks]);

  return (
    <div className={classNames}>
      <header className={classNamesHeader}>
        <Loading isOpen={reportDownloading} isLoading={reportDownloading} />
        <Container className="d-sm-flex justify-content-between align-items-end py-1">
          {title && <HeaderTitle title={title} />}
          {isLoading ? (
            <PulseLoader size={12} color="#dee2e6" className="ml-4" />
          ) : hasChildren ? (
            <div className={!title ? 'w-100' : 'ml-auto mt-3 mt-sm-0'}>
              {canDownload && canSendEmail ? (
                <ButtonEmail onClick={onEmailRequest} />
              ) : canDownload ? (
                <>
                  <ButtonDownload title="csv" onClick={handleCSVDownload} />
                  <ButtonDownload title="pdf" onClick={handlePDFDownload} />
                </>
              ) : null}
              {canPrint && <ButtonPrint />}
              {children}
            </div>
          ) : null}
        </Container>
      </header>
      {subHeaderComponent}
      {hasAlert && (
        <Alert
          className={`rounded-0 d-print-none ${
            subHeaderComponent ? 'mb-0' : ''
          }`}
          isManualDismiss={isManualDismiss}
        />
      )}
    </div>
  );
};

Header.propTypes = {
  canDownload: PropTypes.bool,
  canPrint: PropTypes.bool,
  canSendEmail: PropTypes.bool,
  children: PropTypes.any,
  className: PropTypes.string,
  color: PropTypes.string,
  downloadLinks: PropTypes.object,
  hasAlert: PropTypes.bool,
  isLoading: PropTypes.bool,
  onEmailRequest: PropTypes.func,
  title: PropTypes.string,
  subHeaderComponent: PropTypes.node,
  isManualDismiss: PropTypes.bool,
};

Header.defaultProps = {
  canDownload: false,
  canPrint: false,
  color: 'white',
  hasAlert: true,
  isLoading: false,
  subHeaderComponent: null,
  isManualDismiss: false,
};
