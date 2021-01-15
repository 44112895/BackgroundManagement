$('.login-user input').focus(function () {//用户名框获得焦点
    $('#name-tip').html('');
})

$('.login-pwd input').focus(function () {//密码框获得焦点
    $('#password-tip').html('');
});

$('.login-btn input').click(function () {//登录按钮点击事件
    if ($(".login-user input").val() === '' || $(".login-pwd input").val() === '') {//用户名和密码有一个为空，不能登录
        $('#password-tip').html('用户名或密码不能为空').css('color', '#ec3e27');
    } else {//否则可以登录
        $.ajax({
            url: 'http://localhost:8989/loginCheck',
            type: 'post',
            data: {
                name: $('.login-user input').val(),
                password: $('.login-pwd input').val()
            },
            success: function (result) {
                if (result) {
                    location.href = 'http://localhost:8989/';
                } else {
                    $('#password-tip').html('用户名或密码不正确，请检查').css('color', '#ec3e27');
                }
            }
        });
    }
});