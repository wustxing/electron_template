
import fs from 'fs'
import path from 'path'
import {zipFolder} from './zip'

export function readDirectory(directoryPath, extensionFilter){
    try {
        const files = fs.readdirSync(directoryPath)
        const filteredFiles = files.filter(file => {
          const filePath = path.join(directoryPath, file)
          const stat = fs.statSync(filePath)
          return stat.isFile() && (extensionFilter ? file.endsWith(extensionFilter) : true)
        })
        return filteredFiles
      } catch (error) {
        console.error('读取目录失败:', error)
        return []
      }
}

export default {
    readDirectory,
    zipFolder
}

// 暴露一个 readDirectory 函数
// contextBridge.exposeInMainWorld('fileAPI', {
  
// })
