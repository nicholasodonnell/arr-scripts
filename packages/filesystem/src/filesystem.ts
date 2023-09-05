import {
  chmodSync,
  chownSync,
  existsSync,
  lchownSync,
  mkdirSync,
  rmSync,
  symlinkSync,
  readdirSync,
} from 'fs'

import type { Permissions } from './types'

const setPermissions = (path: string, permissions: Permissions) => {
  try {
    const { gid, uid } = permissions.chown

    if ((uid && !gid) || (!uid && gid)) {
      throw new Error('Both uid and gid must be set')
    }

    if (permissions.chmod) {
      chmodSync(path, permissions.chmod)
    }

    if (uid && gid) {
      chownSync(path, uid, gid)
      lchownSync(path, uid, gid)
    }
  } catch (e: any) {
    const error = new Error(`Failed to set permissions: ${e.message}`)

    throw error
  }
}

export const createDirectoryIfNotExists = (
  dir: string,
  permissions: Permissions,
): boolean => {
  try {
    if (!existsSync(dir)) {
      mkdirSync(dir)
      setPermissions(dir, permissions)

      return true
    }

    return false
  } catch (e: any) {
    const error = new Error(`Failed to create directory: ${e.message}`)

    throw error
  }
}

export const symlinkIfNotExists = (
  source: string,
  destination: string,
  permissions: Permissions,
): boolean => {
  try {
    if (existsSync(source) && !existsSync(destination)) {
      symlinkSync(source, destination, 'dir')
      setPermissions(destination, permissions)

      return true
    }

    return false
  } catch (e: any) {
    const error = new Error(`Failed to create symlink: ${e.message}`)

    throw error
  }
}

export const removeFromDirNotInList = (
  destination: string,
  allowList: string[],
): string[] => {
  const removedDirs: string[] = []

  try {
    const files = readdirSync(destination, { recursive: false })

    for (const file of files) {
      const fullPath = `${destination}/${file}`

      if (!allowList.includes(fullPath)) {
        rmSync(fullPath, { force: true, recursive: true })
        removedDirs.push(fullPath)
      }
    }

    return removedDirs
  } catch (e: any) {
    const error = new Error(
      `Failed to remove directories not in list: ${e.message}`,
    )

    throw error
  }
}
