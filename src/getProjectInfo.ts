
import * as path from 'path'
import * as fs from 'fs-extra'
import { cwd } from './consts'
import exec from './utils/exec'



const projectInfohandlers =
    [
        {
            key: 'banchName',
            cmd: 'git name-rev --name-only HEAD',
            handler(stdout) {
                return stdout.replace('\n', '')
            }
        },
        {
            key: 'repository',
            cmd: 'git remote -v',
            handler(stdout) {
                let result = ((stdout.match(/(?:\t).*?(?:\(fetch\))/)) || [])[0] || ''
                if (result) {
                    result = result.replace(/(\t|^\s+|\s+$|\s+\(fetch\))+/g, '')
                }
                return result
            }
        },
        {
            key: 'userName',
            cmd: 'git config user.name',
            handler(stdout) {
                return stdout.replace('\n', '')
            }
        },
        {
            key: 'userEmail',
            cmd: 'git config user.email',
            handler(stdout) {
                return stdout.replace('\n', '')
            }
        },
        {
            key: 'commitId',
            cmd: 'git rev-parse HEAD',
            handler(stdout) {
                return stdout.replace('\n', '')
            }
        },
        {
            key: 'name',
            async handler() {
                const packageJSON = await fs.readJSON(path.join(cwd, 'package.json'))
                return packageJSON.name
            }
        },

    ]
export default async () => {
    const data = {}
    await Promise.all(
        projectInfohandlers.map(async item => {
            let result
            if (item.cmd) {
                result = await exec(item.cmd)
            }
            data[item.key] = await item.handler(result)
        })
    )
    return data
}