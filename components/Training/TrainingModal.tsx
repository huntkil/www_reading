'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { TrainingPlan } from '@/lib/types';

interface TrainingModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onStartTraining: () => void
  plan: TrainingPlan | null
  onSessionComplete: (stats: { wpm: number; accuracy: number }) => void;
}

export function TrainingModal({ open, onOpenChange, onStartTraining, plan }: TrainingModalProps) {
  if (!plan) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{plan.title}</DialogTitle>
          <DialogDescription>
            {plan.content}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="space-y-2">
            <p className="flex justify-between">
              <span>목표 WPM:</span>
              <span className="font-bold">{plan.targetWpm} WPM</span>
            </p>
            <p className="flex justify-between">
              <span>훈련 시간:</span>
              <span className="font-bold">{plan.duration}분</span>
            </p>
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={onStartTraining}>훈련 시작</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 