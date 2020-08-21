
import * as fs from 'fs-extra'
import * as userHome from 'user-home'
import * as path from 'path'
import exec from './utils/exec'

const userHomeDirectory = path.join(userHome, '.jdd-cli-cache')
const centerRepositoryFolderName = 'center-repository'
const centerRepositoryDirectory = path.join(userHomeDirectory, centerRepositoryFolderName)
const centerRepositoryGitUrl = 'https://github.com/githbq/axios-ajax.git'
const configFileRelativePath = 'resource-config.json'
const configFileAbsolutePath = path.join(centerRepositoryDirectory, configFileRelativePath)

const initPrivateCenterRepository = async () => {
    // 确认用户目录
    await fs.ensureDir(userHomeDirectory)
    console.log('userHomeDirectory', userHomeDirectory)
    // 移除旧仓库目录
    await fs.remove(centerRepositoryDirectory)
    // 克隆中心仓库master分支至指定用户目录
    await exec(
        `git clone --depth=1 ${centerRepositoryGitUrl} ${centerRepositoryFolderName} -b master`,
        { cwd: userHomeDirectory },
        true)
    // 打开目录验证
    await exec('open ' + userHomeDirectory)
}

const udpateConfigFile = async (configContent) => {
    await fs.outputFile(configFileAbsolutePath, configContent)
    await exec('git commit -m xxxx', { cwd: centerRepositoryDirectory })
    await exec('git push origin master', { cwd: centerRepositoryDirectory })
}
