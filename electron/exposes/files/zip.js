import path from 'path'
import { execFile } from 'child_process'
import { platform } from 'os'
// import { path7za } from '7zip-bin'
import { app  } from 'electron'
import { createRequire } from 'module'
import {get7zaPath} from "$electron/configs"

// function get7zaPath() {
  // const require = createRequire(import.meta.url)
  // const baseDir = app.isPackaged
  //   ? path.join(process.resourcesPath, 'app.asar.unpacked', 'node_modules', '7zip-bin')
  //   : path.dirname(require.resolve('7zip-bin'))

  // const platformDir = process.platform === 'win32'
  //   ? 'win/x64/7za.exe'
  //   : process.platform === 'darwin'
  //     ? 'mac/7za'
  //     : 'linux/x64/7za'

  // return path.join(baseDir, platformDir)
// }
/**
 * 使用 7-Zip 打包某个目录
 */
 export function zipFolder(sourceDir, outputFile){
  return new Promise((resolve, reject) => {
    const args = ['a', '-tzip', outputFile, `${sourceDir}${path.sep}*`]
    console.log(`📦 打包中: ${args.join(' ')}`)

    execFile(get7zaPath(), args, (err, stdout, stderr) => {
      if (err) {
        console.error(stderr)
        return reject(err)
      }
      console.log(`✅ 打包成功: ${outputFile}`)
      resolve()
    })
  })
}



export default {
  zipFolder
}

  
