import { useMemo, type MouseEventHandler } from 'react'
import { GripVertical } from 'lucide-react'

import { CSS } from '@dnd-kit/utilities'
import { useSortable } from '@dnd-kit/sortable'
import type { UniqueIdentifier } from '@dnd-kit/core'

import { Card, CardContent } from '@/shared/ui/atoms/card'
import { Button } from '@/shared/ui/atoms/button'
import React from 'react'

export const SortableItem: React.FC<{
  id: string
  title: string
  activeId: UniqueIdentifier | null
  onClick?: MouseEventHandler<HTMLButtonElement>
}> = React.memo(({ id, title, activeId, onClick }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  })

  const style = useMemo<React.CSSProperties>(
    () => ({
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.3 : 1,
    }),
    [transform, transition, isDragging]
  )

  const isPlaceholder = useMemo(() => activeId === id, [activeId, id])

  return (
    <>
      <Card
        className={`mb-2 p-2 min-w-[154px] max-w-[154px] ${isPlaceholder ? 'border border-dashed bg-gray-200' : ''}`}
      >
        <CardContent className="flex items-center gap-2 p-0">
          <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <GripVertical className="cursor-grab text-muted-foreground" />
          </div>
          {title}
        </CardContent>
        <Button onClick={onClick}>{'->'}</Button>
      </Card>
    </>
  )
})
