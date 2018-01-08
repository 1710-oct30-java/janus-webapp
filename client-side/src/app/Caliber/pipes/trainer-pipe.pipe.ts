import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'trainerPipe'
})
export class TrainerPipePipe implements PipeTransform {

  transform(trainers: any, status: String): any {
    console.log(trainers);
    if (status === 'ROLE_INACTIVE') {
      return trainers.filter(trainer => trainer.tier === status);
    }else {
      return trainers.filter(trainer => trainer.tier !== 'ROLE_INACTIVE');
    }
  }
}
