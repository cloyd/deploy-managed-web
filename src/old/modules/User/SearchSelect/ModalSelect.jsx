import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import React, { useCallback, useContext, useState } from 'react';
import Select from 'react-select';
import { PulseLoader } from 'react-spinners';
import {
  Button,
  Col,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row,
} from 'reactstrap';

import { useIsOpen } from '../../../hooks';
import { MARKETPLACE_FEE_OPTIONS, getEndpointType } from '../../../redux/users';
import { toQueryObject } from '../../../utils';
import { ModalConfirm } from '../../Modal';
import { Pagination } from '../../Pagination';
import { ButtonInvite } from './ButtonInvite';
import { OptionItem } from './OptionItem';
import { SearchSelectContext } from './SearchSelectContext';

/**
 * Paginated list of results (options) from user search
 * Choosing an option and clicking 'Select' will then call onSubmit
 */
export const ModalSelect = (props) => {
  const [selectedOption, setSelectedOption] = useState({});
  const [isOpen, actions] = useIsOpen();

  const context = useContext(SearchSelectContext);

  const handleChangeAdminFeeFilter = useCallback(
    (param) => context.handleChangeParams({ agencyPaysAdminFee: param.value }),
    [context]
  );

  const handlePaginate = useCallback(
    (value) => {
      const path = value.split('?');

      if (path.length > 1) {
        context.handleChangeParams(toQueryObject(path[1]));
      }
    },
    [context]
  );

  const handleSearch = useCallback(
    (event) => {
      event.stopPropagation();
      context.handleChangeInput(event.target.value);
    },
    [context]
  );

  const handleSelect = useCallback(
    (option) => () => setSelectedOption(option),
    []
  );

  const handleSubmit = useCallback(() => {
    actions.handleClose();
    context.handleClickOption(selectedOption)();
  }, [actions, context, selectedOption]);

  return (
    <div className={props.className}>
      <Button color="link" tabIndex="0" onClick={actions.handleOpen}>
        Show more results
      </Button>
      <ModalConfirm
        btnCancel={{ text: 'Cancel', color: 'danger' }}
        btnSubmit={{ text: 'Select' }}
        isOpen={isOpen}
        size="lg"
        tabIndex="0"
        title="More results"
        onCancel={actions.handleClose}
        onSubmit={handleSubmit}>
        <Row>
          <Col md={context?.hasFilters ? 12 : 7} className="mt-3">
            <SearchInput search={context.search} onChange={handleSearch} />
          </Col>
          {context?.hasFilters && (
            <Col md={5} className="mt-3">
              <Select
                name="agencyPaysAdminFee"
                onChange={handleChangeAdminFeeFilter}
                options={[
                  { label: '-- Clear Filter --', value: '' },
                  ...MARKETPLACE_FEE_OPTIONS,
                ]}
              />
            </Col>
          )}
        </Row>
        {context.handleSendInvite && (
          <div className="my-3 mx-2">
            <ButtonInvite onClick={actions.handleClose} />
          </div>
        )}
        <div className="modal-search-results mt-3">
          {context.isLoading ? (
            <PulseLoader color="#dee2e6" size={12} />
          ) : (
            context.options.map((option) => (
              <OptionItem
                className={
                  selectedOption.id === option.id ? 'border-primary' : ''
                }
                isDisabled={context.selectedIds.some((id) => id === option.id)}
                key={`modal-select-option-${option.id}`}
                option={option}
                onClick={handleSelect}
              />
            ))
          )}
          <div className="overflow-auto mt-3">
            <Pagination
              isReload={false}
              name={getEndpointType(context.type)}
              onClick={handlePaginate}
            />
          </div>
        </div>
      </ModalConfirm>
    </div>
  );
};

ModalSelect.propTypes = {
  className: PropTypes.string,
};

const SearchInput = (props) => (
  <InputGroup>
    <Input type="text" value={props.search} onChange={props.onChange} />
    <InputGroupAddon addonType="append">
      <InputGroupText className="py-1">
        <FontAwesomeIcon icon={['far', 'search']} />
      </InputGroupText>
    </InputGroupAddon>
  </InputGroup>
);

SearchInput.propTypes = {
  onChange: PropTypes.func,
  search: PropTypes.string,
};
