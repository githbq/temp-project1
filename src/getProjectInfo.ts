
import exec from './utils/exec'


const projectInfoHandlers =
    [
        {
            key: 'banchName',
            cmd: 'git name-rev --name-only HEAD',
            handle(stdout) {
                return stdout.replace('\n', '')
            }
        },
        {
            key: 'repository',
            cmd: 'git remote -v',
            handle(stdout) {
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
            handle(stdout) {
                return stdout.replace('\n', '')
            }
        },
        {
            key: 'userEmail',
            cmd: 'git config user.email',
            handle(stdout) {
                return stdout.replace('\n', '')
            }
        },
        {
            key: 'commitId',
            cmd: 'git rev-parse HEAD',
            handle(stdout) {
                return stdout.replace('\n', '')
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