import first from 'lodash/fp/first';
import sortBy from 'lodash/fp/sortBy';
import PropTypes from 'prop-types';
import React, { useCallback, useMemo, useState } from 'react';
import {
  Col,
  Container,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
} from 'reactstrap';

import { useIsMobile } from '../../hooks';
import { CardLight } from '../../modules/Card';
import { Header } from '../../modules/Header';
import { useRolesContext } from '../../modules/Profile';
import { aggregateByYearMonth, financialYearFromMonth } from '../../utils';

export const MonthlyStatements = ({ isLoading, property, user }) => {
  const isMobile = useIsMobile();

  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const currentFinancialYear = financialYearFromMonth(
    currentMonth,
    currentYear
  );
  const { isOwner } = useRolesContext();
  const { primaryOwner, secondaryOwners } = property;

  const monthlyReports = useMemo(() => {
    const currentOwner = isOwner
      ? [primaryOwner, ...secondaryOwners].find((owner) => owner.id === user.id)
      : primaryOwner;

    return (
      currentOwner?.attachments.filter(
        (report) => report.attachableCategory === 'monthly_statement'
      ) || []
    );
  }, [isOwner, primaryOwner, secondaryOwners]);

  /* Map monthy reports attachments to:
    {
      year: {
        month: [pdf, csv],
      }
    }
  */
  const monthlyReportsMap = useMemo(
    () =>
      monthlyReports.length
        ? aggregateByYearMonth(monthlyReports)
        : {
            // If there are no monthly statements yet, show the current financial year with empty data
            [currentFinancialYear]: [],
          },
    [currentFinancialYear, monthlyReports]
  );

  // Set latest financial year with monthy statement as active tab
  const [activeTab, setActiveTab] = useState(
    Object.keys(monthlyReportsMap).find(
      (year) => year === currentFinancialYear.toString()
    )
      ? currentFinancialYear.toString()
      : (currentFinancialYear - 1).toString()
  );

  const handleClickTab = useCallback(
    (year) => () => {
      setActiveTab(year);
    },
    []
  );

  return (
    <>
      <Header
        color="none"
        isLoading={isLoading}
        title="Monthly Statements"
        className="mb-0"
      />
      <Container className="mb-2">
        <div className="mb-4">
          Monthly statements are automatically generated and emailed on the 1st
          day of the new month.
        </div>
        <Nav tabs className="border-0">
          {Object.keys(monthlyReportsMap)
            .sort((a, b) => b - a)
            .map((year) => (
              <NavItem className="p-0" key={year}>
                <NavLink
                  className={`px-4 ${activeTab === year ? 'active' : ''}`}
                  onClick={handleClickTab(year)}
                  style={{
                    border: 0,
                    borderRadius: '0.75rem 0.75rem 0 0',
                    cursor: 'pointer',
                  }}>
                  {`FY ${(year % 2000) - 1}/${year % 2000}`}
                </NavLink>
              </NavItem>
            ))}
        </Nav>
        <TabContent activeTab={activeTab}>
          {Object.entries(monthlyReportsMap).map(([year, months]) => {
            const monthEntries = sortBy(([_, reports]) => {
              return new Date(first(reports).periodStartsAt);
            })(Object.entries(months));

            return (
              <TabPane key={year} tabId={year}>
                <Row>
                  <Col sm="12">
                    <CardLight
                      className="w-100 p-4"
                      style={{
                        ...(monthEntries.length
                          ? {
                              display: 'grid',
                              gridTemplateColumns: `repeat(${
                                isMobile ? 2 : 4
                              }, 1fr)`,
                              gridTemplateRows: `repeat(${
                                isMobile ? 6 : 3
                              }, 1fr)`,
                              gridAutoFlow: 'column',
                              rowGap: '1rem',
                            }
                          : {}),
                        borderRadius: '0 0.75rem 0.75rem',
                      }}>
                      {monthEntries.length
                        ? monthEntries.map(([month, reports]) => {
                            const pdf = reports.find(
                              (report) =>
                                report.contentType === 'application/pdf'
                            );
                            const csv = reports.find(
                              (report) => report.contentType === 'text/csv'
                            );
                            return (
                              <div key={month}>
                                <strong>{month}</strong>
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
                  </Col>
                </Row>
              </TabPane>
            );
          })}
        </TabContent>
      </Container>
    </>
  );
};

MonthlyStatements.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  property: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
};
