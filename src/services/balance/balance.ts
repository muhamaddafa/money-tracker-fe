/* eslint-disable @typescript-eslint/no-explicit-any */

import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export function useBalance() {
  return useQuery({
    queryKey: ["balance"],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/balance`
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
        description: error?.responseMessage || 'Failed to fetch balance.',
      });
    },
    refetchOnWindowFocus: false,
    retry: false,
  });
}