import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { Button, Modal, ModalBody, ModalHeader } from 'reactstrap';

import { useClassName } from '../../hooks';
import { httpClient } from '../../utils';
import { CustomTaskModal } from './CustomTask/CustomTaskModal';

export const TaskCustomModalButton = ({
  color,
  history,
  property,
  taskMeta,
  ...props
}) => {
  const [isCustomTaskModelOpen, setIsCustomTaskModelOpen] = useState(false);
  const [taskValue, setTaskValue] = useState();
  const [categoryValue, setCategoryValue] = useState();
  const [statusValue, setStatusValue] = useState();
  const [tasksList, setTasksList] = useState([]);
  const [activeTaskId, setActiveTaskId] = useState();
  const [taskEdit, setTaskEdit] = useState();
  const [categoryEdit, setCategoryEdit] = useState();
  const [statusEdit, setStatusEdit] = useState();
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [errorAlert, setErrorAlert] = useState(false);
  const [categoriesList, setCategoriesList] = useState();
  const [statusesList, setStatusesList] = useState();
  const taskTypeahead = useRef(null);
  const taskCategoryTypeahead = useRef(null);
  const taskStatusTypeahead = useRef(null);
  const className = useClassName(['text-nowrap'], props.className);

  useEffect(() => {
    if (!categoriesList) {
      setCategoriesList(property?.agency?.categories);
    }

    if (!statusesList) {
      setStatusesList(property?.agency?.statuses);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [property]);

  useEffect(() => {
    let customTaskMeta = Object.values(taskMeta).filter(
      (task) => task?.taskType?.custom
    );

    if (customTaskMeta.length > 0) {
      setTasksList(customTaskMeta);
      setActiveTaskId(customTaskMeta[0]?.taskType?.id);
    }
  }, [taskMeta]);

  const handleInputChangeTaskName = useCallback(
    (name) => {
      // THIS FUNC GETS TRIGGERED WHEN THE USER TYPES THE INPUT RATHER THAN SELECTING TYPEAHEAD VALUE
      if (name) {
        if (
          tasksList
            .map((task) => task.taskType)
            .map((type) => type.name.toLowerCase().trim())
            .includes(name.toLowerCase().trim())
        ) {
          setTaskValue('');
        } else {
          setTaskValue(name);
        }
      } else {
        setTaskValue('');
      }
    },
    [tasksList]
  );

  const handleInputChangeCategoryName = useCallback(
    (name) => {
      // THIS FUNC GETS TRIGGERED WHEN THE USER TYPES THE INPUT RATHER THAN SELECTING TYPEAHEAD VALUE
      if (name) {
        if (
          tasksList
            .filter((task) => task.taskType.id === activeTaskId)[0]
            ?.categories?.map((category) => category.name.toLowerCase().trim())
            .includes(name.toLowerCase().trim())
        ) {
          setCategoryValue('');
        } else {
          setCategoryValue(name);
        }
      } else {
        setCategoryValue('');
      }
    },
    [activeTaskId, tasksList]
  );

  const handleChangeCategoryName = useCallback(
    (e) => {
      // WHEN THE TYPEAHEAD DROPDOWN IS SELECTED - THIS FUNC GETS EXECUTED
      setCategoryValue(taskCategoryTypeahead.current.getInput().value);
    },
    [setCategoryValue]
  );

  const handleInputChangeStatusName = useCallback(
    (name) => {
      // THIS FUNC GETS TRIGGERED WHEN THE USER TYPES THE INPUT RATHER THAN SELECTING TYPEAHEAD VALUE
      if (name) {
        if (
          tasksList
            .filter((task) => task.taskType.id === activeTaskId)[0]
            ?.statuses?.map((status) => status.name.toLowerCase().trim())
            .includes(name.toLowerCase().trim())
        ) {
          setStatusValue('');
        } else {
          setStatusValue(name);
        }
      } else {
        setStatusValue('');
      }
    },
    [activeTaskId, tasksList]
  );

  const handleChangeStatusName = useCallback(
    (e) => {
      // WHEN THE TYPEAHEAD DROPDOWN IS SELECTED - THIS FUNC GETS EXECUTED
      setStatusValue(taskStatusTypeahead.current.getInput().value);
    },
    [setStatusValue]
  );

  const handleEditChange = useCallback(
    (item) => (e) => {
      if (e.target.name === 'EditTask') {
        setTaskEdit({ ...item, name: e.target.value });
      }
      if (e.target.name === 'EditCategory') {
        setCategoryEdit({ ...item, name: e.target.value });
      }
      if (e.target.name === 'EditStatus') {
        setStatusEdit({ ...item, name: e.target.value });
      }
    },
    []
  );

  const taskSelected = useCallback(
    (taskId) => () => {
      if (taskId) {
        setActiveTaskId(taskId);
      }
    },
    [setActiveTaskId]
  );

  const addCustomTask = useCallback(() => {
    httpClient
      .post('/task_types', {
        agency_id: property.agencyId,
        name: taskValue,
      })
      .then((response) => {
        setTasksList([...tasksList, response.data]);
        setActiveTaskId(response.data.taskType.id);
        taskTypeahead.current.clear();
      })
      .catch((error) => {
        setErrorAlert(
          error?.data?.error || 'Internal Server error. Please contact Support'
        );
      });
    setTaskValue('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskValue, tasksList]);

  const addCustomCategory = useCallback(() => {
    httpClient
      .post('/task_categories', {
        task_type_id: activeTaskId,
        name: categoryValue,
      })
      .then((response) => {
        let alteredCategories = tasksList.map((task) =>
          task.taskType.id === activeTaskId
            ? {
                ...task,
                categories: response.data.sort((a, b) =>
                  a.key.localeCompare(b.key)
                ),
              }
            : task
        );
        setTasksList(alteredCategories);
        setCategoriesList([
          ...categoriesList,
          ...response.data.filter(
            (cat) => !categoriesList.find((el) => el.id === cat.id)
          ),
        ]);
        taskCategoryTypeahead.current.clear();
      })
      .catch((error) => {
        error &&
          setErrorAlert(
            error?.data?.error ||
              'Internal Server error. Please contact Support'
          );
      });
    setCategoryValue('');
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [activeTaskId, categoryValue, tasksList]);

  const addCustomStatus = useCallback(() => {
    httpClient
      .post('/task_statuses', {
        task_type_id: activeTaskId,
        name: statusValue,
      })
      .then((response) => {
        let alteredList = tasksList.map((task) =>
          task.taskType.id === activeTaskId
            ? {
                ...task,
                statuses: response.data.sort((a, b) => a.position - b.position),
              }
            : task
        );
        setTasksList(alteredList);
        setStatusesList([
          ...statusesList,
          ...response.data.filter(
            (stat) => !statusesList.find((el) => el.id === stat.id)
          ),
        ]);
        taskStatusTypeahead.current.clear();
      })
      .catch((error) => {
        error &&
          setErrorAlert(
            error?.data?.error ||
              'Internal Server error. Please contact Support'
          );
      });
    setStatusValue('');
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [activeTaskId, statusValue, tasksList]);

  const ModalOpenClose = useCallback(() => {
    setIsCustomTaskModelOpen(!isCustomTaskModelOpen);
    if (isCustomTaskModelOpen) {
      setTaskValue('');
      setCategoryValue('');
      setStatusValue('');
      history.go(`/property/${property.id}/tasks/create`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCustomTaskModelOpen]);

  const editTaskId = useCallback(
    (task) => () => {
      setTaskEdit(task);
    },
    [setTaskEdit]
  );

  const editCategoryId = useCallback(
    (item) => () => {
      if (item) {
        setCategoryEdit(item);
      }
    },
    [setCategoryEdit]
  );

  const editStatusId = useCallback(
    (item) => () => {
      if (item) {
        setStatusEdit(item);
      }
    },
    [setStatusEdit]
  );

  const updateTaskId = useCallback(
    (task) => () => {
      if (task) {
        setActiveTaskId(task.id);
        setTaskValue(task.name);
        httpClient
          .put(`/task_types/${activeTaskId}`, {
            name: taskEdit?.name,
          })
          .then((response) => {
            setTasksList(
              tasksList.map((task) =>
                task.taskType.id === response.data.taskType.id
                  ? { ...task, taskType: response.data.taskType }
                  : task
              )
            );
            setTaskEdit({});
          })
          .catch((error) => {
            if (error) {
              setTaskEdit({});
              setErrorAlert(
                error?.data?.error ||
                  'Internal Server error. Please contact Support'
              );
            }
          });
        setTaskValue('');
      }
    },
    [activeTaskId, tasksList, taskEdit]
  );

  const updateCategoryId = useCallback(
    (category) => () => {
      if (category) {
        setCategoryValue(category.name);
        httpClient
          .put(`/task_categories/${category.id}`, {
            task_type_id: activeTaskId,
            name: categoryEdit?.name,
          })
          .then((response) => {
            let updatedList = tasksList.map((task) =>
              task.taskType.id === activeTaskId
                ? {
                    ...task,
                    categories: response.data.sort((a, b) =>
                      a.key.localeCompare(b.key)
                    ),
                  }
                : task
            );
            setTasksList(updatedList);
            setCategoriesList([
              ...categoriesList,
              ...response.data.filter(
                (cat) => !categoriesList.find((el) => el.id === cat.id)
              ),
            ]);
          })
          .catch((error) => {
            if (error) {
              setCategoryEdit({});
              setErrorAlert(
                error?.data?.error ||
                  'Internal Server error. Please contact Support'
              );
            }
          });
        setCategoryValue('');
        setCategoryEdit({});
      }
    },
    /* eslint-disable react-hooks/exhaustive-deps */
    [activeTaskId, tasksList, categoryEdit]
  );

  const updateStatusId = useCallback(
    (status) => () => {
      if (status) {
        setStatusValue(status.name);
        httpClient
          .put(`/task_statuses/${status.id}`, {
            task_type_id: activeTaskId,
            name: statusEdit?.name,
          })
          .then((response) => {
            setTasksList(
              tasksList.map((task) =>
                task.taskType.id === activeTaskId
                  ? {
                      ...task,
                      statuses: response.data,
                    }
                  : task
              )
            );
            setStatusesList([
              ...statusesList,
              ...response.data.filter(
                (stat) => !statusesList.find((el) => el.id === stat.id)
              ),
            ]);
            setStatusValue('');
            setStatusEdit({});
          })
          .catch((error) => {
            if (error) {
              setStatusEdit({});
              setErrorAlert(
                error?.data?.error ||
                  'Internal Server error. Please contact Support'
              );
            }
          });
      }
    },
    /* eslint-disable react-hooks/exhaustive-deps */
    [activeTaskId, tasksList, statusEdit]
  );

  const cancelEditingCategoryId = useCallback(
    (item) => () => {
      if (item) {
        setCategoryEdit({});
      }
    },
    []
  );

  const cancelEditingStatusId = useCallback(
    (item) => () => {
      if (item) {
        setStatusEdit({});
      }
    },
    []
  );

  const cancelEditingTaskId = useCallback(
    (item) => () => {
      if (item) {
        setTaskEdit({});
      }
    },
    []
  );

  const deleteTaskId = useCallback(
    (taskId) => () => {
      if (taskId) {
        httpClient
          .delete(`/task_types/${taskId}`)
          .then((response) => {
            setTasksList(
              tasksList.filter((task) => task.taskType.id !== response.data.id)
            );
            setActiveTaskId(tasksList[0]?.taskType.id);
            setDeleteConfirmation(false);
          })
          .catch((error) => {
            setErrorAlert(
              error?.data?.error ||
                'Internal Server error. Please contact Support'
            );
          });
      }
    },
    [tasksList]
  );

  const deleteCategoryId = useCallback(
    (categoryId) => () => {
      if (categoryId) {
        httpClient
          .delete(`/task_categories/${categoryId}?task_type_id=${activeTaskId}`)
          .then((response) => {
            let deletedFilteredResponse = tasksList.map((task) =>
              task.taskType.id === activeTaskId
                ? {
                    ...task,
                    categories: response.data,
                  }
                : task
            );
            setTasksList(deletedFilteredResponse);
            setCategoriesList([
              ...categoriesList,
              ...response.data.filter(
                (cat) => !categoriesList.find((el) => el.id === cat.id)
              ),
            ]);
          })
          .catch((error) => {
            setErrorAlert(
              error?.data?.error ||
                'Internal Server error. Please contact Support'
            );
          });
      }
    },
    /* eslint-disable react-hooks/exhaustive-deps */
    [activeTaskId, tasksList]
  );

  const deleteStatusId = useCallback(
    (statusId) => () => {
      if (statusId) {
        httpClient
          .delete(`/task_statuses/${statusId}?task_type_id=${activeTaskId}`)
          .then((response) => {
            let updatedList = tasksList.map((task) =>
              task.taskType.id === activeTaskId
                ? {
                    ...task,
                    statuses: response.data,
                  }
                : task
            );
            setTasksList(updatedList);
            setStatusesList([
              ...statusesList,
              ...response.data.filter(
                (stat) => !statusesList.find((el) => el.id === stat.id)
              ),
            ]);
          })
          .catch((error) => {
            setErrorAlert(
              error?.data?.error ||
                'Internal Server error. Please contact Support'
            );
          });
      }
    },
    /* eslint-disable react-hooks/exhaustive-deps */
    [activeTaskId, tasksList]
  );

  const handleArrowClick = useCallback(
    (id, move) => (e) => {
      e.preventDefault();
      httpClient
        .post(`/task_statuses/update_positions`, {
          task_type_id: activeTaskId,
          id: id,
          direction: move,
        })
        .then((response) => {
          let reorderedIds = response.data.map((item) => item.id);
          let reorderedList = tasksList.map((task) =>
            task.taskType.id === activeTaskId
              ? {
                  ...task,
                  statuses: [
                    ...task.statuses.filter(
                      (status) => !reorderedIds.includes(status.id)
                    ),
                    ...response.data,
                  ].sort((a, b) => a.position - b.position),
                }
              : task
          );
          setTasksList(reorderedList);
        })
        .catch((error) => {
          setErrorAlert(
            error?.data?.error ||
              'Internal Server error. Please contact Support'
          );
        });
      e.stopPropagation();
    },
    [activeTaskId, tasksList]
  );

  const deleteConfirmationModal = useCallback(() => {
    setDeleteConfirmation(!deleteConfirmation);
  }, [deleteConfirmation]);

  const closeErrorModal = useCallback(() => {
    errorAlert && setErrorAlert(false);
  }, [errorAlert]);

  return (
    <>
      <Button color={color} className={className} onClick={ModalOpenClose}>
        <span className="d-none d-sm-inline">Manage Custom </span>Tasks
      </Button>
      <CustomTaskModal
        isCustomTaskModelOpen={isCustomTaskModelOpen}
        tasksList={tasksList}
        activeTaskId={activeTaskId}
        taskSelected={taskSelected}
        taskEdit={taskEdit}
        handleEditChange={handleEditChange}
        updateTaskId={updateTaskId}
        editTaskId={editTaskId}
        deleteTaskId={deleteTaskId}
        taskTypeahead={taskTypeahead}
        handleInputChangeTaskName={handleInputChangeTaskName}
        taskValue={taskValue}
        addCustomTask={addCustomTask}
        cancelEditingTaskId={cancelEditingTaskId}
        categoryEdit={categoryEdit}
        updateCategoryId={updateCategoryId}
        editCategoryId={editCategoryId}
        cancelEditingCategoryId={cancelEditingCategoryId}
        deleteCategoryId={deleteCategoryId}
        categoriesList={categoriesList}
        taskCategoryTypeahead={taskCategoryTypeahead}
        handleChangeCategoryName={handleChangeCategoryName}
        handleInputChangeCategoryName={handleInputChangeCategoryName}
        categoryValue={categoryValue}
        addCustomCategory={addCustomCategory}
        statusEdit={statusEdit}
        updateStatusId={updateStatusId}
        editStatusId={editStatusId}
        cancelEditingStatusId={cancelEditingStatusId}
        deleteStatusId={deleteStatusId}
        handleArrowClick={handleArrowClick}
        statusesList={property?.agency?.statuses}
        taskStatusTypeahead={taskStatusTypeahead}
        handleChangeStatusName={handleChangeStatusName}
        handleInputChangeStatusName={handleInputChangeStatusName}
        statusValue={statusValue}
        addCustomStatus={addCustomStatus}
        ModalOpenClose={ModalOpenClose}
        history={history}
        deleteConfirmationModal={deleteConfirmationModal}
      />
      {/* Modal for error popup */}
      <Modal size="sm" isOpen={errorAlert} centered>
        <ModalHeader>
          <div style={{ color: 'red' }}>Alert !</div>
        </ModalHeader>
        <ModalBody>
          <div style={{ height: '10vh', overflow: 'scroll' }}>{errorAlert}</div>
          <div style={{ float: 'right', marginTop: '1rem' }}>
            <Button
              className="ml-2 mr-2"
              outline
              color="danger"
              onClick={closeErrorModal}>
              OK
            </Button>
          </div>
        </ModalBody>
      </Modal>
      {/* Modal for task delete confirmation popup */}
      <Modal size="sm" isOpen={deleteConfirmation} centered>
        <ModalHeader>
          <div>Are you sure?</div>
        </ModalHeader>
        <ModalBody>
          <div>
            This custom task and its linked categories and statuses will be
            deleted.
          </div>
          <div style={{ float: 'right' }}>
            <Button
              className="ml-2 mr-2"
              outline
              color="primary"
              onClick={deleteTaskId(activeTaskId)}>
              OK
            </Button>
            <Button
              className="ml-2 mr-2"
              outline
              color="danger"
              onClick={deleteConfirmationModal}>
              CANCEL
            </Button>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};

TaskCustomModalButton.defaultProps = {
  className: '',
  color: 'primary',
  property: {},
  taskMeta: {},
};

TaskCustomModalButton.propTypes = {
  className: PropTypes.string,
  color: PropTypes.string,
  history: PropTypes.object,
  property: PropTypes.object,
  taskMeta: PropTypes.object,
};
