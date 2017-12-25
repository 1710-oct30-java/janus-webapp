import { Batch } from './Batch';
import { Category } from './Category';

export class Assessment {
    assessmentId: number;
    title: string;
    batch: Batch;
    rawScore: number;
    type: string;
    week: number;
    category: Category;
}
