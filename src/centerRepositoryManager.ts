
import * as fs from 'fs-extra'
import axios from 'axios'
import * as userHome from 'user-home'
import * as path from 'path'
import * as jsonBeautify from 'json-beautify'
import exec from './utils/exec'

const userHomeDirectory = path.join(userHome, '.jdd-cli-cache')
const centerRepositoryFolderName = 'center-repository'
const centerRepositoryDirectory = path.join(userHomeDirectory, centerRepositoryFolderName)
const centerRepositoryGitUrl = 'https://github.com/githbq/center-repository.git'
const configFileRelativePath = 'resource-config.json'
const configFileAbsolutePath = path.join(centerRepositoryDirectory, configFileRelativePath)
const configFileRemoteUrl = 'https://raw.githubusercontent.com/githbq/center-repository/master/resource-config.json'

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

export const udpateConfigFile = async (config) => {
    if (!config) return
    await exec(`git reset --hard origin/master`, { cwd: centerRepositoryDirectory }, true)
    const configContent = (jsonBeautify as any)(config, null, 2, 80)
    await fs.outputFile(configFileAbsolutePath, configContent)
    await exec(`git commit -am ${config[config.length - 1].user.name}-register`, { cwd: centerRepositoryDirectory }, true)
    await exec('git push origin master', { cwd: centerRepositoryDirectory }, true)
}

export const getResourceConfig = async () => {
    const { data } = await axios.get(configFileRemoteUrl)
    return data
}
