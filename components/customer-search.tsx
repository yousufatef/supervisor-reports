"use client"

import { useState, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useCustomers } from "@/hooks/use-customers"
import type { Customer } from "@/services/customer-api"

interface CustomerSearchProps {
  onSelectCustomer: (customer: Customer & { customerLocation?: string }) => void
  selectedCustomerCodes: string[]
}

export function CustomerSearch({ onSelectCustomer, selectedCustomerCodes }: CustomerSearchProps) {
  const { toast } = useToast()
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [debouncedSearch, setDebouncedSearch] = useState("")

  const { data, isLoading } = useCustomers(debouncedSearch, page, true)

  // Debounce search input
  const handleSearchChange = useCallback((value: string) => {
    setSearch(value)
    const timer = setTimeout(() => {
      setPage(1)
      setDebouncedSearch(value)
    }, 300)
    return () => clearTimeout(timer)
  }, [])

  const handleSelectCustomer = (customer: Customer) => {
    if (selectedCustomerCodes.includes(customer.customerId)) {
      toast({
        title: "Already selected",
        description: "This customer is already in your list",
        variant: "destructive",
      })
      return
    }

    onSelectCustomer({
      ...customer,
      customerLocation: customer.location || "",
    })

    setSearch("")
    setDebouncedSearch("")
  }

  const results = data?.customers || []
  const totalPages = data?.pages || 0

  return (
    <div className="space-y-2">
      <Input
        placeholder="Search by customer name or ID (min 2 chars)..."
        value={search}
        onChange={(e) => handleSearchChange(e.target.value)}
        disabled={isLoading}
      />

      {results.length > 0 && (
        <div className="space-y-1 max-h-64 overflow-y-auto border rounded p-2">
          {results.map((customer) => (
            <Button
              key={customer._id}
              variant="ghost"
              className="w-full justify-start text-left"
              onClick={() => handleSelectCustomer(customer)}
              disabled={selectedCustomerCodes.includes(customer.customerId)}
            >
              <div className="flex flex-col">
                <span className="font-medium">{customer.customerName}</span>
                <span className="text-xs text-muted-foreground">{customer.customerId}</span>
              </div>
            </Button>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => setPage((p) => p - 1)} disabled={page === 1}>
            Previous
          </Button>
          <span className="text-sm py-1">
            Page {page} of {totalPages}
          </span>
          <Button size="sm" variant="outline" onClick={() => setPage((p) => p + 1)} disabled={page === totalPages}>
            Next
          </Button>
        </div>
      )}
    </div>
  )
}
