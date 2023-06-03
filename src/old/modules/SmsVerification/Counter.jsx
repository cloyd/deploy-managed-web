import PropTypes from 'prop-types';
import React, { memo, useEffect, useMemo, useState } from 'react';

const SECOND = 1000;
const MINUTE = SECOND * 60;

export const Counter = ({ toggleTimer }) => {
  const currentTime = new Date().getTime();
  const deadline = new Date(currentTime + 60000).toString();

  const parsedDeadline = useMemo(() => Date.parse(deadline), [deadline]);
  const [time, setTime] = useState(parsedDeadline - Date.now());

  useEffect(() => {
    const interval = setInterval(
      () => setTime(parsedDeadline - Date.now()),
      1000
    );

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (
      Math.floor((time / MINUTE) % 60) <= 0 &&
      Math.floor((time / SECOND) % 60) <= 0
    ) {
      toggleTimer();
    }
  }, [time, toggleTimer]);

  return (
    <div className="timer">
      <span>
        {`${Math.floor((time / MINUTE) % 60)}`.padStart(2, '0')}:
        {`${Math.floor((time / SECOND) % 60)}`.padStart(2, '0')}
      </span>
    </div>
  );
};

Counter.propTypes = {
  toggleTimer: PropTypes.func.isRequired,
};

export default memo(Counter);
