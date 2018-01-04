import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { ReportingService } from '../../../services/reporting.service';
import { GranularityService } from '../services/granularity.service';

/**
 * Component utilizes service API calls to fetch and display an overall
 * batch line chart
 *
 * @author Mitch Goshorn
 */
@Component({
  selector: 'app-batch-overall-line-chart',
  templateUrl: './batch-overall-line-chart.component.html',
  styleUrls: ['./batch-overall-line-chart.component.css']
})
export class BatchOverallLineChartComponent implements OnInit, OnDestroy {

  public data: any = null;
  private dataSubscription: Subscription;
  public dataShown = null;
  private batchId: Number;
  private week: number;

  private batchSub: Subscription;
  private weekSub: Subscription;

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
    this.dataSubscription = this.reportsService.batchOverallLineChart$.subscribe((result) => {
      if (result) {
        const newData = [];
        const newLabels = [];

        // Format data for charts
        for (const key in result.data) {
          if (result.data.hasOwnProperty(key)) {

              // Fixing decimal length for charts
              newData.push(result.data[key].toFixed(2));
              newLabels.push(key);
          }
        }

        // Assign new data
        this.labels = newLabels;
        this.data = [{data: newData, label: 'label'}];

        // Update display data with new data accounting for week limitation
        this.updateWeeks();

      } else {
        console.log('line chart data failed to load');
      }
    });

    this.batchSub = this.granularityService.currentBatch$.subscribe(
      (result) => {
        // Make sure batchId is not undefined
        if (result) {
          if (result.batchId !== this.batchId) {
            this.batchId = result.batchId;
            this.fetch();
          }
        }
    });

    this.weekSub = this.granularityService.currentWeek$.subscribe(
      (result) => {
        if (result !== this.week) {
          this.week = result;
          this.updateWeeks();
        }
      }
    );
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
    this.batchSub.unsubscribe();
    this.weekSub.unsubscribe();
    this.dataSubscription.unsubscribe();
  }
}
