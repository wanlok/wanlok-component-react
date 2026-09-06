import { useState } from "react";
import { Stack, Typography } from "@mui/material";
import { Add as AddIcon, Close as CloseIcon } from "@mui/icons-material";
import { LayoutHeader, topSx } from "../../../components/LayoutHeader";
import { DeleteConfirmationModal } from "../../../components/DeleteConfirmationModal";
import { EmptyPlaceholder } from "../../../components/EmptyPlaceholder";
import { iconButtonSx, WButton } from "../../../components/WButton";
import { Product } from "../../../services/ApiTypes";
import { AddProductModal } from "../AddProductModal";
import { PriceItem, ProductRow } from "../ProductRow";
import { ProductModal } from "../ProductModal";
import { useSupermarkets } from "./useSupermarkets";

const getPrices = (urls: Record<string, Product>): PriceItem[] =>
  Object.entries(urls).map(([url, product]) => {
    const latestPrice = product.prices[product.prices.length - 1]?.price;
    return { price: latestPrice, line1: product.seller, url };
  });

const Top = ({
  onAddButtonClick,
  deleteModeActivated,
  onDeleteModeButtonClick
}: {
  onAddButtonClick: () => void;
  deleteModeActivated: boolean;
  onDeleteModeButtonClick: () => void;
}) => (
  <Stack sx={[topSx]}>
    <Stack sx={{ flex: 1, p: 2, justifyContent: "center" }}>
      <Typography variant="body1">Supermarkets</Typography>
    </Stack>
    <Stack sx={{ flexDirection: "row", gap: "1px" }}>
      <WButton onClick={onAddButtonClick} sx={iconButtonSx}>
        <AddIcon sx={{ fontSize: 26 }} />
      </WButton>
      <WButton isActivated={deleteModeActivated} onClick={onDeleteModeButtonClick} sx={iconButtonSx}>
        <CloseIcon sx={{ fontSize: 24 }} />
      </WButton>
    </Stack>
  </Stack>
);

export const Index = () => {
  const { products, deleteProduct } = useSupermarkets();
  const productEntries = Object.entries(products).sort(([a], [b]) => a.localeCompare(b));
  const empty = productEntries.length === 0;
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [controlGroupState, setControlGroupState] = useState(0);
  const effectiveControlGroupState = empty ? 0 : controlGroupState;
  const [productToDelete, setProductToDelete] = useState<{ name: string }>();
  const [selectedProductName, setSelectedProductName] = useState<string>();

  return (
    <Stack sx={{ flex: 1, minWidth: 0, minHeight: 0 }}>
      <LayoutHeader
        top={
          <Top
            onAddButtonClick={() => setAddModalOpen(true)}
            deleteModeActivated={effectiveControlGroupState === 1}
            onDeleteModeButtonClick={() => setControlGroupState(effectiveControlGroupState === 1 ? 0 : 1)}
          />
        }
        bottom={<></>}
      />
      {empty ? (
        <EmptyPlaceholder text="No products" />
      ) : (
        <Stack sx={{ flex: 1, overflow: "auto", backgroundColor: "common.white" }}>
          {productEntries.map(([name, urls]) => (
            <ProductRow
              key={name}
              title={name}
              subtitle=""
              prices={getPrices(urls)}
              deleteMode={effectiveControlGroupState === 1}
              onClick={() => setSelectedProductName(name)}
              onDeleteButtonClick={() => setProductToDelete({ name })}
            />
          ))}
        </Stack>
      )}
      <AddProductModal
        key={`add-product-modal-${addModalOpen ? "open" : "closed"}`}
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
      />
      {selectedProductName && (
        <ProductModal
          key={`product-modal-${selectedProductName}`}
          open={!!selectedProductName}
          onClose={() => setSelectedProductName(undefined)}
          type="supermarkets"
          name={selectedProductName}
        />
      )}
      <DeleteConfirmationModal
        open={!!productToDelete}
        title="Delete Product"
        name={productToDelete?.name}
        onClose={() => setProductToDelete(undefined)}
        onConfirm={() => {
          if (productToDelete) {
            deleteProduct(productToDelete.name);
            setControlGroupState(0);
          }
        }}
      />
    </Stack>
  );
};
