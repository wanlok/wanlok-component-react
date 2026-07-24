import { Stack } from "@mui/material";
import {
  Api as ApiIcon,
  Close as CloseIcon,
  Download as DownloadIcon,
  Edit as EditIcon,
  Undo as UndoIcon,
  SwapHoriz as SwapHorizIcon,
  ViewList as ViewListIcon
} from "@mui/icons-material";
import { iconButtonSx, WButton } from "../../components/WButton";
import { OneLineTypography } from "../../components/OneLineTypography";
import { Folder } from "../../services/Types";
import { toSlug } from "../../common/StringUtils";
import { SelectInput } from "../../components/SelectInput";
import { bottomSx, LayoutHeader, topSx } from "../../components/LayoutHeader";
import { StyledContainer } from "../../components/StyledContainer";

const Top = ({
  isLoading,
  folder,
  resetButtonHidden,
  onEditAttributeButtonClick,
  onResetButtonClick,
  onDownloadButtonClick
}: {
  isLoading: boolean;
  folder: Folder | undefined;
  resetButtonHidden: boolean;
  onEditAttributeButtonClick: () => void;
  onResetButtonClick: () => void;
  onDownloadButtonClick: () => void;
}) => (
  <Stack sx={[topSx]}>
    <Stack sx={{ flex: 1, minWidth: 0, justifyContent: "center", px: 2 }}>
      <OneLineTypography variant="body1">{folder ? folder.name : ""}</OneLineTypography>
    </Stack>
    {folder && !isLoading && (
      <Stack sx={{ flexDirection: "row", gap: "1px" }}>
        <WButton onClick={onEditAttributeButtonClick} rightIcon={<EditIcon sx={{ fontSize: 18 }} />}>
          Edit Attributes
        </WButton>
        {!resetButtonHidden && (
          <WButton onClick={onResetButtonClick} rightIcon={<UndoIcon sx={{ fontSize: 20 }} />}>
            Reset Order
          </WButton>
        )}
        <WButton onClick={onDownloadButtonClick} rightIcon={<DownloadIcon sx={{ fontSize: 24 }} />}>
          Export
        </WButton>
        <WButton
          onClick={() => window.open(`#/api/collections/${toSlug(folder.name)}`, "_blank")}
          rightIcon={<ApiIcon sx={{ fontSize: 24 }} />}
        >
          API
        </WButton>
      </Stack>
    )}
  </Stack>
);

const Bottom = ({
  controlGroupState,
  attributeKeys,
  attributeValues,
  selectedAttributeKey,
  selectedAttributeValue,
  onAttributeKeyChange,
  onAttributeValueChange,
  onAttributeButtonClick,
  onDeleteButtonClick,
  onRearrangeButtonClick
}: {
  controlGroupState: number;
  attributeKeys: { label: string; value: string }[];
  attributeValues: { label: string; value: string }[];
  selectedAttributeKey: string;
  selectedAttributeValue: string;
  onAttributeKeyChange: (value: string) => void;
  onAttributeValueChange: (value: string) => void;
  onAttributeButtonClick: () => void;
  onDeleteButtonClick: () => void;
  onRearrangeButtonClick: () => void;
}) => {
  return (
    <Stack sx={[bottomSx]}>
      <StyledContainer sx={{ flex: 1, flexDirection: "row", p: 1, gap: 1 }}>
        <Stack sx={{ flex: 1 }}>
          <SelectInput items={attributeKeys} value={selectedAttributeKey} onChange={onAttributeKeyChange} />
        </Stack>
        {selectedAttributeKey && (
          <Stack sx={{ flex: 1 }}>
            <SelectInput items={attributeValues} value={selectedAttributeValue} onChange={onAttributeValueChange} />
          </Stack>
        )}
      </StyledContainer>
      <Stack sx={{ flexDirection: "row", gap: 1 }}>
        <Stack sx={{ flexDirection: "row", gap: "1px" }}>
          <WButton
            onClick={onAttributeButtonClick}
            sx={
              controlGroupState === 1
                ? { ...iconButtonSx, backgroundColor: "common.black", "&:hover": { backgroundColor: "common.black" } }
                : iconButtonSx
            }
          >
            <ViewListIcon sx={{ fontSize: 24, color: controlGroupState === 1 ? "common.white" : "inherit" }} />
          </WButton>
          <WButton
            disabled={Boolean(selectedAttributeValue)}
            onClick={onRearrangeButtonClick}
            sx={
              controlGroupState === 3
                ? { ...iconButtonSx, backgroundColor: "common.black", "&:hover": { backgroundColor: "common.black" } }
                : iconButtonSx
            }
          >
            <SwapHorizIcon sx={{ fontSize: 26, color: controlGroupState === 3 ? "common.white" : "inherit" }} />
          </WButton>
          <WButton
            onClick={onDeleteButtonClick}
            sx={
              controlGroupState === 2
                ? { ...iconButtonSx, backgroundColor: "common.black", "&:hover": { backgroundColor: "common.black" } }
                : iconButtonSx
            }
          >
            <CloseIcon sx={{ fontSize: 24, color: controlGroupState === 2 ? "common.white" : "inherit" }} />
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
  attributeKeys,
  attributeValues,
  selectedAttributeKey,
  selectedAttributeValue,
  onAttributeKeyChange,
  onAttributeValueChange,
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
  attributeKeys: { label: string; value: string }[];
  attributeValues: { label: string; value: string }[];
  selectedAttributeKey: string;
  selectedAttributeValue: string;
  onAttributeKeyChange: (value: string) => void;
  onAttributeValueChange: (value: string) => void;
  onAttributeButtonClick: () => void;
  onEditAttributeButtonClick: () => void;
  onDeleteButtonClick: () => void;
  onRearrangeButtonClick: () => void;
  onResetButtonClick: () => void;
  onDownloadButtonClick: () => void;
}) => (
  <LayoutHeader
    top={
      <Top
        isLoading={isLoading}
        folder={folder}
        resetButtonHidden={resetButtonHidden}
        onEditAttributeButtonClick={onEditAttributeButtonClick}
        onResetButtonClick={onResetButtonClick}
        onDownloadButtonClick={onDownloadButtonClick}
      />
    }
    bottom={
      isLoading || !folder ? (
        <></>
      ) : (
        <Bottom
          controlGroupState={controlGroupState}
          attributeKeys={attributeKeys}
          attributeValues={attributeValues}
          selectedAttributeKey={selectedAttributeKey}
          selectedAttributeValue={selectedAttributeValue}
          onAttributeKeyChange={onAttributeKeyChange}
          onAttributeValueChange={onAttributeValueChange}
          onAttributeButtonClick={onAttributeButtonClick}
          onDeleteButtonClick={onDeleteButtonClick}
          onRearrangeButtonClick={onRearrangeButtonClick}
        />
      )
    }
  />
);
