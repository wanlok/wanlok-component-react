import { Stack, Typography } from "@mui/material";
import {
  Close as CloseIcon,
  Download as DownloadIcon,
  Edit as EditIcon,
  Undo as UndoIcon,
  SwapHoriz as SwapHorizIcon,
  ViewList as ViewListIcon
} from "@mui/icons-material";
import { iconButtonSx, WButton } from "../../components/WButton";
import { Folder } from "../../services/Types";
import { SelectInput } from "../../components/SelectInput";
import { bottomSx, LayoutHeader, topSx } from "../../components/LayoutHeader";

const Top = ({ folder }: { folder: Folder | undefined }) => (
  <Stack sx={[topSx, { alignItems: "center", px: 2 }]}>
    <Typography variant="body1" sx={{ flex: 1 }}>
      {folder ? folder.name : ""}
    </Typography>
  </Stack>
);

const Bottom = ({
  resetButtonHidden,
  controlGroupState,
  items,
  selectedCategory,
  onCategoryChange,
  onAttributeButtonClick,
  onEditAttributeButtonClick,
  onDeleteButtonClick,
  onRearrangeButtonClick,
  onResetButtonClick,
  onDownloadButtonClick
}: {
  resetButtonHidden: boolean;
  controlGroupState: number;
  items: { label: string; value: string }[];
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  onAttributeButtonClick: () => void;
  onEditAttributeButtonClick: () => void;
  onDeleteButtonClick: () => void;
  onRearrangeButtonClick: () => void;
  onResetButtonClick: () => void;
  onDownloadButtonClick: () => void;
}) => {
  return (
    <Stack sx={[bottomSx]}>
      <Stack sx={{ flex: 1, justifyContent: "center", p: 1 }}>
        <SelectInput items={items} value={selectedCategory} onChange={onCategoryChange} />
      </Stack>
      <Stack sx={{ flexDirection: "row", gap: 1 }}>
        <Stack sx={{ flexDirection: "row", gap: "1px" }}>
          <Stack sx={{ flexDirection: "row" }}>
            {controlGroupState === 1 && (
              <WButton onClick={onEditAttributeButtonClick} sx={{ ...iconButtonSx, backgroundColor: "common.black" }}>
                <EditIcon sx={{ fontSize: 18, color: "common.white" }} />
              </WButton>
            )}
            <WButton
              onClick={onAttributeButtonClick}
              rightIcon={<ViewListIcon sx={{ fontSize: 24 }} />}
              sx={controlGroupState === 1 ? { pt: "4px", borderBottom: "black solid 4px" } : {}}
            >
              Attributes
            </WButton>
          </Stack>
          <Stack sx={{ flexDirection: "row" }}>
            {controlGroupState === 3 && !resetButtonHidden && (
              <WButton onClick={onResetButtonClick} sx={{ ...iconButtonSx, backgroundColor: "common.black" }}>
                <UndoIcon sx={{ fontSize: 20, color: "common.white" }} />
              </WButton>
            )}
            <WButton
              disabled={Boolean(selectedCategory)}
              onClick={onRearrangeButtonClick}
              rightIcon={<SwapHorizIcon sx={{ fontSize: 26 }} />}
              sx={controlGroupState === 3 && !resetButtonHidden ? { pt: "4px", borderBottom: "black solid 4px" } : {}}
            >
              Rearrange
            </WButton>
          </Stack>
          <WButton onClick={onDeleteButtonClick} rightIcon={<CloseIcon sx={{ fontSize: 24 }} />}>
            Delete
          </WButton>
          <WButton onClick={onDownloadButtonClick} rightIcon={<DownloadIcon sx={{ fontSize: 24 }} />}>
            Download
          </WButton>
        </Stack>
      </Stack>
    </Stack>
  );
};

export const RightHeader = ({
  isLoading,
  folder,
  resetButtonHidden,
  controlGroupState,
  items,
  selectedCategory,
  onCategoryChange,
  onAttributeButtonClick,
  onEditAttributeButtonClick,
  onDeleteButtonClick,
  onRearrangeButtonClick,
  onResetButtonClick,
  onDownloadButtonClick
}: {
  isLoading: boolean;
  folder: Folder | undefined;
  resetButtonHidden: boolean;
  controlGroupState: number;
  items: { label: string; value: string }[];
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  onAttributeButtonClick: () => void;
  onEditAttributeButtonClick: () => void;
  onDeleteButtonClick: () => void;
  onRearrangeButtonClick: () => void;
  onResetButtonClick: () => void;
  onDownloadButtonClick: () => void;
}) => (
  <LayoutHeader
    top={<Top folder={folder} />}
    bottom={
      isLoading ? (
        <></>
      ) : (
        <Bottom
          resetButtonHidden={resetButtonHidden}
          controlGroupState={controlGroupState}
          items={items}
          selectedCategory={selectedCategory}
          onCategoryChange={onCategoryChange}
          onAttributeButtonClick={onAttributeButtonClick}
          onEditAttributeButtonClick={onEditAttributeButtonClick}
          onDeleteButtonClick={onDeleteButtonClick}
          onRearrangeButtonClick={onRearrangeButtonClick}
          onResetButtonClick={onResetButtonClick}
          onDownloadButtonClick={onDownloadButtonClick}
        />
      )
    }
  />
);
