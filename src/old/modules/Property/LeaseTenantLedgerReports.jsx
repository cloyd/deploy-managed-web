import PropTypes from 'prop-types';
import React, { useCallback, useMemo, useState } from 'react';
import { Button } from 'reactstrap';

import { Loading } from '../../containers/Loading';
import { downloadFile, fullName } from '../../utils';

export const PropertyLeaseTenantLedgerReport = (props) => {
  const [isReportDownloading, setIsReportDownloading] = useState(false);
  const { id: leaseId, primaryTenant } = props.lease;

  const tenantName = useMemo(() => fullName(primaryTenant), [primaryTenant]);

  const handleDownloadTenantReport = useCallback(
    (type) => () => {
      setIsReportDownloading(true);
      downloadFile(
        `/api/leases/${leaseId}/current-tenant-transactions.${type}`,
        `${tenantName}-tenant_ledger.${type}`,
        setIsReportDownloading
      );
    },
    [leaseId, tenantName, setIsReportDownloading]
  );

  return (
    <>
      <Loading isOpen={isReportDownloading} isLoading={isReportDownloading} />
      <Button
        className="px-0"
        color="link"
        onClick={handleDownloadTenantReport('pdf')}>
        Download to PDF
      </Button>
      <br />
      <Button
        className="px-0"
        color="link"
        onClick={handleDownloadTenantReport('csv')}>
        Download to CSV
      </Button>
    </>
  );
};

PropertyLeaseTenantLedgerReport.propTypes = {
  lease: PropTypes.object,
};
