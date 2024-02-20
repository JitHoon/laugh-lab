// REF: 필요한 모듈을 가져옵니다.
const express = require("express");
const http = require("http");
const Server = require("socket.io").Server; // REF: Socket.IO의 서버 클래스를 가져옵니다.
const app = express();
const path = require("path");

// REF: Express 애플리케이션을 생성합니다.
const server = http.createServer(app);

// REF: Socket.IO 서버를 생성합니다.
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// REF: 현재 디렉토리 경로를 가져옵니다.
const _dirname = path.dirname("");
// REF: 클라이언트 빌드 파일의 경로를 설정합니다.
const buildPath = path.join(_dirname, "../client/build");

// REF: Express 애플리케이션에서 정적 파일을 제공하기 위해 빌드 경로를 설정합니다.
app.use(express.static(buildPath));

// REF: 모든 요청에 대해 클라이언트의 인덱스 HTML 파일을 제공합니다.
app.get("/*", function (req, res) {
  res.sendFile(
    path.join(_dirname, "../client/build/index.html"),
    function (err) {
      if (err) {
        res.status(500).send(err);
      }
    }
  );
});

// REF: 클라이언트와의 소켓 통신을 위한 이벤트 핸들러를 설정합니다.
io.on("connection", (socket) => {
  console.log("We are connected");

  // REF: 클라이언트에서 'chat' 이벤트를 수신하면 모든 클라이언트에게 해당 이벤트를 전달합니다.
  socket.on("chat", (chat) => {
    io.emit("chat", chat);
  });

  // REF: 클라이언트가 연결을 종료하면 해당 이벤트를 콘솔에 기록합니다.
  socket.on("disconnect", () => {
    console.log("disconnected");
  });
});

// REF: 서버가 5001 포트에서 클라이언트 요청을 수신하도록 대기합니다.
server.listen(5001, () => console.log("Listening to port 5001"));
