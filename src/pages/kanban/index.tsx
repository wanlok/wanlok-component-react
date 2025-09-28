import { useState } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { ComponentFolder, folders, useKanban } from "./useKanban";
import { LayoutPanel } from "../../components/LayoutPanel";
import { WCardList } from "../../components/WCardList";

import FolderIcon from "../../assets/images/icons/folder.png";
import FolderSelectedIcon from "../../assets/images/icons/folder_selected.png";
import UpIcon from "../../assets/images/icons/up.png";
import DownIcon from "../../assets/images/icons/down.png";
import { LayoutHeader, topSx } from "../../components/LayoutHeader";
import { KanbanLayout } from "./KanbanLayout";
import { WText } from "../../components/WText";

export interface ColumnData {
  name: string;
  list: string[];
}

const data = [
  { name: "To Do", list: ["AAAAA"] },
  { name: "In Progress", list: ["BBBBB", "CCCCC"] },
  { name: "Ready To Deploy", list: ["DDDDD", "EEEEE"] },
  { name: "Done", list: ["FFFFF"] }
];

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

const KanbanHeaderTop = ({ selectedFolder }: { selectedFolder: ComponentFolder | undefined }) => {
  return (
    <Stack sx={[topSx, { height: 55 }]}>
      <Stack sx={{ flex: 1 }}>
        <WText
          text={selectedFolder?.name}
          placeholder="Dummy"
          rightButtons={[
            { label: "Add", onClick: () => {} },
            { label: "Add", onClick: () => {} }
          ]}
        />
      </Stack>
    </Stack>
  );
};

const KanbanHeaderBottom = () => {
  return (
    <Stack sx={{ flex: 1, flexDirection: "row", gap: "1px" }}>
      {data.map(({ name }) => {
        return (
          <Stack
            sx={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "common.black",
              color: "common.white",
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16
            }}
          >
            <Typography>{name}</Typography>
          </Stack>
        );
      })}
      {/* <WButton
              onClick={() => setNewItemOpened(!newItemOpened)}
              sx={{ backgroundColor: "primary.main", height: 48 }}
            >
              New Item
            </WButton> */}
    </Stack>
  );
};

export const Kanban = () => {
  const { selectedFolder, openFolder } = useKanban();
  const [panelOpened, setPanelOpened] = useState(false);
  const [newItemOpened] = useState(false);

  return (
    <LayoutPanel
      panelOpened={panelOpened}
      setPanelOpened={setPanelOpened}
      width={300}
      panel={
        <>
          <LayoutHeader
            top={
              <Stack sx={[topSx, { px: 1 }]}>
                <Typography variant="body1">Kanban</Typography>
              </Stack>
            }
            bottom={<></>}
          />
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
      <LayoutHeader top={<KanbanHeaderTop selectedFolder={selectedFolder} />} bottom={<KanbanHeaderBottom />} />
      {newItemOpened ? <>Hello World</> : <KanbanLayout data={data} />}
    </LayoutPanel>
  );
};
