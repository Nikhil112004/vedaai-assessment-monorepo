import { io, type Socket } from 'socket.io-client';
import { appConfig } from '../config';
import type { AssignmentStatusEvent } from '../../types/assessment';

let socket: Socket | null = null;

const getSocket = (): Socket => {
  if (!socket) {
    socket = io(appConfig.wsUrl, {
      transports: ['websocket'],
      autoConnect: true,
    });
  }
  return socket;
};

export const assignmentSocket = {
  subscribe(assignmentId: string): void {
    const client = getSocket();
    client.emit('assignment:subscribe', assignmentId);
  },

  onStatus(handler: (event: AssignmentStatusEvent) => void): () => void {
    const client = getSocket();
    client.on('assignment:status', handler);
    return () => {
      client.off('assignment:status', handler);
    };
  },
};

