import axios from 'axios'


(async () => {
    const res = await axios.get('http://gitlab-jdd.jd.com/jdd/feds/raw/master/%E7%89%A9%E6%96%99%E5%B8%82%E5%9C%BA%E6%96%B9%E6%A1%88%E8%AE%A8%E8%AE%BA.md?inline=true')
    debugger
    console.log(res.data)
})()