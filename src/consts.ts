import * as userHome from 'user-home'
import * as path from 'path'

export const userHomeDirectory = path.join(userHome, '.jdd-cli-cache')
export const centerRepositoryFolderName = 'center-repository'
export const centerRepositoryDirectory = path.join(userHomeDirectory, centerRepositoryFolderName)
export const centerRepositoryGitUrl = 'https://github.com/githbq/center-repository.git'
export const configFileRelativePath = 'resource-config.json'
export const configFileAbsolutePath = path.join(centerRepositoryDirectory, configFileRelativePath)
export const configFileRemoteUrl = 'https://raw.githubusercontent.com/githbq/center-repository/master/resource-config.json'