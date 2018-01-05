import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'trainerPipe'
})
export class TrainerPipePipe implements PipeTransform {

  transform(trainers: any, status: String): any {
    if (status === 'INACTIVE') {
      return trainers.filter(trainer => trainer.tier === status);
    }else {
      return trainers;
    }
  }
}
