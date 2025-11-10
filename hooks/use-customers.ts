"use client"

import { useQuery } from "@tanstack/react-query"
import { searchCustomers, type CustomerSearchResponse } from "@/services/customer-api"

export function useCustomers(search: string, page = 1, enabled = false) {
  return useQuery<CustomerSearchResponse>({
    queryKey: ["customers", search, page],
    queryFn: () => searchCustomers(search, page),
    enabled: enabled && search.trim().length > 0,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  })
}
