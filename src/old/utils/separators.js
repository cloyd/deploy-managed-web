const hasChanged = (a, b) => a && a !== b;
const hasGaps = (a) => (a || []).length > 0;
const isInPosition = (a, b, c) => a === c && b === c - 1;

export const removeSeparators = (value, search) =>
  value.replace(new RegExp(search, 'g'), '');

export const addSeparators = (params) => {
  const { prevValue = '', value = '', separator = '', gaps } = params;
  const positionA = removeSeparators(value, separator).length;
  const positionB = removeSeparators(prevValue, separator).length;

  return (
    hasChanged(positionA, positionB) &&
    hasGaps(gaps) &&
    gaps.reduce(
      (acc, position) =>
        isInPosition(positionA, positionB, position)
          ? `${acc}${separator}`
          : acc,
      value
    )
  );
};
