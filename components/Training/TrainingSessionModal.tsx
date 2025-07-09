'use client';

import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import TrainingHelpModal from './TrainingHelpModal';

interface TrainingSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  exerciseName: string;
}

export default function TrainingSessionModal({
  isOpen,
  onClose,
  exerciseName,
}: TrainingSessionModalProps) {
  const [showHelpModal, setShowHelpModal] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-5/6 flex flex-col">
        <TrainingHelpModal open={showHelpModal} onOpenChange={setShowHelpModal} selectedHelpKey={exerciseName} />
      </DialogContent>
    </Dialog>
  );
} 