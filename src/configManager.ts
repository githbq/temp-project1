import { udpateConfigFile, getResourceConfig } from './centerRepositoryManager'

export class User {
    public name
    public email
    public department
    constructor(name, email, department) {
        this.name = name
        this.email = email
        this.department = department
    }
}

export class Repository {
    public url
    public branch
    public commitId
    public name
    constructor(url, name, branch, commitId) {
        this.url = url
        this.name = name
        this.branch = branch
        this.commitId = commitId
    }
}
export class ResourceItem {
    public user: User
    public repository: Repository
    constructor(user: User, repository: Repository) {
        this.user = user
        this.repository = repository
    }
}
const check = async (configs, config) => {
    let result = true
    const checkActions = [
        () => {
            if (!config.repository.name) {
                console.log(`请确认该项目是否配置package.json name 值`)
                return false
            }
        },
        () => {
            const existingConfig = configs.find(n => n.user.department === config.user.department && n.repository.name === config.repository.name)
            if (existingConfig) {
                if (existingConfig.user.name !== config.user.name) {
                    console.log(`已存在资源${config.repository.name},请更改包名再注册`)
                    return false
                }
            }
        }
    ]
    for (let checkAction of checkActions) {
        const checkResult = await checkAction()
        if (checkResult === false) {
            result = checkResult
            break
        }
    }
    return result
}

const mergeConfigs = (configs, config) => {
    const existingConfig = configs.find(n => n.user.name === config.user.name && n.repository.name === config.repository.name)
    if (!existingConfig) {
        configs.push(config)
    } else {
        Object.assign(existingConfig, config)
    }
}


export const add = async (user: User, repository: Repository) => {
    const resourceItems = await getResourceConfig()

    const resourceItem = new ResourceItem(user, repository)
    const checkResult = await check(resourceItems, resourceItem)
    if (!checkResult) {
        return
    }
    mergeConfigs(resourceItems, resourceItem)
    await udpateConfigFile(resourceItems)
    console.log(`注册${resourceItem.repository.name}成功`)
    return resourceItems
}

/**
 * 根据部门与项目名移除指定资源后更新仓库
 * @param department 
 * @param projectName 
 */
export const remove = async (department, name) => {
    let resourceItems = await getResourceConfig()
    resourceItems = resourceItems.filter(n => !(n.user.department === department && n.repository.name === name))

    await udpateConfigFile(resourceItems)
    console.log(`更新成功`)
    return resourceItems
}