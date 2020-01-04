var userNum = 0; //统计在线人数
var chatList = [];//记录聊天记录
var WebSocketServer = require('ws').Server;
wss = new WebSocketServer({ port: 3000 }); 
wss.broadcast = function (msg) {
    wss.clients.forEach(function each(client) {
        client.send(msg);
    });
};
wss.on('connection', function (ws) {
    userNum++;
    wss.broadcast(JSON.stringify({ funName: 'userCount', users: userNum, chat: chatList })); 
    console.log('Connected clients:', userNum);
    ws.on('message', function (e) {
        var resData = JSON.parse(e)
        console.log('接收到来自clent的消息：' + resData.msg)
        chatList.push({ userId: resData.userId, content: resData.msg });
        wss.broadcast(JSON.stringify({ userId: resData.userId, msg: resData.msg })); 

    });
    ws.on('close', function (e) {
        userNum--;
        wss.broadcast(JSON.stringify({ funName: 'userCount', users: userNum, chat: chatList }));
        console.log('Connected clients:', userNum);
        console.log('长连接已关闭')
    })
})
console.log('服务器创建成功')