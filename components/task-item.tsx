"use client"

import type React from "react"

import { useState, useRef } from "react"
import { format } from "date-fns"
import type { Task } from "@/types/task"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChevronDown, Trash, Plus, Calendar, Sparkles, Paperclip, Tag, Share2, MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"
import AddSubtaskForm from "@/components/add-subtask-form"
import AddAiSubtaskForm from "@/components/add-ai-subtask-form"
import { motion, AnimatePresence } from "framer-motion"
import FileUpload from "@/components/file-upload"
import TaskTags from "@/components/task-tags"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { generateSubtasks } from "@/lib/ai"
import { createShareableLink } from "@/lib/actions"
import { useSettingsStore } from "@/lib/settings-store"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface TaskItemProps {
  task: Task
  allTasks: Task[]
  hideCompleted: boolean
  onUpdateTask: (task: Task) => void
  onDeleteTask: (taskId: string) => void
  onToggleComplete: (taskId: string) => void
  onAddSubtask: (parentId: string, subtask: Task) => void
  onAddAiSubtasks: (parentId: string, taskDescription: string, depth: number) => void
  level: number
}

export default function TaskItem({
  task,
  allTasks,
  hideCompleted,
  onUpdateTask,
  onDeleteTask,
  onToggleComplete,
  onAddSubtask,
  onAddAiSubtasks,
  level = 0,
}: TaskItemProps) {
  const [expanded, setExpanded] = useState(true)
  const [showAddSubtaskForm, setShowAddSubtaskForm] = useState(false)
  const [showAddAiSubtaskForm, setShowAddAiSubtaskForm] = useState(false)
  const [showFileUpload, setShowFileUpload] = useState(false)
  const [showTagInput, setShowTagInput] = useState(false)
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [shareableLink, setShareableLink] = useState("")
  const [newTag, setNewTag] = useState("")
  const { minimalistMode } = useSettingsStore()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const findAllSubtasks = (taskId: string): Task[] => {
    const subtasks: Task[] = []
    for (const t of allTasks) {
      if (t.parentId === taskId) {
        subtasks.push(t, ...findAllSubtasks(t.id)) 
      }
    }
    return subtasks
  }
  const subtasks = findAllSubtasks(task.id)
  const filteredSubtasks = hideCompleted ? subtasks.filter((t) => !t.completed) : subtasks
  const completedSubtasks = subtasks.filter((t) => t.completed).length
  const completionPercentage =
    subtasks.length > 0 ? Math.round((completedSubtasks / subtasks.length) * 100) : task.completed ? 100 : 0
  const formattedDueDate = task.dueDate ? format(new Date(task.dueDate), "MMM d, yyyy") : ""
  const daysRemaining = task.dueDate
    ? Math.ceil((new Date(task.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null

  const toggleExpanded = () => {
    setExpanded(!expanded)
  }

  const toggleAddSubtaskForm = () => {
    setShowAddSubtaskForm(!showAddSubtaskForm)
    setShowAddAiSubtaskForm(false)
    setShowFileUpload(false)
  }

  const toggleAddAiSubtaskForm = () => {
    setShowAddAiSubtaskForm(!showAddAiSubtaskForm)
    setShowAddSubtaskForm(false)
    setShowFileUpload(false)
  }

  const toggleFileUpload = () => {
    setShowFileUpload(!showFileUpload)
    setShowAddSubtaskForm(false)
    setShowAddAiSubtaskForm(false)
  }

  const handleFileUpload = (files: File[]) => {
    const updatedFiles = [
      ...(task.files || []),
      ...files.map((file) => ({
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file),
      })),
    ]

    onUpdateTask({ ...task, files: updatedFiles })
    setShowFileUpload(false)
  }

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newTag.trim()) {
      const updatedTags = [...(task.tags || []), newTag.trim()]
      onUpdateTask({ ...task, tags: updatedTags })
      setNewTag("")
      setShowTagInput(false)
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    const updatedTags = (task.tags || []).filter((tag) => tag !== tagToRemove)
    onUpdateTask({ ...task, tags: updatedTags })
  }

  const handleShareTask = async () => {
    try {
      const shareableData = {
        tasks: [task, ...subtasks],
        tags: task.tags,
      }

      const id = await createShareableLink(shareableData)
      const shareUrl = `${window.location.origin}/share/${id}`
      setShareableLink(shareUrl)
      setShowShareDialog(true)
    } catch (error) {
      toast.error("Failed to create shareable link")
    }
  }

  const getDueDateStatusColor = () => {
    if (!daysRemaining || task.completed) return ""

    if (daysRemaining < 0) return "text-red-500 dark:text-red-400"
    if (daysRemaining === 0) return "text-orange-500 dark:text-orange-400"
    if (daysRemaining <= 2) return "text-yellow-500 dark:text-yellow-400"
    return "text-muted-foreground"
  }

  const handleAddAiSubtasks = async (depth: number) => {
    try {
      // TODO: add functionality
      const aiSubtasks = await generateSubtasks(task.title, depth)

      const subtasksWithParent = aiSubtasks.map((subtask) => ({
        ...subtask,
        parentId: task.id,
      }))

      onAddAiSubtasks(task.id, task.title, depth)

      setShowAddAiSubtaskForm(false)
    } catch (error) {
      console.error("Error generating AI subtasks:", error)
    }
  }

  const handleAddSubtask = (subtask: Task) => {
    console.log("Adding subtask:", subtask)
    const subtaskWithParent = {
      ...subtask,
      parentId: task.id,
    }
    onAddSubtask(task.id, subtaskWithParent)
    setShowAddSubtaskForm(false)
  }

  const hasSubtasks = subtasks.length > 0
  const hasVisibleSubtasks = filteredSubtasks.length > 0

  return (
    <div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "border rounded-lg p-4 transition-all bg-card shadow-sm hover:shadow",
            task.completed && "bg-muted/40",
            minimalistMode && "p-2",
          )}
        >
          <div className="flex items-start gap-2">
            <div className="flex items-center h-6 mt-0.5">
              {(hasSubtasks || minimalistMode) && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleExpanded}
                  className="p-0.5 rounded-md hover:bg-muted"
                >
                  <motion.div animate={{ rotate: expanded ? 0 : -90 }} transition={{ duration: 0.2 }}>
                    <ChevronDown className="h-4 w-4" />
                  </motion.div>
                </motion.button>
              )}
            </div>

            <Checkbox checked={task.completed} onCheckedChange={() => onToggleComplete(task.id)} className="mt-1" />

            <div className="flex-1 space-y-1">
              <div className="flex items-start justify-between flex-wrap gap-2">
                <div className={cn("font-medium", task.completed && "line-through text-muted-foreground")}>
                  {task.title}

                  {hasSubtasks && !minimalistMode && (
                    <Badge variant="outline" className="ml-2 text-xs">
                      {completedSubtasks}/{subtasks.length}
                    </Badge>
                  )}
                </div>

                {!minimalistMode && (
                  <div className="flex items-center gap-2 flex-wrap">
                    {task.priority && !task.completed && (
                      <Badge
                        variant={
                          task.priority === "high" ? "destructive" : task.priority === "medium" ? "default" : "secondary"
                        }
                        className="text-xs"
                      >
                        {task.priority}
                      </Badge>
                    )}

                    <div className={cn("flex items-center text-xs", getDueDateStatusColor())}>
                      <Calendar className="h-3 w-3 mr-1" />
                      {formattedDueDate}
                      {daysRemaining !== null && !task.completed && (
                        <span className="ml-1">
                          {daysRemaining === 0
                            ? "(Today)"
                            : daysRemaining < 0
                              ? `(${Math.abs(daysRemaining)}d overdue)`
                              : `(${daysRemaining}d left)`}
                        </span>
                      )}
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setShowTagInput(true)}>
                          <Tag className="h-4 w-4 mr-2" />
                          Add Tag
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={toggleFileUpload}>
                          <Paperclip className="h-4 w-4 mr-2" />
                          Attach Files
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleShareTask}>
                          <Share2 className="h-4 w-4 mr-2" />
                          Share Task
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDeleteTask(task.id)} className="text-destructive">
                          <Trash className="h-4 w-4 mr-2" />
                          Delete Task
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              </div>

              {task.description && (
                <p className={cn("text-sm text-muted-foreground", task.completed && "line-through")}>{task.description}</p>
              )}

              {/* Tags */}
              {task.tags && task.tags.length > 0 && (
                <TaskTags
                  tags={task.tags}
                  onRemoveTag={handleRemoveTag}
                  onUpdateTagColor={(tag, color) => {
                    const updatedTags = (task.tags || []).map((t) =>
                      t === tag ? t : t
                    )
                    onUpdateTask({ ...task, tags: updatedTags })
                  }}
                />
              )}

              {showTagInput && (
                <div className="flex items-center gap-2 mt-2">
                  <Input
                    type="text"
                    placeholder="Add tag and press Enter"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={handleAddTag}
                    className="h-8 text-sm"
                  />
                  <Button size="sm" variant="ghost" onClick={() => setShowTagInput(false)}>
                    Cancel
                  </Button>
                </div>
              )}

              {/* Progress bar */}
              {!minimalistMode && hasSubtasks && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Progress</span>
                    <span>{completionPercentage}%</span>
                  </div>
                  <Progress value={completionPercentage} className="h-1" />
                </div>
              )}

              {/* File attachments */}
              {task.files && task.files.length > 0 && (
                <div className="mt-2">
                  <Label className="text-xs font-medium mb-1">Attachments</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {task.files.map((file, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative group"
                      >
                        {file.type.startsWith("image/") ? (
                          <div className="relative w-16 h-16 rounded-md overflow-hidden border">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={file.url || "/placeholder.svg"}
                              alt={file.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="flex items-center justify-center w-16 h-16 rounded-md border bg-muted">
                            <Paperclip className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-md flex items-center justify-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-white hover:text-white"
                            onClick={() => {
                              const updatedFiles = task.files?.filter((_, i) => i !== index)
                              onUpdateTask({ ...task, files: updatedFiles })
                            }}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Controls */}
              {!task.completed && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2 mt-2">
                  <Button variant="outline" size="sm" className="h-7 text-xs" onClick={toggleAddSubtaskForm}>
                    <Plus className="h-3 w-3 mr-1" /> Add Subtask
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs group relative"
                    onClick={toggleAddAiSubtaskForm}
                  >
                    <Sparkles className="h-3 w-3 mr-1 group-hover:text-primary transition-colors" />
                    AI Subtasks
                    {showAddAiSubtaskForm && (
                      <motion.div
                        layoutId="active-indicator"
                        className="absolute inset-0 border-2 border-primary rounded-md"
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </Button>
                </motion.div>
              )}

              {/* Forms */}
              <AnimatePresence>
                {showAddSubtaskForm && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-2">
                      <AddSubtaskForm
                        parentId={task.id}
                        onAddSubtask={handleAddSubtask}
                        onCancel={() => setShowAddSubtaskForm(false)}
                      />
                    </div>
                  </motion.div>
                )}

                {showAddAiSubtaskForm && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-2">
                      <AddAiSubtaskForm
                        onAddAiSubtasks={handleAddAiSubtasks}
                        onCancel={() => setShowAddAiSubtaskForm(false)}
                      />
                    </div>
                  </motion.div>
                )}

                {showFileUpload && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-2">
                      <FileUpload onUpload={handleFileUpload} onCancel={() => setShowFileUpload(false)} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Subtasks */}
              <AnimatePresence>
                {hasVisibleSubtasks && expanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className={cn("mt-3 space-y-3 border-l", minimalistMode ? "pl-2" : "pl-4")}>
                      {filteredSubtasks.map((subtask) => (
                        <TaskItem
                          key={subtask.id}
                          task={subtask}
                          allTasks={allTasks}
                          hideCompleted={hideCompleted}
                          onUpdateTask={onUpdateTask}
                          onDeleteTask={onDeleteTask}
                          onToggleComplete={onToggleComplete}
                          onAddSubtask={onAddSubtask}
                          onAddAiSubtasks={onAddAiSubtasks}
                          level={level + 1}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Share Dialog */}
          <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
            <DialogContent>
              <DialogTitle>Share Task</DialogTitle>
              <DialogHeader>
                <DialogTitle>Share Task</DialogTitle>
                <DialogDescription>Share this task and its subtasks with others</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Input value={shareableLink} readOnly className="flex-1" />
                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText(shareableLink)
                      toast.success("The shareable link has been copied to your clipboard")
                    }}
                  >
                    Copy Link
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>
    </div>
  )
}

