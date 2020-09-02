/**
 * entry
 */ 
import getProjectInfo from './getProjectInfo'
import * as centerRepositoryManager from './centerRepositoryManager'
import * as configManager from './configManager'
import * as yargs from 'yargs'


if (yargs.argv.config) {
    (async () => {
        const data = await centerRepositoryManager.getResourceConfig()
        console.log(data.length)
    })()
}

if (yargs.argv.info) {
    console.log('~~~~~~~~~~~~~~获取项目工程信息~~~~~~~~~~~~~~~~~~');

    (async () => {

        const res1 = await getProjectInfo()
        console.log(res1)
    })()
}

if (yargs.argv.init) {
    console.log('~~~~~~~~~~~~~~初始化中心仓库~~~~~~~~~~~~~~~~~~');
    (async () => {
        await centerRepositoryManager.initPrivateCenterRepository()
        console.log('初始化隐式中心仓库完成')
    })()
}

if (yargs.argv.add) {
    console.log('~~~~~~~~~~~~~~configManager add~~~~~~~~~~~~~~~~~~');
    (async () => {
        const projectInfo: any = await getProjectInfo()
        const res = await configManager.add(
            new configManager.User(projectInfo.userName, projectInfo.userEmail, 'department1' + Date.now()),
            new configManager.Repository(projectInfo.repository, projectInfo.banchName, projectInfo.commitId)
        )
    })()
}

if (yargs.argv.clone) {
    console.log('~~~~~~~~~~~~~~configManager add~~~~~~~~~~~~~~~~~~');
    (async () => {
        const projectInfo: any = await getProjectInfo()
        const res = await configManager.add(
            new configManager.User(projectInfo.userName, projectInfo.userEmail, 'department1' + Date.now()),
            new configManager.Repository(projectInfo.repository, projectInfo.banchName, projectInfo.commitId)
        )
    })()
}


// 仓库检测
// 仓库地址、必填字段、目录结构
// 
// 信息获取
// 获取仓库地址
// 获取分支信息
// 获取用户名
// 获取邮箱
//
// 中心仓库
// https://www.npmjs.com/package/user-home
// 隐式仓库目录定义
// 隐式仓库初始化 
// 目录结构定义
// 分支使用定义
// 
// 
// 信息保存
// 配置文件定义
// 提交机制
// 
// 仓库处理
// 配置文件读取 http://gitlab-jdd.jd.com/jdd/feds/raw/master/物料市场方案讨论.md 
// 根据配置初始化对应业务线中心仓库
// 仓库克隆
// 仓库重置
// 多业务线分支