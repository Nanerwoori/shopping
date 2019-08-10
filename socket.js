/**
 * Socket Manage
 */

// Set up socketIO (Websocket built up on http)
// Now since we use http server to establish our webscoket connection
// that uses that http protocol as a basis
let io;

module.exports = {
  init: httpServer => {
    console.log("소켓 초기화 .... ");
    io = require("socket.io")(httpServer);
    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error("Not Intialized socket!");
    }
    return io;
  }
};
