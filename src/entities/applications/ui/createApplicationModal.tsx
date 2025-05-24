import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/shared/ui/dialog'
import { Input } from '@/shared/ui/input'
import { Button } from '@/shared/ui/button'
import { Textarea } from '@/shared/ui/textarea'
import { Label } from '@/shared/ui/label'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/shared/ui/select'

import type { Application, Statuses } from '@/entities/applications/model/type' // адаптируй путь под проект
import { postApplication } from '../api/postApplication'
import { useQueryClient } from '@tanstack/react-query'
import { ApplicationQueryKeys } from '../model/queries/queryKeys'

const statusOptions: Statuses[] = ['APPLIED', 'INTERVIEW', 'OFFER', 'REJECTED', 'ACCEPTED']

export function CreateApplicationModal() {
  const [open, setOpen] = useState<boolean>(false)

  const queryClient = useQueryClient()
  const [company, setCompany] = useState<string>('')
  const [position, setPosition] = useState<string>('')
  const [status, setStatus] = useState<Statuses>('APPLIED')
  const [link, setLink] = useState<string>('')
  const [notes, setNotes] = useState<string>('')

  const handleSubmit = async () => {
    if (!company.trim() || !position.trim()) return

    const newApp: Omit<Application, 'id' | 'order'> = {
      company,
      position,
      status,
      // или кастомная логика
      link: link || undefined,
      notes: notes || undefined,
    }

    // onCreate(newApp)
    setOpen(false)
    setCompany('')
    setPosition('')
    setStatus('APPLIED')
    setLink('')
    setNotes('')
    await postApplication(newApp)
    queryClient.invalidateQueries({
      queryKey: [ApplicationQueryKeys.applications],
    })
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

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="company">Company</Label>
            <Input id="company" value={company} onChange={e => setCompany(e.target.value)} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="position">Position</Label>
            <Input id="position" value={position} onChange={e => setPosition(e.target.value)} />
          </div>

          <div className="grid gap-2">
            <Label>Status</Label>
            <Select value={status} onValueChange={value => setStatus(value as Statuses)}>
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
          </div>

          <div className="grid gap-2">
            <Label htmlFor="link">Link</Label>
            <Input id="link" value={link} onChange={e => setLink(e.target.value)} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!company || !position}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
