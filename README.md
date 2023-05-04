# Gomoku五子棋游戏——分布式作业报告

- 200110632 雷洵 计算机6班
- 第二次提交版本

## 部署方法

邮件中提交的代码为本地部署(端口`9999`)，若要网络部署，需将服务端的`WebSocketServer`修改为（`host:服务器私网ip`,`port: 端口`）,前端`WebSocket`的修改为`服务器公网ip:端口`

在阿里云临时部署的地址已经注释在客户端文件里了。

网络部署：

- 已经将游戏后台和`html`界面部署到阿里云上，通过http://8.130.91.197/test.html访问即可
  - 作为一个`nodejs`后端项目，使用`forever`包实现在阿里云上的持续运行
  - 阿里云上的服务器的后端可能会关闭，请联系 QQ : 1747343655


本地部署：

- 安装`node.js`包，再安装`ws`环境依赖，详细环境配置过程不作赘述
- 在`server.js`所在目录下在终端使用命令`node server.js`运行后台
- 本机使用浏览器打开`html`界面，打开2个或2的倍数个界面即可形成对局开始对战

## 游戏规则

- 没有写胜利判断，只做了最基本的对手寻找和顺序下子（黑子先手）
- 未自动搜索到对局时，显示`Searching player……`
- 轮到该玩家时，显示`Your turn!`
- 支持多组玩家同时进行游戏
- 当一方关闭（退出游戏）或刷新（重新开始匹配对手）时，另一方则显示游戏结束

## 项目介绍

- 后端使用JavaScript结合Websocket编写
- 前端采用html，配合css完成棋盘，使用js完成与后端的交互与通信逻辑
- （第二次提交）做了用户退出检测的逻辑，当配对的对手关闭或刷新网页时，再尝试下棋则会提示对手离开（润）了

## 工程逻辑

- 后端以2个玩家为一组`qipang`保存棋盘逻辑和通信地址
- 当玩家匹配时，建立新棋盘并等待下一位玩家接入，当服务器发现有一对玩家时，发送匹配成功消息，玩家端显示匹配成功，玩家就可以根据合法顺序下棋了
- 当玩家发生下棋请求时，当请求合法则向对应`qipang`里的2个玩家发送确认消息，修改前端页面的棋盘
- 有玩家退出或刷新页面时发送关闭报文，后端收到后向匹配的对手发送关闭消息
- 如果玩家未匹配就刷新页面，默认自己匹配自己，在尝试下棋时后端会检测到这项异常行为，从而终止这个【一个人的游戏】，这也是第二次提交主要要解决的bug

## 项目心得

- 从零开始学的html和js，项目整体还是比较粗糙
- 第一遍先实现了2人的对战，之后实现的多组对局
- 第一次提交后又测试了一些鲁棒性项目，发现只有一个用户刷新自己的页面时，会显示找到对局但是没法下【觉得这样作为一个已经没有胜负判断的游戏来说更过分了】，所以又爬起来写了一下退出检测，这样你就能知道你对面的人已经润了（悲）
  - 注意到这个bug主要是视频里虚拟机的网页端显示的第一个页面是find状态，但是其实并没有其他在线的对手了，原因就是我当时多刷新了一下，最新的页面匹配了刷新前的页面作为对手
  - 视频就展示了网页的多端可运行，实测ipad的Safari也可以下，就是棋盘变成圆角了
- 其实到这里写一个判断输赢的逻辑也挺简单的，但是考虑到和课程关系不是特别大，就作罢了【】
- UI没有再优化和给更多信息也是由于上述缘故
- 而且比起本地部署会卡卡的，如果优化下代码结构可能会流畅一点吧，在服务器上运行的项目果然对稳定性和性能都有更高要求