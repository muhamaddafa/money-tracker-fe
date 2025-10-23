/* eslint-disable @typescript-eslint/no-explicit-any */

import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export function useTransactions({pageSize = 10, pageNumber = 1} = {}) {
  const params = {
    pageSize,
    pageNumber
  };

  return useQuery({
    queryKey: ["transactions", params],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/transactions?pageSize=${pageSize}&pageNumber=${pageNumber}`
      );
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return Promise.reject(errorData);
      }
      return response.json();
    },
    onError: (error: any) => {
      toast.error('Error', {
        closeButton: true,
        description: error?.responseMessage || 'Failed to fetch transactions.',
      });
    },
    refetchOnWindowFocus: false,
    retry: false,
  });
}