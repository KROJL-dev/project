import { useCallback } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui/molecules/dialog'
import {
  Form,
  FormField,
  FormControl,
  FormLabel,
  FormItem,
  FormMessage,
} from '@/shared/ui/organisms/form'
import { Input } from '@/shared/ui/atoms/input'
import { Button } from '@/shared/ui/atoms/button'

import type { Application, Meeting } from '@/entities/applications/model/type'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { z } from 'zod'
import { validationSchema } from '../model/validation/addMeeting.schema'
import { Calendar } from '@/shared/ui/molecules/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/molecules/popover'
import { CalendarIcon } from 'lucide-react'
import dayjs from 'dayjs'
import { cn } from '@/lib/utils'
import { postMeeting } from '../api/postMeeting'

interface IProps {
  onClose: () => void
  open: boolean
  applicationId: Application['id'] | undefined
}

const AddMeetingLinkModal: React.FC<IProps> = ({ onClose, open, applicationId }) => {
  const form = useForm<z.infer<typeof validationSchema>>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      title: '',
      link: '',
      time: new Date(),
    },
  })

  const onSubmit = useCallback(
    (values: z.infer<typeof validationSchema>) => {
      applicationId && postMeeting(applicationId, values as unknown as Meeting)
    },
    [applicationId]
  )

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Meeting</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="HR interview" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link</FormLabel>
                  <FormControl>
                    <Input placeholder="https://" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="time"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Time</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-[240px] justify-start text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          <CalendarIcon />
                          {field.value ? (
                            dayjs(field.value).format('YYYY/MM/DD')
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={new Date(field.value)}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    {/* <Calendar
                      mode="single"
                      selected={field.value ? dayjs(field.value).toISOString() : undefined}
                      onSelect={field.onChange}
                      initialFocus
                    /> */}
                    <FormMessage />
                  </FormItem>
                )
              }}
            />
            <Button type="submit" className="w-full">
              Add
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default AddMeetingLinkModal
