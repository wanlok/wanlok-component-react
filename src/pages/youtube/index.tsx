import { useState } from "react";
import { Box, Link, Stack, Typography } from "@mui/material";
import { PrimaryButton } from "../../components/PrimaryButton";
import { TextInput } from "../../components/TextInput";
import { useYouTube, YouTubeDocument } from "./useYouTube";

const YouTubeList = ({ document }: { document: YouTubeDocument | undefined }) => {
  const youTubeUrl = "https://www.youtube.com/watch?v=";
  return (
    <Stack sx={{ flex: 1, overflowY: "auto" }}>
      <Stack sx={{ flexDirection: "row", flexWrap: "wrap", gap: "1px" }}>
        {document &&
          Object.entries(document).map(([v, youTubeOembed]) => (
            <Link
              href={`${youTubeUrl}${v}`}
              sx={{ width: "calc(25% - 1px)", backgroundColor: "#CCCCCC", textDecoration: "none" }}
            >
              <Stack sx={{ aspectRatio: "16/9" }}>
                <Box
                  component="img"
                  src={youTubeOembed.thumbnail_url}
                  alt=""
                  sx={{
                    display: "block",
                    objectFit: "cover",
                    width: "100%",
                    height: "100%"
                  }}
                />
              </Stack>
              <Stack sx={{ p: 2 }}>
                <Typography
                  variant="body2"
                  sx={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    color: "black"
                  }}
                >
                  {youTubeOembed.title}
                </Typography>
              </Stack>
            </Link>
          ))}
      </Stack>
    </Stack>
  );
};

const YouTubeForm = ({ add }: { add: (text: string) => Promise<void> }) => {
  const [text, setText] = useState<string>("");

  const submit = async () => {
    if (text && text.trim().length > 0) {
      await add(text);
      setText("");
    }
  };

  return (
    <Stack sx={{ flexDirection: "row", gap: 2, p: 2, backgroundColor: "#EEEEEE" }}>
      <Stack sx={{ flex: 1, gap: 2 }}>
        <TextInput
          placeholder="YouTube Links"
          value={text}
          onChange={(value) => setText(value)}
          hideHelperText={true}
        />
      </Stack>
      <Stack sx={{}}>
        <PrimaryButton onClick={submit}>Save</PrimaryButton>
      </Stack>
    </Stack>
  );
};

export const YouTube = () => {
  const { document, add } = useYouTube();
  return (
    <Stack sx={{ height: "100%" }}>
      <YouTubeList document={document} />
      <YouTubeForm add={add} />
    </Stack>
  );
};
