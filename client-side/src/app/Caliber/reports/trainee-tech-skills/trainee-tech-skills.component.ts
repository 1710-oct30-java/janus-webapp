import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { ReportingService } from '../../../services/reporting.service';

@Component({
  selector: 'app-trainee-tech-skills',
  templateUrl: './trainee-tech-skills.component.html',
  styleUrls: ['./trainee-tech-skills.component.css']
})
export class TraineeTechSkillsComponent implements OnInit {


  private batchOverallSubscription: Subscription;
  private traineeOverallRadar: Subscription;


  constructor(private reportsService: ReportingService) { }



  // Chart labels - for other charts the labels would have to be dynamic
  public dataSetLabels: string[] = ['batch', 'trainee'];

  // Dataset for chart
  public chartData: any[];
  
  // Chart type assignment
  public chartType = 'radar';

  ngOnInit() {

    // this.chartData = [0];
    this.batchOverallSubscription = this.reportsService.batchOverallRadar$.subscribe((result) => {

      if (!result) {
        console.log('data not received');
        this.chartData = null;
        // this.reportsService.fetchTraineeOverallRadarChart(5536);
        this.reportsService.fetchBatchOverallRadarChart(2201);
      } else {
        console.log('data received');
        console.log(result);
        if (this.chartData === null) {
          this.chartData = [result.data];
        } else {
          this.chartData = [result.data, this.chartData[0]];
        }
      }
    });
    this.batchOverallSubscription = this.reportsService.traineeOverallRadar$.subscribe((result) => {

      if (!result) {
        console.log('data not received');
        this.chartData = null;
        this.reportsService.fetchTraineeOverallRadarChart(5536);
        // this.reportsService.fetchBatchOverallRadarChart(2201);
      } else {
        console.log('data received');
        console.log(result);
        if (this.chartData === null) {
          this.chartData = [result.data];
        } else {
          this.chartData = [this.chartData[0], result.data];
        }
      }
    });
  }
}
