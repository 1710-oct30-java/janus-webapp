import { Component, OnInit } from '@angular/core';
import { BatchService } from '../../services/batch.service';
import { GranularityService } from '../services/granularity.service';
import { TrainerService } from '../../services/trainer.service';
import { Subscription } from 'rxjs/Subscription';
import { Subscribable } from 'rxjs/Observable';
import { Batch } from '../../entities/Batch';
import { Trainee } from '../../entities/Trainee';

@Component({
  selector: 'app-tools',
  templateUrl: './tools.component.html',
  styleUrls: ['./tools.component.css']
})
export class ToolsComponent implements OnInit {

  private selectedYear: number;
  private selectedBatch: Batch;
  private selectedWeek: number;
  private selectedTrainee: Trainee;

  private defaultTrainee: Trainee = new Trainee();

  private batchList: Array<Batch>;
  private years: Array<number>;
  private weekList: Array<number>;
  private batches: Map<number, Array<Batch>>;

  private batchSubscription: Subscription;
  private trainerSubscription: Subscription;

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

  private batchSorter(a: Batch, b: Batch): number {
    const dateA = new Date(a.startDate);
    const dateB = new Date(b.startDate);
    if (dateA.valueOf() < dateB.valueOf()) { return  1; }
    if (dateA.valueOf() > dateB.valueOf()) { return -1; }
    return 0;
  }

  public setDefaults(): void {
    console.log('setting defaults');
    this.defaultTrainee.traineeId = 0;

    this.selectedYear = this.years[0];
    this.selectedBatch = this.batches.get(this.selectedYear)[0];
    this.generateWeekArray();
    this.selectedWeek = 0;
    this.selectedTrainee = this.defaultTrainee;
  }

  public yearChanged() {
    console.log('year been changed yo');
    this.selectedBatch = this.batches.get(this.selectedYear)[0];
    this.batchChanged();
  }

  public batchChanged() {
    console.log('batch changed yo');
    this.generateWeekArray();
    this.selectedWeek = 0;
    this.selectedTrainee = this.defaultTrainee;

    this.granularityService.pushReady(false);
    this.granularityService.pushBatch(this.selectedBatch);
    this.weekChanged();
    this.traineeChanged();
    this.granularityService.pushReady(true);
  }

  public weekChanged() {
    this.granularityService.pushWeek(this.selectedWeek);
  }

  public traineeChanged() {
    this.granularityService.pushTrainee(this.selectedTrainee);
  }

  private generateWeekArray(): void {
    const arr: Array<number> = new Array;
    for (let i = 1; i < this.selectedBatch.weeks; i++) {
      arr.push(i);
    }
    this.weekList = arr;
  }
}
