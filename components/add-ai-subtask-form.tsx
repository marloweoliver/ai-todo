"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

interface AddAiSubtaskFormProps {
  onAddAiSubtasks: (depth: number) => void
  onCancel: () => void
}

export default function AddAiSubtaskForm({ onAddAiSubtasks, onCancel }: AddAiSubtaskFormProps) {
  const [depth, setDepth] = useState(2)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAddAiSubtasks(depth)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 border rounded-md p-3 bg-muted/30">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-xs font-medium">Subtask Depth (1-5)</Label>
          <div className="flex items-center gap-4">
            <Slider
              value={[depth]}
              min={1}
              max={5}
              step={1}
              onValueChange={(value) => setDepth(value[0])}
              className="flex-1"
            />
            <span className="text-sm font-medium w-4">{depth}</span>
          </div>
          <p className="text-xs text-muted-foreground">Higher depth values will generate more detailed subtasks.</p>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" size="sm">
          Generate Subtasks
        </Button>
      </div>
    </form>
  )
}

