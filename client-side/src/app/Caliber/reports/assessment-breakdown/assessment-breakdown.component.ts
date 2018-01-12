import { Component, OnInit, OnDestroy } from '@angular/core';
import { ReportingService } from '../../../services/reporting.service';
import { GradeService } from '../../services/grade.service';
import { Subscription } from 'rxjs/Subscription';
import { GranularityService } from '../services/granularity.service';
import { Subscriber } from 'rxjs/Subscriber';
import { Observable } from 'rxjs/Observable';

/**
 * Component will display a bar graph comparing the specific trainees
 * assessment for the specified week or overall if all weeks selected
 * compared to the batch average
 *
 * @author Mitch Goshorn
 */
@Component({
  selector: 'app-assessment-breakdown',
  templateUrl: './assessment-breakdown.component.html',
  styleUrls: ['./assessment-breakdown.component.css']
})
export class AssessmentBreakdownComponent implements OnInit, OnDestroy {

  // Data needed for API calls
  private batchId: Number;
  private week: Number;
  private traineeId: Number;

  private viewReady = false;

  // Subscriptions for granularity and API
  private granularitySub: Subscription;
  private dataSubscription: Subscription;

  // Data to be injected into chart
  public data: Array<any>;
  public labels: Array<string>;

  // Chart options
  private chartType = 'bar';
  private barChartLegend = true;

  public options = {
    scales: {
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Average'
        },
        ticks: {
          beginAtZero: false,
          fixedStepSize: 10,
          max: 100,
          suggestedMin: 40
        }
      }]
    }
  };

  // Define colors used by chart
  public chartColors: Array<any> = [
    { // Trainee - Complimentary
      backgroundColor: 'rgb(37,242,227)',
    },
    { // Revature Orange
      backgroundColor: 'rgb(242, 105, 37)',
  }];

  /*============ Lifecycle Methods ==============*/

  constructor(private reportsService: ReportingService, private granularityService: GranularityService) { }

  /**
   * Initialize state of component
   */
  ngOnInit() {

    // setup API data subscription
    this.dataSubscription = this.reportsService.assessmentBreakdownBarChart$.subscribe(
      (result) => {
        if (result) {

          // Call appropriate data manipulation method for given state
          if (this.traineeId === 0) {
            this.setupBatch(result);
          } else {
            this.setupTrainee(result);
          }
          this.viewReady = true;
        }
      });

      // Setup granularity subscription
      this.granularitySub = Observable.combineLatest(
        this.granularityService.currentBatch$,
        this.granularityService.currentWeek$,
        this.granularityService.currentTrainee$
      ).subscribe( (res) => {
        this.batchId = res[0].batchId;
        this.week = res[1];
        this.traineeId = res[2].traineeId;
        this.tryFetch();
      });

  }

  /**
   * Destroys subscriptions when component is destroyed
   */
  ngOnDestroy() {
    // Unsubscribe from subscriptions
    if (this.granularitySub)    { this.granularitySub.unsubscribe(); }
    if (this.dataSubscription)  { this.dataSubscription.unsubscribe(); }
  }


  /*============ Helper Methods ==============*/


  /**
   * Mutates data form and prepares structure for graph when
   * only batch data is being displayed
   */
  public setupBatch(data) {
    const incomingBatchData: any = { data: [], label: 'Batch' };
    const incomingLabels: any = [];

    for (const key in data.data) {
      if (data.data.hasOwnProperty(key)) {
          // else only batch data
          incomingBatchData.data.push(data.data[key][0].toFixed(2));
          // Fixing decimal length for charts
          incomingLabels.push(key);
      }
    }
    // Assign data to data object for display
    this.labels = incomingLabels;
    this.data = [incomingBatchData];
  }

  /**
   * Mutates data form and prepares structure for graph when a trainee
   * is selected to compare the batch data with.
   * @param data - Incoming data from API call
   */
  public setupTrainee(data) {

    const incomingTraineeData: any = { data: [], label: 'Trainee' };
    const incomingBatchData: any = { data: [], label: 'Batch' };
    const incomingLabels: any = [];

    for (const key in data.data) {
      if (data.data.hasOwnProperty(key)) {
          incomingTraineeData.data.push(data.data[key][0].toFixed(2));
          incomingBatchData.data.push(data.data[key][1].toFixed(2));
          incomingLabels.push(key);
      }
    }

    // Assign data to data object for display
    this.labels = incomingLabels;
    this.data = [incomingTraineeData, incomingBatchData];
  }

  /**
   * Logic gate for API calls.
   * Defines if state is ready for an API call and calls the appropriate call based on the valid state.
   */
  tryFetch() {
    // Check that all objects are present
    if (this.batchId && this.week !== undefined && this.traineeId !== undefined) {
      if (this.week === 0) {
        // If week is 0, fetch data for all weeks
        this.reportsService.fetchBatchOverallTraineeBarChart(this.batchId, this.traineeId);
      } else if (this.traineeId === 0) {
        this.reportsService.fetchBatchWeekAvgBarChart(this.batchId, this.week);
      } else {
        // Else fetch data for the specific week
        this.reportsService.fetchBatchWeekTraineeBarChart(this.batchId, this.week, this.traineeId);
      }
      this.viewReady = false;
    }
  }
}
