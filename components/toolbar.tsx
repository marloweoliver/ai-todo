"use client"

import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

import type React from "react"

import { useRef } from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Sparkles, Eye, EyeOff, Search, Tag, FileDown, FileUp, BarChart2, X } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import TaskStatistics from "./task-statistics"
import type { Task } from "@/types/task"
import { useTheme } from "next-themes"

interface ToolbarProps {
	preAiPreoritizationState: any
	setPreAiPreoritizationState: () => void
	aiPrioritization: boolean
	toggleAiPrioritization: () => void
	hideCompleted: boolean
	toggleHideCompleted: () => void
	isDarkMode: boolean
	toggleDarkMode: () => void
	showAddTaskForm: boolean
	toggleAddTaskForm: () => void
	tasks: Task[]
	allTags: string[]
	selectedTags: string[]
	onTagSelect: (tag: string) => void
	searchQuery: string
	onSearchChange: (query: string) => void
	onExportTasks: () => void
	onImportTasks: (importedTasks: Task[]) => void
}

export default function Toolbar({
	aiPrioritization,
	toggleAiPrioritization,
	hideCompleted,
	toggleHideCompleted,
	isDarkMode,
	toggleDarkMode,
	showAddTaskForm,
	toggleAddTaskForm,
	tasks,
	allTags,
	selectedTags,
	onTagSelect,
	searchQuery,
	onSearchChange,
	onExportTasks,
	onImportTasks,
}: ToolbarProps) {
	const [showSearch, setShowSearch] = useState(false)
	const [mounted, setMounted] = useState(false)
	const fileInputRef = useRef<HTMLInputElement>(null)
	const { theme, setTheme } = useTheme()

	useEffect(() => setMounted(true), [])

	const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0]
		if (file) {
			const reader = new FileReader()
			reader.onload = (e) => {
				try {
					const importedTasks = JSON.parse(e.target?.result as string)
					onImportTasks(importedTasks)
				} catch (error) {
					console.error("Error importing tasks:", error)
				}
			}
			reader.readAsText(file)
		}
	}

	return (
		<TooltipProvider>
			<motion.div
				className="grid gap-4 p-3 bg-card border rounded-lg shadow-sm md:flex md:flex-wrap md:items-center"
				initial={{ opacity: 0, y: -10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.3 }}
			>
				{/* Primary Actions */}
				<div className="flex items-center gap-2">
					<Button
						onClick={toggleAddTaskForm}
						variant={showAddTaskForm ? "secondary" : "default"}
						className="w-full md:w-auto gap-1"
					>
						<Plus className="h-4 w-4" />
						{showAddTaskForm ? "Cancel" : "Add Task"}
					</Button>
				</div>

				<Separator className="hidden md:block" orientation="vertical" />

				{/* Task Controls */}
				<div className="flex flex-wrap items-center gap-4">
					<div className="flex items-center gap-2">
						<Tooltip>
							<TooltipTrigger asChild>
								<div className="flex items-center gap-2">
									<Switch id="ai-prioritization" checked={aiPrioritization} onCheckedChange={toggleAiPrioritization} />
									<Label
										htmlFor="ai-prioritization"
										className="flex items-center gap-1 cursor-pointer whitespace-nowrap"
									>
										<Sparkles className="h-4 w-4" />
										<span className="hidden sm:inline">AI Priority</span>
									</Label>
								</div>
							</TooltipTrigger>
							<TooltipContent>
								<p>Use AI to prioritize tasks</p>
							</TooltipContent>
						</Tooltip>
					</div>

					<div className="flex items-center gap-2">
						<Tooltip>
							<TooltipTrigger asChild>
								<div className="flex items-center gap-2">
									<Switch id="hide-completed" checked={hideCompleted} onCheckedChange={toggleHideCompleted} />
									<Label htmlFor="hide-completed" className="flex items-center gap-1 cursor-pointer whitespace-nowrap">
										{hideCompleted ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
										<span className="hidden sm:inline">{hideCompleted ? "Show Completed" : "Hide Completed"}</span>
									</Label>
								</div>
							</TooltipTrigger>
							<TooltipContent>
								<p>{hideCompleted ? "Show completed tasks" : "Hide completed tasks"}</p>
							</TooltipContent>
						</Tooltip>
					</div>
				</div>

				<Separator className="hidden md:block" orientation="vertical" />

				{/* Filters */}
				<div className="flex flex-wrap items-center gap-2 sm:gap-4">
					{/* Tag Filter */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" size="sm" className="gap-2 h-9">
								<Tag className="h-4 w-4" />
								<span className="hidden sm:inline">Filter Tags</span>
								{selectedTags.length > 0 && (
									<Badge variant="secondary" className="ml-1">
										{selectedTags.length}
									</Badge>
								)}
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="start" className="w-56">
							{allTags.length === 0 ? (
								<div className="px-2 py-1.5 text-sm text-muted-foreground">No tags available</div>
							) : (
								allTags.map((tag) => (
									<DropdownMenuCheckboxItem
										key={tag}
										checked={selectedTags.includes(tag)}
										onCheckedChange={() => onTagSelect(tag)}
									>
										<div className="flex items-center gap-2">
											<div className="w-2 h-2 rounded-full" />
											{tag}
										</div>
									</DropdownMenuCheckboxItem>
								))
							)}
							{selectedTags.length > 0 && (
								<>
									<DropdownMenuSeparator />
									<DropdownMenuItem onSelect={() => selectedTags.forEach((tag) => onTagSelect(tag))}>
										Clear filters
									</DropdownMenuItem>
								</>
							)}
						</DropdownMenuContent>
					</DropdownMenu>

					{/* Search */}
					<div className="relative flex-1 sm:max-w-[200px]">
						<AnimatePresence>
							{showSearch ? (
								<motion.div
									initial={{ width: 0, opacity: 0 }}
									animate={{ width: "100%", opacity: 1 }}
									exit={{ width: 0, opacity: 0 }}
									className="overflow-hidden"
								>
									<Input
										type="text"
										placeholder="Search tasks..."
										value={searchQuery}
										onChange={(e) => onSearchChange(e.target.value)}
										className="h-9 w-full"
									/>
								</motion.div>
							) : (
								<Button variant="outline" size="icon" className="h-9 w-9" onClick={() => setShowSearch(true)}>
									<Search className="h-4 w-4" />
								</Button>
							)}
						</AnimatePresence>
						{showSearch && (
							<Button
								variant="ghost"
								size="icon"
								className="absolute right-1 top-1 h-7 w-7"
								onClick={() => {
									setShowSearch(false)
									onSearchChange("")
								}}
							>
								<X className="h-4 w-4" />
							</Button>
						)}
					</div>
				</div>

				{/* Actions */}
				<div className="flex items-center gap-2 md:ml-auto">
					<Dialog>
						<DialogTrigger asChild>
							<Button variant="outline" size="icon" className="h-9 w-9">
								<BarChart2 className="h-4 w-4" />
							</Button>
						</DialogTrigger>
						<DialogContent className="max-w-3xl">
							<DialogTitle>Task Statistics & Insights</DialogTitle>
							<TaskStatistics tasks={tasks} />
						</DialogContent>
					</Dialog>

					{/* Import/Export - Hidden on mobile */}
					<div className="hidden md:flex items-center gap-2">
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="outline" size="icon" className="h-9 w-9">
									<FileDown className="h-4 w-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuItem onClick={onExportTasks}>
									<FileDown className="h-4 w-4 mr-2" />
									Export Tasks
								</DropdownMenuItem>
								<DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
									<FileUp className="h-4 w-4 mr-2" />
									Import Tasks
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
						<input ref={fileInputRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
					</div>

					{/* Theme Toggle with Animation */}
					{mounted && (
						<motion.div
							initial={false}
							animate={{
								scale: [1, 0.9, 1],
								rotate: theme === "dark" ? 360 : 0,
							}}
							transition={{ duration: 0.2 }}
						>
							<Button
								variant="outline"
								size="icon"
								onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
								className="h-9 w-9"
							>
								<motion.div
									initial={false}
									animate={{ rotate: theme === "dark" ? 360 : 0 }}
									transition={{ duration: 0.2 }}
								>
									{theme === "dark" ? (
										<motion.svg
											key="sun"
											className="h-4 w-4"
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										>
											<circle cx="12" cy="12" r="5" />
											<line x1="12" y1="1" x2="12" y2="3" />
											<line x1="12" y1="21" x2="12" y2="23" />
											<line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
											<line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
											<line x1="1" y1="12" x2="3" y2="12" />
											<line x1="21" y1="12" x2="23" y2="12" />
											<line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
											<line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
										</motion.svg>
									) : (
										<motion.svg
											key="moon"
											className="h-4 w-4"
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										>
											<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
										</motion.svg>
									)}
								</motion.div>
							</Button>
						</motion.div>
					)}
				</div>
			</motion.div>
		</TooltipProvider>
	)
}

