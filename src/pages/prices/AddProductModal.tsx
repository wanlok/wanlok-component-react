import { Alert, CircularProgress, Divider, Stack } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { StyledContainer } from "../../components/StyledContainer";
import { TextInput } from "../../components/TextInput";
import { WModal } from "../../components/WModal";
import { YesNoButtons } from "../../components/YesNoButtons";
import { MetaItem } from "../../components/MetaItem";
import { useAddProductModal } from "./useAddProductModal";
import { WButton } from "../../components/WButton";

export const AddProductModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const { url, onUrlChange, product, isLoading, error, onSearchButtonClick, onNameChange, onSaveButtonClick } =
    useAddProductModal();

  return (
    <WModal
      open={open}
      onClose={onClose}
      pages={[{ icon: <AddIcon sx={{ fontSize: 26, mt: -0.1 }} />, label: "Add Product" }]}
      bottom={
        <YesNoButtons
          yesLabel="Save"
          yesDisabled={!product?.name || !url}
          onYesClick={async () => {
            const result = await onSaveButtonClick();
            if (!result.error) {
              onClose();
            }
          }}
          noLabel="Cancel"
          onNoClick={onClose}
        />
      }
    >
      <Stack sx={{ gap: 2, p: 2 }}>
        <Stack sx={{ gap: 2 }}>
          <StyledContainer isError={!!error} sx={{ p: 1 }}>
            <TextInput label="URL" value={url} onChange={onUrlChange} inputSx={{ flex: 1 }} />
          </StyledContainer>
          <Stack sx={{ height: 40 }}>
            <WButton disabled={!url || isLoading} onClick={onSearchButtonClick} sx={{ flex: 1 }}>
              {isLoading ? <CircularProgress size={16} sx={{ color: "text.primary" }} /> : "Search"}
            </WButton>
          </Stack>
          {!isLoading && product && (
            <>
              <Divider />
              <StyledContainer sx={{ p: 1 }}>
                <TextInput label="Name" value={product.name} onChange={onNameChange} inputSx={{ flex: 1 }} />
              </StyledContainer>
              <MetaItem title="Price" value={`$${product.price.toFixed(2)}`} hideDivider />
            </>
          )}
        </Stack>
        {error && (
          <Alert severity="error" sx={{ borderRadius: 0 }}>
            {error}
          </Alert>
        )}
      </Stack>
    </WModal>
  );
};
