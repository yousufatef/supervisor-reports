import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})


export const dataEntrySchema = z.object({
  supervisorEmail: z.string().email(),
  supervisorName: z.string().min(1),
  currentDate: z.string(),
  region: z.string().min(1),
  contractType: z.string().min(1),
  area: z.string().min(1),
  targetCustomers: z.number().min(0),
  visitedCustomers: z.number().min(0),
  psChecked: z.boolean(),
  osa: z.number().min(0).max(100),
  merchDisplay: z.number().min(0).max(100),
  issuesReported: z.boolean(),
  comments: z.string().optional(),
  customers: z.array(
    z.object({
      customerId: z.string().min(1),
      customerLocation: z.string().optional(),
    })
  ),
});

export type DataEntryForm = z.infer<typeof dataEntrySchema>;

export type LoginInput = z.infer<typeof loginSchema>
