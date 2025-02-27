import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Task } from '@/types/task'
import { generateSubtasks, prioritizeTasks } from './ai'

interface TodoState {
	tasks: Task[]
	aiPrioritization: boolean
	hideCompleted: boolean
	selectedTags: string[]
	searchQuery: string
	addTask: (task: Task) => void
	updateTask: (task: Task) => void
	deleteTask: (taskId: string) => void
	toggleComplete: (taskId: string) => void
	addSubtask: (parentId: string, subtask: Task) => void
	addAiSubtasks: (parentId: string, taskDescription: string, depth: number) => Promise<void>
	setAiPrioritization: (enabled: boolean) => void
	setHideCompleted: (hidden: boolean) => void
	setSelectedTags: (tags: string[]) => void
	setSearchQuery: (query: string) => void
	importTasks: (tasks: Task[]) => void
	clearTasks: () => void
	getSubtasks: (taskId: string) => Task[]
	getAllSubtasks: (taskId: string) => Task[]
}

export const useTodoStore = create<TodoState>()(
	persist(
		(set, get) => ({
			tasks: [],
			aiPrioritization: false,
			hideCompleted: false,
			selectedTags: [],
			searchQuery: '',

			addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),

			updateTask: (updatedTask) =>
				set((state) => ({
					tasks: state.tasks.map((task) =>
						task.id === updatedTask.id ? updatedTask : task
					),
				})),

			deleteTask: (taskId) =>
				set((state) => {
					const allSubtaskIds = get().getAllSubtasks(taskId).map(task => task.id)
					return {
						tasks: state.tasks.filter(
							(task) => task.id !== taskId && !allSubtaskIds.includes(task.id)
						),
					}
				}),

			toggleComplete: (taskId) =>
				set((state) => {
					const updatedTasks = state.tasks.map((task) =>
						task.id === taskId
							? { ...task, completed: !task.completed }
							: task
					)
					return { tasks: updatedTasks }
				}),

			addSubtask: (parentId, subtask) =>
				set((state) => ({
					tasks: [...state.tasks, { ...subtask, parentId }],
				})),

			addAiSubtasks: async (parentId, taskDescription, depth) => {
				try {
					const aiSubtasks = await generateSubtasks(taskDescription, depth)
					const subtasksWithParent = aiSubtasks.map((subtask) => ({
						...subtask,
						parentId,
					}))
					set((state) => ({
						tasks: [...state.tasks, ...subtasksWithParent],
					}))
				} catch (error) {
					console.error('Error adding AI subtasks:', error)
				}
			},

			setAiPrioritization: (toggle: boolean) => { // TODO: save the previous state before toggling then when disabled revert to previous state
				set((state) => {
					const newState = { ...state, aiPrioritization: toggle }
					if (toggle) {
						newState.tasks = prioritizeTasks(newState.tasks)
					}
					return newState
				})
			},

			setHideCompleted: (hidden) => set({ hideCompleted: hidden }),
			setSelectedTags: (tags) => set({ selectedTags: tags }), // TODO: fix this not clearing all tasks in one go
			setSearchQuery: (query) => set({ searchQuery: query }),
			importTasks: (tasks) => set((state) => ({ tasks: [...state.tasks, ...tasks] })),
			clearTasks: () => set({ tasks: [] }),

			// Helper functions
			getSubtasks: (taskId) => {
				const state = get()
				return state.tasks.filter((task) => task.parentId === taskId)
			},

			getAllSubtasks: (taskId) => {
				const state = get()
				const result: Task[] = []
				const addSubtasks = (parentId: string) => {
					const subtasks = state.tasks.filter((task) => task.parentId === parentId)
					subtasks.forEach((subtask) => {
						result.push(subtask)
						addSubtasks(subtask.id)
					})
				}
				addSubtasks(taskId)
				return result
			},
		}),
		{
			name: 'todo-storage',
		}
	)
)
