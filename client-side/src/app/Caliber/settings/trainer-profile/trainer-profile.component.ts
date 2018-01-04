import { Component } from '@angular/core';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { Observable } from 'rxjs/Observable';

import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { Trainer } from '../../entities/Trainer';
import { Batch } from '../../entities/Batch';
import { TrainerService } from '../../services/trainer.service';
import { BatchService } from '../../services/batch.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';




@Component({
  selector: 'app-trainer-profile',
  templateUrl: './trainer-profile.component.html',
  styleUrls: ['./trainer-profile.component.css']
})
export class TrainerProfilesComponent implements OnInit {

  // create variables for all batches, and current trainer and their batch
  currentTrainer: Trainer;
  batches: Array<Batch>;
  currentBatch: Batch;

  // create variable for subscribing and trainers
  private trainerSubscription: Subscription;
  trainers: Array<Trainer>;
  titles: Array<any>;
  tiers: Array<any>;

  // create temp variables
  model = new Trainer();
  currEditTrainer: Trainer;
  newTier: string;
  newTitle: string;

  // create varible for form group
  rForm: FormGroup;

  // get services
  constructor(private trainerService: TrainerService, private modalService: NgbModal,
    private batchService: BatchService, private router: Router, private fb: FormBuilder) { }

  ngOnInit() {
    // gets the appropriate trainer for the page from trainer service's current trainer
    this.trainerService.currentTrainer.subscribe(currentTrainer => this.currentTrainer = currentTrainer);

    // if the trainer is null navigate back to the trainers page
    if (this.currentTrainer == null) { this.router.navigate(['Caliber/settings/trainers']); }

    // fetches all batches for the current trainer authenticated on the server side which is patrick walsh
    this.batchService.fetchAll();
    this.batchService.getList().subscribe(
      (batches: Batch[]) => { this.batches = batches; }
    );

    // fetches all trainers, titles and tiers and pushes them onto the trainers, titles and tiers subjects
    this.trainerService.populateOnStart();

    // subsscribes to the subject
    this.trainerSubscription = this.trainerService.trainers$.subscribe((resp) => {
      this.trainers = resp;
    });
    this.trainerSubscription = this.trainerService.titles$.subscribe((resp) => {
      this.titles = resp;
    });
    this.trainerSubscription = this.trainerService.tiers$.subscribe((resp) => {
      this.tiers = resp;
    });
  }
  // opens a modal
  open(content) {
    this.modalService.open(content);
  }
  // opens a large modal
  openLarge(content) {
    this.modalService.open(content, { size: 'lg' });
  }
  // sets the current batch
  setCurrentBatch(batch) {
    this.currentBatch = batch;
  }
  // navigates to assess page
  navAssess() {
    this.router.navigate(['Caliber/reports']);
  }
  // navigates to assess page
  navManage() {
    this.router.navigate(['Caliber/manage']);
  }



  // Open modal and get Trainer that belong to this modal
  // Backup these fields before the edit
  editTrainer(content, modalTrainer: Trainer) {
    this.currEditTrainer = modalTrainer;
    this.newTier = modalTrainer.tier;
    this.newTitle = modalTrainer.title;
    this.rForm = this.fb.group({
      'name': [this.currEditTrainer.name, Validators.required],
      'email': [this.currEditTrainer.email, Validators.required],
      'title': [this.newTitle],
      'tier': [this.newTier],
    });
    this.modalService.open(content, { size: 'lg' });
  }

  // When tier was changed
  tierChange(newTier) {
    this.newTier = newTier;
  }

  // when title was changed
  titleChange(newTitle) {
    // Empty title, changed back to original
    if (newTitle === '') {
      this.newTitle = this.currEditTrainer.title;
    } else {
      // New title was changed
      this.newTitle = newTitle;
    }
  }

  // // Sets the model trainer's tier field
  // newTierChange(newTier) {
  //   this.model.tier = newTier;
  // }
  // // Sets the model trainer's tier field
  // newTitleChange(newTitle) {
  //   this.model.title = newTitle;
  // }

  // update button clicked, takes the value of the modal
  updateTrainer(modal) {
    // replacing the trainer's fields with the new ones
    this.currEditTrainer.tier = this.newTier;
    this.currEditTrainer.title = this.newTitle;
    this.currEditTrainer.name = modal.name;
    this.currEditTrainer.email = modal.email;
    // call trainerService to update
    this.trainerService.updateTrainer(this.currEditTrainer);
  }

}
