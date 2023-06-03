import capitalize from 'lodash/fp/capitalize';
import PropTypes from 'prop-types';
import React, { useCallback, useMemo, useState } from 'react';
import Select from 'react-select';
import { Col, Row } from 'reactstrap';

import { LoanGraph, useInstalmentsCalculator } from '.';
import { roundTo, toDollars, toPercentFormattedAmount } from '../../utils';
import { FormLabel, FormLabelInput } from '../Form';

function mapProducts({ loanPeriodValue, loanPeriodUnits, interestRate }) {
  return {
    value: loanPeriodValue,
    label: `${loanPeriodValue} ${capitalize(loanPeriodUnits)}`,
    interestRate: interestRate / 1e4,
    interestRateFormatted: toPercentFormattedAmount(interestRate),
  };
}

export const LoanCalculator = (props) => {
  const products = useMemo(() => props.products.map(mapProducts), [props]);
  const [value, setValue] = useState(props.value);
  const [product, setProduct] = useState(products[0]);
  const [incomeCents, setIncomeCents] = useState(props.incomeCents);

  const handleChangeValue = useCallback(
    (e) => {
      setValue(Number(e.currentTarget.value));
    },
    [setValue]
  );

  const handleChangeProduct = useCallback(
    (value) => {
      setProduct(value);
    },
    [setProduct]
  );

  const handleChangeIncomeCents = useCallback(
    (e) => {
      setIncomeCents(e.currentTarget.value * 100);
    },
    [setIncomeCents]
  );

  const { instalments, repayments } = useInstalmentsCalculator(
    value,
    product.interestRate,
    product.value
  );

  return (
    <>
      <Row className="mb-4 px-lg-5 px-xl-0">
        <Col sm={6} md={4} xl={{ size: 2, offset: 1 }}>
          <FormLabelInput
            type="number"
            label="Amount to borrow"
            name="value"
            prepend="$"
            defaultValue={value}
            handleChange={handleChangeValue}
          />
        </Col>
        <Col sm={6} md={4} xl={2}>
          <FormLabel for="months">Loan period</FormLabel>
          <Select
            onChange={handleChangeProduct}
            options={products}
            value={product}
          />
        </Col>
        <Col sm={6} md={4} xl={2}>
          <FormLabelInput
            type="number"
            label="Monthly Rent Income"
            name="income"
            prepend="$"
            defaultValue={roundTo(toDollars(incomeCents), 0)}
            handleChange={handleChangeIncomeCents}
          />
        </Col>
        <Col sm={6} md={{ size: 4, offset: 2 }} xl={{ size: 2, offset: 0 }}>
          <FormLabelInput
            type="number"
            label="Total Payable"
            name="total"
            prepend="$"
            value={repayments.total}
            disabled
          />
        </Col>
        <Col sm={6} md={{ size: 4, push: 2 }} xl={{ size: 2, push: 1 }}>
          <FormLabelInput
            type="number"
            label="Monthly Repayments"
            name="repayments"
            prepend="$"
            value={repayments.monthly}
            disabled
          />
        </Col>
      </Row>
      <LoanGraph
        instalments={instalments}
        incomeCents={incomeCents * product.value}
      />
    </>
  );
};

LoanCalculator.propTypes = {
  incomeCents: PropTypes.number,
  products: PropTypes.array.isRequired,
  value: PropTypes.number,
};

LoanCalculator.defaultProps = {
  incomeCents: 0,
  value: 2000,
};
