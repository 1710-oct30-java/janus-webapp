import { Trainer } from './Trainer';
import { Trainee } from './Trainee';

export class Panel {
    panelId: number;
    trainee: Trainee;
    panelist: Trainer;
    interviewDate: Date;
    duration: string;
    interviewFormat: string;
    internetConnectivity: string;
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
}
