import { Assessment } from './Assessment';
import { Trainee } from './Trainee';

export class Grade {
    gradeId: number;
    assessment: Assessment;
    trainee: Trainee;
    dateReceived: any;
    score: number;
}
