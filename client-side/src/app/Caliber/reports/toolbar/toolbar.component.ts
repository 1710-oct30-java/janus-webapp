/**
 * This toolbar is responsible for updating the charts information
 * and pushing data to the granularity service.
 *
 * @author Edel Benavides
 * @author Brandon Richardson
 */
import { Component, OnInit, ViewChild, } from '@angular/core';

import { BatchService } from '../../../Caliber/services/batch.service';
import { Batch } from '../../entities/Batch';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { TrainerService } from '../../services/trainer.service';
import { GranularityService } from '../services/granularity.service';
import { Trainee } from '../../entities/Trainee';
import { PDFService } from '../../../services/pdf.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  // Toolbar selections
  public yearSelect: number;
  public batchSelect: number;
  public weekSelect: number;
  public traineeSelect: number;

  // Current batch and trainee Object based on selection
  currentBatch: Batch = new Batch();
  currentTrainee: Trainee;

  // Arrays
  public yearList: Array<number>;              // Contains list of all years from batches
  public batchList: Array<Batch>;              // Contains list of all batches
  public batchYearList: Array<Batch>;          // Contains list of all batches based on year selection
  public weekList: Array<number>;              // Contains list of all weeks based on batch selection
  public traineesList: Array<Trainee>;         // Contains list of all trainees based on batch selection
  public traineesListNames: Array<String>;     // Contains list of all trainees names based on batch selection

  // Subscriptions
  private batchSubscription: Subscription;
  private trainerSubscription: Subscription;

  constructor(private batchService: BatchService,
              private granularityService: GranularityService,
              private pdfService: PDFService) {
  }

  ngOnInit() {
    this.batchService.fetchAll();

    this.batchSubscription = this.batchService.getList().subscribe(response => {

      if (response.length > 0) {
        this.batchList = response;

        // Generate dropdown information for years
        this.createYearDropdown();

        // Set granularity to not ready
        this.granularityService.pushReady(false);

        // Generate dropdown information for batches and set initial values
        this.createBatchDropdown();
        this.batchSelect = this.batchYearList[0].batchId;
        this.currentBatch = this.getBatchByIdFromSelection(this.batchSelect);

        // Generate dropdown information for weeks and set initial values
        this.createWeeksDropdown();
        this.weekSelect = this.weekList[0];

        // Generate dropdown information for trainees and set initial values
        this.createTraineesDropdown();
        this.traineeSelect = 0;
        this.currentTrainee = this.createEmptyTrainee();

        // Push to granularity service.
        this.pushToGranularityService();
        this.granularityService.pushReady(true);
      }

    });
  }

  /**
   * Set the current selected values.
   * Access the toolbar HTML elements and assigns the current value.
   */
  setSelectionValues(): void {
    this.yearSelect = Number((<HTMLInputElement>document.getElementById('year')).value);
    this.batchSelect = Number((<HTMLInputElement>document.getElementById('batch')).value);
    this.weekSelect = Number((<HTMLInputElement>document.getElementById('week')).value);
    this.traineeSelect = Number((<HTMLInputElement>document.getElementById('trainee')).value);
  }

  /**
   * Clears the input search box.
   */
  clearSearchBox() {
    (<HTMLInputElement>document.getElementById('searchTextBox')).value = '';
  }

  /************************************
   * Generate dropdown information
   ************************************/
  /**
   * Creates and returns an array of all the batch years without duplicates.
   */
  createYearDropdown(): Array<number> {
    // create Set
    const yearSet = new Set<number>();

    // Add all batch years to Set. It will not allow duplicates
    for (const date of this.batchList) {
      yearSet.add(Number(date.startDate.toString().substring(0, 4)));
    }

    // Converts Set to an Array
    this.yearList = Array.from(yearSet);

    // Sort the array
    this.yearList.sort(function(a: number, b: number) {
      return b - a;
    });
    this.yearSelect = this.yearList[0];
    return this.yearList;
  }

  /**
   * Creates and returns an array of all batches based on year selection.
   */
  createBatchDropdown(): Array<Batch> {
    this.batchYearList = [];

    for (const batch of this.batchList) {
      const year = Number(batch.startDate.toString().substring(0, 4));
      if (year === this.yearSelect) {
        this.batchYearList.push(batch);
      }
    }

    return this.batchYearList;
  }

  /**
   * Creates and returns an array of all weeks based on batch selection.
   */
  createWeeksDropdown(): Array<number> {
    this.weekList = [];

    for (let i = 0; i <= this.currentBatch.weeks; i++) {
      this.weekList.push(i);
    }

    this.weekSelect = this.weekList[0];
    return this.weekList;
  }

  /**
   * Creates and returns an array of all trainees based on batchselection.
   */
  createTraineesDropdown(): Array<Trainee> {
    this.traineesList = [];
    this.traineesListNames = [];

    for (const trainee of this.currentBatch.trainees) {
      this.traineesList.push(trainee);
      this.traineesListNames.push(trainee.name);
    }

    this.traineeSelect = 0;
    this.sortTraineesByName();
    return this.traineesList;
  }

  /************************************
   * Events
   ************************************/
  /**
   * Click event to generate batch dropdown.
   * @param year - New year number from selection.
   */
  yearOnClick(year): void {
    this.granularityService.pushReady(false);
    this.yearSelect = year;
    this.createBatchDropdown();
    this.batchSelect = this.batchYearList[0].batchId;
    this.currentBatch = this.getBatchByIdFromSelection(this.batchSelect);
    this.createWeeksDropdown();
    this.createTraineesDropdown();
    this.currentTrainee = this.createEmptyTrainee();
    this.pushToGranularityService();
    this.granularityService.pushReady(true);
    this.clearSearchBox();
  }

  /**
   * Click event to generate weeks and trainees dropdown.
   * @param batchId - New batch ID from selection.
   */
  batchOnClick(batchId): void {
    this.granularityService.pushReady(false);
    this.batchSelect = batchId;
    this.currentBatch = this.getBatchByIdFromSelection(batchId);
    this.createWeeksDropdown();
    this.createTraineesDropdown();
    this.currentTrainee = this.createEmptyTrainee();
    this.pushToGranularityService();
    this.granularityService.pushReady(true);
    this.clearSearchBox();
  }

  /**
   * Click event to update current week selection.
   * @param week - New week number from selection.
   */
  weekOnClick(week): void {
    this.weekSelect = week;
    this.granularityService.pushWeek(this.weekSelect);
  }

  /**
   * Click event to update current trainee selection.
   * @param traineeId - New trainee ID from selection.
   */
  traineeOnClick(traineeId) {
    this.traineeSelect = traineeId;

    // Set current Trainee based on selection.
    if (traineeId === 0) {
      // Creates empty trainee with ID of 0 if no trainee exists
      this.currentTrainee = this.createEmptyTrainee();
      this.clearSearchBox();
    } else {
      // Set current Trainee if trainee ID exists
      this.currentTrainee = this.getTraineeByIdFromSelection(traineeId);
      this.clearSearchBox();
    }
    this.granularityService.pushTrainee(this.currentTrainee);
  }

  /**
   * Searches trainees list. If found, performs the traineeOnClick(traineeId) method.
   */
  searchTrainees() {
    const input = (<HTMLInputElement>document.getElementById('searchTextBox')).value;
    for (const trainee of this.traineesList) {
      if (trainee.name === input) {
        this.traineeOnClick(trainee.traineeId);
        (<HTMLInputElement>document.getElementById('searchTextBox')).value = input;
      }
    }
  }

  /************************************
   * Other functions
   ************************************/
  /**
   * Returns Batch object from ID based on batch selection.
   * @param batchId - Batch ID to search for.
   */
  getBatchByIdFromSelection(batchId: number): Batch {
    for (const batch of this.batchYearList) {
      if (batchId === batch.batchId) {
        return batch;
      }
    }
  }

  /**
   * Returns Trainee object from ID based on trainee selection.
   * @param traineeId - Trainee ID to search for.
   */
  getTraineeByIdFromSelection(traineeId: number): Trainee {
    for (const trainee of this.traineesList) {
      if (traineeId === trainee.traineeId) {
        return trainee;
      }
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
   * Pushes current batch, week, and trainee to granularity service.
   */
  pushToGranularityService() {
    this.granularityService.pushBatch(this.currentBatch);
    this.granularityService.pushWeek(this.weekSelect);
    this.granularityService.pushTrainee(this.currentTrainee);
  }

  /**
   * Creates and returns an empty Trainee object with ID of 0.
   */
  createEmptyTrainee(): Trainee {
    const emptyTrainee = new Trainee();
    emptyTrainee.traineeId = 0;
    return emptyTrainee;
  }

  /************************************
   * PDF Service
   ************************************/
  downloadCharts() {
    this.pdfService.downloadCharts();
  }

  downloadPDFwithFeedback() {
    this.pdfService.downloadPDFwithFeedback();
  }
}
