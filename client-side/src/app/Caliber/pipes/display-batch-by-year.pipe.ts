import { Pipe, PipeTransform } from '@angular/core';
import { Batch } from '../entities/Batch';

@Pipe({name: 'DisplayBatchByYear'})
export class DisplayBatchByYear implements PipeTransform {
   transform(item: Batch[], year: number): Batch[] {
       const output = item.filter(batch => {
           const selectedDate = new Date(batch.startDate);
           return ( Number(selectedDate.getFullYear()) === Number(year) );
       });
       return output;
   }
}
