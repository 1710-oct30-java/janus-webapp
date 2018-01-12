import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { ReportingService } from '../../../services/reporting.service';
import { GranularityService } from '../services/granularity.service';
import { Observable } from 'rxjs/Observable';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';

/**
 * @author Robert Choboy
 */
@Component({
  selector: 'app-trainee-line-chart',
  templateUrl: './trainee-line-chart.component.html',
  styleUrls: ['./trainee-line-chart.component.css']
})
export class TraineeLineChartComponent implements OnInit, OnDestroy {

  public data: any = null;
  public dataShown = null;
  private batchId: Number;
  private week: number;

  private dataSubscription: Subscription;
  private granularitySubscription: Subscription;

  public traineeId: Subscription;


  public labels: Array<String> = null;
  public labelsShown: Array<String> = null;

  public lineChartLegend = false;
  public lineChartType = 'line';

  public options = {
    scales: {
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Average'
        },
        ticks: {
          beginAtZero: false,
          fixedStepSize: 20,
          max: 100,
          suggestedMin: 40
        }
      }]
    }
  };

  public lineChartColors: Array<any>= [
    {
      backgroundColor: 'rgba(0,0,0,0)',
      borderColor: 'rgba(76, 111, 163, 1)',
      pointBackgroundColor: 'rgba(76, 111, 163, 1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: 'rgba(76, 111, 163, 1)',
      pointHoverBorderColor: 'rgba(76, 111, 163, 1)'
    },
    {
      backgroundColor: 'rgba(0,0,0,0)',
      borderColor: 'rgba(190, 71, 71, 1)',
      pointBackgroundColor: 'rgba(190, 71, 71, 1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: 'rgba(190, 71, 71, 1)',
      pointHoverBorderColor: 'rgba(190, 71, 71, 1)'
    },
    {
      backgroundColor: 'rgba(0,0,0,0)',
      borderColor: 'rgba(164, 180, 20, 1)',
      pointBackgroundColor: 'rgba(164, 180, 20, 1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: 'rgba(164, 180, 20, 1)',
      pointHoverBorderColor: 'rgba(164, 180, 20, 1)'
    }
  ];

  constructor(private reportsService: ReportingService, private granularityService: GranularityService) {}

  ngOnInit() {
    this.granularitySubscription = Observable.combineLatest(
      this.granularityService.currentBatch$, this.granularityService.currentTrainee$,
      this.granularityService.currentWeek$).subscribe((batchdata) => {
        const batch = batchdata[0];
        const trainee = batchdata[1];
        const week = batchdata[2];
        this.batchId = batch.batchId;

        this.week = week;
        this.labels = [batch.trainingName];

        if (trainee.traineeId === 0 ) { return; }
        this.reportsService.fetchTraineeOverallLineChart(batch.batchId, trainee.traineeId);
      }
    );

    this.dataSubscription = this.reportsService.lineTraineeOverall$.subscribe(
      (data) => {
        const newBatchData = [];
        const newTraineeData = [];
        const newLabels = [];

        if (!data) {
          return;
        }
        for (const key in data.data) {
          if (data.data.hasOwnProperty(key)) {
            newBatchData.push(data.data[key][1].toFixed(2));
            newTraineeData.push(data.data[key][0].toFixed(2));
            newLabels.push(key);
          }
        }
        this.labels = newLabels;
        this.data = [{data: newTraineeData, label: 'trainee'},
                    {data: newBatchData, label: 'batch'}];
      });
  }

  // Fetches data when new data is pushed in
  private fetch() {
    this.reportsService.fetchBatchOverallLineChart(this.batchId);
  }

  /**
   * Method copies contents of stored user array and updates the arrays
   * used to display data such that the data includes all weeks up to the
   * selected week or all weeks if all are selected
   */
  private updateWeeks() {
    // return if there is no stored data yet
    if (this.data === null) { return; }

    // if all weeks is not selected
    if (this.week !== 0) {
      // Copy arrays
      const newData = this.data[0].data.slice();
      const newLabels = this.labels.slice();

      // Splice arrays by current week
      newData.splice(this.week);
      newLabels.splice(this.week);

      // Assign new arrays to data used for display
      this.dataShown = [{data: newData, label: this.data[0].label }];
      this.labelsShown = newLabels;

    } else {
      // When all weeks are selected, just use the full dataset
      this.dataShown = this.data;
      this.labelsShown = this.labels;
    }
  }

  ngOnDestroy() {
    // Unsubscribe from subscriptions
    if (this.granularitySubscription) { this.granularitySubscription.unsubscribe(); }
    if (this.dataSubscription) { this.dataSubscription.unsubscribe(); }
  }
}
