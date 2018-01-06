import { Component, OnInit } from '@angular/core';
import { BatchService } from '../../services/batch.service';
import { GranularityService } from '../services/granularity.service';
import { TrainerService } from '../../services/trainer.service';
import { Subscription } from 'rxjs/Subscription';
import { Subscribable } from 'rxjs/Observable';
import { Batch } from '../../entities/Batch';
import { Trainee } from '../../entities/Trainee';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';

/**
 * Component describes drop down menu for the reports page which users
 * users with filtering options for the reports data and content.
 *
 * Default values and selections are passed to the Granularity service
 * to be distributed to individual components as needed.
 *
 * @author Mitch Goshorn
 */
@Component({
  selector: 'app-tools',
  templateUrl: './tools.component.html',
  styleUrls: ['./tools.component.css']
})
export class ToolsComponent implements OnInit, OnDestroy {

  // currently selected values
  private selectedYear: number;
  private selectedBatch: Batch;
  private selectedWeek: number;
  private selectedTrainee: Trainee;

  // default trainee object (representative of All)
  private defaultTrainee: Trainee = new Trainee();

  // Collections for holding/tracking data
  private batchList: Array<Batch>;
  private years: Array<number>;
  private weekList: Array<number>;
  private batches: Map<number, Array<Batch>>;

  // Subscriptions
  private batchSubscription: Subscription;
  private trainerSubscription: Subscription;


  /****************** Lifecycle ******************/

  constructor(private batchService: BatchService,
              private trainerService: TrainerService,
              private granularityService: GranularityService) { }


  ngOnInit() {
    // setup subscriptions
    this.batchSubscription = this.batchService.getList().subscribe((batches) => {

      if (batches.length > 0) {
        this.batchList = batches;
        this.setupYears(batches);

        this.setDefaults();

      }
    });
    // fetch data
    this.batchService.fetchAll();
  }

  ngOnDestroy() {
    this.batchSubscription.unsubscribe();
    this.trainerSubscription.unsubscribe();
  }


  /************* Setup Methods ******************/

  /** Sets up the years value  */
  private setupYears(batches: Array<Batch>) {
    const map: Map<number, Array<Batch>> = new Map();

    // process raw batches
    batches.forEach( b => {
      const year: number = new Date(b.startDate).getFullYear();

      // if we are not already tracking this year
      if (!map.has(year)) {
        map.set(year, Array.of(b));
      } else {
        map.get(year).push(b);
      }
    });

    // get sorted array of years from map keys
    this.years = Array.from(map.keys()).sort((a, b) => {
      if (a > b) { return -1; }
      if (a < b) { return  1; }
      return 0;
    });

    // sort inner array by batch start date
    map.forEach( arr => {
      arr.sort( (a, b) => this.batchSorter(a, b) );
    });

    this.batches = map;
  }



  /** Sets up the default state that one should expect on initial page load */
  public setDefaults(): void {
    this.defaultTrainee.traineeId = 0;

    this.selectedYear = this.years[0];
    this.selectedBatch = this.batches.get(this.selectedYear)[0];
    this.generateWeekArray();
    this.selectedWeek = 0;
    this.selectedTrainee = this.defaultTrainee;
  }

  /****************** State Mutation Methods *************/

  /**
   * Called when there has been a change to the year value selection.
   */
  public yearChanged() {
    this.selectedBatch = this.batches.get(this.selectedYear)[0];
    this.batchChanged();
  }

  /**
   * Called when there has been a change to the batch value selection.
   */
  public batchChanged() {
    this.generateWeekArray();
    this.selectedWeek = 0;
    this.selectedTrainee = this.defaultTrainee;

    this.granularityService.pushReady(false);
    this.granularityService.pushBatch(this.selectedBatch);
    this.weekChanged();
    this.traineeChanged();
    this.granularityService.pushReady(true);
  }

  /** Called when there has been a change to the week value selection */
  public weekChanged() {
    this.granularityService.pushWeek(this.selectedWeek);
  }

  /** Called when there has been a change to the trainee value selection */
  public traineeChanged() {
    this.granularityService.pushTrainee(this.selectedTrainee);
  }


  /*************** Helper Methods ****************/

  private generateWeekArray(): void {
    const arr: Array<number> = new Array;
    for (let i = 1; i < this.selectedBatch.weeks; i++) {
      arr.push(i);
    }
    this.weekList = arr;
  }

  private batchSorter(a: Batch, b: Batch): number {
    const dateA = new Date(a.startDate);
    const dateB = new Date(b.startDate);
    if (dateA.valueOf() < dateB.valueOf()) { return  1; }
    if (dateA.valueOf() > dateB.valueOf()) { return -1; }
    return 0;
  }
}
