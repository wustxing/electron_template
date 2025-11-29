import { ipcMain, dialog, app } from 'electron'
import fs from 'fs-extra'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { zipFolder } from '$electron/exposes/files/zip'
import {getTempPath,getResolvePath} from "$electron/configs"
const __dirname = app.getAppPath()
const tempPath = getTempPath()
const basePath = getResolvePath()
// console.log("__dirname===", __dirname)
// const __dirname = path.dirname(fileURLToPath(import.meta.url))
console.log("__dirname===", __dirname)
async function copyFile(filePaths) {
    // 原始文件路径（可以是用户选择的路径）
    if (filePaths.length == 0) {
        return;
    }

    // 目标路径：当前项目根目录下的
    const targetDir = path.resolve(tempPath, "images")
    // const targetDir1 = path.resolve(__dirname,"temp","t1", "images")
    console.log("targetDir===", targetDir)
    await fs.remove(targetDir)
    for (let i = 0; i < filePaths.length; i++) {
        const targetPath = path.join(targetDir, path.basename(filePaths[i]))
        // // 确保目标目录存在
        await fs.ensureDir(targetDir)
        // // 复制文件
        await fs.copy(filePaths[i], targetPath)


        // const targetPath1 = path.join(targetDir1, path.basename(filePaths[i]))
        //  // // 确保目标目录存在
        //  await fs.ensureDir(targetDir1)
        //  // // 复制文件
        //  await fs.copy(filePaths[i], targetPath1)
    }

}

async function copyDataFile() {
    const targetDir = path.resolve(tempPath, "js")
    const dataPath = path.join(targetDir, 'data.js')
    const dataFilePath = path.join(targetDir, 'data_temp.js')
    console.log("copydata文件")
    await fs.copy(dataFilePath, dataPath)
}


async function replacePlaceholderInJs(filePath, placeholder, obj) {
    const content = await fs.readFile(filePath, 'utf-8')

    console.log(`🔍 正在替换占位符: ${filePath}`, obj)
    // 将对象格式化成 JS 对象文本（不是 JSON 字符串）
    const replacement = JSON.stringify(obj, null, 2)

    // 替换占位符（注意不要加引号）
    const newContent = content.replace(placeholder, replacement)

    await fs.writeFile(filePath, newContent, 'utf-8')
    console.log(`✅ 替换完成: ${filePath}`)
}





export default (mainWindow) => {

    ipcMain.handle('createZip', async (event, data) => {
        const targetDir = path.resolve(tempPath)
        const zipPath = path.resolve(basePath, 'temp', data.activity_id + ".zip")
        console.log("zipPath===", zipPath,data.upath)
        
        await zipFolder(
            targetDir,
            zipPath
        )
        //复制到选择的目录
        if(data.upath){
            let upath = path.resolve(data.upath, data.activity_id + ".zip")
            console.log("upath===", upath)
            await fs.copy(zipPath, upath)
        }
        await fs.remove(zipPath)
    })
    ipcMain.handle('replaceInFiles', async (event, data) => {

        await copyDataFile();
        const targetDir = path.resolve(tempPath, "js")

        await replacePlaceholderInJs(
            path.resolve(targetDir, 'data.js'),
            '$__pagedata__',
            data
        )
    })
    ipcMain.handle('dialog:openDirectory', async () => {
        const result = await dialog.showOpenDialog({
            properties: ['openDirectory']
        })
        if (result.canceled) {
            return null
        } else {
            return result.filePaths[0] // 返回选中的文件夹路径
        }
    })

    // 遍历文件夹内容
    ipcMain.handle('directory:readFiles', async (event, folderPath) => {
        try {
            let fileNames = []
            let filePaths = []
            console.log("folderPath===", folderPath)
            let files = fs.readdirSync(folderPath)
            console.log("files===", files)
            files.forEach(file => {
                if (file.includes('.jpg') || file.includes('.png')) {
                    fileNames.push(file)
                    filePaths.push(path.join(folderPath, file))

                }
            })
            //复制文件到指定目录
            copyFile(filePaths)
            return fileNames
        } catch (error) {
            console.error('读取文件夹失败:', error)
            return []
        }
    })

}
