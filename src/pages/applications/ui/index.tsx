import { useCallback, useEffect, useState } from 'react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

import { toast } from 'sonner'

import * as _ from 'lodash-es'

import {
  useActiveApplication,
  useActiveId,
  useApplicationActions,
  useApplications,
  useApplicationStatuses,
  useColumns,
} from '@/entities/applications/model/store/useApplicationStore'
import { CreateApplicationModal } from '@/entities/applications/ui/createApplicationModal'
import { useFindDiffInColDueOrder } from '@/entities/applications/lib'
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/atoms/card'
import { useApplicationsQuery, useApplicationStatusesQuery } from '@/entities/applications/model'

import { DroppableColumn } from './DroppableColumn'
import { SortableItem } from './SortableItem'
import { patchApplicationOrder, patchApplicationStatus } from '@/entities/applications/api'
import type { Application, Statuses } from '@/entities/applications/model/type'
import ApplicationDrawer from './Drawer'
import { Button } from '@/shared/ui/atoms/button'
import AddMeetingLinkModal from '@/entities/applications/ui/addMeetingLinkModal'

const TRIGGER_ADD_MEETING_LINK_MODAL_VALUE = ['INTERVIEW']
const Applications = () => {
  const [addOpenMeetingModal, setAddOpenMeetingModal] = useState<boolean>(false)
  const [applicationIdForAddMeeting, setApplicationIdForAddMeeting] = useState<Application['id']>()
  const [applicationForShowDetails, setApplicationForShowDetails] = useState<Application>()
  const [destinationStatus, setDestinationStatus] = useState<string>()

  const { data: applicationStatusesQuery } = useApplicationStatusesQuery()
  const { data: applicationsQuery } = useApplicationsQuery()

  const activeColumn = useActiveApplication()
  const columns = useColumns()
  const applications = useApplications()
  const applicationStatuses = useApplicationStatuses()
  const activeId = useActiveId()

  const { setColumns, setApplicationStatuses, setApplications, processColumns, setActiveId } =
    useApplicationActions()

  const sensors = useSensors(useSensor(PointerSensor))

  useEffect(() => {
    setApplicationStatuses(applicationStatusesQuery)
  }, [applicationStatusesQuery])

  useEffect(() => {
    setApplications(applicationsQuery)
  }, [applicationsQuery])

  useEffect(() => {
    setColumns(processColumns(applications, applicationStatuses))
  }, [applications, applicationStatuses])

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id)
  }, [])

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      setDestinationStatus(undefined)
      const { active, over } = event
      setActiveId(null)

      if (!over || active.id === over.id) return

      const sourceColumn = columns.find(col => col.applications.some(a => a.id === active.id))
      const targetColumn =
        columns.find(col => col.applications.some(a => a.id === over.id)) ??
        columns.find(col => col.id === over.id)

      if (!sourceColumn || !targetColumn) return

      const application = sourceColumn.applications.find(a => a.id === active.id)
      if (!application) return

      const oldColumns = _.cloneDeep(columns)

      if (sourceColumn.id === targetColumn.id) {
        const fromIndex = sourceColumn.applications.findIndex(a => a.id === active.id)
        const toIndex = targetColumn.applications.findIndex(a => a.id === over.id)
        const columnIndex = columns.findIndex(col => col.id === sourceColumn.id)

        const reordered = arrayMove([...targetColumn.applications], fromIndex, toIndex).map(
          (app, index) => ({ ...app, order: index })
        )

        const updatedColumns = [...columns]
        updatedColumns[columnIndex] = { ...targetColumn, applications: reordered }

        setColumns(updatedColumns)

        try {
          const ids = useFindDiffInColDueOrder(oldColumns[columnIndex], updatedColumns[columnIndex])

          await Promise.all(
            ids.map(id => {
              const updated = updatedColumns[columnIndex].applications.find(a => a.id === id)
              return updated ? patchApplicationOrder(updated.id, updated.order) : null
            })
          )
        } catch (e) {
          setColumns(oldColumns)
        }
      } else {
        if (TRIGGER_ADD_MEETING_LINK_MODAL_VALUE.includes(targetColumn.title)) {
          setDestinationStatus(targetColumn.title)
          setApplicationIdForAddMeeting(application.id)
        }
        const updatedApp = { ...application, status: targetColumn.id as Statuses }

        const newSource = sourceColumn.applications.filter(a => a.id !== active.id)
        const newTarget = [...targetColumn.applications]
        const insertIndex = targetColumn.applications.findIndex(a => a.id === over.id)

        if (insertIndex === -1) {
          newTarget.push(updatedApp)
        } else {
          newTarget.splice(insertIndex, 0, updatedApp)
        }

        const updatedSourceCol = {
          ...sourceColumn,
          applications: newSource.map((a, index) => ({ ...a, order: index })),
        }

        const updatedTargetCol = {
          ...targetColumn,
          applications: newTarget.map((a, index) => ({ ...a, order: index })),
        }

        const updatedColumns = columns.map(col => {
          if (col.id === sourceColumn.id) return updatedSourceCol
          if (col.id === targetColumn.id) return updatedTargetCol
          return col
        })

        setColumns(updatedColumns)

        try {
          await Promise.all([
            patchApplicationStatus(updatedApp.id, updatedApp.status),
            ...useFindDiffInColDueOrder(targetColumn, updatedTargetCol).map(id => {
              const updated = updatedTargetCol.applications.find(a => a.id === id)
              return updated ? patchApplicationOrder(updated.id, updated.order) : null
            }),
            ...useFindDiffInColDueOrder(sourceColumn, updatedSourceCol).map(id => {
              const updated = updatedSourceCol.applications.find(a => a.id === id)
              return updated ? patchApplicationOrder(updated.id, updated.order) : null
            }),
          ])
        } catch (e) {
          setColumns(oldColumns)
        }
      }
    },
    [columns, setActiveId, setColumns]
  )

  useEffect(() => {
    if (destinationStatus) {
      toast.success('You can add a Meeting Link', {
        description: <Button onClick={() => setAddOpenMeetingModal(true)}>Add</Button>,
      })
    }
  }, [destinationStatus])

  const onCloseApplicationDrawer = useCallback(() => setApplicationForShowDetails(undefined), [])
  const onCloseAddMeetingModal = useCallback(() => setAddOpenMeetingModal(false), [])

 
  return (
    <>
      <AddMeetingLinkModal
        onClose={onCloseAddMeetingModal}
        open={addOpenMeetingModal}
        applicationId={applicationIdForAddMeeting}
      />
      <ApplicationDrawer
        application={applicationForShowDetails}
        onClose={onCloseApplicationDrawer}
      />
      <CreateApplicationModal />
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 pt-4 flex-1">
          {columns.map(column => (
            <Card key={column.id} className="flex min-h-[300px] w-64 flex-col">
              <CardHeader>
                <CardTitle>{column.title}</CardTitle>
                <div className='w-full border-[1px] border-[var(--primary)] border-solid'/>
              </CardHeader>
               
              <DroppableColumn id={column.id}>
                <SortableContext
                  items={column.applications.map(a => a.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {column.applications
                    .sort((applicationA, applicationB) => applicationA.order - applicationB.order).filter(application=> application.id !== activeId)
                    .map(app => (
                      <SortableItem
                        key={app.id}
                        id={app.id}
                        title={`${app.position} at ${app.company}`}
                        activeId={activeId}
                        onClick={e => {
                          e.preventDefault()
                          setApplicationForShowDetails(app)
                        }}
                      />
                    ))}
                </SortableContext>
              </DroppableColumn>
            </Card>
          ))}
        </div>

        <DragOverlay>
          {activeId ? (
            <SortableItem
            key={activeColumn?.id}
            id={activeColumn?.id || ''}
            title={`${activeColumn?.position} at ${activeColumn?.company}`}
            activeId={activeId}
            
          />
             
          ) : null}
        </DragOverlay>
      </DndContext>
    </>
  )
}

export default Applications
