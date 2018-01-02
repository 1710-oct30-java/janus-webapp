import { Component } from '@angular/core';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { Trainer } from '../entities/Trainer';
import { TrainerService } from '../services/trainer.service';
import { Observable } from 'rxjs/Observable';

import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from '../services/authentication.service';
import { User } from '../entities/User';


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

    constructor(trainerService: TrainerService, private modalService: NgbModal, authService: AuthenticationService) {
        this.trainerService = trainerService;
        this.authService = authService;
    }

    ngOnInit() {
        console.log('before fetch');
        this.trainerService.fetchAll();
        // this.authService.fetchCurrentUser();
        console.log('after fetch');
        // gets all trainers
        this.trainerService.getList()
        .subscribe(
            (trainers: Trainer[]) => { this.trainers = trainers; }
        );
        console.log('got trainers now getting authenticated user');
        // this.authService.getAuthenticatedUser()
        // .subscribe(
        //   (currentTrainer: User) => { this.currentTrainer = currentTrainer; }
        // );
        this.trainerEmail = 'patrick.walsh@revature.com/';
        this.trainerService.fetchByEmail(this.trainerEmail)
        .subscribe(
          (currentTrainer: Trainer) => {
            console.log(currentTrainer);
            this.currentTrainer = currentTrainer; }
        );
        // patrick.walsh@revature.com
        // genesis.bonds@revature.com
    }
    updateInfo() {
      console.log('in the update trainer method Name: ' + this.trainers[0].name + ' Email: '
      + this.trainers[0].email + ' Tier: ' + this.trainers[0].tier);
  }







    open(content) {
        this.modalService.open(content).result.then((result) => {
          this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
      }

      private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
          return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
          return 'by clicking on a backdrop';
        } else {
          return  `with: ${reason}`;
        }
      }

}
