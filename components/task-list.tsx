import type { Task } from "@/types/task"
import TaskItem from "@/components/task-item"

interface TaskListProps {
  tasks: Task[]
  hideCompleted: boolean
  onUpdateTask: (task: Task) => void
  onDeleteTask: (taskId: string) => void
  onToggleComplete: (taskId: string) => void
  onAddSubtask: (parentId: string, subtask: Task) => void
  onAddAiSubtasks: (parentId: string, taskDescription: string, depth: number) => void
}

export default function TaskList({
  tasks,
  hideCompleted,
  onUpdateTask,
  onDeleteTask,
  onToggleComplete,
  onAddSubtask,
  onAddAiSubtasks,
}: TaskListProps) {
  const topLevelTasks = tasks.filter((task) => !task.parentId)
  const filteredTasks = hideCompleted ? topLevelTasks.filter((task) => !task.completed) : topLevelTasks

  return (
    <div className="space-y-4">
      {filteredTasks.length === 0 ? (
        <div className="text-center p-8 border rounded-lg border-dashed bg-card">
          <p className="text-muted-foreground">
            {tasks.length === 0
              ? "No tasks yet. Add a task to get started!"
              : "No visible tasks. Try adding a new task or changing your filters."}
          </p>
        </div>
      ) : (
        filteredTasks.map((task) => (
          console.log("Rendering task", task),
          <TaskItem
            key={task.id}
            task={task}
            allTasks={tasks}
            hideCompleted={hideCompleted}
            onUpdateTask={onUpdateTask}
            onDeleteTask={onDeleteTask}
            onToggleComplete={onToggleComplete}
            onAddSubtask={onAddSubtask}
            onAddAiSubtasks={onAddAiSubtasks}
            level={0}
          />
        ))
      )}
    </div>
  )
}

