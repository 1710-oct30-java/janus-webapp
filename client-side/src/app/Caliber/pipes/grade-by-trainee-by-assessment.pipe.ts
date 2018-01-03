import { Pipe, PipeTransform } from '@angular/core';

import { Grade } from '../entities/Grade';
import { Trainee } from '../entities/Trainee';
import { Assessment } from '../entities/Assessment';

@Pipe({
  name: 'gradeByTraineeByAssessment'
})

export class GradeByTraineeByAssessmentPipe implements PipeTransform {

  transform(value: Grade[], trainee: Trainee, assessment: Assessment ): Grade[] {
    return value.filter( (grade) =>
      ( grade.assessment.assessmentId === assessment.assessmentId && grade.trainee.traineeId === trainee.traineeId ) );
  }

}
