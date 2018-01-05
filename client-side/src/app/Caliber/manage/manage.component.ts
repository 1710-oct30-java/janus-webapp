import { Component, OnInit, OnDestroy } from '@angular/core';
import { BatchService} from '../services/batch.service';
import { TrainerService } from '../services/trainer.service';
import { LocationService } from '../services/location.service';
import { Location } from '../entities/Location';
import { Trainer } from '../entities/Trainer';
import { Batch } from '../entities/Batch';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { DatePipe} from '@angular/common';
import { format } from 'url';
import { Subscription } from 'rxjs/Subscription';
import { DisplayBatchByYear } from './manage.pipe';
import { PACKAGE_ROOT_URL } from '@angular/core/src/application_tokens';
import { TrainingTypeService } from '../services/training-type.service';
import { SkillService } from '../services/skill.service';
import { Address } from '../entities/Address';
import { TraineeService } from '../services/trainee.service';
import { Trainee } from '../entities/Trainee';
// import { exists } from 'fs';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css'],
  providers: [DatePipe],
})
export class ManageComponent implements OnInit, OnDestroy {

  closeResult: string;
  batches: Batch[] = [];
  batchByYear: Date[] = [];
  batchYearsNoDuplicates: number[] = [];
  currentYear = 2017;
  currentBatch: Batch = new Batch;
  createNewBatch: Batch = new Batch;
  batchToUpdate: Batch = new Batch;
  traineeProfileUrl: string;
  test: string;
  trainers: Trainer[] = [];
  trainerNames: string[] = [];
  locations: Address[] = [];
  trainingTypes: string[] = [];
  skills: string[] = [];
  createNewTrainee: Trainee = new Trainee;
  
  /* Subscriptions */
  batchSub: Subscription;
  trainerSub: Subscription;
  locationSub: Subscription;
  trainingTypeSub: Subscription;
  skillSub: Subscription;

  constructor(private batchService: BatchService, private trainerService: TrainerService,
    private locationService: LocationService, private trainingTypeService: TrainingTypeService,
    private skillService: SkillService, private traineeService: TraineeService,
    private modalService: NgbModal, private datePipe: DatePipe) {
   }


   ngOnInit() {

    /* fetches all batches */
      this.batchService.fetchAll();
      this.batchSub = this.batchService.getList().subscribe(batch => {
        this.batches = batch;
        const batchYears = [];
        /* implemented built in date pipe to display only 4 digit years 
        for the select year drop down to filter batches by year */
        for (let i = 0; i < this.batches.length; i++) {
          const newDate = this.datePipe.transform(this.batches[i].startDate, 'yyyy');
          batchYears.push(newDate);
      }
      this.batchYearsNoDuplicates = Array.from(new Set(batchYears));
     });

     /* fetches all trainers */
     this.trainerService.fetchAll();
     this.trainerSub = this.trainerService.getList().subscribe(trainer => {
       this.trainers = trainer;
       for (let i = 0; i < this.trainers.length; i++) {
         this.trainerNames.push(this.trainers[i].name);
       }
     });

     /* fetches all training locations */
     this.locationService.fetchAll();
     this.locationSub = this.locationService.getList().subscribe(location => {
       this.locations = location;
     });

     /*fetches all training types */
     /*this.trainingTypeService.fetchAll();*/
     this.trainingTypeSub = this.trainingTypeService.getList().subscribe(trainingType => {
       this.trainingTypes = trainingType;
     });

     /*fetches all skills */
     this.skillSub = this.skillService.getList().subscribe(skill => {
       this.skills = skill;
     });



  }

  ngOnDestroy() {

    this.batchSub.unsubscribe();

  }

  /** Creates a new batch from batch service
   * createNewBatch is a batch that is dynamically populated from the modal
   * and function calls from the html in the modal
   */
  createNewBatchFunction() {
    console.log(this.createNewBatch);
    this.batchService.save(this.createNewBatch);
  }

  createNewTraineeFunction() {
    console.log(this.createNewTrainee.name);
    console.log(this.createNewTrainee.email);
    console.log(this.createNewTrainee);
    this.traineeService.save(this.createNewTrainee);
  }


