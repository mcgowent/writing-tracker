import { supabase } from './supabase'
import type { Session, Project } from '../types'

// ── Sessions ──────────────────────────────────────────────────────────────

export async function fetchRemoteSessions(userId: string): Promise<Session[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('user_id', userId)
  if (error) { console.error('fetchRemoteSessions', error); return [] }
  return (data ?? []).map(row => ({
    id:         row.id,
    projectId:  row.project_id,
    date:       row.date,
    wordCount:  row.word_count,
    duration:   row.duration ?? undefined,
    notes:      row.notes ?? undefined,
    createdAt:  row.created_at,
  }))
}

export async function upsertRemoteSession(session: Session, userId: string) {
  if (!supabase) return
  const { error } = await supabase.from('sessions').upsert({
    id:          session.id,
    user_id:     userId,
    project_id:  session.projectId,
    date:        session.date,
    word_count:  session.wordCount,
    duration:    session.duration ?? null,
    notes:       session.notes ?? null,
    created_at:  session.createdAt,
  })
  if (error) console.error('upsertRemoteSession', error)
}

export async function deleteRemoteSession(id: string) {
  if (!supabase) return
  const { error } = await supabase.from('sessions').delete().eq('id', id)
  if (error) console.error('deleteRemoteSession', error)
}

// ── Projects ──────────────────────────────────────────────────────────────

export async function fetchRemoteProjects(userId: string): Promise<Project[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', userId)
  if (error) { console.error('fetchRemoteProjects', error); return [] }
  return (data ?? []).map(row => ({
    id:          row.id,
    name:        row.name,
    color:       row.color,
    targetWords: row.target_words ?? undefined,
    createdAt:   row.created_at,
  }))
}

export async function upsertRemoteProject(project: Project, userId: string) {
  if (!supabase) return
  const { error } = await supabase.from('projects').upsert({
    id:           project.id,
    user_id:      userId,
    name:         project.name,
    color:        project.color,
    target_words: project.targetWords ?? null,
    created_at:   project.createdAt,
  })
  if (error) console.error('upsertRemoteProject', error)
}

export async function deleteRemoteProject(id: string) {
  if (!supabase) return
  const { error } = await supabase.from('projects').delete().eq('id', id)
  if (error) console.error('deleteRemoteProject', error)
}
