export type Statuses = 'APPLIED' | 'INTERVIEW' | 'OFFER' | 'REJECTED' | 'ACCEPTED'
export type Application = {
  id: string
  company: string
  position: string
  status: Statuses
  order: number
  link?: string
  notes?: string
  meeting?: Meeting[]
  createdAt: string
}

export type Meeting = {
  id: string
  title: string
  date: string
  time: string
  link?: string
  notes?: string
  status?: Statuses
}

export type Column = {
  id: string
  title: string
  applications: Application[]
}
