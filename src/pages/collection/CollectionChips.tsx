import { Stack } from "@mui/material";
import {
  Description as DescriptionIcon,
  Link as LinkIcon,
  YouTube as YouTubeIcon
} from "@mui/icons-material";
import { Folder } from "../../services/Types";
import { WChip } from "../../components/WChip";
import SteamIcon from "../../assets/images/icons/steam.png";

export const CollectionChips = ({ folder }: { folder: Folder }) => {
  const { files, hyperlinks, steam, youtube_regular, youtube_shorts } = folder.counts;
  if (!Object.values(folder.counts).some((count) => count > 0)) {
    return <></>;
  }
  return (
    <Stack sx={{ flexDirection: "row", gap: 1 }}>
      {files > 0 && (
        <WChip icon={<DescriptionIcon sx={{ fontSize: 20 }} style={{ color: "black" }} />} label={`${files}`} />
      )}
      {hyperlinks > 0 && (
        <WChip icon={<LinkIcon sx={{ fontSize: 20 }} style={{ color: "black" }} />} label={`${hyperlinks}`} />
      )}
      {steam > 0 && <WChip icon={SteamIcon} label={`${steam}`} />}
      {youtube_regular > 0 && youtube_shorts > 0 && (
        <WChip
          icon={<YouTubeIcon sx={{ fontSize: 20 }} style={{ color: "black" }} />}
          label={`${youtube_shorts} + ${youtube_regular}`}
        />
      )}
      {youtube_regular === 0 && youtube_shorts > 0 && (
        <WChip
          icon={<YouTubeIcon sx={{ fontSize: 20 }} style={{ color: "black" }} />}
          label={`${youtube_shorts}`}
        />
      )}
      {youtube_regular > 0 && youtube_shorts === 0 && (
        <WChip
          icon={<YouTubeIcon sx={{ fontSize: 20 }} style={{ color: "black" }} />}
          label={`${youtube_regular}`}
        />
      )}
    </Stack>
  );
};
