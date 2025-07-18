import { z } from 'zod'

export const validationSchema = z.object({
  title: z.string().min(2, 'Title too short'),
  link: z.string().url(),
  time: z.date(),
})
