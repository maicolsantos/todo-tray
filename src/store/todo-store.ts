import { create } from "zustand"
import { persist } from "zustand/middleware"

interface Todo {
  id: string
  title: string
  completed: boolean
  createdAt: string
}

interface TodoState {
  todos: Todo[]
  addTodo: (title: string) => void
  removeTodo: (id: string) => void
  toggleTodo: (id: string) => void
  updateTodo: (id: string, title: string) => void
}

export const useTodoStore = create<TodoState>()(
  persist(
    (set) => ({
      todos: [],

      addTodo: (title) =>
        set((state) => ({
          todos: [
            ...state.todos,
            {
              id: crypto.randomUUID(),
              title,
              completed: false,
              createdAt: new Date().toISOString(),
            },
          ],
        })),

      removeTodo: (id) =>
        set((state) => ({
          todos: state.todos.filter((todo) => todo.id !== id),
        })),

      toggleTodo: (id) =>
        set((state) => ({
          todos: state.todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)),
        })),

      updateTodo: (id, title) =>
        set((state) => ({
          todos: state.todos.map((todo) => (todo.id === id ? { ...todo, title } : todo)),
        })),
    }),
    {
      name: "todo-storage",
    },
  ),
)
