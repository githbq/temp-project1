/**
 * entry
 */
import axios from 'axios'
import getProjectInfo from './getProjectInfo'
import handleGit from './handleGit'
import configManager from './configManager'


// (async () => {
//     const res = await axios.get('http://gitlab-jdd.jd.com/jdd/feds/raw/master/%E7%89%A9%E6%96%99%E5%B8%82%E5%9C%BA%E6%96%B9%E6%A1%88%E8%AE%A8%E8%AE%BA.md?inline=true')
//     debugger
//     console.log(res.data)
// })()


// console.log('~~~~~~~~~~~~~~获取项目工程信息~~~~~~~~~~~~~~~~~~');

// (async () => {

//     const res1 = await getProjectInfo()
//     console.log(res1)
// })();



// console.log('~~~~~~~~~~~~~~初始化中心仓库~~~~~~~~~~~~~~~~~~');
// (async () => {
//     const res2 = await handleGit()
//     console.log(res2)
// })();

console.log('~~~~~~~~~~~~~~getConfig~~~~~~~~~~~~~~~~~~');
(async () => {
    const res2 = await configManager()
    console.log(res2)
})();


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