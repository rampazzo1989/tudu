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
