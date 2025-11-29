import { extraResolve } from '$electron/helpers/index.js'


export function get7zaPath() {
    if (process.platform === "darwin") {
        return extraResolve(`7zip-bin/mac/${process.arch}/7za`)
        //   return path.join(__dirname, "mac", process.arch, "7za")
    }
    else if (process.platform === "win32") {
        return extraResolve(`7zip-bin/win/${process.arch}/7za.exe`)
        //   return path.join(__dirname, "win", process.arch, "7za.exe")
    }
    else {
        return extraResolve(`7zip-bin/linux/${process.arch}/7za`)
        //   return path.join(__dirname, "linux", process.arch, "7za")
    }
}

export function getTempPath() {
    return extraResolve(`temp/t1`)
}
export function getResolvePath() {
    return extraResolve("")
}




export const tempPath = getTempPath()
export const resolvePath = getResolvePath()

export default {
    tempPath,
    resolvePath
}

