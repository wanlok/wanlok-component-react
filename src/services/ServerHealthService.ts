import { serverUrl } from "./Types";

export const fetchServerHealth = async () => {
  const response = await fetch(`${serverUrl}/health`);
  let json = undefined;
  if (response.ok) {
    json = await response.json();
  }
  return json;
};

export const getServerHealth = async () => {
  let serverHealth;
  try {
    serverHealth = await fetchServerHealth();
  } catch (e) {
    serverHealth = undefined;
  }
  return serverHealth;
};
