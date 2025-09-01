import { SteamInfo } from "./Types";

export const fetchSteamInfo = async (appId: string) => {
  let steamInfo: SteamInfo | undefined = undefined;
  try {
    const response = await fetch(
      `https://cors-anywhere.com/https://store.steampowered.com/api/appdetails?appids=${appId}`
    );
    if (response.ok) {
      const { name, header_image } = (await response.json())[appId]["data"];
      steamInfo = {
        title: name as string,
        imageUrl: header_image as string
      };
    }
  } catch (e) {}
  return steamInfo;
};

export const extractSteamAppIds = (text: string): string[] => {
  const regex = /\/app\/(\d+)/g;
  const matches = text.match(regex) || [];
  return matches
    .map((str) => {
      const idMatch = str.match(/\/app\/(\d+)/);
      return idMatch ? idMatch[1] : "";
    })
    .filter(Boolean);
};

export const getSteamInfos = async (text: string) => {
  const steam: { [key: string]: SteamInfo } = {};

  const appIds = extractSteamAppIds(text);

  const results = (
    await Promise.all(
      appIds.map(async (appId) => {
        const steamInfo = await fetchSteamInfo(appId);
        return steamInfo ? { appId, steamInfo } : null;
      })
    )
  ).filter(Boolean) as { appId: string; steamInfo: SteamInfo }[];

  for (const { appId, steamInfo } of results) {
    steam[appId] = steamInfo;
  }

  return { steam };
};
