"use client"

import type { UseFormRegister, UseFormWatch, FieldValues } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface FormSectionProps<T extends FieldValues> {
  register: UseFormRegister<T>
  watch: UseFormWatch<T>
  errors: Record<string, any>
}

export function SupervisorInfoSection({ register }: Omit<FormSectionProps<any>, "watch" | "errors">) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Supervisor Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Email</label>
            <Input {...register("supervisorEmail")} disabled />
          </div>
          <div>
            <label className="text-sm font-medium">Name</label>
            <Input {...register("supervisorName")} disabled />
          </div>
          <div>
            <label className="text-sm font-medium">Region</label>
            <Input {...register("region")} disabled />
          </div>
          <div>
            <label className="text-sm font-medium">Date</label>
            <Input {...register("currentDate")} type="date" disabled />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function DetailsSection({ register, watch, errors }: FormSectionProps<any>) {
  const targetCustomers = watch("targetCustomers")
  const visitedCustomers = watch("visitedCustomers")

  return (
    <Card>
      <CardHeader>
        <CardTitle>Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Contract Type</label>
            <Input {...register("contractType")} placeholder="e.g., Standard, Premium" />
            {errors.contractType && <p className="text-xs text-destructive mt-1">{errors.contractType.message}</p>}
          </div>
          <div>
            <label className="text-sm font-medium">Target Customers</label>
            <Input {...register("targetCustomers", { valueAsNumber: true })} type="number" min="1" />
            {errors.targetCustomers && (
              <p className="text-xs text-destructive mt-1">{errors.targetCustomers.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Visited Customers</label>
          <Input
            {...register("visitedCustomers", { valueAsNumber: true })}
            type="number"
            min="0"
            max={targetCustomers}
          />
          {visitedCustomers > targetCustomers && (
            <p className="text-xs text-destructive mt-1">Visited cannot exceed target</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <Checkbox {...register("psChecked")} />
            <span className="text-sm">PS Checked</span>
          </label>
          <label className="flex items-center gap-2">
            <Checkbox {...register("osa")} />
            <span className="text-sm">OSA</span>
          </label>
          <label className="flex items-center gap-2">
            <Checkbox {...register("merchDisplay")} />
            <span className="text-sm">Merchandise Display</span>
          </label>
        </div>

        <div>
          <label className="text-sm font-medium">Comments</label>
          <textarea
            {...register("comments")}
            className="w-full border rounded p-2 text-sm"
            rows={3}
            placeholder="Optional comments..."
          />
        </div>
      </CardContent>
    </Card>
  )
}
