import { Component, OnInit } from '@angular/core';
import { ReportingService } from '../../../services/reporting.service';
import { PDFService } from '../../../services/pdf.service';
import { Subscription } from 'rxjs/Subscription';
import { GranularityService } from '../services/granularity.service';

/**
 * This component displays the batch overall chart shows as the 'Cumulative Scores'.
 * It displays the chart as a bar chart. It also has a download button that allows
 * to save the graph as a PDF.
 * @author Edel Benavides
 */

@Component({
  selector: 'app-weekly-line-chart',
  templateUrl: './weekly-line-chart.component.html',
  styleUrls: ['./weekly-line-chart.component.css']
})
export class WeeklyLineChartComponent implements OnInit {

  public batchId = 0;
  public traineeId = -1;
  public chartData: any = [];
  public scoresAverage = 0;

  // batch[i][0] = trainee name
  // batch[i][1] = trainee overall score
  public batch: Array<any> = [];

  private dataSubscription: Subscription;

  constructor(private reportsService: ReportingService,
              private pdfService: PDFService,
              private granularityService: GranularityService) { }

  // Chart labels - for other charts the labels would have to be dynamic
  public dataSetLabels: string[] = ['Batch Scores', 'Benchmark'];

  // Dataset for chart
  // Chart type assignment
  public chartType = 'bar';

  ngOnInit() {
    this.createBatchArray();
  }

  /**
   * Fills the batch array with data. Called every time to populate chart information.
   * @param input - Data for the batch array.
   */
  createBatchArray() {
    this.dataSubscription = this.reportsService.batchOverallBar$.subscribe((result) => {
      if (!result) {
        // console.log('data not received');
        this.chartData = null;
        this.granularityService.currentBatch$.subscribe(response => {
          if (response) {
            this.reportsService.fetchBatchOverallBarChart(response.batchId);
          }
        });
      } else {
        // console.log('data received');

        // Empty the current batch
        this.batch = [];

        // Adds batch information (trainee and overallScore) to the batch array
        for (const trainee of Object.entries(result.data)) {
          this.batch.push(trainee);
        }

        // First sort array by highest scores, then create chart with sorted array
        const sortedBatchArray = this.sortByHighestScore(result.data);
        const newbatch = {};

        for (let i = 0; i < sortedBatchArray.length; i++) {
          newbatch[sortedBatchArray[i][0]] = sortedBatchArray[i][1];
        }
        this.createChartData(newbatch);
      }
    });

    this.granularityService.currentTrainee$.subscribe(response => {
      if (response) {
        this.traineeId = response.traineeId;
      }
    });
  }

    /**
   * Creates chart with Benchmark and Batch Scores.
   * @param data
   */
  public createChartData(data): void {
    this.chartData =
    [
     {
        benchmark: this.calculateScoreAverage()
     },
       data
    ];
  }

  /**
   * Calculates returns the average score of based on all trainees.
   * @returns - average score of all trainees
   */
  private calculateScoreAverage(): number {
    let result = 0;

    for (const score of this.batch) {
      result += score[1];
    }

    result = result / this.batch.length;

    return result;
  }

  /**
   * Sorts the batch array by highest scores and
   * returns the new ordered batch array.
   * Based on Mozilla example of Array.prototype.sort()
   * @param array
   */
  sortByHighestScore(array) {
    return this.batch.sort(function (a, b) {
      return b[1] - a[1];
    });
  }

  // events
  public chartClicked(e: any): void {
    // console.log(e);
  }

  public chartHovered(e: any): void {
    // console.log(e);
  }

  /**
   * Downloads weekly chart as a PDF file.
   */
  public downloadPDF(): void {
    this.pdfService.downloadPDF('chart');
  }

}
