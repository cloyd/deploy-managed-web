import PropTypes from 'prop-types';
import React, { useCallback, useMemo, useState } from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import {
  Button,
  CardBody,
  Col,
  Container,
  Input,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
  UncontrolledTooltip,
} from 'reactstrap';

import { toClassName } from '../../../utils';
import { ButtonIcon } from '../../Button';
import { CardLight } from '../../Card';

export const CustomTaskModal = (props) => {
  const {
    isCustomTaskModelOpen,
    tasksList,
    activeTaskId,
    taskSelected,
    taskEdit,
    handleEditChange,
    updateTaskId,
    editTaskId,
    taskTypeahead,
    handleInputChangeTaskName,
    taskValue,
    addCustomTask,
    categoryEdit,
    updateCategoryId,
    editCategoryId,
    cancelEditingCategoryId,
    deleteCategoryId,
    categoriesList,
    taskCategoryTypeahead,
    handleChangeCategoryName,
    handleInputChangeCategoryName,
    categoryValue,
    addCustomCategory,
    statusEdit,
    updateStatusId,
    editStatusId,
    cancelEditingStatusId,
    deleteStatusId,
    handleArrowClick,
    statusesList,
    taskStatusTypeahead,
    handleChangeStatusName,
    handleInputChangeStatusName,
    statusValue,
    addCustomStatus,
    ModalOpenClose,
    cancelEditingTaskId,
    deleteConfirmationModal,
  } = props;

  const [taskError, setTaskError] = useState('');
  const isInvalidTask = useMemo(
    () => taskError || !taskValue,
    [taskError, taskValue]
  );

  const handleTaskChange = useCallback(
    (task) => {
      handleInputChangeTaskName(task);
      if (!task.match(/^[A-Za-z0-9 ]*$/g)) {
        setTaskError('Special characters are not allowed');
      } else {
        setTaskError('');
      }
    },
    [handleInputChangeTaskName]
  );

  return (
    <Container className="mb-3">
      {
        <Modal size="xl" isOpen={isCustomTaskModelOpen} centered>
          <ModalHeader cssModule={{ 'modal-title': 'w-100' }}>
            <div className="d-inline-flex w-100 justify-content-between">
              <div>Manage Custom Tasks</div>
              <p
                className="text-right text-muted h6 font-weight-light small"
                style={{ fontSize: '12px' }}>
                {'* - System Default: These cannot be edited.'}
              </p>
            </div>
          </ModalHeader>
          <ModalBody>
            <div
              className="container"
              style={{ marginBottom: taskError && '1.438rem' }}>
              <div className="row no-gutters">
                <div className="col-sm border-right">
                  <div
                    className="text-left font-weight-bold"
                    style={{
                      paddingLeft: '5%',
                      backgroundColor: '#A791D0',
                      paddingTop: '0.5rem',
                      paddingBottom: '0.5rem',
                    }}>
                    Add a Type
                  </div>
                </div>
                <div className="col-sm border-right">
                  <div
                    className="text-left font-weight-bold"
                    style={{
                      paddingLeft: '5%',
                      backgroundColor: '#d0c2ea',
                      paddingTop: '0.5rem',
                      paddingBottom: '0.5rem',
                    }}>
                    Add Categories to Type
                  </div>
                </div>
                <div className="col-sm border-right">
                  <div
                    className="text-left font-weight-bold"
                    style={{
                      paddingLeft: '5%',
                      backgroundColor: '#d0c2ea',
                      paddingTop: '0.5rem',
                      paddingBottom: '0.5rem',
                    }}>
                    Add Statuses to Type
                  </div>
                </div>
              </div>
              <div className="row no-gutters">
                <div className="col-sm">
                  <CardLight
                    className={toClassName(['border-0'])}
                    style={{
                      height: '50vh',
                      overflow: 'scroll',
                      borderRadius: 'inherit',
                    }}>
                    {tasksList && tasksList.length > 0 && (
                      <CardBody
                        className="py-0"
                        style={{ paddingRight: '15px', paddingLeft: '15px' }}>
                        {tasksList?.map((task) => (
                          <div
                            key={task.taskType.id}
                            onClick={taskSelected(task.taskType.id)}
                            className="d-block"
                            style={{ cursor: 'pointer' }}>
                            <Row
                              className={toClassName(
                                ['py-2 border-bottom'],
                                activeTaskId === task?.taskType?.id
                                  ? ''
                                  : 'bg-light border-right'
                              )}
                              style={{
                                alignItems: 'center',
                                justifyContent: 'space-between',
                              }}>
                              {taskEdit?.id === task?.taskType?.id ? (
                                <Col>
                                  <Input
                                    // data-testid="form-field-name"
                                    type="text"
                                    name="EditTask"
                                    value={taskEdit?.name || ''}
                                    placeholder="Edit Task"
                                    onChange={handleEditChange(task.taskType)}
                                  />
                                </Col>
                              ) : (
                                <Col
                                  md={7}
                                  style={{
                                    fontWeight:
                                      activeTaskId === task?.taskType?.id
                                        ? 'bold'
                                        : '',
                                  }}>
                                  {task.taskType.name}
                                </Col>
                              )}
                              <Col
                                md={activeTaskId === task?.taskType?.id ? 4 : 5}
                                style={{
                                  paddingRight:
                                    activeTaskId === task?.taskType?.id
                                      ? '0px'
                                      : '15px',
                                  paddingLeft:
                                    activeTaskId === task?.taskType?.id
                                      ? '0px'
                                      : '15px',
                                }}
                                className="text-right">
                                {taskEdit?.id === task.taskType.id ? (
                                  <ButtonIcon
                                    className="p-0"
                                    icon={['fas', 'check-circle']}
                                    onClick={updateTaskId(task.taskType)}
                                  />
                                ) : (
                                  <ButtonIcon
                                    className="p-0"
                                    icon={['fas', 'edit']}
                                    onClick={editTaskId(task.taskType)}
                                  />
                                )}
                                {taskEdit?.id === task.taskType.id ? (
                                  <ButtonIcon
                                    className="ml-1"
                                    color="danger"
                                    icon={['far', 'times-circle']}
                                    onClick={cancelEditingTaskId(task)}
                                  />
                                ) : (
                                  <ButtonIcon
                                    className="ml-1"
                                    color={
                                      task?.taskType?.inUse
                                        ? '#dee2e6'
                                        : 'danger'
                                    }
                                    icon={['far', 'trash-alt']}
                                    disabled={task?.taskType?.inUse}
                                    onClick={deleteConfirmationModal}
                                  />
                                )}
                                {activeTaskId === task?.taskType?.id && (
                                  <ButtonIcon
                                    data-testid="button-right-custom-task"
                                    color="primary"
                                    style={{
                                      paddingRight: '0px',
                                      paddingLeft: '0px',
                                    }}
                                    icon={['far', 'chevron-right']}
                                  />
                                )}
                              </Col>
                            </Row>
                          </div>
                        ))}
                      </CardBody>
                    )}
                  </CardLight>
                  <div style={{ marginTop: '3rem' }} />
                  <div
                    className="mt-3"
                    style={{
                      display: 'flex',
                      position: 'absolute',
                      bottom: 0,
                      width: '97%',
                    }}>
                    <Typeahead
                      style={{ width: '100%' }}
                      paginate
                      id="typeahead-tasktypes"
                      isInvalid={taskError}
                      labelKey="name"
                      name="Task"
                      options={tasksList.map((task) => task.taskType)}
                      placeholder="Enter Task"
                      ref={taskTypeahead}
                      onInputChange={handleTaskChange}
                    />
                    <Button
                      className="ml-2 mr-2"
                      disabled={isInvalidTask}
                      color={isInvalidTask ? '#dee2e6' : 'primary'}
                      onClick={addCustomTask}>
                      Add
                    </Button>
                  </div>
                </div>
                <div
                  className="col-sm"
                  style={{
                    borderRight: 'dashed',
                    borderRightWidth: '1px',
                    borderRightColor: 'lightgrey',
                    paddingRight: '0px',
                  }}>
                  <CardLight
                    className={toClassName(['border-0'])}
                    style={{ height: '50vh', overflow: 'scroll' }}>
                    {tasksList &&
                      tasksList.filter(
                        (task) => task?.taskType?.id === activeTaskId
                      ).length > 0 && (
                        <CardBody className="py-0">
                          {tasksList.filter(
                            (task) => task?.taskType?.id === activeTaskId
                          )[0]?.categories.length > 0 ? (
                            tasksList
                              .filter(
                                (task) => task.taskType.id === activeTaskId
                              )[0]
                              ?.categories.sort((a, b) =>
                                a.key.localeCompare(b.key)
                              )
                              .map((category) => (
                                <div key={category.id} className="d-block">
                                  <Row
                                    className={toClassName([
                                      'py-2 border-bottom',
                                    ])}
                                    style={{
                                      alignItems: 'center',
                                      justifyContent: 'space-between',
                                    }}>
                                    {categoryEdit?.id === category.id ? (
                                      <Col>
                                        <Input
                                          // data-testid="form-field-name"
                                          type="text"
                                          name="EditCategory"
                                          value={categoryEdit.name || ''}
                                          placeholder="Edit Category"
                                          onChange={handleEditChange(category)}
                                        />
                                      </Col>
                                    ) : (
                                      <Col md={8}>
                                        {!category?.custom ? '*' : null}
                                        {category.name}
                                      </Col>
                                    )}
                                    <Col md={4} className="text-right">
                                      {categoryEdit?.id === category.id ? (
                                        <ButtonIcon
                                          className="p-0"
                                          icon={['fas', 'check-circle']}
                                          disabled={!category?.custom}
                                          onClick={updateCategoryId(category)}
                                        />
                                      ) : (
                                        <ButtonIcon
                                          className="p-0"
                                          icon={['fas', 'edit']}
                                          color={
                                            !category?.custom
                                              ? '#dee2e6'
                                              : 'primary'
                                          }
                                          disabled={!category?.custom}
                                          onClick={editCategoryId(category)}
                                        />
                                      )}
                                      {categoryEdit?.id === category.id ? (
                                        <ButtonIcon
                                          className="ml-1"
                                          color="danger"
                                          icon={['far', 'times-circle']}
                                          onClick={cancelEditingCategoryId(
                                            category
                                          )}
                                        />
                                      ) : (
                                        <ButtonIcon
                                          className="ml-1"
                                          color={
                                            category?.inUse
                                              ? '#dee2e6'
                                              : 'danger'
                                          }
                                          icon={['far', 'trash-alt']}
                                          disabled={category?.inUse}
                                          onClick={deleteCategoryId(
                                            category.id
                                          )}
                                        />
                                      )}
                                    </Col>
                                  </Row>
                                </div>
                              ))
                          ) : (
                            <div style={{ marginTop: '1rem' }}>
                              {'No Categories found.'}
                            </div>
                          )}
                        </CardBody>
                      )}
                  </CardLight>
                  <div style={{ marginTop: '3rem' }} />
                  <div
                    className="mt-3 ml-2"
                    style={{
                      display: 'flex',
                      position: 'absolute',
                      bottom: 0,
                      width: '97%',
                    }}>
                    <Typeahead
                      style={{ width: '100%' }}
                      paginate
                      id="typeahead-taskcategories"
                      labelKey="name"
                      name="Category"
                      options={
                        categoriesList?.filter(
                          (category) =>
                            !tasksList
                              ?.filter(
                                (task) => task?.taskType?.id === activeTaskId
                              )[0]
                              ?.categories.map((cat) => cat.id)
                              .includes(category.id)
                        ) || []
                      }
                      placeholder="Enter Category"
                      ref={taskCategoryTypeahead}
                      onChange={handleChangeCategoryName}
                      onInputChange={handleInputChangeCategoryName}
                    />
                    <Button
                      className="ml-2 mr-2"
                      disabled={!categoryValue}
                      color={!categoryValue ? '#dee2e6' : 'primary'}
                      onClick={addCustomCategory}>
                      Add
                    </Button>
                  </div>
                </div>
                <div className="col-sm">
                  <CardLight
                    className={toClassName(['border-0'])}
                    style={{ height: '50vh', overflow: 'scroll' }}>
                    {tasksList &&
                      tasksList.filter(
                        (task) => task?.taskType?.id === activeTaskId
                      ).length > 0 &&
                      tasksList.filter(
                        (task) => task?.taskType?.id === activeTaskId
                      )[0]?.statuses.length > 0 && (
                        <CardBody className="py-0">
                          {tasksList
                            .filter(
                              (task) => task?.taskType?.id === activeTaskId
                            )[0]
                            ?.statuses.map((status) => (
                              <div key={status.id} className="d-block">
                                <Row
                                  className={toClassName([
                                    'py-2 border-bottom',
                                  ])}
                                  style={{
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                  }}>
                                  {statusEdit?.id === status.id ? (
                                    <Col>
                                      <Input
                                        // data-testid="form-field-name"
                                        type="text"
                                        name="EditStatus"
                                        value={statusEdit.name || ''}
                                        placeholder="Edit Status"
                                        onChange={handleEditChange(status)}
                                      />
                                    </Col>
                                  ) : (
                                    <>
                                      <Col
                                        className="text-nowrap overflow-hidden"
                                        md={5}>
                                        <span
                                          id={'tooltipStatusName-' + status.id}>
                                          {' '}
                                          {!status?.custom ? '*' : null}
                                          {status.name.length > 16
                                            ? status.name.slice(0, 14) + '...'
                                            : status.name}
                                        </span>
                                      </Col>
                                      {status.name.length > 16 ? (
                                        <UncontrolledTooltip
                                          target={
                                            'tooltipStatusName-' + status.id
                                          }
                                          placement="top">
                                          {status.name}
                                        </UncontrolledTooltip>
                                      ) : null}
                                    </>
                                  )}
                                  <Col md={7} className="text-right">
                                    {statusEdit?.id === status.id ? (
                                      <ButtonIcon
                                        className="p-0"
                                        icon={['fas', 'check-circle']}
                                        color={
                                          status?.inUse || !status?.custom
                                            ? '#dee2e6'
                                            : 'primary'
                                        }
                                        disabled={
                                          status?.inUse || !status?.custom
                                        }
                                        onClick={updateStatusId(status)}
                                      />
                                    ) : (
                                      <ButtonIcon
                                        className="p-0"
                                        icon={['fas', 'edit']}
                                        color={
                                          status?.inUse || !status?.custom
                                            ? '#dee2e6'
                                            : 'primary'
                                        }
                                        disabled={
                                          status?.inUse || !status?.custom
                                        }
                                        onClick={editStatusId(status)}
                                      />
                                    )}
                                    {statusEdit?.id === status.id ? (
                                      <ButtonIcon
                                        color="danger"
                                        className="ml-1"
                                        icon={['far', 'times-circle']}
                                        onClick={cancelEditingStatusId(status)}
                                      />
                                    ) : (
                                      <ButtonIcon
                                        className="ml-1"
                                        icon={['far', 'trash-alt']}
                                        color={
                                          status?.inUse ||
                                          [
                                            'draft',
                                            'completed',
                                            'followers_notified',
                                          ].includes(status.key)
                                            ? '#dee2e6'
                                            : 'danger'
                                        }
                                        disabled={
                                          status?.inUse ||
                                          [
                                            'draft',
                                            'completed',
                                            'followers_notified',
                                          ].includes(status.key)
                                        }
                                        onClick={deleteStatusId(status.id)}
                                      />
                                    )}
                                    <ButtonIcon
                                      data-testid="button-up-custom-task"
                                      color={
                                        status.position <= 3 ||
                                        status.key === 'completed'
                                          ? '#dee2e6'
                                          : 'primary'
                                      }
                                      disabled={
                                        status.position <= 3 ||
                                        status.key === 'completed'
                                      }
                                      icon={['far', 'chevron-up']}
                                      onClick={handleArrowClick(
                                        status.id,
                                        'up'
                                      )}
                                    />
                                    <ButtonIcon
                                      data-testid="button-down-custom-task"
                                      className="p-0"
                                      color={
                                        status.key === 'draft' ||
                                        status.key === 'followers_notified' ||
                                        status.position >=
                                          tasksList.filter(
                                            (task) =>
                                              task?.taskType?.id ===
                                              activeTaskId
                                          )[0]?.statuses.length -
                                            1
                                          ? '#dee2e6'
                                          : 'primary'
                                      }
                                      disabled={
                                        status.key === 'draft' ||
                                        status.key === 'followers_notified' ||
                                        status.position >=
                                          tasksList.filter(
                                            (task) =>
                                              task?.taskType?.id ===
                                              activeTaskId
                                          )[0]?.statuses.length -
                                            1
                                      }
                                      icon={['far', 'chevron-down']}
                                      onClick={handleArrowClick(
                                        status.id,
                                        'down'
                                      )}
                                    />
                                  </Col>
                                </Row>
                              </div>
                            ))}
                        </CardBody>
                      )}
                  </CardLight>
                  <div style={{ marginTop: '3rem' }} />
                  <div
                    className="mt-3 ml-2"
                    style={{
                      display: 'flex',
                      bottom: 0,
                      position: 'absolute',
                      width: '97%',
                    }}>
                    <Typeahead
                      style={{ width: '100%' }}
                      paginate
                      id="typeahead-taskstatuses"
                      labelKey="name"
                      name="Status"
                      options={
                        statusesList?.filter(
                          (status) =>
                            !tasksList
                              ?.filter(
                                (task) => task?.taskType?.id === activeTaskId
                              )[0]
                              ?.statuses.map((stat) => stat.id)
                              .includes(status.id)
                        ) || []
                      }
                      placeholder="Enter Status"
                      ref={taskStatusTypeahead}
                      onChange={handleChangeStatusName}
                      onInputChange={handleInputChangeStatusName}
                    />
                    <Button
                      className="ml-2 mr-2"
                      disabled={!statusValue}
                      color={!statusValue ? '#dee2e6' : 'primary'}
                      onClick={addCustomStatus}>
                      Add
                    </Button>
                  </div>
                </div>
              </div>
              <small className="text-danger ">{taskError}</small>
            </div>
            <div
              className="mt-3"
              style={{ display: 'inline-block', float: 'right' }}>
              <Button
                className="float-right mt-2 mr-3"
                color="primary"
                onClick={ModalOpenClose}>
                Done
              </Button>
            </div>
          </ModalBody>
        </Modal>
      }
    </Container>
  );
};

