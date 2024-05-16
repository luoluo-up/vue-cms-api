// 引入模块
const { formidable } = require('formidable')
const path = require('path')
const fs = require('fs')


// 随机唯一值id
var uuid = require('node-uuid');
// console.log(uuid.v1());  // 根据时间
// console.log(uuid.v4()); // 根据随机数
// 品牌管理数据
let tableData = []
// 用户管理数据
let userData = [
    {
        userNumber: 'admin',
        userName: 'admin管理员',
        userSex: '男',
        userPhone: '13075900144',
        userRole: '管理员',
        date: '2024-01-01',
        state: false,
        id: uuid.v4(),
        Email: '2qq@w.com',
        section: '地区',
        brief: '简介11111',
        passWord: '123456',
        token: 'tokenAdmin',
    },
    {
        userNumber: 'test',
        userName: '测试用户',
        userSex: '女',
        userPhone: '13075900144',
        userRole: '管理员',
        date: '2022-03-08',
        state: false,
        id: uuid.v4(),
        Email: '2qq@w.com',
        section: '地区',
        brief: '简介22222',
        passWord: '123456',
        token: 'tokenTest',
    }
]
// 对应用户路由权限
let userRoutes = [
    {
        token: 'tokenAdmin',
        routes: ['Product', 'productBrand', 'producSku', 'producSpu', 'Acl', 'aclUser', 'aclRole', 'aclMenus']
    },
    {
        token: 'tokenTest',
        routes: ['Product', 'productBrand', 'producSku', 'Acl', 'aclUser']
    }
]
// 给用户管理数据表格中添加用户的菜单权限数据
userData.forEach((item, index) => {
    item.routes = userRoutes[index].routes
})
// 异步路由数据
const asyncRoutes = [
    // 商品管理
    {
        path: '/product',
        redirect: '/product/brand',
        name: 'Product',
        label: '商品管理',
        component: () => import('@/layout/Layout.vue'),
        meta: {
            title: 'menu.product.title',
            icon: 'ShoppingBag',
            hidden: false
        },
        children: [
            {
                path: '/product/brand',
                name: 'productBrand',
                component: () => import('@/views/product/brand/index.vue'),
                label: '品牌管理',
                meta: {
                    title: 'menu.product.brand',
                    icon: 'Shop',
                    hidden: false
                },
            },
            {
                path: '/product/spu',
                name: 'producSpu',
                label: 'SPU管理',
                component: () => import('@/views/product/spu/index.vue'),
                meta: {
                    title: 'menu.product.spu',
                    icon: 'Shop',
                    hidden: false
                },
            },
            {
                path: '/product/sku',
                name: 'producSku',
                label: 'SKU管理',
                component: () => import('@/views/product/sku/index.vue'),
                meta: {
                    title: 'menu.product.sku',
                    icon: 'Shop',
                    hidden: false
                },
            },
        ]
    },

    // 权限管理
    {
        path: '/acl',
        redirect: '/acl/user',
        name: 'Acl',
        label: '权限管理',
        component: () => import('@/layout/Layout.vue'),
        meta: {
            title: 'menu.acl.title',
            icon: 'Histogram',
            hidden: false
        },
        children: [
            {
                path: '/acl/user',
                name: 'aclUser',
                label: '用户管理',
                component: () => import('@/views/acl/user/index.vue'),
                meta: {
                    title: 'menu.acl.user',
                    icon: 'User',
                    hidden: false
                },
            },
            {
                path: '/acl/role',
                name: 'aclRole',
                label: '角色管理',
                component: () => import('@/views/acl/role/index.vue'),
                meta: {
                    title: 'menu.acl.role',
                    icon: 'UserFilled',
                    hidden: false
                },
            },
            {
                path: '/acl/menus',
                name: 'aclMenus',
                label: '菜单管理',
                component: () => import('@/views/acl/menus/index.vue'),
                meta: {
                    title: 'menu.acl.menu',
                    icon: 'List',
                    hidden: false
                },
            },
        ]
    },
]
//  留言板数据
let messageData = []



