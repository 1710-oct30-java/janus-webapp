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
  someTrainer = new Trainer();
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
  // gets the appropriate trainer for the page
  this.trainerService.currentTrainer.subscribe(currentTrainer => this.currentTrainer = currentTrainer);
  this.trainerService.fetchByEmail(this.currentTrainer.email + '/').subscribe(
    (currentTrainer: Trainer) => { this.currentTrainer = currentTrainer; }
  );
  // fetches all batches for the current trainer authenticated on the server side which is patrick walsh
  this.batchService.fetchAll();
  this.batchService.getList().subscribe(
    (batches: Batch[]) => { this.batches = batches; }
  );
}
  // updates a specfic trainers info
  updateInfo() {
    console.log('in the update trainer method Name: ' + this.currentTrainer.name + ' Email: '
      + this.currentTrainer.email + ' Tier: ' + this.currentTrainer.tier);
  }
  // opens a modal
  open(content) {
    this.modalService.open(content);
  }
  // opens a large modal
  openLarge(content) {
    this.modalService.open(content, {size: 'lg'});
  }
  // sets the current batch
  setCurrentBatch(batch) {
    this.currentBatch = batch;
  }
  // navigates to assess page
  navAssess() {
    this.router.navigate(['Caliber/assess']);
  }
  // navigates to assess page
  navManage() {
    this.router.navigate(['Caliber/manage']);
  }
}
