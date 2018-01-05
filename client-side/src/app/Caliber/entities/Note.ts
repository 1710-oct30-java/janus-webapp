import { Trainee } from './Trainee';
import { Batch } from './Batch';

export class Note {
    noteId: number;
    content: string;
    week: number;
    batch: Batch;
    trainee: Trainee;
    maxVisibility: number;
    type: string;
    qcFeedback: boolean;
    qcStatus: string;
}
