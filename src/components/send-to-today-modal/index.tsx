import React, { useCallback } from 'react';
import { UNLISTED_LIST_ID } from '../../scenes/home/state';
import { generateRandomHash } from '../../hooks/useHashGenerator';
import { SendToTodayModalProps } from './types';
import { SendToTodayConfirmationModal } from '../send-to-today-confirmation-modal';

const SendToTodayModal: React.FC<SendToTodayModalProps> = ({ tudu, onUpdateTudu, onClose }) => {
  const handleReschedule = useCallback(() => {
    if (tudu) {
      tudu.dueDate = new Date();
      onUpdateTudu(tudu);
      onClose();
    }
  }, [tudu, onUpdateTudu, onClose]);

  const handleCreateCopy = useCallback(() => {
    if (tudu) {
      const tuduClone = tudu.clone();

      // Set a new ID
      tuduClone.id = generateRandomHash('New Tudu');

      // Set the due date to today
      tuduClone.dueDate = new Date();

      // Remove the scheduled order
      tuduClone.scheduledOrder = undefined;

      // Remove the recurrence
      tuduClone.recurrence = undefined;

      // Set the list to "unlisted"
      tuduClone.listId = UNLISTED_LIST_ID;

      onUpdateTudu(tuduClone);
      onClose();
    }
  }, [tudu, onUpdateTudu, onClose]);

  return (
    <SendToTodayConfirmationModal
      isVisible={!!tudu}
      onReschedule={handleReschedule}
      onCreateCopy={handleCreateCopy}
      onModalClose={onClose}
    />
  );
};

export {SendToTodayModal};