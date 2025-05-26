import { create } from 'zustand'
import type { Application, Column } from '../type'
import type { UniqueIdentifier } from '@dnd-kit/core'

interface ApplicationStore {
  activeId: UniqueIdentifier | null
  applicationStatuses: string[]
  activeApplication: Application | null
  applications: Application[]
  columns: Column[]
  actions: {
    processColumns: (applications: Application[], applicationStatuses: string[]) => Column[]
    setColumns: (columns: Column[]) => void
    setApplications: (applications: Application[]) => void
    setApplicationStatuses: (applicationStatuses: string[]) => void
    setActiveId: (id: UniqueIdentifier | null) => void
  }
}

const useApplicationStore = create<ApplicationStore>((set, get) => ({
  activeId: null,
  applicationStatuses: [],
  applications: [],
  columns: [],
  activeApplication: null,

  actions: {
    processColumns: (applications: Application[], applicationStatuses: string[]) => {
      const grouped: Record<string, Application[]> = {
        APPLIED: [],
        INTERVIEW: [],
        OFFER: [],
        REJECTED: [],
        ACCEPTED: [],
      }

      for (const app of applications) {
        grouped[app.status].push(app)
      }

      const newColumns = applicationStatuses.map(status => ({
        id: status,
        title: status,
        applications: grouped[status] || [],
      }))

      return newColumns
    },
    setApplications: (applications: Application[]) => set({ applications }),
    setApplicationStatuses: (applicationStatuses: string[]) => {
      set({ applicationStatuses })
    },
    setColumns: columns => set({ columns }),
    setActiveId: id => {
      for (const column of get().columns) {
        const app = column.applications.find(app => app.id === id)
        if (app) {
          set({ activeApplication: app })
          break
        }
      }

      set({ activeId: id })
    },
  },
}))

export const useActiveApplication = () => useApplicationStore(state => state.activeApplication)
export const useActiveId = () => useApplicationStore(state => state.activeId)
export const useApplicationStatuses = () => useApplicationStore(state => state.applicationStatuses)
export const useColumns = () => useApplicationStore(state => state.columns)
export const useApplications = () => useApplicationStore(state => state.applications)

export const useApplicationActions = () => useApplicationStore(state => state.actions)
