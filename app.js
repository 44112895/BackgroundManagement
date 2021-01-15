/*
* 引入模块
* */
const express = require('express');//express模块
const app = express();//创建服务

const ejs = require('ejs');//ejs模块

const bodyParser = require('body-parser');//post请求参数解析模块
const urlencodedParser = bodyParser.urlencoded({extended: false});//post参数解析设置

const cookieParser = require('cookie-parser');//cookie模块
const session = require('express-session');//session模块
const NedbStore = require('nedb-session-store')(session);//配置session持久化模块

const ObjectId = require('mongodb').ObjectID;//数据库_id数据处理模块
const dao = require('./model/dao.js');//数据库操作模块

const http = require('http').Server(app);//http模块

const io = require('socket.io')(http);//Web Socket模块

const music = require('./model/music.js');//导入音乐列表信息
const md5 = require('md5');//md5加密模块

/*
* 路由、接口配置
* */
app.set('view engine', 'ejs')//配置可以使用ejs模板引擎
.use(cookieParser())//配置可以使用cookie模块
.use(session({//配置可以使用session模块
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {//session保存时长
        maxAge: 1000 * 60 * 60 * 24 * 7
    },
    store: new NedbStore({//设置持久化
        filename: 'user.db'
    })
}))
.use('/public', express.static('./public/'))//呈递公共资源
.get('/', (req, res) => {//配置首页路由
    let obj = {};
    if (req.session.name) {//登陆了
        if (req.query.title) {//登陆了，有查询条件
            obj = {
                title: {$regex: req.query.title},
                author: {$not: {$regex: req.session.name}}
            };
        } else {//登陆了，没查询条件
            obj = {
                author: {$not: {$regex: req.session.name}}
            };
        }
    } else {//没登陆
        if (req.query.title) {//没登陆，有查询条件
            obj = {
                title: {$regex: req.query.title}
            };
        } else {//没登陆，没查询条件，显示所有的博客
            obj = {};
        }
    }
    dao.find('blog', 'article', (result) => {//数据库查询操作
        res.render('index', {user: req.session.name, articleList: result});
    }, obj, {}, 0, 0);
})
.get('/login', (req, res) => {//配置登录页面路由
    if (req.session.name) {//如果存在登录记录，重定向到首页
        res.redirect('http://localhost:8989/');
    } else {//否则显示登录界面
        res.render('login');
    }
})
.post('/loginCheck', urlencodedParser, (req, res) => {//配置登录验证接口
    let obj = {//查询条件
        name: req.body.name,
        password: md5(md5(req.body.password))
    };
    dao.find('blog', 'user', (result) => {//查询user数据集合
        if (result.length !== 0) {//结果的长度不为0，说明存在账号，且密码正确
            req.session.name = result[0].name;
            res.send(true);
        } else {//否则，说明不存在，清除登录记录
            req.session.name = null;
            res.send(false);
        }
    }, obj, {}, 0, 0);
})
.get('/loginExit', (req, res) => {//配置退出登录接口，清除session记录，重定向到首页
    req.session.name = null;
    res.redirect('http://localhost:8989/');
})
.get('/sign', (req, res) => {//配置注册页面路由
    res.render('sign');
})
.post('/signCheck', urlencodedParser, (req, res) => {//配置用户名校验接口，检查数据库中是否已经存在这个用户名
    let obj = {
        name: req.body.name
    };
    dao.find('blog', 'user', (result) => {
        res.send(result);
    }, obj, {}, 0, 0);
})
.post('/signAdmin', urlencodedParser, (req, res) => {//配置注册接口，向数据库中增加新的账号
    let obj = {
        name: req.body.name,
        password: md5(md5(req.body.password))
    };
    dao.insert('blog', 'user', obj, (result) => {
        res.send(result);
    });
})
.get('/deleteAdmin', (req, res) => {//配置注销接口，注销当前账号，并重定向到首页
    let obj = {
        name: req.session.name
    };
    dao.delete('blog', 'user', obj, (result) => {
        req.session.name = null;
        res.send();
    });
})
.get('/indexPage', (req, res) => {//配置首页的分页接口
    let obj = {};
    if (req.session.name) {//登陆了
        if (req.query.title) {//登陆了，有查询条件
            obj = {
                title: {$regex: req.query.title},
                author: {$not: {$regex: req.session.name}}
            };
        } else {//登陆了，没查询条件
            obj = {
                author: {$not: {$regex: req.session.name}}
            };
        }
    } else {//没登陆
        if (req.query.title) {//没登陆，有查询条件
            obj = {
                title: {$regex: req.query.title}
            };
        } else {//没登陆，没查询条件，显示所有的博客
            obj = {};
        }
    }
    dao.find('blog', 'article', (result) => {
        res.send(result);
    }, obj, {}, 10 * (req.query.page - 1), 10);
})
.post('/myBlog', urlencodedParser, (req, res) => {//我的博客首次加载
    let obj = {};
    if (req.query.title) {//有查询条件
        obj = {
            title: {$regex: req.query.title},
            author: req.session.name
        };
    } else {//没有查询条件
        obj = {
            author: req.session.name
        };
    }
    dao.find('blog', 'article', (result) => {
        res.send(result);
    }, obj, {}, 0, 0);
})
.get('/myPage', (req, res) => {//配置我的博客的分页接口
    let obj = {};
    if (req.query.title) {//有查询条件
        obj = {
            title: {$regex: req.query.title},
            author: req.session.name
        };
    } else {//没有查询条件
        obj = {
            author: req.session.name
        };
    }
    dao.find('blog', 'article', (result) => {
        res.send(result);
    }, obj, {}, 10 * (req.query.page - 1), 10);
})
.get('/write', (req, res) => {//配置新建博客页面接口
    res.render('write', {user: req.session.name, id: null});
})
.get('/update', (req, res) => {//配置博客更新页面路由
    res.render('write', {user: req.session.name, id: req.query.id});
})
.get('/searchId', (req, res) => {//根据id查找数据
    let obj = {
        _id: new ObjectId(req.query.id)
    };
    dao.find('blog', 'article', (result) => {
        res.send(result);
    }, obj, {}, 0, 0);
})
.post('/insertData', urlencodedParser, (req, res) => {//插入数据
    let obj = {
        title: req.body.title,
        content: req.body.content,
        author: req.body.author,
        date: req.body.date,
        view: '0',
        like: '0',
        comment: []
    };
    dao.insert('blog', 'article', obj, (result) => {
        res.send(result);
    });
})
.post('/updateData', urlencodedParser, (req, res) => {//更新数据
    let obj = {
        _id: new ObjectId(req.body.id)
    };
    let updateObj = {
        title: req.body.title,
        content: req.body.content
    };
    dao.update('blog', 'article', obj, updateObj, (result) => {
        res.send(result);
    });
})
.get('/deleteData', (req, res) => {//删除数据
    let obj = {
        _id: new ObjectId(req.query.id)
    };
    dao.delete('blog', 'article', obj, (result) => {
        res.send(result);
    });
})
.get('/like', (req, res) => {//更新点赞数
    let obj = {
        _id: new ObjectId(req.query.id)
    };
    let updateObj = {
        like: '' + req.query.like
    };
    dao.update('blog', 'article', obj, updateObj, (result) => {
        res.send(result);
    });
})
.get('/view', (req, res) => {//展示详情信息
    let obj = {
        _id: new ObjectId(req.query.id)
    };
    let update = {
        view: parseInt(req.query.view) + 1
    };
    dao.update('blog', 'article', obj, update, (result) => {
        if (result) {
            res.render('view', {user: req.session.name, id: req.query.id});
        }
    });
})
.get('/updateComment', (req, res) => {//发表评论接口
    let obj = {
        _id: new ObjectId(req.query.id)
    };
    let updateObj = {
        comment: req.query.comment
    };
    dao.update('blog', 'article', obj, updateObj, (result) => {
        res.send(result);
    });
})
.get('/tip', (req, res) => {//配置注册后的提示页面路由
    res.render('tip');
})
.get('/chat', (req, res) => {//配置聊天室页面路由
    res.render('chat', {user: req.session.name, music: music});
})
.use((req, res) => {//配置错误页面路由
    res.render('404');
});

/*
* 配置长连接
* */
io.on('connection', (socket) => {
    socket.on('chat', (msg) => {//接收
        io.emit('send', msg);//发送
    });
});

/*
* 监听端口号
* */
http.listen('8989', (err) => {
    if (err) throw err;
    console.log('服务器已开启，IP地址为：http://localhost:8989/');
});