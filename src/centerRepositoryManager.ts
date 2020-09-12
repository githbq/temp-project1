
import * as path from 'path'
import * as fs from 'fs-extra'
import * as jsonBeautify from 'json-beautify'
import exec from './utils/exec'
import debug from './utils/debug'

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
    debug('1:syncCenterRepository')
    await syncCenterRepository()
    const configContent = (jsonBeautify as any)(config, null, 2, 80)
    debug('2:outputFile')
    await fs.outputFile(configFileAbsolutePath, configContent)
    debug('3:git commit')
    await exec(`git commit -am ${config[config.length - 1].user.name}-register`, { cwd: centerRepositoryDirectory }, true)
    debug('4:git push')
    await exec('git push origin master', { cwd: centerRepositoryDirectory }, true)

    const configNew = await getResourceConfig()
    debug('config length', configNew.length)
}

export const getResourceConfig = async () => {
    await syncCenterRepository()
    const data = await fs.readJson(configFileAbsolutePath) || []
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
    debug('resourceConfigresourceConfigresourceConfig', resourceConfig)
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
//     return data
// }
