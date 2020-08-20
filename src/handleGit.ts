
import exec from './utils/exec'


const projectInfoHandlers =
    [
        {
            key: 'banchName',
            cmd: 'git name-rev --name-only HEAD',
            handle(stdout) {
                return stdout
            }
        },
        {
            key: 'banchName',
            cmd: 'git remote -v',
            handle(stdout) {
                return stdout
            }
        },
        {
            key: 'userName',
            cmd: 'git config user.name',
            handle(stdout) {
                return stdout
            }
        },
        {
            key: 'userEmail',
            cmd: 'git config user.email',
            handle(stdout) {
                return stdout
            }
        },
        {
            key: 'commitId',
            cmd: 'git rev-parse HEAD',
            handle(stdout) {

            }
        }
    ]
export default async () => {
    const data = {}
    await Promise.all(
        projectInfoHandlers.map(async item => {
            let result
            if (item.cmd) {
                result = await exec(item.cmd)
            }
            data[item.key] = item.handle(result)
        })
    )
    return data
}