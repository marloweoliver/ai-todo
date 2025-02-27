"use client"

import { useMemo, useState } from "react"
import TaskList from "@/components/task-list"
import AddTaskForm from "@/components/add-task-form"
import Toolbar from "@/components/toolbar"
import { useTheme } from "next-themes"
import { motion, AnimatePresence } from "framer-motion"
import { useTodoStore } from "@/lib/store"
import type { Task } from "@/types/task"

export default function TodoApp() {
  const {
    tasks,
    aiPrioritization,
    hideCompleted,
    selectedTags,
    searchQuery,
    setAiPrioritization,
    setHideCompleted,
    setSelectedTags,
    setSearchQuery,
    addTask,
    updateTask,
    deleteTask,
    toggleComplete,
    addSubtask,
    addAiSubtasks,
    importTasks,
  } = useTodoStore()

  const [showAddTaskForm, setShowAddTaskForm] = useState(false)
  const { theme, setTheme } = useTheme()
  const [preAiPreoritizationState, setPreAiPreoritizationState] = useState()
  function allTags(): string[] {
    const tagSet = new Set<string>()
    tasks.forEach((task) => {
      task.tags?.forEach((tag) => {
        tagSet.add(tag)
      })
    })
    console.log("Bobs the uncle", tagSet)
    return Array.from(tagSet)
  }
  // TODO: Fix this not showing child tasks when filtering by tag
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        searchQuery === "" ||
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesTags =
        selectedTags.length === 0 || selectedTags.every((tag) => task.tags?.some((t) => t === tag))

      return matchesSearch && matchesTags
    })
  }, [tasks, searchQuery, selectedTags])

  const handleAddTask = (newTask: Task) => {
    addTask(newTask)
    setShowAddTaskForm(false)
  }

  const handleTagSelect = (tag: string) => {
    setSelectedTags(selectedTags.includes(tag) ? selectedTags.filter((t) => t !== tag) : [...selectedTags, tag])
  }

  const handleExportTasks = () => {
    const dataStr = JSON.stringify(tasks, null, 2)
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`
    const exportFileDefaultName = `todo-backup-${new Date().toISOString()}.json`
    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <motion.div
        className="flex flex-col gap-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
          Smart Todo List
        </h1>
        <p className="text-muted-foreground">Organize your tasks with AI assistance</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        <Toolbar
          preAiPreoritizationState={preAiPreoritizationState}
          setPreAiPreoritizationState={() => setPreAiPreoritizationState}
          aiPrioritization={aiPrioritization}
          toggleAiPrioritization={() => setAiPrioritization(!aiPrioritization)}
          hideCompleted={hideCompleted}
          toggleHideCompleted={() => setHideCompleted(!hideCompleted)}
          isDarkMode={theme === "dark"}
          toggleDarkMode={() => setTheme(theme === "dark" ? "light" : "dark")}
          showAddTaskForm={showAddTaskForm}
          toggleAddTaskForm={() => setShowAddTaskForm(!showAddTaskForm)}
          tasks={tasks}
          allTags={allTags()}
          selectedTags={selectedTags}
          onTagSelect={handleTagSelect}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onExportTasks={handleExportTasks}
          onImportTasks={importTasks}
        />
      </motion.div>

      <AnimatePresence mode="wait">
        {showAddTaskForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="bg-card border rounded-lg shadow-sm">
              <AddTaskForm onAddTask={handleAddTask} onCancel={() => setShowAddTaskForm(false)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <TaskList
        tasks={filteredTasks}
        hideCompleted={hideCompleted}
        onUpdateTask={updateTask}
        onDeleteTask={deleteTask}
        onToggleComplete={toggleComplete}
        onAddSubtask={addSubtask}
        onAddAiSubtasks={addAiSubtasks}
      />
    </div>
  )
}

