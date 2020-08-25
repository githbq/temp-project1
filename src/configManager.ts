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
    constructor(url, branch, commitId) {
        this.url = url
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
export const add = async (user: User, repository: Repository) => {
    const config = await getResourceConfig()
    const resourceItem = new ResourceItem(user, repository)
    config.push(resourceItem)
    await udpateConfigFile(config)

    return config
}