import { Component, OnInit, OnDestroy } from '@angular/core';

// rxjs
import { Subscription } from 'rxjs/Subscription';

// components
import { Grade } from '../../entities/Grade';

// services
import { BatchService } from '../../services/batch.service';
import { TrainerService } from '../../services/trainer.service';
import { TraineeService } from '../../services/trainee.service';
import { AssessmentService } from '../../services/assessment.service';
import { GradeService } from '../../services/grade.service';
import { NoteService } from '../../services/note.service';
import { CategoryService } from '../../services/category.service';
import { Trainee } from '../../entities/Trainee';
import { Assessment } from '../../entities/Assessment';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})

export class TestComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  private data: any[];


  constructor(private service: GradeService) {
    this.service = service;
  }

  public getTestTrainee(): Trainee {
    return {
      traineeId: 5524,
      resourceId: null,
      name: 'Cartagena, Michael',
      email: 'mcartagenaez8@gmail.com',
      trainingStatus: 'Employed',
      phoneNumber: '347-782-4731',
      skypeId: 'mcart5566',
      profileUrl: 'https://app.revature.com/profile/MichaelC/55b6b9a398dacdb90093a3088822d35c',
      recruiterName: null,
      college: null,
      degree: null,
      major: null,
      techScreenerName: null,
      projectCompletion: null
    };
  }

  public getTestAssessment(): Assessment {
    return {
      assessmentId: 3061,
        title: 'Java Other',
        rawScore: 20,
        type: 'Other',
        batch: null,
        week: 1,
        category: {
          categoryId: 1,
          skillCategory: 'Java',
          active: true
        }
    };
  }

  private log(object: any): void {
    console.log(object);
  }

  // private testCreate(): void {
  //   const test = Object.assign({}, this.data[0]);

  //   console.log(test);

  //   this.service.create(test);
  // }

  ngOnInit() {
    this.subscription = this.service.getList().subscribe( (data) => {
      this.data = data;
      this.log(this.data);

      // if ( this.data.length > 0 ) {
      //   this.testCreate();
      // }
    });

    // this.service.fetchAll();
    // this.service.fetchAllByBatch(3002);
    this.service.fetchByBatchIdByWeek(2201, 1);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
