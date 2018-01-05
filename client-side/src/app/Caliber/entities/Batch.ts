import { Trainer } from './Trainer';
import { Address } from './Address';
import { Trainee } from './Trainee';

export class Batch {
    batchId: number;
    resourceId: number;
    trainingName: string;
    trainer: Trainer;
    coTrainer: Trainer;
    skillType: string;
    trainingType: string;
    startDate: Date;
    endDate: Date;
    location: string;
    address: Address;
    goodGradeThreshold: number;
    borderlineGradeThreshold: number;
    trainees: Trainee[];
    weeks: number;
    gradedWeeks: number;
}
