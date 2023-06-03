import PropTypes from 'prop-types';
import React, { useCallback, useRef, useState } from 'react';
import AvatarEditor from 'react-avatar-editor';
import { Button, Col, Container, Row } from 'reactstrap';

import { ATTACHMENT_EXTENSIONS_PER_TYPE } from '../../../utils';
import { UploaderFormForCanvas } from '../../Uploader';

export const UserAvatarEditor = (props) => {
  const { className, onSubmit } = props;
  const editorRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [uploadedImage, setUploadedImage] = useState();

  const handleChangeScale = useCallback((event) => {
    event.preventDefault();

    if (event.target && event.target.value) {
      setScale(event.target.value / 10);
    }
  }, []);

  const handleComplete = useCallback((image = {}) => {
    // Expects image.data to be a File()
    // https://developer.mozilla.org/en-US/docs/Web/API/File
    if (typeof image.data === 'object') {
      setUploadedImage(image.data);
    }
  }, []);

  const handleLoadFailure = useCallback(() => setUploadedImage(null), []);

  const handleSubmit = useCallback(() => {
    const editorCanvas = editorRef.current.canvas;
    const ratio = editorCanvas.width / 180;

    const croppedDataURL = canvasCropSquare(
      editorCanvas,
      10 * ratio,
      160 * ratio,
      180
    );

    if (onSubmit) {
      onSubmit(croppedDataURL);
    }
  }, [onSubmit]);

  return (
    <Container className={className}>
      <Row>
        <Col md={6} className="mb-3">
          <UploaderFormForCanvas
            allowedFileTypes={ATTACHMENT_EXTENSIONS_PER_TYPE.image}
            note="Please add an image under 25MB"
            onComplete={handleComplete}
          />
        </Col>
        <Col md={6}>
          <div className="d-flex mb-3">
            <div className="avatar-editor-wrapper">
              <AvatarEditor
                image={uploadedImage}
                width={200}
                height={200}
                border={0}
                ref={editorRef}
                scale={scale}
                onLoadFailure={handleLoadFailure}
              />
              <svg width="200" height="200" viewBox="-1 2.5 12 5">
                <path d="M-10 -1 H30 V12 H-10z M 5 5 m -5, 0 a 5,5 0 1,0 10,0 a 5,5 0 1,0 -10,0z" />
              </svg>
            </div>
          </div>
          <EditorScaleInput
            isDisabled={!uploadedImage}
            onChange={handleChangeScale}
          />
          <Button
            color="primary"
            disabled={!uploadedImage}
            onClick={handleSubmit}>
            Upload Avatar
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

UserAvatarEditor.propTypes = {
  className: PropTypes.string,
  onSubmit: PropTypes.func,
};

UserAvatarEditor.defaultProps = {};

const EditorScaleInput = (props) => (
  <div className="d-block mb-3">
    <label className="d-flex" htmlFor="scale-image">
      Scale image
    </label>
    <input
      defaultValue={10}
      disabled={props.isDisabled}
      min={1}
      max={50}
      name="scale-image"
      type="range"
      onChange={props.onChange}
    />
  </div>
);

EditorScaleInput.propTypes = {
  isDisabled: PropTypes.bool,
  onChange: PropTypes.func,
};

const canvasCropSquare = (canvas, offset, canvasSize, imageSize) => {
  const tempCanvas = document.createElement('canvas');
  const ctx = tempCanvas.getContext('2d');

  tempCanvas.width = imageSize;
  tempCanvas.height = imageSize;

  ctx.drawImage(
    canvas,
    offset,
    offset,
    canvasSize,
    canvasSize,
    0,
    0,
    imageSize,
    imageSize
  );

  return tempCanvas.toDataURL('image/png');
};
