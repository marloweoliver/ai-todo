"use client"

import { useTodoStore } from "@/lib/store"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { format } from "date-fns"

export default function SharedPage() {
    const { tasks } = useTodoStore()
    const sharedTasks = tasks.filter((task) => task.shareId)

    return (
        <div className="container max-w-4xl py-10">
            <h1 className="text-3xl font-bold mb-6">Shared Tasks</h1>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
            >
                {sharedTasks.length === 0 ? (
                    <Card className="p-6 text-center text-muted-foreground">No shared tasks found</Card>
                ) : (
                    sharedTasks.map((task) => (
                        <Card key={task.id} className="p-4">
                            <div className="space-y-2">
                                <div className="font-medium">{task.title}</div>
                                {task.description && <div className="text-sm text-muted-foreground">{task.description}</div>}
                                <div className="flex items-center justify-between text-sm text-muted-foreground">
                                    <div>Due: {format(new Date(task.dueDate), "PPP")}</div>
                                    <div>Shared: {format(new Date(task.shareId!), "PPP")}</div>
                                </div>
                                {task.tags && task.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1">
                                        {task.tags.map((tag) => (
                                            <Badge
                                                key={tag}
                                                variant="secondary"
                                            >
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </Card>
                    ))
                )}
            </motion.div>
        </div>
    )
}

