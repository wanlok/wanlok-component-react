import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiResponse, apiUrl, Product } from "../../../services/ApiTypes";

export const useSupermarkets = () => {
  const queryClient = useQueryClient();

  const { data: products = {} } = useQuery({
    queryKey: ["products", "supermarkets"],
    queryFn: () =>
      fetch(`${apiUrl}/products/supermarkets`)
        .then((response) => response.json() as Promise<ApiResponse<Record<string, Record<string, Product>>>>)
        .then((response) => response.data)
  });

  const { mutate: deleteProductMutation } = useMutation({
    mutationFn: (variables: { name: string }) =>
      fetch(`${apiUrl}/products`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "supermarkets", ...variables })
      })
        .then((response) => response.json() as Promise<ApiResponse<Record<string, Record<string, Product>>>>)
        .then((response) => response.data),
    onSuccess: (data) => queryClient.setQueryData(["products", "supermarkets"], data)
  });

  const deleteProduct = (name: string) => {
    deleteProductMutation({ name });
  };

  return { products, deleteProduct };
};