// 登录接口方法
exports.login_handler = (req, res) => {
    const data = req.body;
    const result = userData.some(item => {
        if (item.userNumber == data.userNumber) {
            if (item.passWord == data.passWord) {
                res.send({
                    code: 200,
                    status: 1,
                    message: '登录成功',
                    token: item.token
                })
            } else {
                res.send({
                    code: 200,
                    status: 0,
                    message: '密码错误',
                })
            }
            return true
        }
    })
    if (!result) {
        res.send({
            code: 200,
            status: 0,
            message: '账号不存在',
        })
    }
}
// 获取用户基本信息方法
exports.getUserinfo_handler = (req, res) => {
    let idx
    if (req.headers.token) {
        // 判断删除的用户是否存在
        const isExist = userData.some(item => {
            if (item.token == req.headers.token) {
                return true
            }
        })
        if (!isExist) {
            res.send({
                code: 200,
                status: -1,
                message: '用户已注销或TOKEN已过期',
            })
            return
        }
        const result = userRoutes.some((item, index) => {
            if (item.token == req.headers.token) {
                idx = index
                return true
            }
        })
        if (result) {
            res.send({
                code: 200,
                status: 1,
                message: '获取用户数据成功',
                data: {
                    userName: userData[idx].userName,
                    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
                    routes: userRoutes[idx].routes,
                    userId: userData[idx].id
                }
            })
        } else {
            res.send({
                code: 200,
                status: 0,
                message: '获取用户数据失败',
            })
        }
    } else {
        res.send({
            code: 200,
            status: -1,
            message: '用户已注销或TOKEN已过期',
        })
    }
}
// 获取品牌管理数据方法
exports.getBrandData_handler = (req, res) => {
    if (req.headers.token) {
        // 判断当前的用户是否存在
        const isExist = userData.some(item => {
            if (item.token == req.headers.token) {
                return true
            }
        })
        if (!isExist) {
            res.send({
                code: 200,
                status: -1,
                message: '用户已注销或TOKEN已过期',
            })
            return
        }
        const data = req.body
        const currentPage = data.currentPage // 前端传递过来的的当前页数
        const pageSize = data.pageSize // 前端传递过来的当前一页展示数量
        const startIdx = (currentPage - 1) * pageSize // 截取的初始下标
        const endIdx = startIdx + pageSize // 截取的初始下标
        const arr = tableData.slice(startIdx, endIdx)
        res.send({
            code: 200,
            status: 1,
            message: '获取品牌管理数据成功',
            data: {
                tableData: arr,
                total: tableData.length
            }
        })
    } else {
        res.send({
            code: 200,
            status: -1,
            message: '用户已注销或TOKEN已过期',
        })
    }
}
// 添加或修改品牌数据方法
exports.uploadImg_handler = (req, res) => {
    if (req.headers.token) {
        // 判断当前的用户是否存在
        const isExist = userData.some(item => {
            if (item.token == req.headers.token) {
                return true
            }
        })
        if (!isExist) {
            res.send({
                code: 200,
                status: -1,
                message: '用户已注销或TOKEN已过期',
            })
            return
        }
        const incomingForm = formidable({
            uploadDir: path.resolve(__dirname, '../public/images'),
            keepExtensions: true
        })
        incomingForm.parse(req, (err, fileBody, { file }) => {
            // console.log(file[0].newFilename);
            // console.log(path.resolve(__dirname, '../public/images'));
            if (err) {
                next()
                return
            }
            // 编辑
            if (fileBody.brandId[0]) {
                // console.log('编辑', fileBody);
                let idx
                const result = tableData.some((item, index) => {
                    if (item.brandId == fileBody.brandId[0]) {
                        idx = index
                        return true
                    }
                })
                if (result) {
                    tableData[idx].brandLogo = 'http://127.0.0.1:8080/images/' + file[0].newFilename
                    res.send({
                        code: 200,
                        status: 1,
                        message: '上传成功',
                    })
                } else {
                    res.send({
                        code: 200,
                        status: 0,
                        message: '上传失败',
                    })
                }
            }
            // 添加
            else {
                tableData.push({
                    brandId: uuid.v4(),
                    brandName: fileBody.brandName[0],
                    brandLogo: 'http://127.0.0.1:8080/images/' + file[0].newFilename,
                    sortID: '产品' + (tableData.length + 1)
                })
                res.send({
                    code: 200,
                    status: 1,
                    message: '上传成功',
                })
            }
        })
    } else {
        res.send({
            code: 200,
            status: -1,
            message: '用户已注销或TOKEN已过期',
        })
    }
}
// 修改品牌brandName方法
exports.uploadBrandName_handler = (req, res) => {
    if (req.headers.token) {
        // 判断当前的用户是否存在
        const isExist = userData.some(item => {
            if (item.token == req.headers.token) {
                return true
            }
        })
        if (!isExist) {
            res.send({
                code: 200,
                status: -1,
                message: '用户已注销或TOKEN已过期',
            })
            return
        }
        const data = req.body
        let idx
        const result = tableData.some((item, index) => {
            if (item.brandId == data.brandId) {
                idx = index
                return true
            }
        })
        if (result) {
            tableData[idx].brandName = data.brandName;
            res.send({
                code: 200,
                status: 1,
                message: '修改成功',
            })
        } else {
            res.send({
                code: 200,
                status: 0,
                message: '修改失败',
            })
        }

    } else {
        res.send({
            code: 200,
            status: -1,
            message: '用户已注销或TOKEN已过期',
        })
    }
}
// 删除某个品牌数据方法
exports.delBrandData_handler = (req, res) => {
    if (req.headers.token) {
        // 判断当前的用户是否存在
        const isExist = userData.some(item => {
            if (item.token == req.headers.token) {
                return true
            }
        })
        if (!isExist) {
            res.send({
                code: 200,
                status: -1,
                message: '用户已注销或TOKEN已过期',
            })
            return
        }
        const data = req.body
        let idx
        const result = tableData.some((item, index) => {
            if (item.brandId == data.brandId) {
                idx = index
                return true
            }
        })
        if (result) {
            tableData.splice(idx, 1)
            res.send({
                code: 200,
                status: 1,
                message: '删除品牌数据成功',
            })
        } else {
            res.send({
                code: 200,
                status: 0,
                message: '删除品牌数据失败',
            })
        }
    } else {
        res.send({
            code: 200,
            status: -1,
            message: '用户已注销或TOKEN已过期',
        })
    }
}
// 获取用户管理数据方法
exports.getAclUserData_handler = (req, res) => {
    if (req.headers.token) {
        // 判断当前的用户是否存在
        const isExist = userData.some(item => {
            if (item.token == req.headers.token) {
                return true
            }
        })
        if (!isExist) {
            res.send({
                code: 200,
                status: -1,
                message: '用户已注销或TOKEN已过期',
            })
            return
        }
        res.send({
            code: 200,
            status: 1,
            message: '获取用户管理数据成功',
            data: {
                userData
            }
        })
    } else {
        res.send({
            code: 200,
            status: -1,
            message: '用户已注销或TOKEN已过期',
        })
    }
}
// 添加用户管理数据方法
exports.createUserData_handler = (req, res) => {
    if (req.headers.token) {
        // 判断当前的用户是否存在
        const isExist = userData.some(item => {
            if (item.token == req.headers.token) {
                return true
            }
        })
        if (!isExist) {
            res.send({
                code: 200,
                status: -1,
                message: '用户已注销或TOKEN已过期',
            })
            return
        }
        const data = req.body.userData
        const result = userData.some((item, index) => {
            if (item.userNumber == data.userNumber) {
                res.send({
                    code: 200,
                    status: 0,
                    message: '用户账号不能相同',
                })
                return true
            }
        })
        if (result) return
        if (data.id == '') {
            data.id = uuid.v4()
            data.token = data.id
            let routes
            if (data.userRole == '管理员') {
                routes = ['Product', 'productBrand', 'producSku', 'producSpu', 'Acl', 'aclUser', 'aclRole', 'aclMenus']
            } else if (data.userRole == '钻石VIP') {
                routes = ['Product', 'productBrand', 'producSku', 'producSpu', 'Acl', 'aclRole', 'aclMenus']
            } else {
                routes = ['Product', 'productBrand', 'producSku', 'producSpu']
            }
            // 用户数据增加routes属性
            data.routes = routes
            // routes 列表增加
            userRoutes.push({
                token: data.id,
                routes: routes
            })
            userData.push(data)
            res.send({
                code: 200,
                status: 1,
                message: '创建成功',
                data: {
                    userData
                }
            })
        } else {
            let idx
            userData.some((item, index) => {
                if (item.id == data.id) {
                    item = data
                    idx = index
                    return true
                }
            })
            userData[idx] = data
            res.send({
                code: 200,
                status: 1,
                message: '编辑成功',
            })

        }
    } else {
        res.send({
            code: 200,
            status: -1,
            message: '用户已注销或TOKEN已过期',
        })
    }
}
// 编辑用户管理数据方法
exports.editUserData_handler = (req, res) => {
    if (req.headers.token) {
        const isExist = userData.some(item => {
            if (item.token == req.headers.token) {
                return true
            }
        })
        if (!isExist) {
            res.send({
                code: 200,
                status: -1,
                message: '用户已注销或TOKEN已过期',
            })
            return
        }
        const data = req.body.userData
        let idx
        userData.some((item, index) => {
            if (item.id == data.id) {
                item = data
                idx = index
                return true
            }
        })
        userData[idx] = data
        res.send({
            code: 200,
            status: 1,
            message: '编辑成功',
        })
    } else {
        res.send({
            code: 200,
            status: -1,
            message: '用户已注销或TOKEN已过期',
        })
    }
}
// 删除用户数据方法
exports.delUserData_handler = (req, res) => {
    if (req.headers.token) {
        // 判断当前的用户是否存在
        const isExist = userData.some(item => {
            if (item.token == req.headers.token) {
                return true
            }
        })
        if (!isExist) {
            res.send({
                code: 200,
                status: -1,
                message: '用户已注销或TOKEN已过期',
            })
            return
        }
        const data = req.body
        data.idArr.forEach(item => {
            userData = userData.filter((user, index) => {
                if (user.id !== item) {
                    return user
                } else {
                    userRoutes.splice(index, 1)
                }
            })
        })
        res.send({
            code: 200,
            status: 1,
            message: '删除成功',
        })
    } else {
        res.send({
            code: 200,
            status: -1,
            message: '用户已注销或TOKEN已过期',
        })
    }
}
// 修改用户状态方法
exports.changeState_handler = (req, res) => {
    if (req.headers.token) {
        // 判断当前的用户是否存在
        const isExist = userData.some(item => {
            if (item.token == req.headers.token) {
                return true
            }
        })
        if (!isExist) {
            res.send({
                code: 200,
                status: -1,
                message: '用户已注销或TOKEN已过期',
            })
            return
        }
        const data = req.body
        const result = userData.some(item => {
            if (item.token == data.token) {
                item.state = data.state
                return true
            }
        })
        if (result) {
            res.send({
                code: 200,
                status: 1,
                message: '修改用户状态成功',
            })
        } else {
            res.send({
                code: 200,
                status: 0,
                message: '修改用户状态失败',
            })
        }
    } else {
        res.send({
            code: 200,
            status: -1,
            message: '用户已注销或TOKEN已过期',
        })
    }
}

