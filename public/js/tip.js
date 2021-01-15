let time = parseInt($('span').html());
let timer = setInterval(function () {
    if (time === 1) {
        clearInterval(timer);
        location.href = 'http://localhost:8989/login';
    } else {
        $('span').html(--time);
    }
}, 1000);