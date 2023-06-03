import PropTypes from 'prop-types';
import React, { useCallback, useState } from 'react';

import { Loading } from '../../containers/Loading';
import { ButtonDownload } from '../../modules/Button';
import { CardLight } from '../../modules/Card';
import { toClassName } from '../../utils';
import { downloadFile } from '../../utils/downloadFile';

export const DownloadReport = ({ title, downloadLinks, className }) => {
  const [reportDownloading, setReportDownloading] = useState(false);

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
    <CardLight
      className={toClassName(['mb-3'], className)}
      title={title}
      data-testid="download-report">
      <Loading isOpen={reportDownloading} isLoading={reportDownloading} />
      <>
        <ButtonDownload title="csv" onClick={handleCSVDownload} />
        <ButtonDownload title="pdf" onClick={handlePDFDownload} />
      </>
    </CardLight>
  );
};

DownloadReport.propTypes = {
  title: PropTypes.string,
  downloadLinks: PropTypes.object,
  className: PropTypes.string,
};
