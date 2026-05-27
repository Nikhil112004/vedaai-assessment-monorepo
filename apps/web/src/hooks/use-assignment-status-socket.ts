'use client';

import { useEffect } from 'react';
import { assignmentStatusChannel } from '@/services/realtime/assignment-status-channel';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { applyAssignmentStatusEvent } from '@/store/slices/assignmentSlice';

export const useAssignmentStatusSocket = (): void => {
  const dispatch = useAppDispatch();
  const assignmentId = useAppSelector((state) => state.assignment.currentAssignmentId);

  useEffect(() => {
    const unsubscribe = assignmentStatusChannel.onStatus((event) => {
      dispatch(applyAssignmentStatusEvent(event));
    });
    return unsubscribe;
  }, [dispatch]);

  useEffect(() => {
    if (!assignmentId) return;
    assignmentStatusChannel.subscribe(assignmentId);
  }, [assignmentId]);
};
