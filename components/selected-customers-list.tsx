"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X } from "lucide-react"

interface SelectedCustomer {
  customerCode: string
  customerLocation?: string
}

interface SelectedCustomersListProps {
  customers: SelectedCustomer[]
  onRemove: (customerCode: string) => void
}

export function SelectedCustomersList({ customers, onRemove }: SelectedCustomersListProps) {
  if (customers.length === 0) {
    return <p className="text-sm text-muted-foreground">No customers selected yet</p>
  }

  return (
    <div className="space-y-2">
      {customers.map((customer, idx) => (
        <Card key={idx} className="p-3 flex justify-between items-center">
          <div>
            <p className="font-medium text-sm">{customer.customerCode}</p>
            {customer.customerLocation && <p className="text-xs text-muted-foreground">{customer.customerLocation}</p>}
          </div>
          <Button size="sm" variant="ghost" onClick={() => onRemove(customer.customerCode)}>
            <X className="w-4 h-4" />
          </Button>
        </Card>
      ))}
      <p className="text-xs text-muted-foreground">{customers.length} customer(s) selected</p>
    </div>
  )
}
