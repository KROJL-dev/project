import type { Column } from '../model/type'

export const useFindDiffInColDueOrder = (oldCol: Column, newCol: Column): string[] => {
  const changedIds: string[] = []

  const oldOrderMap = oldCol.applications.reduce<Record<string, number>>((acc, app) => {
    acc[app.id] = app.order
    return acc
  }, {})

  newCol.applications.forEach(app => {
    const oldOrder = oldOrderMap[app.id]
    if (oldOrder !== undefined && oldOrder !== app.order) {
      changedIds.push(app.id)
    }
  })

  return changedIds
}