CustomTaskModal.defaultProps = {
  tasksList: [],
};

CustomTaskModal.propTypes = {
  isCustomTaskModelOpen: PropTypes.bool,
  tasksList: PropTypes.array,
  activeTaskId: PropTypes.number,
  taskSelected: PropTypes.func,
  taskEdit: PropTypes.object,
  handleEditChange: PropTypes.func,
  updateTaskId: PropTypes.func,
  editTaskId: PropTypes.func,
  taskTypeahead: PropTypes.object,
  handleInputChangeTaskName: PropTypes.func,
  taskValue: PropTypes.string,
  addCustomTask: PropTypes.func,
  categoryEdit: PropTypes.object,
  updateCategoryId: PropTypes.func,
  editCategoryId: PropTypes.func,
  cancelEditingCategoryId: PropTypes.func,
  deleteCategoryId: PropTypes.func,
  categoriesList: PropTypes.array,
  taskCategoryTypeahead: PropTypes.object,
  handleChangeCategoryName: PropTypes.func,
  handleInputChangeCategoryName: PropTypes.func,
  categoryValue: PropTypes.string,
  addCustomCategory: PropTypes.func,
  statusEdit: PropTypes.object,
  updateStatusId: PropTypes.func,
  editStatusId: PropTypes.func,
  cancelEditingStatusId: PropTypes.func,
  deleteStatusId: PropTypes.func,
  handleArrowClick: PropTypes.func,
  statusesList: PropTypes.array,
  taskStatusTypeahead: PropTypes.object,
  handleChangeStatusName: PropTypes.func,
  handleInputChangeStatusName: PropTypes.func,
  statusValue: PropTypes.string,
  addCustomStatus: PropTypes.func,
  ModalOpenClose: PropTypes.func,
  cancelEditingTaskId: PropTypes.func,
  deleteConfirmationModal: PropTypes.func,
};
