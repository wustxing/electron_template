import { contextBridge,app } from 'electron'
import path from "node:url"
import { join, resolve } from 'node:path'

export const isPackaged = ['true'].includes(process.env.IS_PACKAGED)
export const extraResolve = (filePath) => {
  const basePath = isPackaged ? process.resourcesPath : 'electron/resources'

  const value = resolve(basePath, 'extra', filePath)

  return value
}

export function exposeContext(key, value) {
  console.log('exposeContext===', process.contextIsolated, key, value)
  if (process.contextIsolated) {
    try {
      contextBridge.exposeInMainWorld(key, value)
    }
    catch (error) {
      console.error(error)
    }
  }
  else {
    window[key] = value
  }
}





