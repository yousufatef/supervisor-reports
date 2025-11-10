export interface DataEntryPayload {
  supervisorEmail: string
  supervisorName: string
  currentDate: string
  region: string
  contractType: string
  targetCustomers: number
  visitedCustomers: number
  psChecked: boolean
  osa: boolean
  merchDisplay: boolean
  comments: string
  customers: Array<{ customerCode: string; customerLocation?: string }>
}

export interface DataEntryResponse {
  id: string
  message: string
}

export async function submitDataEntry(data: DataEntryPayload, token: string): Promise<DataEntryResponse> {
  const res = await fetch("/api/data-entry", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error?.error || "Failed to save data entry");
  }

  return res.json();
}
