import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import pluralize from 'pluralize';
import PropTypes from 'prop-types';
import React from 'react';
import { CardBody, CardHeader, CardTitle } from 'reactstrap';

import { CardLight } from '@app/modules/Card';
import { ContentDefinition } from '@app/modules/Content';
import { timeAgoInWords } from '@app/utils';

export const CardRecommendations = ({ recommendations, ...props }) => {
  return recommendations.length ? (
    <CardLight {...props}>
      <CardHeader className="d-flex justify-content-between bg-white border-400">
        <CardTitle className="mb-0" tag="h5">
          Recommendations
        </CardTitle>
      </CardHeader>
      <CardBody>
        <ContentDefinition className="d-block mb-2" label="Recommended by">
          {recommendations.length} {pluralize('person', recommendations.length)}
        </ContentDefinition>
        <ContentDefinition className="d-block" label="Recent recommendations">
          {recommendations.map(({ id, content, createdAt, createdBy }) => (
            <CardLight key={id} className="bg-gray-200 p-3 mt-2">
              <p className="mb-2">
                <FontAwesomeIcon
                  icon={['far', 'thumbs-up']}
                  className="mr-2 text-primary"
                />
                {content}
              </p>
              <p className="mb-0">
                {createdBy}
                <small className="d-block">{timeAgoInWords(createdAt)}</small>
              </p>
            </CardLight>
          ))}
          {!recommendations.length && (
            <CardLight className="bg-gray-200 p-3 mt-2">
              No recommendations yet
            </CardLight>
          )}
        </ContentDefinition>
      </CardBody>
    </CardLight>
  ) : null;
};

CardRecommendations.propTypes = {
  recommendations: PropTypes.array,
};

CardRecommendations.defaultProps = {
  recommendations: [],
};
