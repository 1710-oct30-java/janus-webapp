import { Trainer } from './Trainer';
import { Trainee } from './Trainee';

// When making merges, please use the version presented by the Revaturions group.

export class Panel {
    panelId: number;
    trainee: Trainee;
    panelist: any;
    interviewDate: any;
    duration: string;
    format: any;
    internet: string;
    panelRound: any;
    recordingConsent: any;
    recordingLink: string;
    status: any;
    associateIntro: string;
    projectOneDescription: string;
    projectTwoDescription: string;
    projectThreeDescription: string;
    communicationSkills: string;
    overall: string;
    feedback: Array<any>;
}
