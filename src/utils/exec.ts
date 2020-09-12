
const util = require('util')
const exec = util.promisify(require('child_process').exec)

export default async (command, options?, silent?) => {
    let message
    try {
        const stdio = await exec(command, options)
        if (!silent && stdio.stderr && !stdio.stdout) {
            return Promise.reject(new Error(stdio.stderr))
        }
        message = stdio.stdout || stdio.stderr
    } catch (error) {
        message = error.message
    }
    return message
}