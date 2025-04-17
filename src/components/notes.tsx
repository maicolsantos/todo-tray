"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent } from "./ui/card"
import { useNotesStore } from "../store/notes-store"
import ReactMarkdown from "react-markdown"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
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
    <Card className="min-h-[500px]">
      <CardContent className="p-6">
        <Tabs defaultValue="edit" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="edit" className="min-h-[400px]">
            <Textarea
              placeholder="Write your notes here... Markdown is supported!"
              className="min-h-[400px] resize-none font-mono"
              value={content}
              onChange={handleChange}
            />
          </TabsContent>

          <TabsContent value="preview" className="min-h-[400px]">
            <div className="prose dark:prose-invert max-w-none min-h-[400px] p-4 border rounded-md overflow-auto">
              {content ? (
                <ReactMarkdown>{content}</ReactMarkdown>
              ) : (
                <p className="text-muted-foreground">Your preview will appear here...</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
