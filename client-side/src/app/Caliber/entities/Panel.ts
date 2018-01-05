import { Trainer } from './Trainer';
import { Trainee } from './Trainee';

// When making merges, please use the version presented by the Revaturions group.

export class Panel {
    panelId: number;
    trainee: Trainee;
    panelist: Trainer;
    interviewDate: Date;
    duration: string;
    format: string;
    internet: string;
    panelRound: number;
    recordingConsent: boolean;
    recordingLink: string;
    panelStatus: string;
    associateIntro: string;
    projectOneDescription: string;
    projectTwoDescription: string;
    projectThreeDescription: string;
    communicationSkills: string;
    overall: string;
    feedback: Array<any>;
}
