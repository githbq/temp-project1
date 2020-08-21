import axios from 'axios'
class User {
    public name
    public email
    public department
}

class Repository {
    public url
    public branch
    public commitId
}
export class ResourceItem {
    public user: User
    public repository: Repository
    constructor({ user, repository }) {
        this.user = user
        this.repository = repository
    }
}


export const get = async () => {
    const { data } = await axios.get('https://raw.githubusercontent.com/githbq/center-repository/master/resource-config.json')
    return data
}

export const add = async (item) => {
    const config = await get()
    const resourceItem = new ResourceItem(item)
    config.push(resourceItem)
    
}