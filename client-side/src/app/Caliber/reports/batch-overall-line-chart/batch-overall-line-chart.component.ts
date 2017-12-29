import { Component, OnInit } from '@angular/core';
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
export class BatchOverallLineChartComponent implements OnInit {

  public data: any = null;
  private dataSubscription: Subscription;
  private batchId: Number;
  private granularitySubscription: Subscription;

  public labels: Array<String> = null;
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

        for (const key in result.data) {
          if (result.data.hasOwnProperty(key)) {

              // Fixing decimal length for charts
              newData.push(result.data[key].toFixed(2));
              newLabels.push(key);
          }
        }

        this.labels = newLabels;
        this.data = [{data: newData, label: 'label'}];
      } else {
        console.log('line chart data failed to load');
      }
    });

    this.granularitySubscription = this.granularityService.currentBatch$.subscribe(
      (result) => {
        if (result.batchId !== this.batchId) {
          this.batchId = result.batchId;
          this.fetch();
        }
      });
  }

  private fetch() {
    this.reportsService.fetchBatchOverallLineChart(this.batchId);
  }
}