// 获取异步路由数据方法
exports.getAsyncRoute_handler = (req, res) => {
    if (req.headers.token) {
        // 判断当前的用户是否存在
        const isExist = userData.some(item => {
            if (item.token == req.headers.token) {
                return true
            }
        })
        if (!isExist) {
            res.send({
                code: 200,
                status: -1,
                message: '用户已注销或TOKEN已过期',
            })
            return
        }
        res.send({
            code: 200,
            status: 1,
            message: '获取菜单权限数据成功',
            data: {
                asyncRoutes
            }
        })
    } else {
        res.send({
            code: 200,
            status: -1,
            message: '用户已注销或TOKEN已过期',
        })
    }
}
// 分配菜单权限方法
exports.distribute_handler = (req, res) => {
    if (req.headers.token) {
        // 判断当前的用户是否存在
        const isExist = userData.some(item => {
            if (item.token == req.headers.token) {
                return true
            }
        })
        if (!isExist) {
            res.send({
                code: 200,
                status: -1,
                message: '用户已注销或TOKEN已过期',
            })
            return
        }
        const data = req.body
        userRoutes.some((item, index) => {
            if (item.token == data.userToken) {
                item.routes = data.routes
                userData[index].routes = data.routes
                return true
            }
        })
        res.send({
            code: 200,
            status: 1,
            message: '菜单权限分配成功',
        })
    } else {
        res.send({
            code: 200,
            status: -1,
            message: '用户已注销或TOKEN已过期',
        })
    }
}
// 获取浏览板数据方法
exports.getMessage_handler = (req, res) => {
    if (req.headers.token) {
        // 判断当前的用户是否存在
        const isExist = userData.some(item => {
            if (item.token == req.headers.token) {
                return true
            }
        })
        if (!isExist) {
            res.send({
                code: 200,
                status: -1,
                message: '用户已注销或TOKEN已过期',
            })
            return
        }
        res.send({
            code: 200,
            status: 1,
            message: '浏览板数据获取成功',
            data: {
                messageData
            }
        })
    } else {
        res.send({
            code: 200,
            status: -1,
            message: '用户已注销或TOKEN已过期',
        })
    }
}
// 获取浏览板数据方法
exports.getMessage_handler = (req, res) => {
    if (req.headers.token) {
        // 判断当前的用户是否存在
        const isExist = userData.some(item => {
            if (item.token == req.headers.token) {
                return true
            }
        })
        if (!isExist) {
            res.send({
                code: 200,
                status: -1,
                message: '用户已注销或TOKEN已过期',
            })
            return
        }
        res.send({
            code: 200,
            status: 1,
            message: '浏览板数据获取成功',
            data: {
                messageData
            }
        })
    } else {
        res.send({
            code: 200,
            status: -1,
            message: '用户已注销或TOKEN已过期',
        })
    }
}


// 添加浏览板数据方法
exports.addMessage_handler = (req, res) => {
    if (req.headers.token) {
        // 判断当前的用户是否存在
        const isExist = userData.some(item => {
            if (item.token == req.headers.token) {
                return true
            }
        })
        if (!isExist) {
            res.send({
                code: 200,
                status: -1,
                message: '用户已注销或TOKEN已过期',
            })
            return
        }
        messageData.unshift(req.body)
        res.send({
            code: 200,
            status: 1,
            message: '添加成功',
        })
    } else {
        res.send({
            code: 200,
            status: -1,
            message: '用户已注销或TOKEN已过期',
        })
    }
}




