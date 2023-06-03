import PropTypes from 'prop-types';
import React, { useCallback, useState } from 'react';
import SignaturePad from 'react-signature-canvas';
import { Button } from 'reactstrap';

import { formatDate } from '../../utils';

export const SignatureCanvas = (props) => {
  const [isError, setIsError] = useState(false);
  const [sigPad, setSigPad] = useState({});
  const signDate = formatDate(Date.now());

  const handleClear = useCallback(() => {
    sigPad.clear();
    setIsError(false);
  }, [sigPad]);

  const setRef = useCallback((ref) => {
    setSigPad(ref);
  }, []);

  const handleSubmit = useCallback(() => {
    if (sigPad.isEmpty()) {
      setIsError(true);
    } else {
      props.onSubmit(sigPad.toDataURL('image/svg+xml'));
    }
  }, [props, sigPad]);

  return (
    <div className="container" data-testid="signature-canvas">
      <div
        className={`border bg-white rounded ${isError ? 'border-danger' : ''}`}>
        <SignaturePad
          canvasProps={{
            style: {
              backgroundColor: 'white',
              width: '100%',
              height: '200px',
            },
          }}
          ref={setRef}
        />
        {isError && (
          <small className="text-danger d-block px-2">
            Please provide a signature
          </small>
        )}
      </div>
      <div className="d-flex align-items-center justify-content-between py-2">
        <span>{signDate}</span>
        <Button color="link" size="sm" onClick={handleClear}>
          <u>Clear Signature</u>
        </Button>
      </div>
      <div className="pt-4 pb-2 d-flex justify-content-between">
        {props.onCancel && (
          <Button
            outline
            className="mr-2"
            color="primary"
            onClick={props.onCancel}>
            Cancel
          </Button>
        )}
        {props.onSubmit && (
          <Button color="success" onClick={handleSubmit}>
            Submit
          </Button>
        )}
      </div>
    </div>
  );
};

SignatureCanvas.propTypes = {
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func,
};
