import {
  Circle,
  LoadScript,
  GoogleMap as ReactGoogleMap,
} from '@react-google-maps/api';
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';

const GoogleMapComponent = (props) => {
  const { latitude, longitude, radiusInKm } = props;

  const center = useMemo(
    () => (latitude && longitude ? { lat: latitude, lng: longitude } : null),
    [latitude, longitude]
  );

  const zoom = useMemo(() => {
    let zoom = 4;

    if (radiusInKm < 10) {
      zoom = 11;
    } else if (radiusInKm < 20) {
      zoom = 10;
    } else if (radiusInKm < 40) {
      zoom = 9;
    } else if (radiusInKm < 80) {
      zoom = 8;
    } else if (radiusInKm < 101) {
      zoom = 7;
    } else if (radiusInKm < 240) {
      zoom = 6;
    }

    return zoom;
  }, [radiusInKm]);

  return center ? (
    <div className={props.className}>
      <LoadScript googleMapsApiKey={import.meta.env.MANAGED_APP_GCP}>
        <ReactGoogleMap
          center={center}
          mapContainerStyle={{ height: '400px' }}
          options={{ disableDefaultUI: true }}
          zoom={zoom}>
          <Circle center={center} radius={radiusInKm * 1000} />
        </ReactGoogleMap>
      </LoadScript>
    </div>
  ) : null;
};

GoogleMapComponent.propTypes = {
  className: PropTypes.string,
  latitude: PropTypes.number,
  longitude: PropTypes.number,
  radiusInKm: PropTypes.number,
};

GoogleMapComponent.defaultProps = {
  latitude: -33.856,
  longitude: 151.215,
  radiusInKm: 10,
};

export const GoogleMap = React.memo(GoogleMapComponent);
