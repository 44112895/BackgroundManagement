/*
* 变量定义
* */
let pageNum = $("section").attr('length');//记录查询到的数据条数
let paging = null;//保存分页组件对象
let index = 1;//第一页
let title = null;

/*
* 第一次生成分页组件
* */
if (pageNum > 0) {//加载的时候自动生成分页组件
    paging = new Paging({//设置分页组件的属性
        total: pageNum
    });
}

/*
* 点击页数
* */
$('.paging').click(function (event) {//分页组件点击事件，冒泡型事件，绑定在父元素上
    if (this !== event.target) {//点击的是容器里的元素，而不是元素本身
        setTimeout(function () {
            index = paging.options.current;
            if ($('#bs-example-navbar-collapse-1 .active a').html() === '首页') {
                $.ajax({
                    url: 'http://localhost:8989/indexPage',
                    type: 'get',
                    data: {
                        page: index,
                        title: title
                    },
                    success: function (result) {
                        indexRender(result);
                    }
                });
            } else if ($("#bs-example-navbar-collapse-1 .active a").html() === '我的博客') {
                $.ajax({
                    url: 'http://localhost:8989/myPage',
                    type: 'get',
                    data: {
                        page: index,
                        title: title
                    },
                    success: function (result) {
                        myRender(result);
                    }
                });
            }
        });
    }
});

/*
* 重新渲染section，indexRender函数
* */
function indexRender(arr, len = 10) {
    let div = '';
    for (let i = 0; i < arr.length && i < len; i++) {
        div += `<div class="panel panel-default">
                    <div class="panel-heading"><span class="id">ID：<span>${arr[i]._id}</span></span><span class="title">标题：<a href="http://localhost:8989/view?id=${arr[i]._id}&view=${arr[i].view}" target="_blank">${arr[i].title}</a></span><span class="author">作者：<span>${arr[i].author}</span></span></div>
                    <div class="panel-body">${arr[i].content}</div>
                    <div class="panel-footer">
                        <div class="left">
                            <span class="date"><span>${arr[i].date}</span></span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="view">view：<span>${arr[i].view}</span></span>
                        </div>
                        <div class="right">
                            <span class="like"><a title="点赞" onclick="like(this);">点赞</a>：<span>${arr[i].like}</span></span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="comment">评论：<span>${arr[i].comment.length}</span></span>
                        </div>
                    </div>
                </div>`;
    }
    $('section').html('').append(div);
}

/*
* 重新渲染section，myRender函数
* */
function myRender(arr, len = 10) {
    let div = '';
    for (let i = 0; i < arr.length && i < len; i++) {
        div += `<div class="panel panel-default">
                    <div class="panel-heading"><span class="id">ID：<span>${arr[i]._id}</span></span><span class="title">标题：<a href="http://localhost:8989/view?id=${arr[i]._id}&view=${arr[i].view}" target="_blank">${arr[i].title}</a></span><span class="author">作者：<span>${arr[i].author}</span></span></div>
                    <div class="panel-body">${arr[i].content}</div>
                    <div class="panel-footer">
                        <div class="left">
                            <span class="date"><span>${arr[i].date}</span></span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="view">view：<span>${arr[i].view}</span></span>
                        </div>
                        <div class="right">
                            <span class="like"><a title="点赞" onclick="like(this);">点赞</a>：<span>${arr[i].like}</span></span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="comment">评论：<span>${arr[i].comment.length}</span>&nbsp;&nbsp;&nbsp;&nbsp;<a class="edit" href="http://localhost:8989/update?id=${arr[i]._id}" target="_blank">编辑</a>&nbsp;&nbsp;&nbsp;&nbsp;<a class="delete" onclick="del(this);">删除</a></span>
                        </div>
                    </div>
                </div>`;
    }
    $('section').html('').append(div);
}

