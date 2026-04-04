import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface TimerStore {
  elapsed: number     // seconds
  isRunning: boolean
  start: () => void
  pause: () => void
  reset: () => void
  tick: () => void
}

export const useTimerStore = create<TimerStore>()(
  persist(
    (set) => ({
      elapsed: 0,
      isRunning: false,
      start: () => set({ isRunning: true }),
      pause: () => set({ isRunning: false }),
      reset: () => set({ elapsed: 0, isRunning: false }),
      tick:  () => set((s) => ({ elapsed: s.elapsed + 1 })),
    }),
    {
      name: 'writing-tracker-timer',
      // Only persist elapsed — re-evaluate isRunning fresh on load
      partialize: (s) => ({ elapsed: s.elapsed }),
    },
  ),
)
