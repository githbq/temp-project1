
import * as path from 'path'
import * as fs from 'fs-extra'
import * as jsonBeautify from 'json-beautify'
import exec from './utils/exec'

import {
    cwd,
    userHomeDirectory,
    centerRepositoryFolderName,
    centerRepositoryDirectory,
    centerRepositoryGitUrl,
    configFileAbsolutePath,
    configFileRelativePath,
    getSubmouleRelativePath
} from './consts'



export const initPrivateCenterRepository = async () => {
    // 确认用户目录
    await fs.ensureDir(userHomeDirectory)
    // 移除旧仓库目录
    await fs.remove(centerRepositoryDirectory)
    // 克隆中心仓库master分支至指定用户目录
    await exec(
        `git clone --depth=1 ${centerRepositoryGitUrl} ${centerRepositoryFolderName} -b master`,
        { cwd: userHomeDirectory },
        true)
    // 确保配置文件存在 
    await fs.ensureFile(configFileAbsolutePath)
    // 打开目录验证
    await exec('open ' + userHomeDirectory)
}
export const syncCenterRepository = async () => {
    await exec(`git remote update && git reset --hard origin/master`, { cwd: centerRepositoryDirectory }, true)
}

export const udpateConfigFile = async (config) => {
    if (!config) return
    console.log(1)
    await syncCenterRepository()
    const configContent = (jsonBeautify as any)(config, null, 2, 80)
    console.log(2)
    await fs.outputFile(configFileAbsolutePath, configContent)
    console.log(3)
    await exec(`git commit -am ${config[config.length - 1].user.name}-register`, { cwd: centerRepositoryDirectory }, true)
    console.log(4)
    await exec('git push origin master', { cwd: centerRepositoryDirectory }, true)

    const configNew = await getResourceConfig()
    console.log('config length', configNew.length)
}

export const getResourceConfig = async () => {
    await syncCenterRepository()
    const data = await fs.readJson(configFileAbsolutePath) || []
    console.log('datadatadatadatadata.length', data[data.length - 1])
    return data
}


export const clonePublicCenterRepository = async (cwd) => {
    await exec(
        `git clone ${centerRepositoryGitUrl} ${centerRepositoryFolderName} -b master`,
        { cwd },
        true)
}

export const initPublicCenterRepositoryWitchBranch = async (cwd?, branch?) => { 
    const projectPath = path.join(cwd, centerRepositoryFolderName)
    const configPath = path.join(projectPath, configFileRelativePath)
    await fs.remove(projectPath)
    await exec(
        `git clone --depth=1 ${centerRepositoryGitUrl} ${centerRepositoryFolderName} -b master`,
        { cwd },
        true)
    const resourceConfig = await fs.readJSON(configPath)
    console.log('resourceConfigresourceConfigresourceConfig', resourceConfig)
    await initSubmodules(projectPath, resourceConfig)
}

const initSubmodules = async (cwd, config) => {
    const promises = config.map(
        async ({ user, repository }) => {
            await exec(
                `git submodule add ${repository.url} ${getSubmouleRelativePath(user.department, repository.name)}`,
                { cwd },
                true)
        })
    await Promise.all(promises)
}


// 从远程直接读取文件内容存在较大缓存问题
// export const getResourceConfig = async () => {
//     const { data } = await axios.get(configFileRemoteUrl + '?n=' + Math.random())
//     console.log('datadatadatadatadata.length', data[data.length-1])
//     return data
// }
