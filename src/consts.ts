import * as userHome from 'user-home'
import * as path from 'path'

export const cwd = process.cwd() || '/Users/hubiqing/temp'
export const userHomeDirectory = path.join(userHome, '.jdd-cli-cache')
export const centerRepositoryFolderName = 'center-repository'
export const centerRepositoryDirectory = path.join(userHomeDirectory, centerRepositoryFolderName)
export const centerRepositoryGitUrl = 'http://gitlab-jdd.jd.com/hubiqing/mark-center-repository.git'
export const configFileRelativePath = 'resource-config.json'
export const configFileAbsolutePath = path.join(centerRepositoryDirectory, configFileRelativePath)
export const configFileRemoteUrl = 'https://raw.githubusercontent.com/githbq/center-repository/master/resource-config.json'
export const submoduleRelativeRoot = 'modules'
export const getSubmouleRelativePath = (type, projectName) => path.join(submoduleRelativeRoot, type, projectName)
