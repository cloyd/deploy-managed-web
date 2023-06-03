import { useCallback, useMemo, useState } from 'react';

export const useIsOpen = (callback, value = false) => {
  const defaultValue = useMemo(() => {
    if (typeof callback === 'boolean') {
      return callback;
    }

    return value;
  }, [callback, value]);

  const [isOpen, setIsOpen] = useState(defaultValue);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
  }, [setIsOpen]);

  const handleSubmit = useCallback(
    (values) => {
      handleClose();

      if (typeof callback === 'function') {
        callback(values);
      }
    },
    [handleClose, callback]
  );

  const handleToggle = useCallback(() => {
    setIsOpen((state) => !state);
  }, [setIsOpen]);

  return [
    isOpen,
    {
      handleClose,
      handleOpen,
      handleSubmit,
      handleToggle,
    },
  ];
};
