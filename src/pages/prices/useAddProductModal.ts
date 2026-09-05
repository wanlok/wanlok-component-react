import { useState } from "react";
import { ApiResponse, apiUrl, Product, SaveProductResponse } from "../../services/ApiTypes";

export const useAddProductModal = () => {
  const [url, setUrl] = useState("");
  const [product, setProduct] = useState<Product>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  const onUrlChange = (value: string) => {
    setUrl(value);
    setError(undefined);
  };

  const onSearchButtonClick = async () => {
    if (!url) {
      return;
    }
    setIsLoading(true);
    setProduct(undefined);
    const response = await fetch(`${apiUrl}/products?url=${encodeURIComponent(url)}`);
    const result = (await response.json()) as ApiResponse<Product | null>;
    if (result.data) {
      setProduct(result.data);
    }
    setIsLoading(false);
  };

  const onNameChange = (name: string) => {
    setProduct((previous) => ({ type: previous?.type ?? "computer-hardware", name, price: previous?.price ?? 0 }));
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
    const result = (await response.json()) as SaveProductResponse;
    if (result.status === "error") {
      setError(result.message);
      return { error: result.message };
    }
    return {};
  };

  return { url, onUrlChange, product, isLoading, error, onSearchButtonClick, onNameChange, onSaveButtonClick };
};
