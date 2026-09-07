import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ApiResponse, apiUrl, Product, ProductType, SearchProduct } from "../../services/ApiTypes";

type EditableProduct = Omit<SearchProduct, "price"> & { price: string | undefined };

export const useAddProductModal = ({ type }: { type: ProductType }) => {
  const queryClient = useQueryClient();
  const [url, setUrl] = useState("");
  const [product, setProduct] = useState<EditableProduct>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  const onUrlChange = (value: string) => {
    setUrl(value);
    setProduct(undefined);
    setError(undefined);
  };

  const onSearchButtonClick = async () => {
    if (!url) {
      return;
    }
    setIsLoading(true);
    setProduct(undefined);
    const response = await fetch(`${apiUrl}/searchProducts?url=${encodeURIComponent(url)}`);
    const result = (await response.json()) as ApiResponse<SearchProduct | null>;
    if (result.data) {
      setProduct({ ...result.data, price: String(result.data.price) });
    }
    setIsLoading(false);
  };

  const onNameChange = (name: string) => {
    setProduct((previous) => {
      if (!previous) {
        return previous;
      }
      return { ...previous, name };
    });
  };

  const onSellerChange = (seller: string) => {
    setProduct((previous) => {
      if (!previous) {
        return previous;
      }
      return { ...previous, seller };
    });
  };

  const onPriceChange = (value: string) => {
    setProduct((previous) => {
      if (!previous) {
        return previous;
      }
      return { ...previous, price: value === "" ? undefined : value };
    });
  };

  const onManualButtonClick = () => {
    setProduct({ type, seller: "", name: "", price: undefined });
  };

  const onSaveButtonClick = async () => {
    if (!product) {
      return { error: "No product to save" };
    }
    const price = Number(product.price);
    if (product.price === undefined || Number.isNaN(price)) {
      const message = "Price must be a number";
      setError(message);
      return { error: message };
    }
    const response = await fetch(`${apiUrl}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, ...product, price })
    });
    const result = (await response.json()) as ApiResponse<Record<string, Record<string, Product>>>;
    if (result.status === "error") {
      const message = "Failed to save product";
      setError(message);
      return { error: message };
    }
    queryClient.setQueryData(["products", product.type], result.data);
    return {};
  };

  return {
    url,
    onUrlChange,
    product,
    isLoading,
    error,
    onSearchButtonClick,
    onNameChange,
    onSellerChange,
    onPriceChange,
    onManualButtonClick,
    onSaveButtonClick
  };
};
