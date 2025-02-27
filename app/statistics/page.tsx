"use client"

import { useTodoStore } from "@/lib/store"
import TaskStatistics from "@/components/task-statistics"
import { motion } from "framer-motion"

export default function StatisticsPage() {
    const { tasks } = useTodoStore()

    return (
        <div className="container max-w-4xl py-10">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <h1 className="text-3xl font-bold mb-6">Task Statistics</h1>
                <TaskStatistics tasks={tasks} />
            </motion.div>
        </div>
    )
}
