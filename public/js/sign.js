let nameFlag = false;//用户名状态
let passwordFlag = false;//密码状态

$('.login-user input').focus(function () {//用户名框获得焦点
    nameFlag = false;
    $('#name-tip').html('');
}).blur(function () {//用户名框失去焦点
    if ($(this).val() === '') {//为空
        $('#name-tip').html('用户名不能为空').css('color', '#ec3e27');
    } else if (new RegExp('\\w').test($(this).val())) {//字符符合要求
        if ($(this).val().length >= 6 && $(this).val().length <= 12) {//长度符合要求
            $.ajax({
                url: 'http://localhost:8989/signCheck',
                type: 'post',
                data: {
                    name: $(this).val()
                },
                success: function (result) {
                    if (result.length === 0) {
                        nameFlag = true;
                        $('#name-tip').html('可以使用的用户名').css('color', '#00b894');
                    } else {
                        $('#name-tip').html('此用户名太受欢迎，请更换一个').css('color', '#ec3e27');
                    }
                }
            });
        } else {//长度不符合要求
            $('#name-tip').html('用户名为6-12位').css('color', '#ec3e27');
        }
    } else {//包含不符合要求的字符
        $('#name-tip').html('用户名仅支持数字、字母或者_下划线').css('color', '#ec3e27');
    }
});

$('.login-pwd input').focus(function () {//密码框获得焦点
    passwordFlag = false;
    $('#password-tip').html('');
}).blur(function () {//密码框失去焦点
    if ($(this).val() === '') {//为空
        $('#password-tip').html('密码不能为空').css('color', '#ec3e27');
    } else if ($(this).val().length < 6) {//小于6位
        $('#password-tip').html('密码长度不能小于6位').css('color', '#ec3e27');
    } else {//符合要求
        passwordFlag = true;
        $('#password-tip').html('可以使用的密码').css('color', '#00b894');
    }
});

$('.login-btn input').click(function () {//注册按钮点击事件
    if (nameFlag && passwordFlag) {//用户名和密码都符合规则，注册
        $.ajax({
            url: 'http://localhost:8989/signAdmin',
            type: 'post',
            data: {
                name: $('.login-user input').val(),
                password: $('.login-pwd input').val()
            },
            success: function (result) {
                if (result.ops.length !== 0) {
                    location.href = 'http://localhost:8989/tip';
                }
            }
        });
    } else {//否则，提示出错
        alert('用户名或密码不符合注册要求，请重新输入');
    }
});