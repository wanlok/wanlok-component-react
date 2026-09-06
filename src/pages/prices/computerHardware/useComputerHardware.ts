import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiResponse, apiUrl, Product } from "../../../services/ApiTypes";

export const useComputerHardware = () => {
  const queryClient = useQueryClient();

  const { data: products = {} } = useQuery({
    queryKey: ["products", "computer-hardware"],
    queryFn: () =>
      fetch(`${apiUrl}/products/computer-hardware`)
        .then((response) => response.json() as Promise<ApiResponse<Record<string, Record<string, Product>>>>)
        .then((response) => response.data)
  });

  // deleteProduct returns the whole updated products document, so write it straight into the cache
  // instead of invalidating and refetching.
  const { mutate: deleteProductMutation } = useMutation({
    mutationFn: (variables: { name: string }) =>
      fetch(`${apiUrl}/products`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "computer-hardware", ...variables })
      })
        .then((response) => response.json() as Promise<ApiResponse<Record<string, Record<string, Product>>>>)
        .then((response) => response.data),
    onSuccess: (data) => queryClient.setQueryData(["products", "computer-hardware"], data)
  });

  const deleteProduct = (name: string) => {
    deleteProductMutation({ name });
  };

  return { products, deleteProduct };
};
