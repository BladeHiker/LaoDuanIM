var ws = require('nodejs-websocket')
function broadcast(str) {
    server.connections.forEach((conn) => {
        conn.sendText(str);
    })
}

function timeString(){
    var d=new Date();
    var str=d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
    str+='['+d.getFullYear()+'-'+d.getMonth()+'-'+d.getDay()+']';
    return str;
}
var server = ws.createServer((conn) => {
    var name = ""
    console.log("客户端接入")
    conn.on('text', (str) => {
        var data=JSON.parse(str);
        if (name === "" && data.type === 'name') {
            name = data.name;
            broadcast(JSON.stringify({
                type:'sys',
                text:name + "上线",
                date:timeString(),
                member:server.connections.length
            }));
            return;
        }
        broadcast(JSON.stringify({
            type:'chat',
            text:data.text,
            sender:name,
            date:timeString()
        }));
    })
    conn.on('error', (err) => {
        console.log(err);
        broadcast(JSON.stringify({
            type:'sys',
            text:name + "  下线",
            date:timeString(),
            member:server.connections.length
        }));
    })
}).listen(2333)