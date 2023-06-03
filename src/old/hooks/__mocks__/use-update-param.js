import { useUpdateParam } from '../use-update-param';

/**
 * Mocks for values returned from useUpdateParam hook
 * Usage:
 * - jest.mock import of ../use-update-param
 * - call clearMockUseUpdateParam in beforeEach
 */
export const mockUseUpdateParam = () => {
  const updateMultipleParams = jest.fn();
  const updateSingleParamValue = jest.fn();
  const updateSingleParam = jest.fn(() => updateSingleParamValue);

  const clearMockUseUpdateParam = () => {
    updateMultipleParams.mockClear();
    updateSingleParamValue.mockClear();
    updateSingleParam.mockClear();
    useUpdateParam.mockReturnValue({ updateMultipleParams, updateSingleParam });
  };

  return {
    clearMockUseUpdateParam,
    updateMultipleParams,
    updateSingleParam,
    updateSingleParamValue,
  };
};
