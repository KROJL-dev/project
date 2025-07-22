import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/shared/ui/molecules/dialog'
import { Input } from '@/shared/ui/atoms/input'
import { Button } from '@/shared/ui/atoms/button'
import { Textarea } from '@/shared/ui/atoms/textarea'
import { Label } from '@/shared/ui/atoms/label'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/shared/ui/molecules/select'

import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { useQueryClient } from '@tanstack/react-query'
import { ApplicationQueryKeys } from '../model/queries/queryKeys'
import { postApplication } from '../api/postApplication'
import type { Application } from '@/entities/applications/model/type'

const statusOptions = ['APPLIED', 'INTERVIEW', 'OFFER', 'REJECTED', 'ACCEPTED'] as const

const schema = z.object({
  company: z.string().min(1, 'Company is required'),
  position: z.string().min(1, 'Position is required'),
  status: z.enum(statusOptions),
  link: z.string().optional(),
  notes: z.string().optional(),
})

type FormData = z.infer<typeof schema>

export function CreateApplicationModal() {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      status: 'APPLIED',
    },
  })

  const onSubmit = async (data: FormData) => {
    const newApp: Omit<Application, 'id' | 'order' | 'createdAt'> = {
      ...data,
      link: data.link?.trim() || undefined,
      notes: data.notes?.trim() || undefined,
    }

    await postApplication(newApp)

    await queryClient.invalidateQueries({
      queryKey: [ApplicationQueryKeys.applications],
    })

    setOpen(false)
    reset()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create Application</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Application</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="company">Company</Label>
              <Input id="company" {...register('company')} />
              {errors.company && (
                <span className="text-sm text-red-500">{errors.company.message}</span>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="position">Position</Label>
              <Input id="position" {...register('position')} />
              {errors.position && (
                <span className="text-sm text-red-500">{errors.position.message}</span>
              )}
            </div>

            <div className="grid gap-2">
              <Label>Status</Label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map(status => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.status && (
                <span className="text-sm text-red-500">{errors.status.message}</span>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="link">Link</Label>
              <Input id="link" {...register('link')} />
              {errors.link && <span className="text-sm text-red-500">{errors.link.message}</span>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" {...register('notes')} />
              {errors.notes && <span className="text-sm text-red-500">{errors.notes.message}</span>}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
