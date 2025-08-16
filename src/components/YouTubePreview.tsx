import { useEffect, useState } from "react";
import { Message } from "../pages/discussion/useDiscussion";
import { Card, CardActionArea, CardContent, Stack, Typography } from "@mui/material";

interface YouTubeOembed {
  title: string;
  author_name: string;
  author_url: string;
  thumbnail_url: string;
  thumbnail_width: number;
  thumbnail_height: number;
  html: string;
  width: number;
  height: number;
}

export const YouTubePreview = ({ message }: { message: Message }) => {
  const [youTube, setYouTube] = useState<{ oembed: YouTubeOembed; urlString: string }>();

  const fetchYouTubePreview = async (urlString: string) => {
    try {
      const response = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(urlString)}&format=json`);
      if (response.ok) {
        setYouTube({ oembed: (await response.json()) as YouTubeOembed, urlString });
      }
    } catch (err: any) {}
  };

  useEffect(() => {
    const FULL_YOUTUBE_URL_REGEX =
      /https?:\/\/(?:www\.)?(?:youtube\.com\/(?:watch\?v=[\w-]{11}|embed\/[\w-]{11})|youtu\.be\/[\w-]{11})(?:[^\s]*)?/;

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
              <img src={youTube?.oembed.thumbnail_url} height={youTube?.oembed.height} />
            </Stack>
            <Stack>
              <Typography variant="h6">{youTube?.oembed.title}</Typography>
            </Stack>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
