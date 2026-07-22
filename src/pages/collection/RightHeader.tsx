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
import { StyledContainer } from "../../components/StyledContainer";

const Top = ({ folder, onDownloadButtonClick }: { folder: Folder | undefined; onDownloadButtonClick: () => void }) => (
  <Stack sx={[topSx]}>
    <Stack sx={{ flex: 1, justifyContent: "center", px: 2 }}>
      <Typography variant="body1">{folder ? folder.name : ""}</Typography>
    </Stack>
    {folder && (
      <WButton onClick={onDownloadButtonClick} sx={iconButtonSx}>
        <DownloadIcon sx={{ fontSize: 24 }} />
      </WButton>
    )}
  </Stack>
);

const Bottom = ({
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
  onResetButtonClick
}: {
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
              disabled={Boolean(selectedAttributeValue)}
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
    top={<Top folder={folder} onDownloadButtonClick={onDownloadButtonClick} />}
    bottom={
      isLoading || !folder ? (
        <></>
      ) : (
        <Bottom
          resetButtonHidden={resetButtonHidden}
          controlGroupState={controlGroupState}
          attributeKeys={attributeKeys}
          attributeValues={attributeValues}
          selectedAttributeKey={selectedAttributeKey}
          selectedAttributeValue={selectedAttributeValue}
          onAttributeKeyChange={onAttributeKeyChange}
          onAttributeValueChange={onAttributeValueChange}
          onAttributeButtonClick={onAttributeButtonClick}
          onEditAttributeButtonClick={onEditAttributeButtonClick}
          onDeleteButtonClick={onDeleteButtonClick}
          onRearrangeButtonClick={onRearrangeButtonClick}
          onResetButtonClick={onResetButtonClick}
        />
      )
    }
  />
);
