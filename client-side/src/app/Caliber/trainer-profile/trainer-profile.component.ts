import { Component } from '@angular/core';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { Trainer } from '../entities/Trainer';
import { TrainerService } from '../services/trainer.service';

import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-trainer-profile',
  templateUrl: './trainer-profile.component.html',
  styleUrls: ['./trainer-profile.component.css']
})
export class TrainerProfileComponent implements OnInit {

  trainers: Array<Trainer>;
  private trainerService: TrainerService;

  constructor(trainerService: TrainerService, private modalService: NgbModal) {
    this.trainerService = trainerService;
  }

  /**
   * Gets all of the trainers from the service
   *
   */
  ngOnInit() {
    this.trainerService.fetchAll();
    this.trainerService.getList()
      .subscribe(
      (trainers: Trainer[]) => { this.trainers = trainers; }
      );
  }

  /**
   * Opens the modal
   *
   */
  open(content) {
    this.modalService.open(content);
  }

  /**
   * Submits the modal form
   * currently the form is just binded to trainers[0]
   * need to get the current trainer logged in from backend
   * change trainers[0] to currentTrainer
   *
   */
  updateInfo() {
    console.log('in the update trainer method Name: ' + this.trainers[0].name + ' Email: '
      + this.trainers[0].email + ' Tier: ' + this.trainers[0].tier);
  }
}
