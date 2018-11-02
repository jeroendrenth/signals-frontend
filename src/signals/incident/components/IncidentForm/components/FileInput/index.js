import React from 'react';
import PropTypes from 'prop-types';

import Header from '../Header/';

import './style.scss';

const FileInput = ({ handler, touched, hasError, getError, parent, meta, validatorsOrOpts }) => {
  const handleChange = (e) => {
    if (e.target.files && e.target.files.length) {
      const file = e.target.files[0];

      // use revokeObjectURL afterward
      const url = window.URL.createObjectURL(file);
      parent.meta.updateIncident({
        image: url
      });

      const reader = new window.FileReader();
      reader.addEventListener('load', () => {
        parent.meta.updateIncident({
          image_file: file
        });
      });

      reader.readAsText(file);
    }
  };

  const handleClear = (e, url) => {
    e.preventDefault();
    window.URL.revokeObjectURL(url);
    parent.meta.updateIncident({
      image: '',
      image_file: null
    });
  };

  const control = parent.controls[meta.name];
  const imageFile = parent && parent.meta && parent.meta.incident && parent.meta.incident.image_file;
  if (imageFile) {
    control.markAsTouched();
    control.setValidators(() => {
      if (meta && meta.maxFileSize) {
        if (imageFile.size > meta.maxFileSize) {
          return { custom: 'Dit bestand is te groot.' };
        }
      }
      if (meta && meta.allowedFileTypes && Array.isArray(meta.allowedFileTypes)) {
        if (meta.allowedFileTypes.indexOf(imageFile.type) === -1) {
          return { custom: 'Dit bestand heeft niet het juiste type.' };
        }
      }
      return null;
    });
  } else {
    control.clearValidators();
  }

  return (
    <div className={`${meta && meta.isVisible ? 'row' : ''}`}>
      {meta && meta.isVisible ?
        <div className={`${meta.className || 'col-12'} mode_input file`}>
          <Header
            meta={meta}
            options={validatorsOrOpts}
            touched={touched}
            hasError={hasError}
            getError={getError}
          >
            {handler().value ?
              <div className="file-input__preview">
                <button
                  className="file-input__button-delete link-functional delete"
                  onClick={(e) => handleClear(e, handler().value)}
                />

                <img
                  alt="Preview uploaded foto"
                  src={handler().value}
                  className="file-input__preview-image"
                />
              </div>
            :
              <div className="invoer">
                <input
                  type="file"
                  id="formUpload"
                  onChange={handleChange}
                />
                <label htmlFor="formUpload" className="secundary-blue">{meta.submitLabel}</label>
              </div>
            }
          </Header>
        </div>
         : ''}
    </div>
  );
};

FileInput.propTypes = {
  handler: PropTypes.func,
  touched: PropTypes.bool,
  hasError: PropTypes.func,
  meta: PropTypes.object,
  parent: PropTypes.object,
  getError: PropTypes.func.isRequired,
  validatorsOrOpts: PropTypes.object
};

export default FileInput;
