"use client"

import type React from "react"

import { useState } from "react"
import type { Task } from "@/types/task"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { v4 as uuidv4 } from "uuid"

interface AddSubtaskFormProps {
  parentId: string
  onAddSubtask: (subtask: Task) => void
  onCancel: () => void
}

export default function AddSubtaskForm({ parentId, onAddSubtask, onCancel }: AddSubtaskFormProps) {
  const [title, setTitle] = useState("")
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !dueDate) return

    const newSubtask: Task = {
      id: uuidv4(),
      parentId,
      title: title.trim(),
      completed: false,
      dueDate: dueDate.toISOString(),
      createdAt: new Date().toISOString(),
      subtasks: [],
    }

    onAddSubtask(newSubtask)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 border rounded-md p-3 bg-muted/30">
      <div className="space-y-2">
        <Input
          placeholder="Subtask title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="text-sm"
        />

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium">Due Date (required)</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "w-full justify-start text-left font-normal text-xs h-8",
                  !dueDate && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-3 w-3" />
                {dueDate ? format(dueDate, "PPP") : "Select a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={dueDate} onSelect={setDueDate} initialFocus />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" size="sm" disabled={!title.trim() || !dueDate}>
          Add
        </Button>
      </div>
    </form>
  )
}

