import { format, subDays } from 'date-fns'
import type { Project, Session } from '../types'

// Helper: date string N days ago
const d = (offset: number) => format(subDays(new Date(), offset), 'yyyy-MM-dd')

export const MOCK_PROJECTS: Project[] = [
  { id: 'proj-1', name: 'Novel: The Last Signal', color: '#7c3aed', createdAt: d(60) },
  { id: 'proj-2', name: 'Blog Posts',             color: '#0891b2', createdAt: d(30) },
  { id: 'proj-3', name: 'Short Stories',          color: '#059669', createdAt: d(20) },
]

export const MOCK_SESSIONS: Session[] = [
  // Today — partial progress toward goal
  {
    id: 's-1', projectId: 'proj-1', date: d(0), wordCount: 650, duration: 45,
    notes: 'Got the protagonist into trouble. Scene is finally alive.',
    createdAt: d(0),
  },
  // Yesterday — strong session
  {
    id: 's-2', projectId: 'proj-1', date: d(1), wordCount: 1200, duration: 90,
    notes: 'The big confrontation scene finally clicked.',
    createdAt: d(1),
  },
  // 2 days ago
  {
    id: 's-3', projectId: 'proj-2', date: d(2), wordCount: 800,
    createdAt: d(2),
  },
  // 3 days ago — short session
  {
    id: 's-4', projectId: 'proj-1', date: d(3), wordCount: 300,
    notes: 'Only had 20 minutes but kept the streak alive.',
    createdAt: d(3),
  },
  // 4 days ago — skipped (streak breaks here intentionally)

  // 5 days ago
  {
    id: 's-5', projectId: 'proj-3', date: d(5), wordCount: 1500, duration: 120,
    notes: 'Finished first draft of "The Waiting Room".',
    createdAt: d(5),
  },
  // 6 days ago
  {
    id: 's-6', projectId: 'proj-2', date: d(6), wordCount: 600,
    createdAt: d(6),
  },
  // 7 days ago
  {
    id: 's-7', projectId: 'proj-1', date: d(7), wordCount: 900,
    createdAt: d(7),
  },
  // 8 days ago
  {
    id: 's-8', projectId: 'proj-1', date: d(8), wordCount: 1100,
    notes: 'Back-to-back sessions this week.',
    createdAt: d(8),
  },
  // 9 days ago
  {
    id: 's-9', projectId: 'proj-3', date: d(9), wordCount: 400,
    createdAt: d(9),
  },
  // 10 days ago
  {
    id: 's-10', projectId: 'proj-2', date: d(10), wordCount: 750,
    createdAt: d(10),
  },
  // 13 days ago — big session
  {
    id: 's-11', projectId: 'proj-1', date: d(13), wordCount: 2000, duration: 150,
    notes: 'Marathon session. Found the voice for chapter three.',
    createdAt: d(13),
  },
]
