import PropTypes from 'prop-types';
import React from 'react';
import { Table } from 'reactstrap';

import { centsToDollar, toPercentFormattedAmount } from '../../../utils';
import { useQuoteTradieFee } from '../hooks';

export const QuoteFeeBreakdown = (props) => {
  const { job, maxMarketplaceFeeCents, quote, quoteAmount, tradieUser } = props;

  const { adminFee, agencyFee, marketplaceFee } = useQuoteTradieFee({
    job,
    quote,
    quoteAmount,
    tradieUser,
  });

  const isWithMaxFee =
    !!maxMarketplaceFeeCents &&
    (agencyFee > maxMarketplaceFeeCents ||
      marketplaceFee > maxMarketplaceFeeCents);

  return (
    <Table className={props.className}>
      <tbody>
        <tr>
          <td>Amount</td>
          <td className="text-right">{centsToDollar(quoteAmount)}</td>
        </tr>
        {marketplaceFee > 0 && (
          <tr>
            <td>
              Less marketplace fee{' '}
              {!isWithMaxFee &&
                `(${toPercentFormattedAmount(
                  tradieUser?.percentageMarketplaceFee
                )})`}
            </td>
            <td className="text-right">
              -
              {centsToDollar(
                isWithMaxFee ? maxMarketplaceFeeCents : marketplaceFee
              )}
            </td>
          </tr>
        )}
        {agencyFee > 0 && (
          <tr>
            <td>
              Less service fee{' '}
              {!isWithMaxFee &&
                `(${toPercentFormattedAmount(job?.percentageAgencyFee)})`}
            </td>
            <td className="text-right">
              -
              {centsToDollar(isWithMaxFee ? maxMarketplaceFeeCents : agencyFee)}
            </td>
          </tr>
        )}
        {adminFee > 0 && (
          <tr>
            <td>Less admin fee</td>
            <td className="text-right">-{centsToDollar(adminFee)}</td>
          </tr>
        )}
        <tr>
          <td>You receive</td>
          <td className="text-right">
            {centsToDollar(
              isWithMaxFee
                ? quoteAmount - maxMarketplaceFeeCents - adminFee
                : quoteAmount - marketplaceFee - agencyFee - adminFee
            )}
          </td>
        </tr>
      </tbody>
    </Table>
  );
};

QuoteFeeBreakdown.propTypes = {
  className: PropTypes.string,
  job: PropTypes.object.isRequired,
  maxMarketplaceFeeCents: PropTypes.number,
  quote: PropTypes.object,
  quoteAmount: PropTypes.number,
  tradieUser: PropTypes.object.isRequired,
};
