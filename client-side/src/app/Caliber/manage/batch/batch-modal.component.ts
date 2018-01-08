import { Component, OnInit, Input, OnDestroy, OnChanges } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

// rxjs
import { Subscription } from 'rxjs/Subscription';

// entities
import { Batch } from '../../entities/Batch';

// services
import { BatchService } from '../../services/batch.service';
import { TrainingTypeService } from '../../services/training-type.service';
import { SkillService } from '../../services/skill.service';
import { LocationService } from '../../services/location.service';
import { TrainerService } from '../../services/trainer.service';
import { Trainer } from '../../entities/Trainer';
import { Address } from '../../entities/Address';

@Component({
  selector: 'app-manage-batch-modal',
  templateUrl: './batch-modal.component.html',
  styleUrls: ['./batch-modal.component.css']
})
export class BatchModalComponent implements OnInit, OnDestroy, OnChanges {

  @Input() initialBatch: Batch;

  public batch: Batch;

  public trainers: Trainer[];
  public skills: string[];
  public locations: Address[];
  public trainingTypes: string[];
  batchType: string;
  isNewBatch: boolean;

  private savedBatchSubscription: Subscription;
  private trainingTypeListSubscription: Subscription;
  private skillListSubscription: Subscription;
  private locationListSubscription: Subscription;
  private trainerListSubscription: Subscription;

  constructor(
    private activeModal: NgbActiveModal,
    private batchService: BatchService,
    private trainingTypeService: TrainingTypeService,
    private skillService: SkillService,
    private locationService: LocationService,
    private trainerService: TrainerService
  ) {
    this.batch = new Batch();
    this.setLocations([]);
    this.setTrainers([]);
    this.setTrainingTypes([]);
    this.setSkills([]);
  }

  private setSkills( skills: string[] ): void {
    this.skills = skills;
  }

  private setLocations( locations: Address[] ): void {
    this.locations = locations;
  }

  private setTrainers( trainers: Trainer[] ): void {
    this.trainers = trainers;
  }

  private setTrainingTypes( types: string[] ): void {
    this.trainingTypes = types;
  }

  private clone() {
    Object.assign(this.batch, this.initialBatch);
  }

  close(result: any): void {
    this.activeModal.close(result);
    this.clone();
  }

  dismiss(result: any): void {
    this.activeModal.dismiss(result);
    this.clone();
  }

  save(): void {
    this.batchService.save( this.batch );
  }

  create(): void {
    this.batchService.create(this.batch);
  }

  /** Dynamically updates the createBatch location selected inside the
    * create batch modal whenever a location is selected from the dropdown
    */
  onLocationSelect(addressId: number): void {
    for (const location of this.locations) {
      if (Number(location.addressId) === Number(addressId)) {
        this.batch.address = location;
      }
    }
    /** Create batch also requires a "location" field inside of it
     *  For now, we will just send a string for the city since the address
     * is already set
     * 
     * The address/location entities need to be redesigned across the application
     */
    this.batch.location = this.batch.address.city;
  }

  /** Dynamically updates the createBatch trainer selected inside the
 * create batch modal whenever a trainer is selected from the dropdown
 */
  onTrainerSelect(trainerId: number): void {
    for (const trainer of this.trainers) {
      if (Number(trainer.trainerId) === Number(trainerId)) {
        this.batch.trainer = trainer;
      }
    }
  }


  /** Dynamically updates the createBatch coTrainer selected inside the
   * create batch modal whenever a trainer is selected from the dropdown
   */
  onCoTrainerSelect(trainerId: number): void {
    for (const trainer of this.trainers) {
      if (Number(trainer.trainerId) === Number(trainerId)) {
        this.batch.coTrainer = trainer;
      }
    }
  }

  ngOnInit() {
    /*
     * reacts to saved batches
     */
    this.savedBatchSubscription = this.batchService.getSaved()
      .subscribe( (saved) => this.close('Saved Successfully') );

     /*
    * keep an updated list of trainers
    */
    this.trainerListSubscription = this.trainerService.getList()
      .subscribe((trainers) => this.setTrainers(trainers));


    this.locationListSubscription = this.locationService.getList()
      .subscribe((locations) => this.setLocations(locations));

    /*fetches all training types */
    /*this.trainingTypeService.fetchAll();*/
    this.trainingTypeListSubscription = this.trainingTypeService.getList()
      .subscribe((types) => this.setTrainingTypes(types));

    /*fetches all skills */
    this.skillListSubscription = this.skillService.getList()
      .subscribe((skills) => this.setSkills(skills));

    /* fetches all batches */
    this.batchService.fetchAll();

    /* fetches all trainers */
    this.trainerService.fetchAll();

    /* fetches all training locations */
    this.locationService.fetchAll();

    /* basic logic to assign the header and button names to what the modal
    is being used for
    If current batch is empty we are creating a new batch
    If current batch has a field asssigned already we are updating a batch

    isNewBatch is assigned so that the proper functions are called from the buttons
    
    This should be redesigned */

    if (this.batch.trainer == null) {
      this.batchType = 'Create Batch';
      this.isNewBatch = true;
     } else {
        this.batchType = 'Update Batch';
        this.isNewBatch = false;
      }

    this.clone();
  }

  ngOnDestroy(): void {
    this.savedBatchSubscription.unsubscribe();
    this.locationListSubscription.unsubscribe();
    this.trainerListSubscription.unsubscribe();
    this.trainingTypeListSubscription.unsubscribe();
    this.skillListSubscription.unsubscribe();
  }

  ngOnChanges(): void {
    this.clone();
  }

}
