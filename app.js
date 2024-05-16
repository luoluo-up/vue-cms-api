const express = require('express')
const app = express()


// 配置 cors 中间件
const cors = require('cors')
app.use(cors())

// 配置解析表单数据中间件：只解析  application/x-www-form-urlencoded 格式数据
app.use(express.urlencoded({ extended: false }))

// 处理接收的 req.body 为空对象问题
var bodyParser = require('body-parser')
app.use(bodyParser.json())

// 使用自己的路由，前面参数是每个接口前面都需要添加的默认路径
const useRouter = require('./router/user')
app.use('/myApi', useRouter)

// app.all("*", function (req, res, next) {
//     //设置允许跨域的域名，*代表允许任意域名跨域
//     res.header("Access-Control-Allow-Origin", "*");
//     //允许的header类型
//     res.header("Access-Contro1-Allow-Headers", "content-type");
//     //跨域允许的请求方式
//     res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
// })

// 配置静态资源目录
app.use(express.static(__dirname + '/public'))

app.listen(8080, () => {
    console.log('开启服务器：http:127.0.0.1:8080');
}) 
