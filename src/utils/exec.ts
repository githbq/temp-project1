
const util = require('util');
const exec = util.promisify(require('child_process').exec);

export default async (command, options?) => {
    const stdio = await exec(command, options);
    if (stdio.stderr && !stdio.stdout) {
        return Promise.reject(new Error(stdio.stderr))
    }
    return stdio.stdout
}