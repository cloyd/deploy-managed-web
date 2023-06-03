import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';

import { httpClient } from '../../utils';

const useAsyncSearchPlaces = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState();
  const [error, setError] = useState('');

  const handleSearchPlaces = useCallback((query) => {
    async function searchPlaces() {
      try {
        const response = await httpClient.get(
          'addresses/autocomplete-google-places',
          {
            params: { query },
          }
        );
        if (response.status === 200) {
          setPlaces(
            response.data['googlePlaces/predictions'].map(
              ({ description, placeId }) => ({
                label: description,
                value: placeId,
              })
            )
          );
        }
      } catch (error) {
        setError(error.message);
      }
      setIsLoading(false);
    }
    setError('');

    if (query) {
      searchPlaces();
      setIsLoading(true);
    }
  }, []);

  const handleFetchPlace = useCallback(
    ([place]) => {
      async function fetchPlace() {
        try {
          const response = await httpClient.get(
            'addresses/fetch-google-place',
            {
              params: { placeId: place.value },
            }
          );
          if (response.status === 200) {
            setSelectedPlace(response.data.addresses);
          }
          setIsLoading(false);
        } catch (error) {
          setError(error.message);
        }
      }

      if (!isLoading && place) {
        setError('');
        setIsLoading(true);
        fetchPlace();
      }
    },
    [isLoading]
  );

  return {
    handleSearchPlaces,
    handleFetchPlace,
    places,
    selectedPlace,
    isLoading,
    error,
  };
};

export const AddressAutoComplete = ({ prefix, disabled, setFieldValue }) => {
  const updateAddress = useCallback(
    (place) => {
      const {
        city,
        postalCode,
        regionShortName,
        street,
        streetNumber,
        unitNumber,
      } = place;

      const completeStreet = streetNumber
        ? unitNumber
          ? `${unitNumber}/${streetNumber} ${street}`
          : `${streetNumber} ${street}`
        : street;

      setFieldValue(`${prefix}.street`, completeStreet);
      setFieldValue(`${prefix}.suburb`, city);
      setFieldValue(`${prefix}.state`, regionShortName);
      setFieldValue(`${prefix}.postcode`, postalCode);
    },
    [prefix, setFieldValue]
  );

  const {
    handleSearchPlaces,
    handleFetchPlace,
    places,
    selectedPlace,
    isLoading,
    error,
  } = useAsyncSearchPlaces();

  useEffect(() => {
    if (selectedPlace) {
      updateAddress(selectedPlace);
    }
  }, [selectedPlace, updateAddress]);

  return (
    <>
      {error ? (
        <span>
          <small className="ml-1 text-danger">{error}</small>
        </span>
      ) : null}
      <AsyncTypeahead
        inputProps={{ 'data-testid': `${prefix}.search` }}
        id={`${prefix}.search`}
        className="address-autocomplete w-100"
        isLoading={isLoading}
        minLength={3}
        onChange={handleFetchPlace}
        onSearch={handleSearchPlaces}
        options={places}
        placeholder={'Search for an address'}
        caseSensitive={false}
        delay={300}
        disabled={disabled}
      />
    </>
  );
};

AddressAutoComplete.propTypes = {
  prefix: PropTypes.string,
  disabled: PropTypes.bool,
  setFieldValue: PropTypes.func,
};
