import { create } from "zustand"
import { persist } from "zustand/middleware"

interface SettingsState {
  minimalistMode: boolean
  setMinimalistMode: (enabled: boolean) => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      minimalistMode: false,
      setMinimalistMode: (enabled) => set({ minimalistMode: enabled }),
    }),
    {
      name: "settings-storage",
    },
  ),
)

