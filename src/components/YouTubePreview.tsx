import { useEffect, useState } from "react";
import { Message } from "../pages/discussion/useDiscussion";
import { Card, CardActionArea, CardContent, Stack, Typography } from "@mui/material";
import { YouTubeOEmbed } from "../common/Bookmark";

const FULL_YOUTUBE_URL_REGEX =
  /https?:\/\/(?:www\.)?(?:youtube\.com\/(?:watch\?v=[\w-]{11}|embed\/[\w-]{11})|youtu\.be\/[\w-]{11})(?:[^\s]*)?/;

export const YouTubePreview = ({ message }: { message: Message }) => {
  const [youTube, setYouTube] = useState<{ oEmbed: YouTubeOEmbed; urlString: string }>();

  const fetchYouTubePreview = async (urlString: string) => {
    try {
      const response = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(urlString)}&format=json`);
      if (response.ok) {
        setYouTube({ oEmbed: (await response.json()) as YouTubeOEmbed, urlString });
      }
    } catch (err: any) {}
  };

  useEffect(() => {
    function extractYouTubeUrl(text: string): string | null {
      const match = text.match(FULL_YOUTUBE_URL_REGEX);
      return match ? match[0] : null;
    }

    const urlString = extractYouTubeUrl(message.lines);

    if (urlString) {
      fetchYouTubePreview(urlString);
    }
  }, [message]);

  return (
    <Card elevation={0} sx={{ borderRadius: 0, mt: 2 }}>
      <CardActionArea onClick={() => window.open(youTube?.urlString, "_blank")}>
        <CardContent>
          <Stack sx={{ flexDirection: "row", gap: 2 }}>
            <Stack>
              <img src={youTube?.oEmbed.thumbnail_url} height={youTube?.oEmbed.height} alt="" />
            </Stack>
            <Stack sx={{ justifyContent: "center" }}>
              <Typography variant="h6">{youTube?.oEmbed.title}</Typography>
            </Stack>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