  updateBatchFunction() {
    this.batchService.update(this.batchToUpdate);
    console.log(this.currentBatch);
  }

  deleteBatchFunction(batch) {
    this.batchService.delete(batch);

  }


  deleteTraineeFunction(trainee) {
    /** In the original caliber app, deleting trainee removes the trainee
     * but the trainee reappears in the active trainees 
     * Even when you remove the trainee, it isn't moved to inactive
     * This is because the trainee object is detached from the database
     * 
     * This method shouldn't call traineeService, it needs to call a batchService
     * and apply a deleteTraineeByBatch(batch, trainee) so it can remove the trainee
     * from the current batch, and not delete the trainee overall
     * 
     * Later implementation needs to move a trainee from active to inactive
     * and be able to actually delete a trainee from the database entirely
     */
    this.traineeService.delete(trainee);
  }



  /** Displays the Create Batch modal and assigns current batch
   * to the batch that is passed in from the table row
   */
  openBatchModal(createBatch) {

    this.modalService.open(createBatch).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  /** Displays the Import Batch modal and assigns current batch
   * to the batch that is passed in from the table row
   */
  openImportBatchModal(importBatch) {

    this.modalService.open(importBatch).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

  }

/** Displays the View Batch Trainees modal and assigns current batch
   * to the batch that is passed in from the table row
   */
  openViewBatchTraineesModal(traineesInBatch, batch) {

    this.modalService.open(traineesInBatch, {size: 'lg', container: '.batch-trainee-modal-container'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

    this.currentBatch = batch;
  }

  /** Displays the Update Batch modal and assigns current batch
   * to the batch that is passed in from the table row
   */
  openUpdateBatchModal(updateBatch, batch) {


    this.modalService.open(updateBatch).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

    this.currentBatch = batch;

    this.batchToUpdate = Object.assign({}, this.currentBatch);
  }

  /** Dynamically updates the createBatch location selected inside the 
   * create batch modal whenever a location is selected from the dropdown
   */
  onCreateBatchLocationSelect(addressId: number): void {
    for (const location of this.locations) {
      if ( Number(location.addressId) === Number(addressId) ) {
        this.createNewBatch.address = location;
      }
    }
    /** Create batch also requires a "location" field inside of it
     *  For now, we will just send a string for the city since the address
     * is already set
     */
    this.createNewBatch.location = this.createNewBatch.address.city;
  }

  /** Dynamically updates the currentBatch location selected inside the
   * update batch modal whenever a new trainer is selected from the dropdown
   */
  onUpdateBatchLocationSelect(addressId: number): void {
    for (const location of this.locations) {
      if ( Number(location.addressId) === Number(addressId) ) {
        console.log('found location match ' + this.currentBatch.address.addressId);
        this.currentBatch.address = location;
      }
    }

  }

  /** This dynamically updates the currentBatch trainer selected inside the 
   * update batch modal whenever a new trainer is selected from the dropdown *
   * */
  onTrainerSelect(trainerId: number): void {
    for (const trainer of this.trainers) {
      if ( Number(trainer.trainerId) === Number(trainerId) ) {
        this.currentBatch.trainer = trainer;
      }
    }
  }

  /** Dynamically updates the createBatch trainer selected inside the
   * create batch modal whenever a trainer is selected from the dropdown
   */
  onCreateBatchTrainerSelect(trainerId: number): void {
    for (const trainer of this.trainers) {
      if ( Number(trainer.trainerId) === Number(trainerId) ) {
        this.createNewBatch.trainer = trainer;
      }
    }
  }


  /** Dynamically updates the createBatch coTrainer selected inside the
   * create batch modal whenever a trainer is selected from the dropdown
   */
  onCreateBatchCoTrainerSelect(trainerId: number ): void {
    for (const trainer of this.trainers) {
      if ( Number(trainer.trainerId) === Number(trainerId) ) {
        this.createNewBatch.coTrainer = trainer;
      }
    }
  }

  /** Modal functionality */
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  /** Keeps track of current year to display batch by years */
  updateYear(year) {
    this.currentYear = year;
  }


}

