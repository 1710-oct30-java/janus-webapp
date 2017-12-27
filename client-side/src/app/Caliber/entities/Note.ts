import { Batch } from './Batch';
import { Trainee } from './Trainee';
import { NoteType } from './NoteType';
import { TrainerRole } from './TrainerRole';
import { QCStatus } from './QCStatus';

export class Note {
    noteId: number;
    content: string;
    week: number;
    batch: Batch;
    trainee: Trainee;
    maxVisibility: TrainerRole;
    noteType: NoteType;
    qcFeedback: boolean;
    qcStatus: QCStatus;
    type: string;
}
