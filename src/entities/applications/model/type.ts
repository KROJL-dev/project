export type Statuses = 'APPLIED' | 'INTERVIEW' | 'OFFER' | 'REJECTED' | 'ACCEPTED'
export type Application = {
  id: string
  company: string
  position: string
  status: Statuses
  order: number
  link?: string
  notes?: string
}

export type Column = {
  id: string
  title: string
  applications: Application[]
}
