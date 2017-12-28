import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { ReportingService } from '../../../services/reporting.service';

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
  public labels: Array<String> = null;
  private dataSubscription: Subscription;
  public lineChartLegend = false;
  public lineChartType = 'line';

  public lineChartColors: Array<any>= [
    {
      backgroundColor: 'rgba(0,0,0,0)',
      borderColor: 'rgba(76, 111, 163, 1)',
      pointBackgroundColor: 'rgba(76, 111, 163, 1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(76, 111, 163, 1)'
    },
    {
      backgroundColor: 'rgba(0,0,0,0)',
      borderColor: 'rgba(190, 71, 71, 1)',
      pointBackgroundColor: 'rgba(190, 71, 71, 1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(190, 71, 71, 1)'
    },
    {
      backgroundColor: 'rgba(0,0,0,0)',
      borderColor: 'rgba(164, 180, 20, 1)',
      pointBackgroundColor: 'rgba(164, 180, 20, 1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(164, 180, 20, 1)'
    }
  ];

  constructor(private reportsService: ReportingService) {}

  ngOnInit() {
    this.dataSubscription = this.reportsService.batchOverallLineChart$.subscribe((result) => {
      if (result) {
        const newData = [];
        const newLabels = [];

        for (const key in result.data) {
          if (result.data.hasOwnProperty(key)) {
              newData.push(result.data[key]);
              newLabels.push(key);
          }
        }

        this.labels = newLabels;
        this.data = [{data: newData, label: 'label'}];
        console.log('Line chart data received');
        console.log(this.data);
        console.log(this.labels);
      } else {
        console.log('line chart data failed to load');
      }
    });
    this.reportsService.fetchBatchOverallLineChart(2200);
  }
}
