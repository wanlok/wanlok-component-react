const ANSWER_DELIMITER_PATTERNS: { [key: string]: RegExp } = {
  letter_dot: /(?<![A-Za-z])(?=[A-Za-z]\.\s)/,
  letter_paren: /(?<![A-Za-z])(?=[A-Za-z]\)\s)/,
  number_dot: /(?<!\d)(?=\d+\.\s)/,
  number_paren: /(?<!\d)(?=\d+\)\s)/,
  roman_dot: /(?<![A-Za-z])(?=[ivxlcdm]+\.\s)/i,
  roman_paren: /(?<![A-Za-z])(?=[ivxlcdm]+\)\s)/i,
  dash: /(?<!\S)(?=-\s)/
};

export const ANSWER_DELIMITER_KEYS = Object.keys(ANSWER_DELIMITER_PATTERNS);

const ANSWER_LABEL_PATTERNS: { [key: string]: RegExp } = {
  letter_dot: /^[A-Za-z]\.\s*/,
  letter_paren: /^[A-Za-z]\)\s*/,
  number_dot: /^\d+\.\s*/,
  number_paren: /^\d+\)\s*/,
  roman_dot: /^[ivxlcdm]+\.\s*/i,
  roman_paren: /^[ivxlcdm]+\)\s*/i,
  dash: /^-\s*/
};

export const splitAnswers = (text: string, delimiter: string): string[] => {
  return text
    .split(ANSWER_DELIMITER_PATTERNS[delimiter])
    .map((answer) => answer.replace(ANSWER_LABEL_PATTERNS[delimiter], "").trim())
    .filter((answer) => answer.length > 0);
};
