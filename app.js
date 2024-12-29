const express = require("express");
const app = express();

const user_handler = require("./router_handler/user_handler");
// 配置 cors 中间件
const cors = require("cors");
app.use(cors());

// 配置解析表单数据中间件：只解析  application/x-www-form-urlencoded 格式数据
app.use(express.urlencoded({ extended: false }));

// 处理接收的 req.body 为空对象问题
var bodyParser = require("body-parser");
app.use(bodyParser.json());

// 使用自己的路由，前面参数是每个接口前面都需要添加的默认路径
// const useRouter = require("./api/user");
// app.use("/myApi", useRouter);
// 设置前缀
// app.use("/myApi", user_handler);
// 配置静态资源目录
app.use(express.static(__dirname + "/public"));
// 登录接口接口
app.post("/login", user_handler.login_handler);
// 获取用户基本信息接口
app.get("/getUserinfo", user_handler.getUserinfo_handler);
// 获取品牌管理数据接口
app.post("/getBrandData", user_handler.getBrandData_handler);
// 添加或修改品牌数据接口
app.post("/uploadImg", user_handler.uploadImg_handler);
// 修改品牌brandName接口
app.post("/uploadBrandName", user_handler.uploadBrandName_handler);
// 删除某个品牌数据接口
app.post("/delBrandData", user_handler.delBrandData_handler);
// 获取用户管理数据接口
app.get("/getAclUserData", user_handler.getAclUserData_handler);
// 添加用户管理数据接口
app.post("/createUserData", user_handler.createUserData_handler);
// 编辑用户管理数据接口
app.post("/editUserData", user_handler.editUserData_handler);
// 删除用户数据接口
app.post("/delUserData", user_handler.delUserData_handler);
// 修改用户状态接口
app.post("/changeState", user_handler.changeState_handler);
// 获取异步路由数据接口
app.get("/getAsyncRoute", user_handler.getAsyncRoute_handler);
// 分配菜单权限接口
app.post("/distribute", user_handler.distribute_handler);
// 获取浏览板数据接口
app.get("/getMessage", user_handler.getMessage_handler);
// 添加浏览板数据接口
app.post("/addMessage", user_handler.addMessage_handler);
app.listen(8080, () => {
  console.log("开启服务器：http:127.0.0.1:8080");
});
exports.app = app;
