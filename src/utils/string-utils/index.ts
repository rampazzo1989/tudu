export const capitalizeFirstLetter = (text: string) =>
  text.charAt(0).toUpperCase() + text.slice(1);

export const isOnBeginningOfText = (text: string, substring: string) => {
  const index = text.indexOf(substring);
  return index === 0;
};

export const isOnEndOfText = (text: string, substring: string) => {
  const index = text.indexOf(substring);
  console.log({text, substring, index, l: text.length});

  return index === text.length - 1;
};
