import { Stack, Typography } from "@mui/material";
import {
  Folder as FolderIcon,
  FolderOutlined as FolderOutlinedIcon,
  YouTube as YouTubeIcon
} from "@mui/icons-material";
import { Folder } from "../../services/Types";
import { WChip } from "../../components/WChip";
import { PanelRow } from "../../components/PanelRow";
import DocumentSelectedIcon from "../../assets/images/icons/document_selected.png";
import HyperlinkIcon from "../../assets/images/icons/hyperlink.png";
import SteamIcon from "../../assets/images/icons/steam.png";

const iconSize = 24;

export const CollectionPanelRow = ({
  folder,
  selectedFolder,
  showChips
}: {
  folder: Folder;
  selectedFolder?: Folder;
  showChips?: boolean;
}) => {
  const { files, hyperlinks, steam, youtube_regular, youtube_shorts } = folder.counts;
  return (
    <PanelRow
      icon={
        folder === selectedFolder ? (
          <FolderIcon sx={{ fontSize: iconSize }} />
        ) : (
          <FolderOutlinedIcon sx={{ fontSize: iconSize }} />
        )
      }
    >
      <Typography variant="body1">{folder.name}</Typography>
      {showChips && Object.values(folder.counts).some((count) => count > 0) && (
        <Stack sx={{ flexDirection: "row", gap: 1 }}>
          {files > 0 && <WChip icon={DocumentSelectedIcon} label={`${files}`} />}
          {hyperlinks > 0 && <WChip icon={HyperlinkIcon} label={`${hyperlinks}`} />}
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
      )}
    </PanelRow>
  );
};
