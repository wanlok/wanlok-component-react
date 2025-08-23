import { Box, Link, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useYouTube, YouTubeDocument, youTubeUrl } from "./useYouTube";
import { TextInputForm } from "../../components/TextInputForm";
import { CardItem, CardList } from "../../components/CardList";
import { useState } from "react";
import CallOfDutyImage from "../../assets/images/call-of-duty.jpg";
import { LayoutPanel } from "../../components/LayoutPanel";

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
    id: "war",
    name: "War",
    image: CallOfDutyImage
  },
  {
    id: "programming",
    name: "Programming",
    image: CallOfDutyImage
  }
];

const CardContent = ({ item }: { item: CardItem }) => {
  return (
    <Stack sx={{ flexDirection: "row", gap: 2 }}>
      <Stack sx={{ flex: 1, p: 2, justifyContent: "center" }}>
        <Typography sx={{ fontSize: 16 }}>{item.name}</Typography>
      </Stack>
    </Stack>
  );
};

export const YouTube = () => {
  const [category, setCategory] = useState(categories[0]);
  const { document, add, exportUrls } = useYouTube(category.id);
  const [panelOpened, setPanelOpened] = useState(false);
  return (
    <LayoutPanel
      panelOpened={panelOpened}
      setPanelOpened={setPanelOpened}
      width={240}
      panel={
        <CardList
          items={categories}
          renderItem={(item) => <CardContent item={item} />}
          onItemClick={(item) => {
            item && setCategory(item);
            setPanelOpened(false);
          }}
        />
      }
      mobilePanel={<CardContent item={category} />}
    >
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
    </LayoutPanel>
  );
};
