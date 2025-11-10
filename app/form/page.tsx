'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { dataEntrySchema } from '@/lib/validation';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import z from 'zod';
import {
  MapPin,
  User,
  Building,
  Target,
  FileText,
  Loader2,
} from 'lucide-react';
import { useDataEntry } from '@/hooks/use-data-entry'; // Adjust import path as needed
import { useEffect } from 'react';

const mockCustomers = [
  { id: 'CUST001', name: 'Customer A' },
  { id: 'CUST002', name: 'Customer B' },
  { id: 'CUST003', name: 'Customer C' },
];

export default function FormPage() {
  const { toast } = useToast();
  const router = useRouter();

  // Get the auth token

  const { mutate: submitData, isPending } = useDataEntry();

  type FormData = z.infer<typeof dataEntrySchema>;
  const form = useForm<FormData>({
    resolver: zodResolver(dataEntrySchema),
    defaultValues: {
      supervisorEmail: '',
      supervisorName: '',
      currentDate: new Date().toISOString().split('T')[0],
      region: '',
      contractType: '',
      area: '',
      targetCustomers: 0,
      visitedCustomers: 0,
      osa: 0,
      merchDisplay: 0,
      issuesReported: false,
      psChecked: false,
      comments: '',
      customers: [{ customerId: '', customerLocation: '' }],
    },
  });

  const { control, handleSubmit, setValue, watch, reset } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'customers',
  });
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      setValue('supervisorEmail', parsedUser.email);
      setValue('supervisorName', parsedUser.name);
      setValue('region', parsedUser.region);
    }
  }, [setValue]);
  const updateLocation = (index: number) => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setValue(
            `customers.${index}.customerLocation`,
            `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(
              4
            )}`
          );
          toast({
            title: 'Location Updated',
            description: 'GPS coordinates captured successfully',
            variant: 'default',
          });
        },
        () =>
          toast({
            title: 'Location Error',
            description: 'Could not get your current location',
            variant: 'destructive',
          })
      );
    }
  };

  const onSubmit = (data: FormData) => {
    // Filter out empty customer entries and transform data to match your API payload
    const validCustomers = data.customers.filter(
      (customer) => customer.customerId && customer.customerLocation
    );

    // Transform the form data to match your DataEntryPayload structure
    const submissionData = {
      supervisorEmail: data.supervisorEmail,
      supervisorName: data.supervisorName,
      currentDate: data.currentDate,
      region: data.region,
      contractType: data.contractType,
      area: data.area,
      targetCustomers: data.targetCustomers,
      visitedCustomers: data.visitedCustomers,
      osa: data.osa > 0,
      merchDisplay: data.merchDisplay,
      issuesReported: data.issuesReported,
      psChecked: data.psChecked,
      comments: data.comments,
      customers: validCustomers,
    };

    submitData(submissionData, {
      onSuccess: () => {
        toast({
          title: 'Success',
          description: 'Data entry saved successfully',
        });
        // Reset form after successful submission
        reset();
        router.push('/form'); // Redirect back to form or wherever you prefer
      },
      onError: (error: any) => {
        toast({
          title: 'Error',
          description: error.message || 'Failed to save data entry',
          variant: 'destructive',
        });
      },
    });
  };

  const visitedCustomers = watch('visitedCustomers');
  const targetCustomers = watch('targetCustomers');
  const completionRate =
    targetCustomers > 0
      ? Math.round((visitedCustomers / targetCustomers) * 100)
      : 0;

  return (
    <div className='min-h-screen bg-background py-8 px-4'>
      <div className='w-full max-w-4xl mx-auto'>
        {/* Header Section */}
        <div className='text-center mb-8'>
          <div className='flex items-center justify-center gap-3 mb-4'>
            <h1 className='text-4xl font-bold text-foreground'>
              Lipton Report
            </h1>
          </div>
          <p className='text-muted-foreground text-lg max-w-2xl mx-auto'>
            Complete your daily supervisor activity report and track field
            performance metrics
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            {/* Supervisor Information Card */}
            <Card className='border-border bg-card shadow-sm'>
              <CardHeader className='pb-4 border-b border-border'>
                <CardTitle className='text-xl font-semibold text-card-foreground flex items-center gap-2'>
                  <User className='h-5 w-5 text-primary' />
                  Supervisor Information
                </CardTitle>
              </CardHeader>
              <CardContent className='pt-6'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <FormField
                    control={control}
                    name='supervisorEmail'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-card-foreground'>
                          Email Address
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder='supervisor@lepton.com'
                            className='border-input bg-background'
                            disabled={true}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name='supervisorName'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-card-foreground'>
                          Full Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder='John Supervisor'
                            className='border-input bg-background'
                            disabled={true}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name='currentDate'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-card-foreground'>
                          Report Date
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type='date'
                            className='border-input bg-background'
                            disabled={true}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name='region'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-card-foreground'>
                          Region
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder='North Region'
                            className='border-input bg-background'
                            disabled={true}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Customer Visits Card */}
            <Card className='border-border bg-card shadow-sm'>
              <CardHeader className='pb-4 border-b border-border'>
                <CardTitle className='text-xl font-semibold text-card-foreground flex items-center gap-2'>
                  <Building className='h-5 w-5 text-primary' />
                  Customer Visits
                  <span className='text-sm font-normal text-muted-foreground ml-auto'>
                    {fields.length} of 8 customers
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className='pt-6'>
                <div className='space-y-4'>
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className='flex gap-3 items-start p-4 border border-border rounded-lg bg-background/50'
                    >
                      <FormField
                        control={control}
                        name={`customers.${index}.customerId`}
                        render={({ field }) => (
                          <FormItem className='flex-1'>
                            <FormLabel className='text-sm text-card-foreground'>
                              Customer
                            </FormLabel>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                              disabled={isPending}
                            >
                              <FormControl>
                                <SelectTrigger className='border-input'>
                                  <SelectValue placeholder='Select Customer' />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {mockCustomers.map((c) => (
                                  <SelectItem key={c.id} value={c.id}>
                                    {c.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={control}
                        name={`customers.${index}.customerLocation`}
                        render={({ field }) => (
                          <FormItem className='flex-1'>
                            <FormLabel className='text-sm text-card-foreground'>
                              Location
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder='GPS coordinates'
                                readOnly
                                className='border-input bg-muted/50'
                                disabled={isPending}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className='flex gap-2 pt-6'>
                        <Button
                          type='button'
                          onClick={() => updateLocation(index)}
                          size='icon'
                          variant='outline'
                          className='border-input hover:bg-accent hover:text-accent-foreground'
                          disabled={isPending}
                        >
                          <MapPin className='h-4 w-4' />
                        </Button>
                        {fields.length > 1 && (
                          <Button
                            type='button'
                            variant='destructive'
                            size='sm'
                            onClick={() => remove(index)}
                            disabled={isPending}
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                  {fields.length < 8 && (
                    <Button
                      type='button'
                      onClick={() =>
                        append({ customerId: '', customerLocation: '' })
                      }
                      variant='outline'
                      className='w-full border-border hover:bg-accent hover:text-accent-foreground'
                      disabled={isPending}
                    >
                      + Add Customer Visit
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Contract & Area Card */}
            <Card className='border-border bg-card shadow-sm'>
              <CardHeader className='pb-4 border-b border-border'>
                <CardTitle className='text-xl font-semibold text-card-foreground flex items-center gap-2'>
                  <FileText className='h-5 w-5 text-primary' />
                  Contract & Area Details
                </CardTitle>
              </CardHeader>
              <CardContent className='pt-6'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <FormField
                    control={control}
                    name='contractType'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-card-foreground'>
                          Contract Type
                        </FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={isPending}
                        >
                          <FormControl>
                            <SelectTrigger className='border-input'>
                              <SelectValue placeholder='Select Contract Type' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value='contract'>Contract</SelectItem>
                            <SelectItem value='non contract'>
                              Non Contract
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name='area'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-card-foreground'>
                          Area
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder='Area coverage'
                            className='border-input bg-background'
                            disabled={isPending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics Card */}
            <Card className='border-border bg-card shadow-sm'>
              <CardHeader className='pb-4 border-b border-border'>
                <CardTitle className='text-xl font-semibold text-card-foreground flex items-center gap-2'>
                  <Target className='h-5 w-5 text-primary' />
                  Performance Metrics
                  {completionRate > 0 && (
                    <span
                      className={`text-sm font-medium ml-auto ${
                        completionRate >= 80
                          ? 'text-green-600'
                          : completionRate >= 60
                          ? 'text-yellow-600'
                          : 'text-red-600'
                      }`}
                    >
                      {completionRate}% Complete
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className='pt-6'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div className='space-y-4'>
                    <FormField
                      control={control}
                      name='targetCustomers'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='text-card-foreground'>
                            Target Customers
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type='number'
                              placeholder='0'
                              className='border-input bg-background'
                              value={field.value || ''}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value === ''
                                    ? 0
                                    : parseInt(e.target.value)
                                )
                              }
                              disabled={isPending}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name='visitedCustomers'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='text-card-foreground'>
                            Visited Customers
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type='number'
                              placeholder='0'
                              className='border-input bg-background'
                              value={field.value || ''}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value === ''
                                    ? 0
                                    : parseInt(e.target.value)
                                )
                              }
                              disabled={isPending}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className='flex gap-4'>
                      <FormField
                        control={control}
                        name='issuesReported'
                        render={({ field }) => (
                          <FormItem className='flex flex-row items-start space-x-3 space-y-0'>
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className='border-input data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground'
                                disabled={isPending}
                              />
                            </FormControl>
                            <div className='space-y-1 leading-none'>
                              <FormLabel className='text-card-foreground font-normal'>
                                Issues Reported
                              </FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={control}
                        name='psChecked'
                        render={({ field }) => (
                          <FormItem className='flex flex-row items-start space-x-3 space-y-0'>
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className='border-input data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground'
                                disabled={isPending}
                              />
                            </FormControl>
                            <div className='space-y-1 leading-none'>
                              <FormLabel className='text-card-foreground font-normal'>
                                PS Checked
                              </FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  <div className='space-y-4'>
                    <FormField
                      control={control}
                      name='osa'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='text-card-foreground'>
                            OSA Percentage
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type='number'
                              placeholder='0%'
                              min={0}
                              max={100}
                              className='border-input bg-background'
                              value={field.value || ''}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value === ''
                                    ? 0
                                    : parseInt(e.target.value)
                                )
                              }
                              disabled={isPending}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name='merchDisplay'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='text-card-foreground'>
                            Merch Display Percentage
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type='number'
                              placeholder='0%'
                              min={0}
                              max={100}
                              className='border-input bg-background'
                              value={field.value || ''}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value === ''
                                    ? 0
                                    : parseInt(e.target.value)
                                )
                              }
                              disabled={isPending}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name='comments'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='text-card-foreground'>
                            Additional Comments
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder='Enter any additional notes or comments...'
                              className='border-input bg-background resize-none h-20'
                              value={field.value || ''}
                              disabled={isPending}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <Button
              type='submit'
              className='w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 text-lg font-semibold'
              size='lg'
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Submitting...
                </>
              ) : (
                'Submit Daily Report'
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
