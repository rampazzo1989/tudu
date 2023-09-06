import {Counter} from '../../scenes/home/types';

const getNewNameWithCopyNumber = (name: string) => {
  const hasCopyNumber = name.match(/^([A-Za-z\s]+) \((\d+)\)/);

  const textPart = hasCopyNumber?.[1] ?? name;
  const copyNumber = hasCopyNumber ? parseInt(hasCopyNumber[2], 10) + 1 : 1;

  return `${textPart} (${copyNumber})`;
};

export const getDuplicateProofCounterTitle = (
  list: Counter[],
  newTitle: string,
): string => {
  const alreadyExists = list.some(counter => counter.title === newTitle);

  if (alreadyExists) {
    const newNameWithCopyNumber = getNewNameWithCopyNumber(newTitle);

    return getDuplicateProofCounterTitle(list, newNameWithCopyNumber);
  } else {
    return newTitle;
  }
};
