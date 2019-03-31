$(function()
{
    $('#btn-reg').click(function()
    {
        console.log("hello world");
        var username = $('#username').val();
        var passwd = $('#password').val();
        var data = {'name': username, 'psw': passwd};
        if(!username)
        {
            $('#logo').prepend('<div style="color:red;">用户名不能为空</div>');
        }
        else
        {
            $.ajax({
                url: '/api/login',
                type: 'post',
                data: data,
                success: function(data, status)
                {
                    if(status == 'success')
                    {
                        location.href = '/#!/';
                    }
                },
                error: function(data, err)
                {
                    console.log('ajax fail');
                    location.href = '/#!/login';
                }
            })
        }
    })
});