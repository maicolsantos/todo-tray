"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useNotesStore } from "../store/notes-store"
import { Textarea } from "./ui/textarea"

export default function Notes() {
  const { notes, updateNotes } = useNotesStore()
  const [content, setContent] = useState(notes)

  useEffect(() => {
    // Initialize with stored notes
    setContent(notes)
  }, [notes])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value
    setContent(newContent)
    updateNotes(newContent)
  }

  return (
    <Textarea
      placeholder="Write your notes here..."
      className="resize-none font-mono w-full h-[calc(100vh-52px)]"
      value={content}
      onChange={handleChange}
    />
  )
}
