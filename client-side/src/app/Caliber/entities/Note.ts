import { Trainee } from './Trainee';

export class Note {
    noteId: number;
    content: string;
    week: number;
    trainee: Trainee;
    maxVisibility: number;
    type: string;
    qcFeedback: boolean;
    qcStatus: string;
}
