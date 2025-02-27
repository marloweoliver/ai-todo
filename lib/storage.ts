import { promises as fs } from 'fs'
import { join } from 'path'
import { nanoid } from 'nanoid'

const SHARE_DIR = join(process.cwd(), '.share')

async function ensureShareDir() {
  try {
    await fs.access(SHARE_DIR)
  } catch {
    await fs.mkdir(SHARE_DIR, { recursive: true })
  }
}

export async function createShareableLink(data: any) {
  await ensureShareDir()
  const id = nanoid(10)
  const filePath = join(SHARE_DIR, `${id}.json`)
  
  const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000
  await fs.writeFile(filePath, JSON.stringify({ ...data, expiresAt }))
  
  return id
}

export async function getSharedData(id: string) {
  try {
    const filePath = join(SHARE_DIR, `${id}.json`)
    const data = JSON.parse(await fs.readFile(filePath, 'utf-8'))
    
    if (data.expiresAt < Date.now()) {
      await fs.unlink(filePath) 
      return null
    }
    
    return data
  } catch {
    return null
  }
}

export async function cleanupExpiredShares() {
  const files = await fs.readdir(SHARE_DIR)
  for (const file of files) {
    try {
      const filePath = join(SHARE_DIR, file)
      const data = JSON.parse(await fs.readFile(filePath, 'utf-8'))
      if (data.expiresAt < Date.now()) {
        await fs.unlink(filePath)
      }
    } catch {
    }
  }
}
