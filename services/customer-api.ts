export interface Customer {
  _id: string
  customerId: string
  customerName: string
  location?: string
}

export interface CustomerSearchResponse {
  customers: Customer[]
  page: number
  limit: number
  total: number
  pages: number
}

export async function searchCustomers(search: string, page = 1): Promise<CustomerSearchResponse> {
  const response = await fetch(`/api/customers?search=${encodeURIComponent(search)}&page=${page}`)

  if (!response.ok) {
    throw new Error("Failed to fetch customers")
  }

  return response.json()
}
