
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
    await exec([`git checkout master`, `git remote update`, `git reset --hard origin/master`],
        { cwd: centerRepositoryDirectory }, true)

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

export const initPublicCenterRepositoryWitchBranch = async (cwd?, branch = 'common') => {
    if (branch === 'master') {
        // 避免master分支被操作
        return
    }
    const projectPath = path.join(cwd, centerRepositoryFolderName)
    const configPath = path.join(projectPath, configFileRelativePath)
    console.log(`移除待clone目标文件夹: ${projectPath}`)
    await fs.remove(projectPath)
    debug(`开始克隆: ${centerRepositoryGitUrl} master`)
    await exec(
        `git clone --depth=1 ${centerRepositoryGitUrl} ${centerRepositoryFolderName} -b master`,
        { cwd },
        true)
    if (!await fs.pathExists(configPath)) {
        await fs.outputJSON(configPath, [])
    }
    const resourceConfig = await fs.readJSON(configPath)
    debug('resourceConfig %O', resourceConfig)
    debug(`重新创建对应分支: ${branch}`, resourceConfig)
    await exec(
        `git branch -D ${branch} && git checkout -b ${branch}`,
        { cwd },
        true)
    await initSubmodules(projectPath, resourceConfig)
    await exec(
        `git push origin branch`,
        { cwd },
        true)
}

const initSubmodules = async (cwd, config) => {
    const promises = config.map(
        async ({ user, repository }) => {
            console.log(`添加子模块${repository.name}@${repository.url} ${repository.branch}`)
            await exec(
                `git submodule add -b ${repository.branch} ${repository.url} ${getSubmouleRelativePath(user.department, repository.name)}`,
                { cwd },
                true)
        })
    await Promise.all(promises)
    await exec(
        `git commit -am "init"`,
        { cwd },
        true)

    console.log(`本地中心仓库初始化完成: cd ${cwd}`)
}


// 从远程直接读取文件内容存在较大缓存问题
// export const getResourceConfig = async () => {
//     const { data } = await axios.get(configFileRemoteUrl + '?n=' + Math.random())
//     return data
// }
