var WebSocketServer = require('ws').Server,
    wss = new WebSocketServer({ port: 9999 });
    //wss = new WebSocketServer({ host: "172.20.79.197",port: "8081" });
var players = [];
var cnt = 0;
var cntCSet = [];
var qipanSet = [];
var qipanCnt = -1;
wss.on('connection', function (ws) {
    console.log('client connected');
    ws.on('message', function (message) {
        var s = JSON.parse(message);
        switch (s.type) {
            case "first":
                if (cnt == 0) {
                    qipanCnt++;
                    players.push({ "pid": "null", "ws": "null" });
                    players.push({ "pid": "null", "ws": "null" });
                    cntCSet.push("black");
                    qipanSet.push(
                        [
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                    );
                    players[qipanCnt * 2 + cnt].pid = qipanCnt;
                    players[qipanCnt * 2 + cnt].ws = ws;
                    cnt++;

                }
                else if (cnt == 1) {
                    players[qipanCnt * 2 + cnt].pid = qipanCnt;
                    players[qipanCnt * 2 + cnt].ws = ws;
                    var back1 = JSON.stringify({
                        "type": "set",
                        "color": "white",
                        "conf": "yes",
                        "pid": qipanCnt
                    });
                    var back2 = JSON.stringify({
                        "type": "set",
                        "color": "black",
                        "conf": "yes",
                        "pid": qipanCnt
                    });
                    console.log("conf!");
                    ws.send(back1);
                    console.log("conf!");
                    players[qipanCnt * 2 + cnt - 1].ws.send(back2);
                    console.log("conf!");
                    cnt = 0;
                }
                break;
            case "msg":
                mesF(s);
                break;
            case "close":
                var a = s.pid;
                console.log("close" + a);
                var mesC = JSON.stringify({
                    "type": "close"
                });
                if (typeof (players[a * 2]) != "undefined") {
                    var cs1 = players[a * 2].ws;
                    cs1.send(mesC);
                }
                if (typeof (players[a * 2 + 1]) != "undefined") {
                    var cs2 = players[a * 2 + 1].ws;
                    cs2.send(mesC);
                }
                break;
        }

    });



    function mesF(s) {
        var p = parseInt(s.idd);
        for (var a = 0; a <= qipanCnt; a++) {
            var cs1 = players[a * 2].ws;
            var cs2 = players[a * 2 + 1].ws;
            if (cntCSet[a] == s.color && a == s.pid) {

                if (qipanSet[a][p] == 0) {
                    console.log("成功下在" + p);
                    cs1.send(JSON.stringify(s));
                    cs2.send(JSON.stringify(s));
                    qipanSet[a][p] = 1;
                    if (cntCSet[a] == "white") {
                        cntCSet[a] = "black";
                    } else {
                        cntCSet[a] = "white";
                    }
                }
                else {
                    console.log(p + "已有棋子");
                }
            }
            else if(a == s.pid){
                var mesC = JSON.stringify({
                    "type": "close"
                });
                if(cs1.readyState == 3 && cs2.readyState == 1){
                    cs2.send(mesC);
                }
                if(cs2.readyState == 3&& cs1.readyState == 1){
                    cs1.send(mesC);
                }
            }
            else {
                console.log("没轮到你");
            }
        }
    }

});
