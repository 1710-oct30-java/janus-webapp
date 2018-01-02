import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { TrainerService } from '../../services/trainer.service';
import { Trainer } from '../../entities/Trainer';
import { NgForm } from '@angular/forms/src/directives/ng_form';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-trainers',
  templateUrl: './trainers.component.html',
  styleUrls: ['./trainers.component.css',
    '../../../../../node_modules/font-awesome/css/font-awesome.css']
})

export class TrainersComponent implements OnInit, OnDestroy {
  private trainerSubscription: Subscription;
  trainers: Trainer[];
  titles: Array<any>;
  tiers: Array<any>;
  model = new Trainer();

  currEditTrainer: Trainer;
  newTier: string;
  newTitle: string;

  rForm: FormGroup;

  constructor(private trainerService: TrainerService,
    private modalService: NgbModal, private fb: FormBuilder) { }

  ngOnInit() {
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

  getAllTrainers() {
    this.trainerService.getAll();
  }

  addTrainer(form) {
    // console.log(this.model.name + ' ' + this.model.email + ' ' + this.model.title + ' ' + this.model.tier);
    // alert(this.model.name + ' '  + this.model.email + ' ' + this.model.title + ' ' + this.model.tier);
    this.trainerService.createTrainer(this.model.name, this.model.title, this.model.email, this.model.tier);
  }


  open(content) {
    this.modalService.open(content);
    /*.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });*/
  }


  // getAllTrainers() {
  //   this.trainerService.getAll();
  // }

  // getAllTitles() {
  //   this.trainerService.getTitles();
  // }

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

  // Update button was clicked, try to update to database
  newTierChange(newTier) {
    this.model.tier = newTier;
  }

  newTitleChange(newTitle) {
    this.model.title = newTitle;
  }

  updateTrainer(modal) {
    // replacing the trainer's fields with the new ones
    this.currEditTrainer.tier = this.newTier;
    this.currEditTrainer.title = this.newTitle;
    this.currEditTrainer.name = modal.name;
    this.currEditTrainer.email = modal.email;
    // call trainerService to update
    this.trainerService.updateTrainer(this.currEditTrainer);
  }


  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  // clean up subscriptions
  ngOnDestroy() {
    this.trainerSubscription.unsubscribe();
  }

}
