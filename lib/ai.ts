"use client"

import type { Task } from "@/types/task"
import { v4 as uuidv4 } from "uuid"

// Function to generate subtasks using AI simulation
export async function generateSubtasks(taskTitle: string, depth: number): Promise<Task[]> {
  try {
    const subtaskTemplates = {
      default: [
        "Research and gather information",
        "Create initial draft",
        "Review and revise",
        "Get feedback",
        "Finalize and complete",
      ],
      project: [
        "Define project scope and objectives",
        "Create project timeline",
        "Assign team responsibilities",
        "Set up project infrastructure",
        "Schedule kickoff meeting",
      ],
      writing: ["Create outline", "Write first draft", "Edit and revise", "Get peer review", "Final proofreading"],
      development: [
        "Setup development environment",
        "Implement core functionality",
        "Write tests",
        "Code review",
        "Deploy and test",
      ],
    }

    let selectedTemplate = subtaskTemplates.default
    if (taskTitle.toLowerCase().includes("project")) {
      selectedTemplate = subtaskTemplates.project
    } else if (taskTitle.toLowerCase().includes("write") || taskTitle.toLowerCase().includes("article")) {
      selectedTemplate = subtaskTemplates.writing
    } else if (taskTitle.toLowerCase().includes("develop") || taskTitle.toLowerCase().includes("code")) {
      selectedTemplate = subtaskTemplates.development
    }

    const selectedSubtasks = selectedTemplate.slice(0, depth)
    const subtasks: Task[] = selectedSubtasks.map((title, index) => ({
      id: uuidv4(),
      title,
      completed: false,
      dueDate: new Date(Date.now() + (index + 1) * 24 * 60 * 60 * 1000).toISOString(), // Spread across days
      createdAt: new Date().toISOString(),
      subtasks: [],
    }))

    return subtasks
  } catch (error) {
    console.error("Error generating subtasks:", error)
    return []
  }
}

export function prioritizeTasks(tasks: Task[]): Task[] {
  try {
    const prioritizedTasks = [...tasks]

    prioritizedTasks.sort((a, b) => {
      if (a.completed && !b.completed) return 1
      if (!a.completed && b.completed) return -1

      const aDate = new Date(a.dueDate)
      const bDate = new Date(b.dueDate)
      const datePriority = aDate.getTime() - bDate.getTime()
      const aHasSubtasks = a.subtasks && a.subtasks.length > 0
      const bHasSubtasks = b.subtasks && b.subtasks.length > 0

      if (aHasSubtasks && !bHasSubtasks) return -1
      if (!aHasSubtasks && bHasSubtasks) return 1

      return datePriority
    })

    return prioritizedTasks.map((task, index, array) => {
      if (task.completed) return { ...task, priority: undefined }

      const position = index / array.length
      let priority: "low" | "medium" | "high"

      if (position < 0.33) {
        priority = "high"
      } else if (position < 0.66) {
        priority = "medium"
      } else {
        priority = "low"
      }

      return { ...task, priority }
    })
  } catch (error) {
    console.error("Error prioritizing tasks:", error)
    return tasks
  }
}

