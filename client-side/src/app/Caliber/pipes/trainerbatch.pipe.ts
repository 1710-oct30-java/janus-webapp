import { Pipe, PipeTransform } from '@angular/core';
import { Batch } from '../entities/Batch';
/**
 *
 */
@Pipe({ name: 'batchByTrainer' })
export class BatchByTrainerPipe implements PipeTransform {
    /**
     * takes in all batches and trainer to filter by
     * @param batches
     * @param trainerName
     */
    transform(batches: Batch[], trainerName: String): Batch[] {
        return batches.filter( batch => batch.trainer.name === trainerName);
    }
}
