import { Pipe, PipeTransform } from '@angular/core';
import { Trainee } from '../entities/Trainee';

@Pipe({
  name: 'traineeSearchPipe'
})
export class TraineeSearch implements PipeTransform {

  transform(trainees: any, searchText: String): Trainee[] {
    if (!trainees) {
      return [];
    } else {
      searchText = searchText.toLowerCase();

      return trainees.filter(results => {
        return results.toLowerCase().includes(searchText);
      });
    }
  }
}

