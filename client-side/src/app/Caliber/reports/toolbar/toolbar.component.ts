/**
 * This toolbar is responsible for updating the charts information.
 *
 * @author Edel Benavides
 * @author Brandon Richardson
 */
import { Component, OnInit, OnDestroy } from '@angular/core';

import { BatchService } from '../../../Caliber/services/batch.service';
import { Batch } from '../../entities/Batch';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { TrainerService } from '../../services/trainer.service';
import { Trainer } from '../../entities/Trainer';
import { GranularityService } from '../services/granularity.service';
import { Trainee } from '../../entities/Trainee';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit, OnDestroy {

  // http://localhost:8080/vp/batch/all
  // Toolbar selections
  yearSelect: any;
  batchSelect: any;
  weekSelect: any;
  traineeSelect: any;
  latestBatch: Batch = null;

  // Arrays
  batchList: Array<Batch>;
  batchesBasedOnYearList: Array<Batch> = [];
  trainerList: Array<Trainer>;
  yearList;
  batchWeeksList: Array<String>;
  traineesList: Array<Trainee>;

  // Subscriptions
  private batchSubscription: Subscription;
  private trainerSubscription: Subscription;

  constructor(private batchService: BatchService,
              private trainerService: TrainerService,
              private granularityService: GranularityService) {
    this.batchSubscription = new Subscription();
    this.trainerSubscription = new Subscription();
  }

  ngOnInit() {
    this.batchService.fetchAll();
    this.batchSubscription = this.batchService.getList().subscribe((batches) => {
        if (batches.length > 0) {
          this.batchList = batches;
          this.latestBatch = this.batchList[0];
          this.createYearList();
          this.createBatchWeeks();
          this.createTrainees();
          this.pushToGranularityService();
        }
      });

      // Initialize current selections
      this.yearSelect = document.getElementById('startDate');
      this.batchSelect = document.getElementById('batch');
      this.weekSelect = document.getElementById('week');
      this.traineeSelect = document.getElementById('trainee');
    }

    /************************************
     * Generate dropdown information
     ************************************/
    /**
     * Creates an array of all the batch years without duplicates.
     */
    createYearList(): void {
      // create Set
      this.yearList = new Set();

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

    /**
     * Returns an array of all weeks from current batch.
     */
    createBatchWeeks() {
      const weeksArray = ['Week (All)'];
      if (this.batchesBasedOnYearList.length === 0 && this.latestBatch) {
        // Avoid empty fields
        for (let i = 1; i <= this.getBatchById(this.latestBatch.batchId).weeks; i++) {
          weeksArray.push(`Week ${i}`);
        }
      } else {
        // Make sure batch selection if not empty
        if (this.batchSelect) {
          for (let i = 1; i <= this.getBatchById(Number(this.batchSelect.value)).weeks; i++) {
            weeksArray.push(`Week ${i}`);
          }
        }
      }

      this.batchWeeksList = weeksArray;
      return this.batchWeeksList;
    }

    /**
     * Returns an array of current trainees based on current batch selection.
     */
    createTrainees() {
      let traineesArray = [];
      // Avoid empty fields
      if (this.batchesBasedOnYearList.length === 0 && this.latestBatch) {
        traineesArray = this.getBatchById(this.latestBatch.batchId).trainees;
      } else {
        if (this.batchSelect) {
          traineesArray = this.getBatchById(Number(this.batchSelect.value)).trainees;
        }
      }

      this.traineesList = traineesArray;
      this.sortTraineesByName();
    }
    /************************************
     * END Generate dropdown information
     ************************************/


    /********************************
     * On Change Events
     ********************************/
    yearOnChange() {
      this.getBatchesByYear();
      this.createBatchWeeks();
      this.createTrainees();
      this.pushToGranularityService();
    }

    weekOnChange() {
      // week on change logic
      this.pushToGranularityService();
    }

    batchOnChange() {
      this.createBatchWeeks();
      this.createTrainees();
      this.pushToGranularityService();
    }

    traineeOnChange() {
      // trainee on change logic
      this.pushToGranularityService();
    }
    /********************************
     * END On Change Events
     ********************************/


     /********************************
     * Other functions
     ********************************/
    /**
     * Returns Batch object from batch ID.
     * @param batchId
     */
    getBatchById(batchId: number): Batch {
      for (const batch of this.batchList) {
        if (batchId === batch.batchId) {
          return batch;
        }
      }
    }

    /**
     * Returns Trainee object based on trainee ID.
     * @param id
     */
    getTraineeById(id: number): Trainee {
      for (const batch of this.batchList) {
        for (const trainee of batch.trainees) {
          if (trainee.traineeId === id) {
            return trainee;
          }
        }
      }
    }

    /**
     * Returns current week selected as a number.
     */
    getWeek(): number {
      return Number(this.weekSelect.value);
    }

    /**
     * Pushes all current selected information to granularity service.
     */
    pushToGranularityService() {
      console.log('batch: ' + this.batchSelect.value + ', trainee: ' + this.traineeSelect.value + ', week: ' + this.getWeek());

      // Check if initial selections are empty
      if (this.batchesBasedOnYearList.length === 0) {
        const trainee = new Trainee();
        trainee.traineeId = 0;
        this.granularityService.pushBatch(this.latestBatch);
        this.granularityService.pushTrainee(this.traineeSelect.value);
        this.granularityService.pushWeek(this.getWeek());
      } else { // else add current selections
        this.granularityService.pushBatch(this.getBatchById(Number(this.batchSelect.value)));
        this.granularityService.pushTrainee(this.getTraineeById(Number(this.traineeSelect.value)));
        this.granularityService.pushWeek(this.getWeek());
      }
    }

    /**
     * Sorts the trainees list in ascending oreder.
     */
    sortTraineesByName() {
      this.traineesList.sort(function(a, b) {
        const nameA = a.name.toUpperCase();
        const nameB = b.name.toUpperCase();
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      });
    }

    /**
     * Return true to show last active year.
     * @param year
     */
    loadYears(year): boolean {
      if (year === this.yearList[2]) {
        return true;
      }
    }

    /**
     * Returns an array of all batches of selected year.
     * It is sorted in descending order.
     * @param year
     */
    getBatchesByYear(): Array<Batch> {
      const batches: Array<Batch> = [];
      if (this.batchList) { // make sure batchList is not empty
        for (const batch of this.batchList) {
          if (this.yearSelect) { // make sure yearSelect is not empty
            if (batch.startDate.toString().substring(0, 4) === this.yearSelect.value) {
              batches.push(batch);
            }
          }
        }
      }

      this.batchesBasedOnYearList = batches;
      return this.batchesBasedOnYearList;
    }
    /********************************
     * END other functions
     ********************************/

    ngOnDestroy() {
      this.batchSubscription.unsubscribe();
      this.trainerSubscription.unsubscribe();
    }
}

