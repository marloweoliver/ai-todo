"use server"

import { kv } from "@vercel/kv"
import { nanoid } from "nanoid"
import type { Task } from "@/types/task"

export async function createShareableLink(data: { tasks?: Task[]; tags?: string[] }) {
  try {
    const id = nanoid(10)
    await kv.set(`share:${id}`, data, { ex: 60 * 60 * 24 * 7 })
    return id
  } catch (error) {
    console.error("Error creating shareable link:", error)
    throw new Error("Failed to create shareable link")
  }
}

export async function getSharedData(id: string) {
  try {
    const data = await kv.get(`share:${id}`)
    return data
  } catch (error) {
    console.error("Error getting shared data:", error)
    throw new Error("Failed to get shared data")
  }
}

