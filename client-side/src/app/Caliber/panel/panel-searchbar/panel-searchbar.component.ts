import { Component, OnInit, OnDestroy, Output } from '@angular/core';

// rxjs
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

// entities
import { Trainee } from '../../entities/Trainee';
import { Batch } from '../../entities/Batch';

// services
import { TraineeService } from '../../services/trainee.service';
import { BatchService } from '../../services/batch.service';
import { PanelService } from '../../services/panel.service';

@Component({
  selector: 'app-panel-searchbar',
  templateUrl: './panel-searchbar.component.html',
  styleUrls: ['./panel-searchbar.component.css']
})

export class PanelSearchbarComponent implements OnInit, OnDestroy {
  trainee: Trainee;
  batchList;
  traineeList = [];
  traineeNameList: any = [];
  batchSubscription: Subscription;
  closeResult: string;

  protected traineeSubject: BehaviorSubject<Trainee>;

  /**
  * Get the necessary services
  * @constructor
  * @param panelService - the PanelService
  */
  constructor(private traineeService: TraineeService, private batchService: BatchService,
    private panelService: PanelService) {
    this.traineeSubject = new BehaviorSubject(this.trainee);
  }

  /**
   * fetch all batches
   */
  ngOnInit() {
    this.batchService.fetchAll();
    this.setBatchList();
  }

  /**
   * @function setBatchList
   */
  setBatchList() {
    this.batchSubscription = this.batchService.getList().subscribe(batchList => {
      this.batchList = batchList;
      this.getTrainees(this.batchList);
    });
  }

  /**
   * @function getTrainees
   * @param batchList
   */
  getTrainees(batchList) {
    for (let i = 0; i < batchList.length; i++) {
      this.traineeList = this.traineeList.concat(batchList[i].trainees);
    }
    for (let i = 0; i < this.traineeList.length; i++) {
      this.traineeNameList.push(this.traineeList[i].name);
    }
  }

  /**
   * @function setTrainee
   * @param trainee
   */
  setTrainee(trainee) {
    this.trainee = trainee;
    this.panelService.fetchAllByTrainee(trainee);
    this.traineeSubject.next(this.trainee);
  }

  /**
   * @function setTraineeBySearch
   * @param traineeName
   */
  setTraineeBySearch(traineeName) {
    for (let i = 0; i < this.traineeList.length; i++) {
      if (traineeName.item === this.traineeList[i].name) {
        this.trainee = this.traineeList[i];
        this.panelService.fetchAllByTrainee(this.trainee);
        this.traineeSubject.next(this.trainee);
      }
    }
  }

  /**
   * @function getTraineeSubject
   */
  public getTraineeSubject(): Observable<Trainee> {
    return this.traineeSubject.asObservable();
  }

  /**
   * @function search
   */
  search = (text$: Observable<string>) =>
    text$
      .debounceTime(200)
      .distinctUntilChanged()
      .map(term => term.length < 2 ? []
        : this.traineeNameList.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))

  ngOnDestroy() {
    this.batchSubscription.unsubscribe();
  }

}


