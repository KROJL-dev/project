import { useCallback, useEffect } from 'react'
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
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/card'
import { useApplicationsQuery, useApplicationStatusesQuery } from '@/entities/applications/model'

import { DroppableColumn } from './DroppableColumn'
import { SortableItem } from './SortableItem'
import { patchApplicationOrder, patchApplicationStatus } from '@/entities/applications/api'
import type { Statuses } from '@/entities/applications/model/type'

const Applications = () => {
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

  return (
    <>
      <CreateApplicationModal />
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 p-4 overflow-x-auto">
          {columns.map(column => (
            <Card key={column.id} className="w-64 min-h-[300px] flex flex-col">
              <CardHeader>
                <CardTitle>{column.title}</CardTitle>
              </CardHeader>
              <DroppableColumn id={column.id}>
                <SortableContext
                  items={column.applications.map(a => a.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {column.applications
                    .sort((applicationA, applicationB) => applicationA.order - applicationB.order)
                    .map(app => (
                      <SortableItem
                        key={app.id}
                        id={app.id}
                        title={`${app.position} @ ${app.company}`}
                        activeId={activeId}
                      />
                    ))}
                </SortableContext>
              </DroppableColumn>
            </Card>
          ))}
        </div>

        <DragOverlay>
          {activeId ? (
            <Card className="w-60 p-2 shadow-lg">
              <CardContent>
                {activeColumn?.position} @ {activeColumn?.company}
              </CardContent>
            </Card>
          ) : null}
        </DragOverlay>
      </DndContext>
    </>
  )
}

export default Applications
