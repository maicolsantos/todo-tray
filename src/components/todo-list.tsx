"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Checkbox } from "./ui/checkbox"
import { Trash2 } from "lucide-react"
import { Card, CardContent } from "./ui/card"
import { useTodoStore } from "../store/todo-store"
import { format } from "date-fns"

export default function TodoList() {
  const [newTodo, setNewTodo] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState("")

  const { todos, addTodo, removeTodo, toggleTodo, updateTodo } = useTodoStore()

  // Sort todos by creation date (newest first) and separate completed todos
  const sortedTodos = [...todos].sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  const activeTodos = sortedTodos.filter(todo => !todo.completed)
  const completedTodos = sortedTodos.filter(todo => todo.completed)

  const handleAddTodo = () => {
    if (newTodo.trim()) {
      addTodo(newTodo)
      setNewTodo("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddTodo()
    }
  }

  const startEditing = (id: string, text: string) => {
    setEditingId(id)
    setEditText(text)
  }

  const saveEdit = (id: string) => {
    if (editText.trim()) {
      updateTodo(id, editText)
    }
    setEditingId(null)
  }

  const renderTodoList = (todos: typeof sortedTodos) => (
    todos.map((todo) => (
      <Card key={todo.id} className="shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <Checkbox
                checked={todo.completed}
                onCheckedChange={() => toggleTodo(todo.id)}
                id={`todo-${todo.id}`}
              />

              {editingId === todo.id ? (
                <Input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onBlur={() => saveEdit(todo.id)}
                  onKeyDown={(e) => e.key === "Enter" && saveEdit(todo.id)}
                  autoFocus
                />
              ) : (
                <div className="flex-1">
                  <label
                    htmlFor={`todo-${todo.id}`}
                    className={`cursor-pointer ${todo.completed ? "line-through text-muted-foreground" : ""}`}
                    onClick={(e) => {
                      e.preventDefault()
                      if (!todo.completed) {
                        startEditing(todo.id, todo.title)
                      }
                    }}
                  >
                    {todo.title}
                  </label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Created: {format(new Date(todo.createdAt), "PPPpp")}
                  </p>
                </div>
              )}
            </div>

            <Button variant="ghost" size="icon" onClick={() => removeTodo(todo.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    ))
  )

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <Input
              placeholder="Add a new task..."
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Button onClick={handleAddTodo}>Add</Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {todos.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">No tasks yet. Add one above!</p>
        ) : (
          <>
            {activeTodos.length > 0 && (
              <div className="space-y-2">
                <h2 className="text-lg font-semibold">Active Tasks</h2>
                {renderTodoList(activeTodos)}
              </div>
            )}

            {completedTodos.length > 0 && (
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-muted-foreground">Completed Tasks</h2>
                {renderTodoList(completedTodos)}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
