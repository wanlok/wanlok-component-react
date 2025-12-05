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
import { WText } from "../../components/WText";
import { KanbanLayout } from "./KanbanLayout";
import { KanbanHeader } from "./KanbanHeader";
import { WModal } from "../../components/WModal";
import { TextInput } from "../../components/TextInput";
import { WButton } from "../../components/WButton";

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

const KanbanHeaderTop = ({
  selectedFolder,
  onAddItemButtonClick
}: {
  selectedFolder: ComponentFolder | undefined;
  onAddItemButtonClick: () => void;
}) => {
  const [editable, setEditable] = useState(false);
  return (
    <Stack sx={[topSx, { height: 55 }]}>
      <Stack sx={{ flex: 1 }}>
        <WText
          text={selectedFolder?.name}
          editable={editable}
          placeholder="Dummy"
          rightButtons={
            editable
              ? [
                  { label: "Save", onClick: () => {} },
                  { label: "Cancel", onClick: () => setEditable(false) }
                ]
              : [
                  { label: "Change Name", onClick: () => setEditable(true) },
                  { label: "Add Item", onClick: onAddItemButtonClick }
                ]
          }
        />
      </Stack>
    </Stack>
  );
};

const KanbanHeaderBottom = () => {
  const { columns } = useKanban();
  return (
    <Stack sx={{ flex: 1, flexDirection: "row", gap: "1px" }}>
      {columns.map(({ name }) => {
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
            <Typography variant="body1">{name}</Typography>
          </Stack>
        );
      })}
    </Stack>
  );
};

export const Kanban = () => {
  const { selectedFolder, openFolder, addItem } = useKanban();
  const [panelOpened, setPanelOpened] = useState(false);
  const [opened, setOpened] = useState(false);
  return (
    <LayoutPanel
      panelOpened={panelOpened}
      setPanelOpened={setPanelOpened}
      width={300}
      panel={
        <>
          <KanbanHeader onCreateButtonClick={() => setOpened(true)} />
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
        top={<KanbanHeaderTop selectedFolder={selectedFolder} onAddItemButtonClick={addItem} />}
        bottom={<KanbanHeaderBottom />}
      />
      <KanbanLayout />
      <WModal open={opened} onClose={() => setOpened(false)}>
        <WText text="Attributes" editable={false} rightButtons={[]} />
        <Stack sx={{ flexDirection: "row", backgroundColor: "background.default" }}>
          <Stack sx={{ flex: 1 }}>
            <TextInput
              label="Hello World"
              value={"Hello World"}
              onChange={(value) => {
                // const newAttributes = [...attributes];
                // newAttributes[i].name = value;
                // setAttributes(newAttributes);
              }}
              hideHelperText={true}
              inputPropsSx={{ flex: 1 }}
            />
          </Stack>
        </Stack>
        <WButton>Save</WButton>
      </WModal>
    </LayoutPanel>
  );
};
