import { Batch } from './Batch';
import { Trainee } from './Trainee';

export class Note {
  noteId: number;
  content: string;
  week: number;
  batch: Batch;
  trainee: Trainee;
  maxVisibility: string;
  type: string;
  qcFeedback: boolean;
  qcStatus: any; // TO DO
}
