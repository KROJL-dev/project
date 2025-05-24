import { CardContent } from '@/shared/ui/card'
import { useDroppable } from '@dnd-kit/core'

export const DroppableColumn: React.FC<{ id: string; children: React.ReactNode }> = ({
  id,
  children,
}) => {
  const { setNodeRef } = useDroppable({ id })
  return (
    <CardContent ref={setNodeRef} className="flex-1">
      {children}
    </CardContent>
  )
}
