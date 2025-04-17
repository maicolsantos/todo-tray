import { create } from "zustand"
import { persist } from "zustand/middleware"

interface NotesState {
  notes: string
  updateNotes: (content: string) => void
}

export const useNotesStore = create<NotesState>()(
  persist(
    (set) => ({
      notes: "",

      updateNotes: (content) =>
        set(() => ({
          notes: content,
        })),
    }),
    {
      name: "notes-storage",
    },
  ),
)