/*
* 我的博客
* */
$('#myBlog').click(function () {
    if ($('#login').length === 1) {
        alert('您还没有登录，请登录');
    } else {
        $.ajax({
            url: 'http://localhost:8989/myBlog',
            type: 'post',
            success: function (result) {
                paging = new Paging({
                    total: result.length
                });
                index = 1;
                title = null;
                $('#bs-example-navbar-collapse-1 .active').removeClass('active');
                $('#myBlog').parent().addClass('active');
                myRender(result);
            }
        });
    }
});

/*
* 新建博客
* */
$('#newBlog').click(function () {
    if ($('#login').length === 1) {
        alert('您还没有登录，请登录');
    } else {
        window.open('http://localhost:8989/write');
    }
});

/*
* 删除博客
* */
function del(_this) {
    if (confirm(`是否删除这个id为${$(_this).parent().parent().parent().parent().find('.id span').html()}的博客`)) {
        $.ajax({
            url: 'http://localhost:8989/deleteData',
            type: 'get',
            data: {
                id: $(_this).parent().parent().parent().parent().find('.id span').html()
            },
            success: function (result) {
                if (result.deletedCount === 1) {
                    $(_this).parent().parent().parent().parent().remove();
                    alert('成功删除博客');
                    if ($('section').html() === '') {
                        $('#myBlog').trigger('click');
                    }
                }
            }
        });
    }
}

/*
* 点赞
* */
function like(_this) {
    if ($('#login').length === 1) {
        alert('您还没有登录，不能点赞，请登录');
    } else {
        $.ajax({
            url: 'http://localhost:8989/like',
            type: 'get',
            data: {
                id: $(_this).parent().parent().parent().parent().find('.id span').html(),
                like: parseInt($(_this).next().html()) + 1
            },
            success: function () {
                $(_this).parent().html(`<a title="取消点赞" onclick="unlike(this);">取消点赞</a>：<span>${parseInt($(_this).next().html()) + 1}</span>`);
            }
        });
    }
}

/*
* 取消点赞
* */
function unlike(_this) {
    $.ajax({
        url: 'http://localhost:8989/like',
        type: 'get',
        data: {
            id: $(_this).parent().parent().parent().parent().find('.id span').html(),
            like: parseInt($(_this).next().html()) - 1
        },
        success: function () {
            $(_this).parent().html(`<a title="点赞" onclick="like(this);">点赞</a>：<span>${parseInt($(_this).next().html()) - 1}</span>`);
        }
    });
}

/*
* 在新窗口打开聊天室界面
* */
$('.chatRoom').click(function () {
    if ($('#login').length === 1) {
        alert('您还没有登录，不能进入聊天室，请登录');
    } else {
        window.open('http://localhost:8989/chat');
    }
});

/*
* 查询
* */
$('.navbar-form button').click(function () {
    if ($('#whereStr').val() === '') {
        alert('查询条件不能为空');
    } else if ($('#bs-example-navbar-collapse-1 .active a').html() === '首页') {
        title = $("#whereStr").val();
        $.ajax({
            url: 'http://localhost:8989/indexPage',
            type: 'get',
            data: {
                title: title
            },
            success: function (result) {
                paging = new Paging({
                    total: result.length === 10 ? result.length + 10 : result.length,
                    current: 1
                });
                indexRender(result);
            }
        });
    } else if ($('#bs-example-navbar-collapse-1 .active a').html() === '我的博客') {
        title = $("#whereStr").val();
        $.ajax({
            url: 'http://localhost:8989/myPage',
            type: 'get',
            data: {
                title: title,
                author: $('#userName').html()
            },
            success: function (result) {
                paging = new Paging({
                    total: result.length === 10 ? result.length + 10 : result.length,
                    current: 1
                });
                myRender(result);
            }
        });
    }
});

/*
* 注销账号
* */
$('#deleteAdmin').click(function () {
    if (confirm('是否确认注销账号，账号注销后不能找回')) {
        $.ajax({
            url: 'http://localhost:8989/deleteAdmin',
            success: function () {
                location.href = 'http://localhost:8989/';
            }
        });
    }
});