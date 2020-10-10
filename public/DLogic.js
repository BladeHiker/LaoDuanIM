let ws = null;
let name = null;
document.onkeydown = (key) => {
    if (key.keyCode == 13) {
        event.returnValue = false;
        event.cancel = true;
        if (document.getElementById('input').value == "")
            return;
        if (ws == null) {
            if (document.getElementById('input').value.length > 20) {
                document.getElementById('tips').innerHTML = "长度非法 请重试↑";
                return;
            }
            ws = new WebSocket('ws://127.0.0.1:2333');
            // ws = new WebSocket('ws://ec2-52-68-202-195.ap-northeast-1.compute.amazonaws.com:2333');
            ws.onopen = () => {
                name = document.getElementById('input').value;
                console.log(name);
                document.getElementById('tips').innerHTML = '<xmp>' + "🔵连接到服务器 以 " + name + " 身份加入对话 输入消息↑后按回车键发送消息" + '</xmp>';
                ws.send(JSON.stringify({
                    type: 'name',
                    name: document.getElementById('input').value
                }));
                document.getElementById('input').value = "";
            }
            ws.onmessage = (e) => {
                document.getElementById('tips').innerHTML = '<xmp>' + "🔵连接到服务器 以 " + name + " 身份加入对话 输入消息↑后按回车键发送消息" + '</xmp>';
                var data = JSON.parse(e.data);
                switch (data.type) {
                    case 'chat':
                        var p = document.createElement('msg');
                        var n = document.createElement('note');
                        n.innerHTML = '<name>' + data.sender + '</name>' + ' 于 ' + data.date + '  :';
                        p.appendChild(n);
                        p.innerHTML += '<xmp>' + data.text + '</xmp>';
                        document.getElementById('Messages').appendChild(p);
                        break;
                    case 'sys':
                        var p = document.createElement('sys-msg');
                        var n = document.createElement('time-note');
                        n.innerHTML = data.date;
                        p.appendChild(n);
                        p.innerHTML += '<xmp>' + data.text + '</xmp>';
                        document.getElementById('Messages').appendChild(p);
                        var q = document.createElement('sys-msg');
                        q.innerHTML = "当前聊天室 " + data.member + " 人在线";
                        document.getElementById('Messages').appendChild(q);
                        break;
                    default:
                        break;
                }

                window.scrollTo(0, document.body.scrollHeight);
            }
            ws.onclose = () => {
                var p = document.createElement('sys-msg');
                var r = document.createElement('red');
                r.innerHTML = "与服务器的连接断开";
                p.appendChild(r);
                document.getElementById('Messages').appendChild(p);
                document.getElementById('tips').innerHTML = "🔴服务器连接异常！";
                document.getElementById('tips').style.backgroundColor = "red";
                document.getElementById('input').value = "请刷新界面重试";
                document.getElementById('input').setAttribute('disabled', true);
            }
            return;
        }
        document.getElementById('tips').innerHTML = "🕘送信中→";
        ws.send(JSON.stringify({
            type: 'msg',
            text: document.getElementById('input').value
        }));
        document.getElementById('input').value = "";

    }
}