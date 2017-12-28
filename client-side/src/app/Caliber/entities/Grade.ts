import { Assessment } from './Assessment';
import { Trainee } from './Trainee';

export class Grade {
    gradeId: number;
    assessment: Assessment;
    trainee: Trainee;
    dateReceived: Date;
    score: number;
}
