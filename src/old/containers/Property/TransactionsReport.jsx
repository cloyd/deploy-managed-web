import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Button } from 'reactstrap';

import { Loading } from '../../containers/Loading';
import { ButtonDownload } from '../../modules/Button';
import { Header } from '../../modules/Header';
import { PropertyTransactionsTable } from '../../modules/Report';
import {
  fetchPropertyTransactions,
  getPropertyTransactions,
} from '../../redux/property';
import { downloadFile } from '../../utils/downloadFile';

const PropertyTransactionsReportComponent = (props) => {
  const {
    property,
    fetchPropertyTransactions,
    transactions,
    isLoading,
    transactionsPropertyExistanceCheck,
  } = props;

  const history = useHistory();
  const [reportDownloading, setReportDownloading] = useState(false);

  const downloadLinks = useMemo(() => {
    const fileName = `${property.address.street}_transactions_report`;

    return {
      csv: {
        url: `/api/properties/${property.id}/transactions.csv`,
        filename: `${fileName}.csv`,
      },
      pdf: {
        url: `/api/properties/${property.id}/transactions.pdf`,
        filename: `${fileName}.pdf`,
      },
    };
  }, [property.address.street, property.id]);

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

  useEffect(() => {
    if (property.id) {
      fetchPropertyTransactions({
        propertyId: property.id,
        format: 'json',
      });
    }
  }, [fetchPropertyTransactions, property.id]);

  const handleBack = useCallback(() => history.goBack(), [history]);

  return (
    <>
      <Header title="Property Wallet Report">
        <Button className="p-0" color="link" onClick={handleBack}>
          Back to Transactions
        </Button>
      </Header>
      <div>
        <div className="d-sm-flex justify-content-between align-items-end py-1 container mb-3">
          <h4>{'Wallet Transactions'}</h4>
          <div>
            <Loading isOpen={reportDownloading} isLoading={reportDownloading} />
            <>
              <ButtonDownload title="csv" onClick={handleCSVDownload} />
              <ButtonDownload title="pdf" onClick={handlePDFDownload} />
            </>
          </div>
        </div>
        <PropertyTransactionsTable
          transactions={transactions}
          isLoading={isLoading}
          transactionsPropertyExistanceCheck={
            transactionsPropertyExistanceCheck
          }
        />
      </div>
    </>
  );
};

PropertyTransactionsReportComponent.propTypes = {
  fetchPropertyTransactions: PropTypes.func.isRequired,
  property: PropTypes.object,
  transactions: PropTypes.array,
  isLoading: PropTypes.bool,
  transactionsPropertyExistanceCheck: PropTypes.bool,
};

PropertyTransactionsReportComponent.defaultProps = {
  property: {},
  transactions: [],
  isLoading: false,
};

const mapStateToProps = (state, props) => {
  const { property } = props;

  return {
    transactions: getPropertyTransactions(state.property, property.id),
    isLoading: state.property.isLoading,
    transactionsPropertyExistanceCheck:
      state.property.hasOwnProperty('transactions'),
  };
};

const mapDispatchToProps = {
  fetchPropertyTransactions,
};

export const PropertyTransactionsReport = connect(
  mapStateToProps,
  mapDispatchToProps
)(PropertyTransactionsReportComponent);
