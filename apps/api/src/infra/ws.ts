import type { Server as HttpServer } from 'node:http';
import { Server as SocketIOServer } from 'socket.io';
import { config } from '../config';

type AssignmentEventPayload = {
  assignmentId: string;
  status: string;
  jobId?: string;
  generatedPaperId?: string;
  error?: string;
};

let io: SocketIOServer | null = null;
const objectIdPattern = /^[a-fA-F0-9]{24}$/;

export const initializeSocketServer = (server: HttpServer): SocketIOServer => {
  io = new SocketIOServer(server, {
    cors: {
      origin: config.frontendUrl,
    },
  });

  io.on('connection', (socket) => {
    socket.on('assignment:subscribe', (assignmentId: string) => {
      if (!objectIdPattern.test(assignmentId)) {
        socket.emit('assignment:error', { message: 'Invalid assignment id' });
        return;
      }
      socket.join(`assignment:${assignmentId}`);
    });
  });

  return io;
};

export const emitAssignmentEvent = (payload: AssignmentEventPayload): void => {
  if (!io) {
    return;
  }
  io.to(`assignment:${payload.assignmentId}`).emit('assignment:status', payload);
};

export const shutdownSocketServer = async (): Promise<void> => {
  if (!io) {
    return;
  }
  await io.close();
  io = null;
};
