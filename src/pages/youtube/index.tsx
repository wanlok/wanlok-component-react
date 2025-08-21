import { Box, Link, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useYouTube, YouTubeDocument, youTubeUrl } from "./useYouTube";
import { TextInputForm } from "../../components/TextInputForm";
import { CardItem, CardList } from "../../components/CardList";
import { useState } from "react";
import CallOfDutyImage from "../../assets/images/call-of-duty.jpg";

const YouTubeList = ({ document }: { document: YouTubeDocument | undefined }) => {
  const { breakpoints } = useTheme();
  const mobile = useMediaQuery(breakpoints.down("md"));
  return (
    <Stack sx={{ flex: 1, overflowY: "auto" }}>
      <Stack sx={{ flexDirection: "row", flexWrap: "wrap", gap: "1px" }}>
        {document &&
          Object.entries(document).map(([v, youTubeOembed], index) => (
            <Link
              key={`youtube-${index}`}
              href={`${youTubeUrl}${v}`}
              sx={{ width: mobile ? "100%" : "calc(25% - 1px)", backgroundColor: "#000000", textDecoration: "none" }}
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
                    color: "#FFFFFF",
                    fontSize: 16
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

const categories: CardItem[] = [
  {
    id: "call-of-duty",
    name: "Call of Duty",
    image: CallOfDutyImage
  },
  {
    id: "diablo",
    name: "Diablo",
    image: CallOfDutyImage
  },
  {
    id: "gundam",
    name: "Gundam",
    image: CallOfDutyImage
  },
  {
    id: "pokemon",
    name: "Pokemon",
    image: CallOfDutyImage
  },
  {
    id: "football",
    name: "Football",
    image: CallOfDutyImage
  },
  {
    id: "hong-kong",
    name: "Hong Kong",
    image: CallOfDutyImage
  },
  {
    id: "japan",
    name: "Japan",
    image: CallOfDutyImage
  },
  {
    id: "programming",
    name: "Programming",
    image: CallOfDutyImage
  }
];

const DummyList = ({ onItemClick }: { onItemClick: (item: CardItem) => void }) => {
  return (
    <CardList
      width={400}
      items={categories}
      renderItem={(item) => (
        <Stack sx={{ flexDirection: "row", gap: 2 }}>
          <Stack sx={{ flex: 1, p: 2, justifyContent: "center" }}>
            <Typography variant="h6">{item.name}</Typography>
          </Stack>
          <Box
            component="img"
            src={item.image}
            alt=""
            sx={{
              display: "block",
              objectFit: "cover",
              height: 100,
              aspectRatio: "16/9"
            }}
          />
        </Stack>
      )}
      onItemClick={onItemClick}
    />
  );
};

export const YouTube = () => {
  const [category, setCategory] = useState(categories[0]);
  const { document, add, exportUrls } = useYouTube(category.id);
  return (
    <Stack sx={{ height: "100%", flexDirection: "row", gap: "1px" }}>
      <DummyList onItemClick={(item) => setCategory(item)} />
      <Stack sx={{ flex: 1 }}>
        <YouTubeList document={document} />
        <TextInputForm
          placeholder="YouTube Links"
          rightButtons={[
            {
              label: "Add",
              onClickWithText: async (text) => await add(text)
            },
            {
              label: "Export",
              onClick: exportUrls
            }
          ]}
        />
      </Stack>
    </Stack>
  );
};
