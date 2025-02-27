export interface Task {
  id: string
  title: string
  description?: string
  completed: boolean
  dueDate: string
  createdAt: string
  parentId?: string
  subtasks?: string[]
  priority?: "low" | "medium" | "high"
  files?: {
    name: string
    size: number
    type: string
    url: string
  }[]
  tags?: string[]
  shareId?: string
}

