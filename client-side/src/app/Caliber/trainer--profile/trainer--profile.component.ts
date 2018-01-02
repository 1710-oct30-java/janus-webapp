import { Component } from '@angular/core';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { Trainer } from '../entities/Trainer';
import { TrainerService } from '../services/trainer.service';
import { Observable } from 'rxjs/Observable';

import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from '../services/authentication.service';
import { User } from '../entities/User';
import { BatchService } from '../services/batch.service';
import { Batch } from '../entities/Batch';
import { Router } from '@angular/router';


@Component({
  selector: 'app-trainer--profile',
  templateUrl: './trainer--profile.component.html',
  styleUrls: ['./trainer--profile.component.css']
})
export class TrainerProfile2Component implements OnInit {

  closeResult: string;
  trainerEmail: string;
  trainers: Array<Trainer>;
  currentTrainer: Trainer;
  batches: Array<Batch>;
  currentBatch: Batch;
  private trainerService: TrainerService;
  private authService: AuthenticationService;
  private batchService: BatchService;

  constructor(trainerService: TrainerService, private modalService: NgbModal,
    authService: AuthenticationService, batchService: BatchService, private router: Router) {
    this.trainerService = trainerService;
    this.authService = authService;
    this.batchService = batchService;
  }

  ngOnInit() {
    // gets all trainers
    this.trainerService.fetchAll();
    // gets all batches for a specific trainer
    this.batchService.fetchAllByTrainer();
    this.trainerService.getList()
      .subscribe(
      (trainers: Trainer[]) => { this.trainers = trainers; }
      );
    console.log('got trainers now getting authenticated user');
    this.trainerEmail = 'patrick.walsh@revature.com/';
    this.trainerService.fetchByEmail(this.trainerEmail)
      .subscribe(
      (currentTrainer: Trainer) => {
        console.log(currentTrainer);
        this.currentTrainer = currentTrainer;
      }
      );
    // patrick.walsh@revature.com
    // genesis.bonds@revature.com
    // gets the batches by trainer
    this.batchService.getList()
      .subscribe(
      (batches: Batch[]) => {
        this.batches = batches;
      });
  }
  // updates a specfic trainers info
  updateInfo() {
    console.log('in the update trainer method Name: ' + this.currentTrainer.name + ' Email: '
      + this.currentTrainer.email + ' Tier: ' + this.currentTrainer.tier);
  }
  // opens modal
  open(content) {
    this.modalService.open(content);
  }
  openLarge(content) {
    this.modalService.open(content, {size: 'lg'});
  }
  setCurrentBatch(batch) {
    this.currentBatch = batch;
  }
  redirect() {
    this.router.navigate(['/assess']);
  }
}
