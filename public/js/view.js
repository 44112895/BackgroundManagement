let converter = new showdown.Converter();

let id = $('#id').attr('data'),
    title = '', content = '', author = '', date = '', view = '', like = '', comment = [];

$.ajax({
    url: 'http://localhost:8989/searchId',
    type: 'get',
    data: {
        id: id
    },
    success: function (result) {
        if (result) {
            title = result[0].title;
            content = result[0].content;
            author = result[0].author;
            date = result[0].date;
            view = result[0].view;
            like = result[0].like;
            comment = result[0].comment;
            $('#id').html(title);
            $('#author').html(author);
            $('#date').html(date);
            $('#view').html(view);
            $('#like').html(like);
            $('#content').html(converter.makeHtml(content));
            for (let i = 0; i < comment.length; i++) {
                let div = $(`<div></div>`);
                for (let key in comment[i]) {
                    let span = $(`<span class="author">${key}：</span><span class="comment">${comment[i][key]}</span>`);
                    div.append(span);
                }
                $('#comment').append(div);
            }
        }
    }
});

$('#addComment').click(function () {
    if ($("label").html() === '') {
        alert('您还没有登录，不能发表评论，请登录');
    } else if ($('#input').val() === '') {
        alert('评论不能为空');
    } else {
        let obj = {};
        obj[$('label').html()] = $("#input").val();
        comment.push(obj);
        $.ajax({
            url: 'http://localhost:8989/updateComment',
            type: 'get',
            data: {
                id: id,
                comment: comment
            },
            success: function (result) {
                if (result) {
                    let div = $(`<div></div>`);
                    let span = $(`<span class="author">${$('label').html()}：</span><span class="comment">${$("#input").val()}</span>`);
                    div.append(span);
                    $('#comment').append(div);
                    $('#input').val('');
                }
            }
        });
    }
});