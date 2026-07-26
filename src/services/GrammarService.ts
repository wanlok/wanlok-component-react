const url = "https://api.languagetool.org/v2/check";

type LanguageToolMatch = {
  message: string;
  offset: number;
  length: number;
  replacements: { value: string }[];
};

type LanguageToolResponse = {
  matches: LanguageToolMatch[];
};

export const checkGrammar = async (text: string): Promise<LanguageToolMatch[]> => {
  const params = new URLSearchParams({ text, language: "en-US" });
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString()
  });
  if (!response.ok) {
    return [];
  }
  const data = (await response.json()) as LanguageToolResponse;
  return data.matches;
};

export const applyCorrections = (text: string, matches: LanguageToolMatch[]): string => {
  let result = text;
  const sorted = [...matches].sort((a, b) => b.offset - a.offset);
  sorted.forEach((match) => {
    if (match.replacements.length > 0) {
      result = result.slice(0, match.offset) + match.replacements[0].value + result.slice(match.offset + match.length);
    }
  });
  return result;
};
