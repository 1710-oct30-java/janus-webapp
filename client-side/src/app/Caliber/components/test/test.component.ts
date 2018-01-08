import { Component, OnInit, OnDestroy } from '@angular/core';

// rxjs
import { Subscription } from 'rxjs/Subscription';

// components
import { Grade } from '../../entities/Grade';

// entities
import { Trainee } from '../../entities/Trainee';
import { Assessment } from '../../entities/Assessment';
import { Batch } from '../../entities/Batch';

// services
import { BatchService } from '../../services/batch.service';
import { TrainerService } from '../../services/trainer.service';
import { TraineeService } from '../../services/trainee.service';
import { AssessmentService } from '../../services/assessment.service';
import { GradeService } from '../../services/grade.service';
import { NoteService } from '../../services/note.service';
import { CategoryService } from '../../services/category.service';
import { LocationService } from '../../services/location.service';
import { PanelService } from '../../services/panel.service';
import { SkillService } from '../../services/skill.service';
import { TrainingTypeService } from '../../services/training-type.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})

export class TestComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  private data: any[];


  constructor(private service: NoteService ) {

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
        assessmentId: 0,
        title: 'Java Other',
        rawScore: 20,
        type: 'Other',
        batch: this.getTestBatch(),
        week: 1,
        category: {
          categoryId: 1,
          skillCategory: 'Java',
          active: true
        }
    };
  }

  public getTestBatch(): Batch {
    return {
      batchId: 3001,
      resourceId: null,
      trainingName: '1801 Oct16 Java',
      trainer: {
        trainerId: 2,
        name: 'Dan Pickles',
        title: 'Lead Trainer',
        email: 'pjw6193@hotmail.com',
        tier: 'ROLE_VP'
      },
      coTrainer: null,
      skillType: 'J2EE',
      trainingType: 'Revature',
      startDate: new Date('2017-12-10'),
      endDate: new Date('2017-12-30'),
      location: 'Revature LLC, 11730 Plaza America Drive, 2nd Floor | Reston, VA 20190',
      address: {
        addressId: 2,
        street: '11730 Plaza America Drive, 2nd Floor',
        city: 'Reston',
        state: 'VA',
        zipcode: '20190',
        company: 'Revature LLC',
        active: true
      },
      goodGradeThreshold: 0,
      borderlineGradeThreshold: 0,
      trainees: [],
      weeks: 4,
      gradedWeeks: 4,
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
    // this.service.save( this.getTestAssessment() );

    // this.service.getSaved().subscribe( (saved) => console.log(saved) );

    this.subscription = this.service.getList().subscribe( (data) => {
      this.data = data;
      this.log(this.data);

      // if ( this.data.length > 0 ) {
      //   this.testCreate();
      // }
    });

    // this.service.fetchAll();
    // this.service.fetchAllByBatch(3002);
    this.service.fetchByBatchIdByWeek(2150, 5);
  }

  ngOnDestroy() {
    // this.subscription.unsubscribe();
  }

}
