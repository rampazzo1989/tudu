export function generateShuffledArray(size: number): number[] {
  // Create an array with numbers from 0 to size - 1
  const array = Array.from({length: size}, (_, index) => index);

  // Shuffle the array using the Fisher-Yates algorithm
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

export function removeFromList<T>(list: T[], items: T[]) {
  const newList = list.slice();
  for (var item of items) {
    const itemIndex = newList.indexOf(item);
    newList.splice(itemIndex, 1);
  }

  return newList;
}

export function getLastItem<T>(list: T[]) {
  return list.at(list.length - 1);
}

export function groupBy<T, K>(
  array: T[],
  keyFn: (item: T) => K,
): Record<string, T[]> {
  return array.reduce((result, item) => {
    const key = String(keyFn(item));
    const group = result[key] || [];
    group.push(item);
    return {...result, [key]: group};
  }, {} as Record<string, T[]>);
}
