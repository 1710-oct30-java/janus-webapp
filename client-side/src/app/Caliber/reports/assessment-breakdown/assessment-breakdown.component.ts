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

  private batchId: Number;
  private week: Number;
  private traineeId: Number;

  private granularitySub: Subscription;
  private dataSubscription: Subscription;

  public data: Array<any>;
  public labels: Array<string>;

  private chartType = 'bar';
  private barChartLegend = true;

  constructor(private reportsService: ReportingService, private granularityService: GranularityService) { }

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

  public chartColors: Array<any> = [
    { // Trainee - Complimentary
      backgroundColor: 'rgb(37,242,227)',
    },
    { // Revature Orange
      backgroundColor: 'rgb(242, 105, 37)',
    }];

  ngOnInit() {

    this.dataSubscription = this.reportsService.assessmentBreakdownBarChart$.subscribe(
      (result) => {
        if (result) {

          const incomingTraineeData: any = { data: [], label: 'Trainee' };
          const incomingBatchData: any = { data: [], label: 'Batch' };
          const incomingLabels: any = [];

          // Format data as chart expects it
          for (const key in result.data) {
            if (result.data.hasOwnProperty(key)) {

                // If both batch and trainee data
                if (this.traineeId !== 0) {
                  incomingTraineeData.data.push(result.data[key][0].toFixed(2));
                  incomingBatchData.data.push(result.data[key][1].toFixed(2));
                } else {
                  // else only batch data
                  incomingBatchData.data.push(result.data[key][0].toFixed(2));
                }
                // Fixing decimal length for charts
                incomingLabels.push(key);
            }
          }
          // Assign data to data object for display
          this.labels = incomingLabels;
          this.data = undefined;
          this.data = [incomingTraineeData, incomingBatchData];
          /* else {
            this.data = undefined;
            this.data = [incomingBatchData];
          }*/
        }
      });

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

  tryFetch() {
    // Check that all objects are present
    if (this.batchId && this.week !== undefined && this.traineeId) {
      if (this.week === 0) {
        // If week is 0, fetch data for all weeks
        this.data = null;
        this.reportsService.fetchBatchOverallTraineeBarChart(this.batchId, this.traineeId);
      } else if (this.traineeId === 0) {
        this.reportsService.fetchBatchWeekAvgBarChart(this.batchId, this.week);
      } else {
        // Else fetch data for the specific week
        this.data = null;
        this.reportsService.fetchBatchWeekTraineeBarChart(this.batchId, this.week, this.traineeId);
      }
    }
  }

  ngOnDestroy() {
    // Unsubscribe from subscriptions
    if (this.granularitySub)    { this.granularitySub.unsubscribe(); }
    if (this.dataSubscription)  { this.dataSubscription.unsubscribe(); }
  }

}
