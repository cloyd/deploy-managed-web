import PropTypes from 'prop-types';
import React from 'react';

// https://codepen.io/designcouch/pen/ExvwPY
// The Nav Icon is made up of 4 thick lines (spans)
// that transform from a hamburger to a cross
export const NavIcon = ({ handleClickNavIcon, isNavOpen }) => (
  <div
    id="nav-icon"
    className={isNavOpen ? 'open' : ''}
    onClick={handleClickNavIcon}>
    {Array.apply(null, Array(4)).map((_, index) => (
      <span key={`hamburger-${index}`} className="bg-primary" />
    ))}
  </div>
);

NavIcon.propTypes = {
  handleClickNavIcon: PropTypes.func,
  isNavOpen: PropTypes.bool,
};
