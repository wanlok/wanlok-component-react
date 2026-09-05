import { useState } from "react";
import { Stack, Typography } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { LayoutHeader, topSx } from "../../../components/LayoutHeader";
import { iconButtonSx, WButton } from "../../../components/WButton";
import { AddProductModal } from "../AddProductModal";

const Top = ({ onAddButtonClick }: { onAddButtonClick: () => void }) => (
  <Stack sx={[topSx]}>
    <Stack sx={{ flex: 1, p: 2, justifyContent: "center" }}>
      <Typography variant="body1">Computer Hardware</Typography>
    </Stack>
    <Stack sx={{ flexDirection: "row", gap: "1px" }}>
      <WButton onClick={onAddButtonClick} sx={iconButtonSx}>
        <AddIcon sx={{ fontSize: 26 }} />
      </WButton>
    </Stack>
  </Stack>
);

export const Index = () => {
  const [addModalOpen, setAddModalOpen] = useState(false);

  return (
    <Stack sx={{ flex: 1, minHeight: 0 }}>
      <LayoutHeader top={<Top onAddButtonClick={() => setAddModalOpen(true)} />} bottom={<></>} />
      <Typography variant="body1">Computer Hardware</Typography>
      <AddProductModal
        key={`add-product-modal-${addModalOpen ? "open" : "closed"}`}
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
      />
    </Stack>
  );
};
