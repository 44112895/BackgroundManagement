let converter = new showdown.Converter();

if ($('#id').val() !== '') {//加载id对应的数据更新
    $.ajax({
        url: 'http://localhost:8989/searchId',
        type: 'get',
        data: {
            id: $("#id").val()
        },
        success: function (result) {
            if (result.length > 0) {
                $('#title').val(result[0].title);
                $('#content').val(result[0].content);
                $('#preview').html(converter.makeHtml($('#content').val()));
            }
        }
    });
}

$('#content').on('input', function () {
    $('#preview').html(converter.makeHtml($('#content').val()));
});

$('#add').click(function () {//新增
    if ($('#title').val() === '') {
        alert('博客的标题不能为空');
    } else if ($('#content').val() === '') {
        alert('博客的内容不能为空');
    } else {
        let date = new Date().toLocaleString().replaceAll('/', '-').split(' ');
        date[1] = date[1].slice(2);
        $.ajax({
            url: 'http://localhost:8989/insertData',
            type: 'post',
            data: {
                title: $("#title").val(),
                content: $('#content').val(),
                author: $('#author').val(),
                date: date.join(' ')
            },
            success: function (result) {
                if (result.ops.length > 0) {
                    alert('成功创建新的博客');
                    window.close();
                }
            }
        });
    }
});

$('#update').click(function () {//更新
    if ($('#title').val() === '') {
        alert('博客的标题不能为空');
    } else if ($('#content').val() === '') {
        alert('博客的内容不能为空');
    } else {
        $.ajax({
            url: 'http://localhost:8989/updateData',
            type: 'post',
            data: {
                id: $('#id').val(),
                title: $("#title").val(),
                content: $('#content').val()
            },
            success: function (result) {
                if (result) {
                    alert('博客更新成功');
                    window.close();
                }
            }
        });
    }
});