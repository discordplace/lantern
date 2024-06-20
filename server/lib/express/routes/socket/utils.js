const Opcodes = config.server.socket.opcodes;

function send(socket, op, d) {
  const payload = {
    t: Object.keys(Opcodes).find(key => Opcodes[key] === op)
  };

  if (op) payload.op = op;
  if (d) payload.d = d;

  socket.send(JSON.stringify(payload));
}

function disconnect(socket, id, error) {
  if (id) {
    ActiveSockets.delete(id);
    logger.socket(`Websocket connection closed: ${id}`);
  }

  send(socket, Opcodes.DISCONNECT, { error });
  socket.close();
}


module.exports = { send, disconnect };