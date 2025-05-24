import { useMemo } from 'react'

import { CSS } from '@dnd-kit/utilities'
import { useSortable } from '@dnd-kit/sortable'
import type { UniqueIdentifier } from '@dnd-kit/core'

import { Card, CardContent } from '@/shared/ui/card'

export const SortableItem: React.FC<{
  id: string
  title: string
  activeId: UniqueIdentifier | null
}> = ({ id, title, activeId }) => {
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
    <Card
      ref={setNodeRef}
      className={`mb-2 cursor-grab p-2 ${isPlaceholder ? 'border border-dashed bg-gray-200' : ''}`}
      style={style}
      {...attributes}
      {...listeners}
    >
      <CardContent className="p-0">{title}</CardContent>
    </Card>
  )
}
