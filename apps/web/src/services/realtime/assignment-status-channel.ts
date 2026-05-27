import { assignmentSocket } from '@/lib/socket/assignment-socket';
import type { AssignmentStatusEvent } from '@/types/assessment';

export const assignmentStatusChannel = {
  subscribe: (assignmentId: string) => {
    assignmentSocket.subscribe(assignmentId);
  },
  onStatus: (handler: (event: AssignmentStatusEvent) => void) => {
    return assignmentSocket.onStatus(handler);
  },
};

