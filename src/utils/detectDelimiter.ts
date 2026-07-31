import { ANSWER_DELIMITER_KEYS, splitAnswers } from "./splitAnswers";

export const detectDelimiter = (text: string): string => {
  let bestDelimiter = ANSWER_DELIMITER_KEYS[0];
  let bestCount = -1;
  ANSWER_DELIMITER_KEYS.forEach((delimiter) => {
    const count = splitAnswers(text, delimiter).length;
    if (count > bestCount) {
      bestCount = count;
      bestDelimiter = delimiter;
    }
  });
  return bestDelimiter;
};
