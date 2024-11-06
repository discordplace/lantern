import type { ServerSocketOpcodes } from '@/src/types/global';
import { WebSocket } from 'ws';

const Opcodes = config.server.socket.opcodes;

interface Payload {
  t: string | undefined;
  op?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  d?: any;
}

/**
 * Sends a message through the WebSocket connection.
 *
 * @param {WebSocket} socket - The WebSocket connection.
 * @param {number} op - The opcode of the message.
 * @param {any} d - The data to send.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function send(socket: WebSocket, op: ServerSocketOpcodes, d?: any): void {
  const payload_name = Object.entries(Opcodes).find(([, value]) => value === op)?.[0];

  const payload: Payload = {
    t: payload_name,
    op
  };

  if (d) payload.d = d;

  socket.send(JSON.stringify(payload));
}

/**
 * Disconnects the WebSocket connection.
 *
 * @param {WebSocket} socket - The WebSocket connection.
 * @param {string} id - The ID of the connection.
 * @param {string} error - The error message.
 */
function disconnect(socket: WebSocket, id: string | null, error: string): void {
  if (id) {
    ActiveSockets.delete(id);
    logger.log('database', `Websocket connection closed: ${id}`);
  }

  send(socket, Opcodes.DISCONNECT, { error });
  socket.close();
}

export { send, disconnect };