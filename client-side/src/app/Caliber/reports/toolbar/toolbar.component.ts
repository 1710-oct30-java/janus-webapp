import { Component, OnInit, OnDestroy } from '@angular/core';

import { BatchService } from '../../../Caliber/services/batch.service';
import { Batch } from '../../entities/Batch';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { TrainerService } from '../../services/trainer.service';
import { Trainer } from '../../entities/Trainer';
import { forEach } from '@angular/router/src/utils/collection';
import { GranularityService } from '../services/granularity.service';
import { Trainee } from '../../entities/Trainee';
import { isUndefined, isObject } from 'util';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit, OnDestroy {

  // http://localhost:8080/vp/batch/all

  private batchService: BatchService;
  private trainerService: TrainerService;
  private granService: GranularityService;

  batchList: Array<Batch>;
  trainerList: Array<Trainer>;
  yearList;
  weekList;
  traineeList;
  batchSelect: any;
  weekSelect: any;
  yearSelect: any;
  traineeSelect: any;
  private batchSubscription: Subscription;
  private trainerSubscription: Subscription;

  constructor(batchService: BatchService, trainerService: TrainerService, granService: GranularityService) {
    this.batchService = batchService;
    this.trainerService = trainerService;
    this.granService = granService;

    this.batchSubscription = new Subscription();
    this.trainerSubscription = new Subscription();
  }

  ngOnInit() {
    this.batchService.fetchAll();
    this.batchSubscription = this.batchService.getList().subscribe((batches) => {
        if (batches.length > 0) {
          this.batchList = batches;
          this.createYearList();
          this.createWeekList();
          this.createTraineeList();
          this.filterByBatch(2201);
        }
      });

      this.yearSelect = document.getElementById('startDate');
      this.weekSelect = document.getElementById('week');
      this.traineeSelect = document.getElementById('trainee');
    }

    filterByBatch(batchNum) {

    }

    loadYears(year): boolean {
      if (year === new Date().getFullYear()) {
        return true;
      }
    }

    yearOnChange() {
      console.log(this.yearSelect.value);
      console.log(this.batchSelect.value);
    }

    /**
     * Creates an array of all the batch years without duplicates.
     */
    createYearList(): void {
      // create Set
      this.yearList = new Set();

      // Add current year and next year
      this.yearList.add(new Date().getFullYear());
      this.yearList.add(new Date().getFullYear() + 1);

      // Add all batch years to Set. It will not allow duplicates
      for (const date of this.batchList) {
        this.yearList.add(date.startDate.toString().substring(0, 4));
      }

      // Converts Set to an Array
      this.yearList = Array.from(this.yearList);

      // Sort the array
      this.yearList.sort(function(a, b) {
        return b - a;
      });
    }

    loadWeeks(week): boolean {
      if (week === 1) {
        return true;
      }
    }

    weekOnChange() {
      console.log(this.weekSelect.value);
    }

    createWeekList(): void {
      // create Set
      this.weekList = new Set();
      this.batchSelect = document.getElementById('trainer');

      // Add current week and further weeks
        for (let i = 0; i < this.batchList.length; i++) {
          console.log('entered for');
          console.log(this.batchSelect.value);
          console.log(this.batchList[i].batchId.toString());
          if (2201 === this.batchList[i].batchId) {
            console.log('entered if');
            for (let j = 1; j <= this.batchList[i].weeks; j++) {
              this.weekList.add(j);
            }
        }
      }

      // Add all batch weeks to Set. It will not allow duplicates
      // for (const week of this.batchList) {
      //   this.weekList.add(week);
      // }

      // Converts Set to an Array
      this.weekList = Array.from(this.weekList);

      // Sort the array
      this.weekList.sort(function(a, b) {
        return a - b;
      });
    }

    traineeOnChange() {
      console.log(this.traineeSelect.value);
    }

    createTraineeList(): void {
        // create Set
        this.traineeList = new Set();

        // Add trainees to a list from the current batch
          for (let i = 0; i < this.batchList.length; i++) {
            console.log('entered for');
            console.log(this.batchSelect);
            console.log(this.batchList[i].batchId.toString());
            if (2201 === this.batchList[i].batchId) {
              console.log('entered if');
              for (let j = 0; j <= this.batchList[i].trainees.length; j++) {
                this.traineeList.add(this.batchList[i].trainees[j].name);
              }
          }
        }

        // Add all batch weeks to Set. It will not allow duplicates
        // for (const week of this.batchList) {
        //   this.weekList.add(week);
        // }

        // Converts Set to an Array
        this.traineeList = Array.from(this.traineeList);

        // Sort the array
        this.traineeList.sort(function(a, b) {
          return a - b;
        });
    }

    public debug(): void {
      // console.log(this.batchList[0].startDate.toString().substr(0, 4));
      console.log(this.yearSelect.value);
    }

    public cleanBatchList(): Array<Batch> {
      for (let i = this.batchList.length - 1; i >= 0; i--) {
        if (this.batchList[i].startDate.toString().substr(0, 4) === this.batchList[i - 1].startDate.toString().substr(0, 4)) {
          this.batchList.splice(i, 1);
        }
      }
      return this.batchList;
    }

    public traineeFilter(trainee: Trainee) {
      this.granService.pushTrainee(trainee);
    }

    public batchFilter(batch: Batch) {
      this.granService.pushBatch(batch);
    }

    public weekFilter(week: number) {
      this.granService.pushWeek(week);
    }

    ngOnDestroy() {
      this.batchSubscription.unsubscribe();
      this.trainerSubscription.unsubscribe();
    }
}

