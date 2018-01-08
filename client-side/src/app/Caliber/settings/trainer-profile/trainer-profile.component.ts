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

  /**
  * create variables for all batches,
  * current trainer and their batch
  */
  currentTrainer: Trainer;
  batches: Array<Batch>;
  currentBatch: Batch;

  /**
  * create variables for subscribing and trainers
  * and storing form data
  */
  private trainerSubscription: Subscription;
  trainers: Array<Trainer>;
  titles: Array<any>;
  tiers: Array<any>;
  model = new Trainer();
  currEditTrainer: Trainer;
  newTier: string;
  newTitle: string;
  rForm: FormGroup;

  constructor(private trainerService: TrainerService, private modalService: NgbModal,
    private batchService: BatchService, private router: Router, private fb: FormBuilder) { }

  ngOnInit() {
  /**
  * gets the current trainer for the page from trainer service's current trainer
  * if the current trainer is null navigate back to the trainers page so that the user can select one
  */
    this.trainerService.currentTrainer.subscribe(currentTrainer => this.currentTrainer = currentTrainer);
    if (this.currentTrainer == null) {
      this.router.navigate(['Caliber/settings/trainers']);
    }

  /**
  * fetches all batches and pushes into the batches object,
  */
    this.batchService.fetchAll();
    this.batchService.getList().subscribe(
      (batches: Batch[]) => { this.batches = batches; }
    );

  /**
  * fetches all trainers, titles and tiers and pushes them onto the trainers, titles and tiers subjects
  */
    this.trainerService.populateOnStart();
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

  /**
  * opens a modal
  *
  * @param content: String
  */
  open(content) {
    this.modalService.open(content);
  }

  /**
  * opens a large modal
  *
  * @param content: String
  */
  openLarge(content) {
    this.modalService.open(content, { size: 'lg' });
  }

  /**
  * sets the current batch
  * triggered when a user clicks to see the trainees for a current batch
  *
  * @param content: String
  */
  setCurrentBatch(batch) {
    this.currentBatch = batch;
  }

  /**
  * navigates to the reports page
  */
  navReports() {
    this.router.navigate(['Caliber/reports']);
  }

  /**
  * navigates to the manage page
  */
  navManage() {
    this.router.navigate(['Caliber/manage']);
  }

  /**
  * Open modal and get Trainer that belong to this modal
  * Backup these fields before the edit
  *
  * @param content: String
  * @param modalTrainer: Trainer
  */
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

  /**
  * When tier was changed
  *
  * @param newTier: string
  */
  tierChange(newTier) {
    this.newTier = newTier;
  }

  /**
  * When title was changed
  *
  * @param newTitle: string
  */
  titleChange(newTitle) {
    // Empty title, changed back to original
    if (newTitle === '') {
      this.newTitle = this.currEditTrainer.title;
    } else {
      // New title was changed
      this.newTitle = newTitle;
    }
  }

  /**
  * update button clicked, takes the value of the modal
  *
  * @param modal: any
  */
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
