import { useState, useActionState } from 'react'
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

import type { Application, Statuses } from '@/entities/applications/model/type'
import { postApplication } from '../api/postApplication'
import { useQueryClient } from '@tanstack/react-query'
import { ApplicationQueryKeys } from '../model/queries/queryKeys'

const statusOptions: Statuses[] = ['APPLIED', 'INTERVIEW', 'OFFER', 'REJECTED', 'ACCEPTED']

export function CreateApplicationModal() {
  const [open, setOpen] = useState<boolean>(false)
  const queryClient = useQueryClient()
 
 
  const createApplication = async (_: null, formData: FormData) => {
    const company = formData.get('company') as string
    const position = formData.get('position') as string
    const status = formData.get('status') as Statuses
    const link = formData.get('link') as string
    const notes = formData.get('notes') as string

    if (!company.trim() || !position.trim()) return null

    const newApp: Omit<Application, 'id' | 'order' | 'createdAt'> = {
      company,
      position,
      status,
      link: link || undefined,
      notes: notes || undefined,
    }

    await postApplication(newApp)

    queryClient.invalidateQueries({
      queryKey: [ApplicationQueryKeys.applications],
    })

 
    setOpen(false)
    
    return null
  }

  const [_, formAction, isPending] = useActionState(createApplication, null)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create Application</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Application</DialogTitle>
        </DialogHeader>

       
        <form action={formAction}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                name="company"
              
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                name="position"
                
              />
            </div>

            <div className="grid gap-2">
              <Label>Status</Label>
              <Select name="status">
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map(s => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
       
              <input type="hidden" name="status"   />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="link">Link</Label>
              <Input
                id="link"
                name="link"
               
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                 
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={ isPending}>
              {isPending ? 'Creating...' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
