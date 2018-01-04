import { Component, OnInit, OnDestroy } from '@angular/core';
import { ReportingService } from '../../../services/reporting.service';
import { GradeService } from '../../services/grade.service';
import { Subscription } from 'rxjs/Subscription';
import { GranularityService } from '../services/granularity.service';

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

  private batchIdSub: Subscription;
  private weekSub: Subscription;
  private traineeIdSub: Subscription;

  public data: Array<any>;
  public labels: Array<string>;
  private dataSubscription: Subscription;

  private chartType = 'bar';
  private barChartLegend = true;

  constructor(private reportsService: ReportingService, private granularityService: GranularityService) { }

  public options = {
    scales: {
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Average'
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

                // Fixing decimal length for charts
                incomingTraineeData.data.push(result.data[key][0].toFixed(2));
                incomingBatchData.data.push(result.data[key][1].toFixed(2));
                incomingLabels.push(key);

                this.data = [incomingTraineeData, incomingBatchData];
                this.labels = incomingLabels;
            }
          }
        }
      });

      this.batchIdSub = this.granularityService.currentBatch$.subscribe(
          data => { this.batchId = data.batchId; this.tryFetch(); });

      this.weekSub = this.granularityService.currentWeek$.subscribe(
          data => { this.week = data; this.tryFetch(); });

      this.traineeIdSub = this.granularityService.currentTrainee$.subscribe(
          data => { this.traineeId = data.traineeId; this.tryFetch(); });
  }

  tryFetch() {
    // Check that all objects are present
    if (this.batchId && this.week !== null && this.traineeId !== undefined) {
      if (this.week === 0) {
        // If week is 0, fetch data for all weeks
        console.log('Fetching @ week === 0');
        this.reportsService.fetchBatchOverallTraineeBarChart(this.batchId, this.traineeId);
      } else if (this.traineeId > 0) {
        console.log('fetching @ traineeId > 0');
        // Else fetch data for the specific week
        this.reportsService.fetchBatchWeekTraineeBarChart(this.batchId, this.week, this.traineeId);
      } else {
        console.log('fetching @ else');
        this.reportsService.fetchBatchWeekAvgBarChart(this.batchId, this.week);
      }
    } else {
      console.log( this.batchId + ', ' + this.week + ', ' + this.traineeId);
    }
  }

  ngOnDestroy() {
    // Unsubscribe from subscriptions
    this.batchIdSub.unsubscribe();
    this.weekSub.unsubscribe();
    this.traineeIdSub.unsubscribe();
    this.dataSubscription.unsubscribe();
  }

}
