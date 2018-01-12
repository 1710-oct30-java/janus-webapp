import { Batch } from './Batch';
import { Trainee } from './Trainee';

export class Note {
    public static TYPE_QCBATCH = 'QC_BATCH';
    public static TYPE_QCTRAINEE = 'QC_TRAINEE';
    public static TYPE_TRAINEE = 'TRAINEE';
    public static TYPE_BATCH = 'BATCH';

    public static STATUS_SUPERSTAR = 'Superstar';
    public static STATUS_GOOD = 'Good';
    public static STATUS_AVERAGE = 'Average';
    public static STATUS_POOR = 'Poor';
    public static STATUS_UNDEFINED = 'Undefined';

    noteId: number;
    content: string;
    week: number;
    batch: Batch;
    trainee: Trainee;
    maxVisibility: string;
    type: string;
    qcFeedback: boolean;
    qcStatus: string;
}
