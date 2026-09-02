import { Stack } from "@mui/material";
import {
  Description as DescriptionIcon,
  Image as ImageIcon,
  Link as LinkIcon,
  SwapHoriz as SwapHorizIcon,
  Videocam as VideocamIcon,
  YouTube as YouTubeIcon
} from "@mui/icons-material";
import { Folder } from "../../services/Types";
import { WChip } from "../../components/WChip";

export const CollectionChips = ({ folder }: { folder: Folder }) => {
  const { file, hyperlink, image, video, youTubeRegular, youTubeShort } = folder.counts;
  const isContainSequences = Object.values(folder.sequences).some((sequence) => sequence.length > 0);
  if (!isContainSequences && !Object.values(folder.counts).some((count) => count > 0)) {
    return <></>;
  }
  return (
    <Stack sx={{ flexDirection: "row", gap: 1 }}>
      {isContainSequences && <WChip icon={<SwapHorizIcon sx={{ fontSize: 22 }} style={{ color: "black" }} />} />}
      {file > 0 && (
        <WChip icon={<DescriptionIcon sx={{ fontSize: 20 }} style={{ color: "black" }} />} label={`${file}`} />
      )}
      {hyperlink > 0 && (
        <WChip icon={<LinkIcon sx={{ fontSize: 20 }} style={{ color: "black" }} />} label={`${hyperlink}`} />
      )}
      {image > 0 && <WChip icon={<ImageIcon sx={{ fontSize: 20 }} style={{ color: "black" }} />} label={`${image}`} />}
      {video > 0 && (
        <WChip icon={<VideocamIcon sx={{ fontSize: 20 }} style={{ color: "black" }} />} label={`${video}`} />
      )}
      {youTubeRegular > 0 && youTubeShort > 0 && (
        <WChip
          icon={<YouTubeIcon sx={{ fontSize: 24 }} style={{ color: "black" }} />}
          label={`${youTubeShort} + ${youTubeRegular}`}
        />
      )}
      {youTubeRegular === 0 && youTubeShort > 0 && (
        <WChip icon={<YouTubeIcon sx={{ fontSize: 24 }} style={{ color: "black" }} />} label={`${youTubeShort}`} />
      )}
      {youTubeRegular > 0 && youTubeShort === 0 && (
        <WChip icon={<YouTubeIcon sx={{ fontSize: 24 }} style={{ color: "black" }} />} label={`${youTubeRegular}`} />
      )}
    </Stack>
  );
};
