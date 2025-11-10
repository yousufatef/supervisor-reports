"use client"

import { useMutation } from "@tanstack/react-query"
import { submitDataEntry, type DataEntryPayload } from "@/services/data-entry-api"

export function useDataEntry() {
  return useMutation({
    mutationFn: (data: DataEntryPayload) => {
      // Access localStorage inside the function (runs only on client)
      const token = localStorage.getItem("auth-token") || ""
      return submitDataEntry(data, token)
    },
  })
}
