import {CounterViewModel} from '../../scenes/home/types';

const getNewNameWithCopyNumber = (name: string) => {
  const hasCopyNumber = name.match(/^([A-Za-z\s]+) \((\d+)\)/);

  const textPart = hasCopyNumber?.[1] ?? name;
  const copyNumber = hasCopyNumber ? parseInt(hasCopyNumber[2], 10) + 1 : 1;

  return `${textPart} (${copyNumber})`;
};

export const getDuplicateProofCounterTitle = (
  counterList: CounterViewModel[],
  newTitle: string,
): string => {
  const alreadyExists = counterList.some(counter => counter.title === newTitle);

  if (alreadyExists) {
    const newNameWithCopyNumber = getNewNameWithCopyNumber(newTitle);

    return getDuplicateProofCounterTitle(counterList, newNameWithCopyNumber);
  } else {
    return newTitle;
  }
};
