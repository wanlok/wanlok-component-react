const ANSWER_DELIMITER_PATTERNS: { [key: string]: RegExp } = {
  letter: /(?<![A-Za-z])(?=[A-Za-z][.)]\s)/,
  number: /(?<!\d)(?=\d+[.)]\s)/,
  roman: /(?<![A-Za-z])(?=[ivxlcdm]+[.)]\s)/i,
  dash: /(?<!\S)(?=-\s)/
};

const ANSWER_LABEL_PATTERNS: { [key: string]: RegExp } = {
  letter: /^[A-Za-z][.)]\s*/,
  number: /^\d+[.)]\s*/,
  roman: /^[ivxlcdm]+[.)]\s*/i,
  dash: /^-\s*/
};

export const splitAnswers = (text: string, delimiter: string): string[] => {
  return text
    .split(ANSWER_DELIMITER_PATTERNS[delimiter])
    .map((answer) => answer.replace(ANSWER_LABEL_PATTERNS[delimiter], "").trim())
    .filter((answer) => answer.length > 0);
};
