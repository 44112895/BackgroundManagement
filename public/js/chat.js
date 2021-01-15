let socket = io();

$('#msg').on('input', function () {//输入
    if ($("#msg").val() === '') {
        $('#send').attr('disabled', true);
    } else {
        $('#send').attr('disabled', false);
    }
});

$('#send').click(function () {//发
    socket.emit('chat', {user: $('.chat h3 span').html(), msg: $('#msg').val()});
    $("#msg").val('');
    $('#send').attr('disabled', true);
});

socket.on('send', (model) => {//收
    let div = '';
    if (model.user === $('.chat h3 span').html()) {
        div = `<div>
            <div class="right">:我说</div>
            <div class="center right">${model.msg}</div>
        </div>`;
    } else {
        div = `<div>
            <div class="left">${model.user}说:</div>
            <div class="center left">${model.msg}</div>
        </div>`;
    }
    $(".msg").append(div).scrollTop($('.msg').scrollTop() + $('.msg>div:last').outerHeight(true));
});

/*
* 键盘按键监听
* */
$('#msg').keydown(function (event) {
    if (event.keyCode === 13) {
        $('#send').trigger('click');
    }
});

/*
* 音乐播放
* */
let number = 5, that = 5;//索引初始化
$('tbody tr').eq(number).addClass('current');//样式初始化

$('tbody tr').click(function () {//列表点击
    if ($(this).index() !== that) {
        $('video').get(0).pause();
        number = $(this).index();
        $("tbody tr").eq(that).removeClass('current');
        $('tbody tr').eq(number).addClass('current');
        $('video').attr('src', '../public/music/' + $(this).children().html());
        $('video').get(0).play();
        $('#play').html('暂停');
        that = number;
    }
});

$('#next').click(function () {//下一首
    $('video').get(0).pause();
    number++;
    if (number === $('tbody tr').length) {
        number = 0;
    }
    $("tbody tr").eq(that).removeClass('current');
    $('tbody tr').eq(number).addClass('current');
    $('video').attr('src', '../public/music/' + $('tbody tr').eq(number).children().html());
    $('video').get(0).play();
    $('#play').html('暂停');
    that = number;
});

$('#prev').click(function () {//上一首
    $('video').get(0).pause();
    number--;
    if (number === -1) {
        number = $('tbody tr').length - 1;
    }
    $("tbody tr").eq(that).removeClass('current');
    $('tbody tr').eq(number).addClass('current');
    $('video').attr('src', '../public/music/' + $('tbody tr').eq(number).children().html());
    $('video').get(0).play();
    $('#play').html('暂停');
    that = number;
});

$('#play').click(function () {//播放和暂停
    if ($(this).html() === '播放') {
        $(this).html('暂停');
        $('video').get(0).play();
    } else {
        $(this).html('播放');
        $('video').get(0).pause();
    }
});

$('video').get(0).onended = function () {//播放完播放下一首
    $('#next').trigger('click');
};