import { Stack } from "@mui/material";
import {
  Description as DescriptionIcon,
  Link as LinkIcon,
  SwapHoriz as SwapHorizIcon,
  YouTube as YouTubeIcon
} from "@mui/icons-material";
import { Folder } from "../../services/Types";
import { WChip } from "../../components/WChip";
import SteamIcon from "../../assets/images/icons/steam.png";

export const CollectionChips = ({ folder }: { folder: Folder }) => {
  const { files, hyperlinks, steam, youtubeRegular, youtubeShorts } = folder.counts;
  const isContainSequences = Object.values(folder.sequences).some((sequence) => sequence.length > 0);
  if (!isContainSequences && !Object.values(folder.counts).some((count) => count > 0)) {
    return <></>;
  }
  return (
    <Stack sx={{ flexDirection: "row", gap: 1 }}>
      {isContainSequences && <WChip icon={<SwapHorizIcon sx={{ fontSize: 22 }} style={{ color: "black" }} />} />}
      {files > 0 && (
        <WChip icon={<DescriptionIcon sx={{ fontSize: 20 }} style={{ color: "black" }} />} label={`${files}`} />
      )}
      {hyperlinks > 0 && (
        <WChip icon={<LinkIcon sx={{ fontSize: 20 }} style={{ color: "black" }} />} label={`${hyperlinks}`} />
      )}
      {steam > 0 && <WChip icon={SteamIcon} label={`${steam}`} />}
      {youtubeRegular > 0 && youtubeShorts > 0 && (
        <WChip
          icon={<YouTubeIcon sx={{ fontSize: 20 }} style={{ color: "black" }} />}
          label={`${youtubeShorts} + ${youtubeRegular}`}
        />
      )}
      {youtubeRegular === 0 && youtubeShorts > 0 && (
        <WChip icon={<YouTubeIcon sx={{ fontSize: 20 }} style={{ color: "black" }} />} label={`${youtubeShorts}`} />
      )}
      {youtubeRegular > 0 && youtubeShorts === 0 && (
        <WChip icon={<YouTubeIcon sx={{ fontSize: 20 }} style={{ color: "black" }} />} label={`${youtubeRegular}`} />
      )}
    </Stack>
  );
};
