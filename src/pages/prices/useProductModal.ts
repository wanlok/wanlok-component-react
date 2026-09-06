import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ApiResponse, apiUrl, Product, ProductType } from "../../services/ApiTypes";

export const useProductModal = ({
  type,
  name,
  sellers
}: {
  type: ProductType;
  name: string;
  sellers: Record<string, Product>;
}) => {
  const queryClient = useQueryClient();
  const [newName, setNewName] = useState(name);
  const [selectedUrl, setSelectedUrl] = useState(Object.keys(sellers)[0] ?? "");
  const [isUpdatingPrice, setIsUpdatingPrice] = useState(false);
  const prices = sellers[selectedUrl]?.prices ?? [];
  const lastUpdatedDate = prices.length > 0 ? prices[prices.length - 1].datetime.split("T")[0] : undefined;
  const lowest = prices.length > 0 ? prices.reduce((a, b) => (b.price < a.price ? b : a)) : undefined;
  const highest = prices.length > 0 ? prices.reduce((a, b) => (b.price > a.price ? b : a)) : undefined;
  const priceValues = prices.map((price) => price.price);
  const minPrice = priceValues.length > 0 ? Math.min(...priceValues) : undefined;
  const maxPrice = priceValues.length > 0 ? Math.max(...priceValues) : undefined;
  const pricePadding = minPrice !== undefined && maxPrice !== undefined ? (maxPrice - minPrice) * 0.8 || 1 : 0;

  const onSaveButtonClick = async () => {
    const response = await fetch(`${apiUrl}/products`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, name, newName })
    });
    const result = (await response.json()) as ApiResponse<Record<string, Record<string, Product>>>;
    if (result.status === "ok") {
      queryClient.setQueryData(["products", type], result.data);
    }
  };

  const onUpdatePriceButtonClick = async () => {
    setIsUpdatingPrice(true);
    const response = await fetch(`${apiUrl}/products`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, name })
    });
    const result = (await response.json()) as ApiResponse<Record<string, Record<string, Product>>>;
    if (result.status === "ok") {
      queryClient.setQueryData(["products", type], result.data);
    }
    setIsUpdatingPrice(false);
  };

  return {
    newName,
    onNewNameChange: setNewName,
    selectedUrl,
    onSelectedUrlChange: setSelectedUrl,
    isUpdatingPrice,
    prices,
    lastUpdatedDate,
    lowest,
    highest,
    minPrice,
    maxPrice,
    pricePadding,
    onSaveButtonClick,
    onUpdatePriceButtonClick
  };
};
