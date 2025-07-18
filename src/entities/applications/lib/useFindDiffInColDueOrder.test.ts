import { describe, it, expect } from 'vitest'

import { useFindDiffInColDueOrder } from './useFindDiffInColDueOrder'
import type { Column } from '../model/type'

const createApp = (id: string, order: number): Column['applications'][0] => ({
  id,
  company: `Company ${id}`,
  position: `Position ${id}`,
  status: 'APPLIED',
  order,
  createdAt: '2025-01-01T00:00:00Z',
  meeting: [],
})

describe('useFindDiffInColDueOrder', () => {
  it('returns empty array when no changes', () => {
    const colA: Column = {
      id: 'col1',
      title: 'Applied',
      applications: [
        {
          id: '1',
          company: 'Company A',
          position: 'Dev',
          status: 'APPLIED',
          order: 0,
          createdAt: '2023-01-01T00:00:00Z',
          meeting: [],
        },
        {
          id: '2',
          company: 'Company B',
          position: 'QA',
          status: 'APPLIED',
          order: 1,
          createdAt: '2023-01-01T00:00:00Z',
          meeting: [],
        },
      ],
    }

    const colB: Column = JSON.parse(JSON.stringify(colA))

    expect(useFindDiffInColDueOrder(colA, colB)).toEqual([])
  })

  it('returns changed id when order is different', () => {
    const oldCol: Column = {
      id: 'col1',
      title: 'Applied',
      applications: [
        {
          id: '1',
          company: 'Company A',
          position: 'Dev',
          status: 'APPLIED',
          order: 0,
          createdAt: '2023-01-01T00:00:00Z',
          meeting: [],
        },
        {
          id: '2',
          company: 'Company B',
          position: 'QA',
          status: 'APPLIED',
          order: 1,
          createdAt: '2023-01-01T00:00:00Z',
          meeting: [],
        },
      ],
    }

    const newCol: Column = {
      ...oldCol,
      applications: [
        { ...oldCol.applications[0], order: 1 },
        { ...oldCol.applications[1], order: 0 },
      ],
    }

    expect(useFindDiffInColDueOrder(oldCol, newCol).sort()).toEqual(['1', '2'])
  })

  it('ignores new applications not present in oldCol', () => {
    const oldCol: Column = {
      id: 'col1',
      title: 'Applied',
      applications: [
        {
          id: '1',
          company: 'Company A',
          position: 'Dev',
          status: 'APPLIED',
          order: 0,
          createdAt: '2023-01-01T00:00:00Z',
          meeting: [],
        },
      ],
    }

    const newCol: Column = {
      ...oldCol,
      applications: [
        ...oldCol.applications,
        {
          id: '2',
          company: 'Company B',
          position: 'QA',
          status: 'APPLIED',
          order: 1,
          createdAt: '2023-01-01T00:00:00Z',
          meeting: [],
        },
      ],
    }

    expect(useFindDiffInColDueOrder(oldCol, newCol)).toEqual([])
  })

  it('ignores removed applications from newCol', () => {
    const oldCol: Column = {
      id: 'col1',
      title: 'Applied',
      applications: [
        {
          id: '1',
          company: 'Company A',
          position: 'Dev',
          status: 'APPLIED',
          order: 0,
          createdAt: '2023-01-01T00:00:00Z',
          meeting: [],
        },
        {
          id: '2',
          company: 'Company B',
          position: 'QA',
          status: 'APPLIED',
          order: 1,
          createdAt: '2023-01-01T00:00:00Z',
          meeting: [],
        },
      ],
    }

    const newCol: Column = {
      ...oldCol,
      applications: [
        {
          id: '1',
          company: 'Company A',
          position: 'Dev',
          status: 'APPLIED',
          order: 0,
          createdAt: '2023-01-01T00:00:00Z',
          meeting: [],
        },
      ],
    }

    expect(useFindDiffInColDueOrder(oldCol, newCol)).toEqual([])
  })

  it('handles completely reordered applications', () => {
    const oldCol: Column = {
      id: 'col1',
      title: 'Applied',
      applications: [createApp('1', 0), createApp('2', 1), createApp('3', 2)],
    }

    const newCol: Column = {
      ...oldCol,
      applications: [createApp('1', 2), createApp('2', 0), createApp('3', 1)],
    }

    expect(useFindDiffInColDueOrder(oldCol, newCol).sort()).toEqual(['1', '2', '3'])
  })
})
