import { ReactNode, RefObject, useRef, useState } from "react";
import { Box, Card, CardContent, Divider, Stack, Typography } from "@mui/material";
import { ComponentFolder, folders, useKanban } from "./useKanban";
import { LayoutPanel } from "../../components/LayoutPanel";
import { WCardList } from "../../components/WCardList";

import FolderIcon from "../../assets/images/icons/folder.png";
import FolderSelectedIcon from "../../assets/images/icons/folder_selected.png";
import UpIcon from "../../assets/images/icons/up.png";
import DownIcon from "../../assets/images/icons/down.png";
import { LayoutHeader } from "../../components/LayoutHeader";
import { WButton } from "../../components/WButton";
import Draggable, { DraggableEventHandler } from "react-draggable";

const FolderRow = ({
  folder,
  selectedFolder,
  panelOpened
}: {
  folder: ComponentFolder;
  selectedFolder?: ComponentFolder;
  panelOpened?: boolean;
}) => {
  const mobileRow = panelOpened === true || panelOpened === false;
  return (
    <Stack
      sx={{
        flexDirection: "row",
        py: 2,
        pl: 2,
        pr: mobileRow ? 2 : 0,
        gap: 2,
        boxSizing: "border-box",
        backgroundColor: mobileRow ? "background.default" : "transparent"
      }}
    >
      <Box
        component="img"
        src={folder === selectedFolder ? FolderSelectedIcon : FolderIcon}
        alt=""
        sx={{ width: "24px", height: "24px" }}
      />
      <Stack sx={{ flex: 1, gap: 1, pr: 2 }}>
        <Typography variant="body1">{folder.name}</Typography>
      </Stack>
      {mobileRow && (
        <Box
          component="img"
          src={panelOpened ? UpIcon : DownIcon}
          alt=""
          sx={{ width: "16px", height: "16px", mt: "4px" }}
        />
      )}
    </Stack>
  );
};

export const Dummy = ({ onStop, children }: { onStop: DraggableEventHandler | undefined; children: ReactNode }) => {
  return (
    <Draggable handle=".drag-handle" onStop={onStop}>
      <Card
        // ref={nodeRef}
        sx={{
          // position: "absolute",
          width: "100%",
          boxShadow: 6,
          borderRadius: 2
        }}
        className="drag-handle"
      >
        <CardContent>{children}</CardContent>
      </Card>
    </Draggable>
  );
};

export const MyKan = () => {
  const [data, setData] = useState<
    {
      ref: RefObject<HTMLDivElement>;
      list: string[];
    }[]
  >([
    { ref: useRef<HTMLDivElement>(null), list: ["AAAAA"] },
    { ref: useRef<HTMLDivElement>(null), list: [] },
    { ref: useRef<HTMLDivElement>(null), list: [] },
    { ref: useRef<HTMLDivElement>(null), list: [] }
  ]);

  return (
    <Stack sx={{ flex: 1, flexDirection: "row" }}>
      {data.map(({ ref, list }, index) => (
        <>
          {index !== 0 && <Divider orientation="vertical" />}
          <Stack ref={ref} sx={{ flex: 1, p: 2 }}>
            {list.map((item) => (
              <Dummy
                onStop={(_, { x }) => {
                  const rect = ref.current?.getBoundingClientRect();
                  if (rect) {
                    const a = (x + 16) / rect?.width;
                    if (a > 0.25) {
                      const newData = [...data];
                      newData[index].list = newData[index].list.filter((i) => i !== item);
                      if (index + 1 < newData.length) {
                        newData[index + 1].list.push(item);
                      } else {
                        newData[0].list.push(item);
                      }
                      setData(newData);
                    } else if (a < -0.25) {
                      const newData = [...data];
                      newData[index].list = newData[index].list.filter((i) => i !== item);
                      if (index - 1 >= 0) {
                        newData[index - 1].list.push(item);
                      } else {
                        newData[newData.length - 1].list.push(item);
                      }
                      setData(newData);
                    }
                  }
                }}
              >
                <Typography>{item}</Typography>
              </Dummy>
            ))}
          </Stack>
        </>
      ))}
    </Stack>
  );
};

export const Kanban = () => {
  const { selectedFolder, openFolder } = useKanban();
  const [panelOpened, setPanelOpened] = useState(false);
  const [newItemOpened, setNewItemOpened] = useState(false);

  return (
    <LayoutPanel
      panelOpened={panelOpened}
      setPanelOpened={setPanelOpened}
      width={300}
      panel={
        <>
          <LayoutHeader top={<Typography sx={{ p: 1 }}>Kanban</Typography>} bottom={<Stack sx={{ height: 48 }} />} />
          <WCardList
            items={folders}
            renderContent={(folder) => <FolderRow folder={folder} selectedFolder={selectedFolder} />}
            onContentClick={(folder) => {
              openFolder(folder);
              setPanelOpened(false);
            }}
            renderRightContent={() => <></>}
          />
        </>
      }
      topChildren={
        selectedFolder ? (
          <FolderRow folder={selectedFolder} selectedFolder={selectedFolder} panelOpened={panelOpened} />
        ) : (
          <></>
        )
      }
    >
      <LayoutHeader
        top={<Typography sx={{ p: 1 }}>{selectedFolder?.name}</Typography>}
        bottom={
          <>
            <WButton
              onClick={() => setNewItemOpened(!newItemOpened)}
              sx={{ backgroundColor: "primary.main", height: 48 }}
            >
              New Item
            </WButton>
          </>
        }
      />
      {newItemOpened ? <>Hello World</> : <MyKan />}
    </LayoutPanel>
  );
};
