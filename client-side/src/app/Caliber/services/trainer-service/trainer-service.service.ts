import { Component } from '@angular/core';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { Trainer } from '../../../entities/Trainer';

export class TrainerService {

  currentTrainer = new Trainer();

  getTrainerById(id: number) {
    // this.currentTrainer = sessionStorage("currentTrainer")
    console.log('id of trainer to get in service: ' + id);
    this.currentTrainer.trainerId = 1;
    this.currentTrainer.name = 'john';
    this.currentTrainer.email = 'john@email.com';
    this.currentTrainer.phoneNumber = '888-888-8888';
    this.currentTrainer.bio = 'The best coder east of Bearss Ave';
    return this.currentTrainer;
  }
  updateInfo(ct: Trainer) {
    return ct;
  }
}
