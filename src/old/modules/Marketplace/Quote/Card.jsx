import PropTypes from 'prop-types';
import React, { useMemo } from 'react';

import { useClassName } from '@app/hooks';
import { CardLight } from '@app/modules/Card';
import { QuoteStatus } from '@app/modules/Marketplace';
import { centsToDollar } from '@app/utils';

export const QuoteCard = ({
  amount,
  content,
  isActive,
  status,
  title,
  ...props
}) => {
  const classNames = useMemo(() => {
    let styles = props.className || '';

    if (isActive) {
      styles += ' alert-highlight';
    }

    if (props.onClick) {
      styles += ' pointer';
    }

    return styles;
  }, [isActive, props.className, props.onClick]);

  const className = useClassName(['px-3', 'py-2', 'shadow-sm'], classNames);

  return (
    <CardLight data-testid="quote-card" {...props} className={className}>
      <div className="d-flex align-items-start">
        {props.children}
        <div className="d-flex flex-column text-left">
          {!!title && <p className="m-0">{title}</p>}
          {!!amount && (
            <p className="m-0 opacity-50 text-nowrap">
              {centsToDollar(amount)}
            </p>
          )}
          {!!status && (
            <p className="m-0 opacity-50">
              {!content && <span className="mr-2">Status:</span>}
              <QuoteStatus status={status} className="text-capitalize" />
            </p>
          )}
          {!!content && <p className="m-0 opacity-50">{content}</p>}
        </div>
      </div>
    </CardLight>
  );
};

QuoteCard.propTypes = {
  amount: PropTypes.number,
  content: PropTypes.string,
  isActive: PropTypes.bool,
  status: PropTypes.string,
  title: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
  onClick: PropTypes.func,
};
