import type { Application, Meeting } from '@/entities/applications/model/type'
import { Drawer, DrawerContent } from '@/shared/ui/molecules/drawer'
import { Label } from '@/shared/ui/atoms/label'
import FAIcon, { EPrefix } from '@/shared/ui/atoms/FAIcon'

import { useClipboard } from '@/shared/lib/useClipboard'

import dayjs from 'dayjs'
import React from 'react'

interface IProps {
  application?: Application
  onClose: () => void
}

const MeetingItem = ({ meeting }: { meeting: Meeting }) => {
  const { copy, copied } = useClipboard(meeting.link)
  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault()
    copy()
  }
  return (
    <div className="table-row hover:bg-gray-50" key={meeting.id}>
      <span className="table-cell border-b p-2">{meeting.title}</span>
      <a className="table-cell border-b p-2" href={meeting.link} target="_blank">
        {meeting.link}{' '}
        <FAIcon
          name={copied ? 'fa-check' : 'fa-copy'}
          prefix={EPrefix.far}
          className="ml-2 cursor-pointer"
          onClick={handleCopy}
        />
      </a>
      <div className="table-cell border-b p-2">{meeting.status}</div>
    </div>
  )
}
const ApplicationDrawer: React.FC<IProps> = React.memo(({ application, onClose }) => {
  return (
    <Drawer open={!!application} onClose={onClose}>
      <DrawerContent className="px-6 pb-6">
        <h1 className="mb-4">{application?.position}</h1>
        <div className="flex gap-8 space-y-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="name" className="text-muted-foreground text-sm">
              Company
            </Label>
            <div className="font-semibold text-lg">{application?.company}</div>
          </div>
          {application?.meeting?.length ? (
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name" className="text-muted-foreground text-sm">
                Meetings
              </Label>
              <div className="flex flex-col space-y-1">
                <div className="table w-full border-collapse">
                  <div className="table-header-group">
                    <div className="table-row">
                      <div className="table-cell border-b p-2 font-semibold">Title</div>
                      <div className="table-cell border-b p-2 font-semibold">Link</div>
                      <div className="table-cell border-b p-2 font-semibold">Status</div>
                    </div>
                  </div>

                  <div className="table-row-group">
                    {application?.meeting?.map(meeting => (
                      <MeetingItem meeting={meeting} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="name" className="text-muted-foreground text-sm">
              Applied At
            </Label>
            <div className="text-lg font-semibold">
              {dayjs(application?.createdAt).format('DD/MM/YYYY')}
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
})
export default ApplicationDrawer
