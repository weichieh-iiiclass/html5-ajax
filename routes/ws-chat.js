const WebSocket = require("ws");


const createChatServer = server => {
    const wsServer = new WebSocket.Server({ server });

    const map = new Map();

    wsServer.on("connection", (ws, req) => {
        map.set(ws, {name: ''});
        
        ws.on("message", message => {
            const mObj = map.get(ws);
            let msg;
            if(! mObj.name){
                mObj.name = message; //剛登入的input msg是代表輸入名字
                msg = `${mObj.name} 進入，共${wsServer.clients.size}人`;
            } else { //之後的input msg是代表講甚麼內容
                msg = `${mObj.name}: ${message}`;
            }
            wsServer.clients.forEach(c=>{
                if(c.readyState===WebSocket.OPEN){
                    c.send(msg);
                }
            });
        });
        ws.send("連線了!");
        // console.log("ip: " + req.connection.remoteAddress);
        // console.log("port: " + req.connection.remotePort);
    });
};
module.exports = createChatServer;
