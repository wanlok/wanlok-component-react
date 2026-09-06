import { useState } from "react";
import { ApiResponse, apiUrl, Product, SearchProduct } from "../../services/ApiTypes";

export const useAddProductModal = () => {
  const [url, setUrl] = useState("");
  const [product, setProduct] = useState<SearchProduct>();
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
      setProduct(result.data);
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

  const onSaveButtonClick = async () => {
    if (!product) {
      return { error: "No product to save" };
    }
    const response = await fetch(`${apiUrl}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, ...product })
    });
    const result = (await response.json()) as ApiResponse<Record<string, Record<string, Product>>>;
    if (result.status === "error") {
      const message = "Failed to save product";
      setError(message);
      return { error: message };
    }
    return {};
  };

  return { url, onUrlChange, product, isLoading, error, onSearchButtonClick, onNameChange, onSaveButtonClick };
};
