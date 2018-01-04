import { Component } from '@angular/core';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { Trainer } from '../entities/Trainer';
import { TrainerService } from '../services/trainer.service';
import { Observable } from 'rxjs/Observable';

import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from '../services/authentication.service';
import { User } from '../entities/User';
import { EnvironmentService } from '../services/environment.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-tempjohn',
  templateUrl: './tempjohn.component.html',
  styleUrls: ['./tempjohn.component.css']
})
export class TempJohnComponent implements OnInit {

  closeResult: string;
  trainerEmail: string;
  trainers: Array<Trainer>;
  currentTrainer: Trainer;
  private trainerService: TrainerService;
  private authService: AuthenticationService;

  constructor(trainerService: TrainerService, private modalService: NgbModal,
     authService: AuthenticationService, private envService: EnvironmentService,
    private route: Router) {
    this.trainerService = trainerService;
    this.authService = authService;
  }

  ngOnInit() {
    this.trainerService.fetchAll();
    this.trainerService.getList()
      .subscribe(
      (trainers: Trainer[]) => { this.trainers = trainers; }
      );
      console.log('got all trainers');

      // this.trainerService.currentTrainer.subscribe(currentTrainer => this.currentTrainer = currentTrainer);

    // patrick.walsh@revature.com
    // genesis.bonds@revature.com
  }

  goToProfile(trainer) {
    this.trainerService.changeCurrentTrainer(trainer);
    this.route.navigate(['Caliber/trainer-dev']);
    // console.log(trainer.email);
    // this.trainerService.fetchByEmail(trainer.email + '/')
    //   .subscribe(
    //   (currentTrainer: Trainer) => {
    //     this.currentTrainer = currentTrainer;
    //     console.log(currentTrainer.name);
    //   });
    //   this.envService.buildUrl('trainer-dev');
  }
}

