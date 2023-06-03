import PropTypes from 'prop-types';
import React from 'react';

import { UserAvatar } from '@app/modules/User';

import './styles.scss';

export const Contacts = ({ title, list = [] }) => {
  if (!list.length) return null;

  return (
    <div className="contacts-container" data-testid={`contacts-${title}`}>
      {title && (
        <div className="row">
          <div className="text-center">
            <p className="mb-4 font-weight-bold">{title}</p>
          </div>
        </div>
      )}

      <ul className="contact-list row">
        {list.map((person) => (
          <li key={`${title} - ${person.name}`}>
            <div>
              <UserAvatar size={1} imageUrl={person?.imageUrl || null} />
            </div>
            <div className="contact-info">
              <p className="font-weight-bold mb-0">{person.name}</p>
              <p className="text-muted mb-0">{person.phoneNumber || '-'}</p>
              {person.email && (
                <p className="text-muted">
                  <a href={`mailto:${person.email}`}>{person.email}</a>
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

Contacts.propTypes = {
  title: PropTypes.string,
  list: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      phoneNumber: PropTypes.string,
      email: PropTypes.string,
    })
  ),
};

export default Contacts;
