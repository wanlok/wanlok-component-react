import { Stack } from "@mui/material";
import {
  Close as CloseIcon,
  Download as DownloadIcon,
  Edit as EditIcon,
  Undo as UndoIcon,
  SwapHoriz as SwapHorizIcon
} from "@mui/icons-material";
import { iconButtonSx, WButton } from "../../components/WButton";
import { OneLineTypography } from "../../components/OneLineTypography";
import { Folder } from "../../services/Types";
import { SelectInput } from "../../components/SelectInput";
import { bottomSx, LayoutHeader, topSx } from "../../components/LayoutHeader";
import { StyledContainer } from "../../components/StyledContainer";

const Top = ({
  isLoading,
  folder,
  resetButtonHidden,
  controlGroupState,
  selectedAttributeValue,
  onEditFolderButtonClick,
  onResetButtonClick,
  onRearrangeButtonClick,
  onDownloadButtonClick,
  onDeleteButtonClick
}: {
  isLoading: boolean;
  folder: Folder | undefined;
  resetButtonHidden: boolean;
  controlGroupState: number;
  selectedAttributeValue: string;
  onEditFolderButtonClick: () => void;
  onResetButtonClick: () => void;
  onRearrangeButtonClick: () => void;
  onDownloadButtonClick: () => void;
  onDeleteButtonClick: () => void;
}) => (
  <Stack sx={[topSx]}>
    <Stack sx={{ flex: 1, minWidth: 0, justifyContent: "center", px: 2 }}>
      <OneLineTypography variant="body1">{folder ? folder.name : ""}</OneLineTypography>
    </Stack>
    {folder && !isLoading && (
      <Stack sx={{ flexDirection: "row", gap: "1px" }}>
        <WButton onClick={onDownloadButtonClick} sx={iconButtonSx}>
          <DownloadIcon sx={{ fontSize: 24 }} />
        </WButton>
        {!resetButtonHidden && (
          <WButton onClick={onResetButtonClick} sx={iconButtonSx}>
            <UndoIcon sx={{ fontSize: 20 }} />
          </WButton>
        )}
        <WButton
          isActivated={controlGroupState === 2}
          disabled={Boolean(selectedAttributeValue)}
          onClick={onRearrangeButtonClick}
          sx={iconButtonSx}
        >
          <SwapHorizIcon sx={{ fontSize: 26 }} />
        </WButton>
        <WButton onClick={onEditFolderButtonClick} sx={iconButtonSx}>
          <EditIcon sx={{ fontSize: 18 }} />
        </WButton>
        <WButton isActivated={controlGroupState === 3} onClick={onDeleteButtonClick} sx={iconButtonSx}>
          <CloseIcon sx={{ fontSize: 24 }} />
        </WButton>
      </Stack>
    )}
  </Stack>
);

const Bottom = ({
  attributeKeys,
  attributeValues,
  selectedAttributeKey,
  selectedAttributeValue,
  onAttributeKeyChange,
  onAttributeValueChange
}: {
  attributeKeys: { label: string; value: string }[];
  attributeValues: { label: string; value: string }[];
  selectedAttributeKey: string;
  selectedAttributeValue: string;
  onAttributeKeyChange: (value: string) => void;
  onAttributeValueChange: (value: string) => void;
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
  onEditFolderButtonClick,
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
  onEditFolderButtonClick: () => void;
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
        controlGroupState={controlGroupState}
        selectedAttributeValue={selectedAttributeValue}
        onEditFolderButtonClick={onEditFolderButtonClick}
        onResetButtonClick={onResetButtonClick}
        onRearrangeButtonClick={onRearrangeButtonClick}
        onDownloadButtonClick={onDownloadButtonClick}
        onDeleteButtonClick={onDeleteButtonClick}
      />
    }
    bottom={
      isLoading || !folder ? (
        <></>
      ) : (
        <Bottom
          attributeKeys={attributeKeys}
          attributeValues={attributeValues}
          selectedAttributeKey={selectedAttributeKey}
          selectedAttributeValue={selectedAttributeValue}
          onAttributeKeyChange={onAttributeKeyChange}
          onAttributeValueChange={onAttributeValueChange}
        />
      )
    }
  />
);
