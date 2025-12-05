import { Stack, Typography } from "@mui/material";
import { LayoutHeader, topSx } from "../../components/LayoutHeader";
import { ComponentFolder, useKanban } from "./useKanban";
import { useState } from "react";
import { WText } from "../../components/WText";

const Top = ({
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

const Bottom = () => {
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

export const KanbanHeader = ({
  selectedFolder,
  onAddItemButtonClick
}: {
  selectedFolder: ComponentFolder | undefined;
  onAddItemButtonClick: () => void;
}) => {
  return (
    <LayoutHeader
      top={<Top selectedFolder={selectedFolder} onAddItemButtonClick={onAddItemButtonClick} />}
      bottom={<Bottom />}
    />
  );
};
