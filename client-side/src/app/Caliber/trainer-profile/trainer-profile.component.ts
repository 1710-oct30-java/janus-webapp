import { Component } from '@angular/core';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { Trainer } from '../../entities/Trainer';
import { TrainerService } from '../services/trainer-service/trainer-service.service';

@Component({
  selector: 'app-trainer-profile',
  templateUrl: './trainer-profile.component.html',
  styleUrls: ['./trainer-profile.component.css']
})
export class TrainerProfileComponent implements OnInit {

  ts = new TrainerService();
  currentTrainer= new Trainer();
  ct = new Trainer();

  ngOnInit() {
    this.ct.name = 'john';
  }

  fetch() {
    // this.currentTrainer = sessionStorage("currentTrainer")
    // this.currentTrainer.trainerId = 1;
    // this.currentTrainer.name = 'john';
    // this.currentTrainer.email = 'john@email.com';
    // this.currentTrainer.phoneNumber = '888-888-8888';
    // this.currentTrainer.bio = 'The best coder east of Bearss Ave';
    this.currentTrainer = this.ts.getTrainerById(1);
  }

  updateInfo () {
    this.ts.updateInfo(this.ct);
  }
}
