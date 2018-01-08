import { Component, OnInit } from '@angular/core';
import * as jsPDF from 'jspdf';
import { environment } from '../../../../environments/environment';
// import { Http } from '@angular/http';
import { PDFService } from '../../../services/pdf.service';
import { ReportingService } from '../../../services/reporting.service';
import { Subscription } from 'rxjs/Subscription';
import { GranularityService } from '../services/granularity.service';
import { Observable } from 'rxjs/Observable';

/**
 * Displays the QC statuses of a given batch as a doughnut chart.
*/

@Component({
  selector: 'app-qc-doughnut',
  templateUrl: './qc-doughnut.component.html',
  styleUrls: ['./qc-doughnut.component.css']
})
export class QcDoughnutComponent implements OnInit {

  public batchId = 0;
  public week = 1;
  public dataSetLabels: string[] = ['batch'];
  public chartData: number[];
  public chartType = 'doughnut';
  private dataSubscription: Subscription;
  private batchSubscription: Subscription;
  constructor(private reportsService: ReportingService, private pdfService: PDFService,
    private granularityService: GranularityService) { }

  ngOnInit() {

    this.batchSubscription = Observable.combineLatest(
      this.granularityService.currentBatch$, this.granularityService.currentWeek$).subscribe((batchWeek) => {
      const batch = batchWeek[0];
      const week = batchWeek[1];
      this.batchId = batch.batchId;
      this.week = week;
      this.dataSetLabels = [batch.trainingName];
      if (week === 0) {
        this.reportsService.fetchQcStatusDoughnutChart(batch.batchId);
      } else {
        this.reportsService.fetchBatchWeekPieChart(batch.batchId, week);
      }
    });

    this.dataSubscription = this.reportsService.qcStatusDoughnut$.subscribe((result) => {
      if (result) {
        console.log(result.data);
        this.chartData = [result.data];
      }
    });
  }

  /**
   * Downloads weekly chart as a PDF file.
   */
  public downloadPDF(): void {
    this.pdfService.downloadPDF('chart');
  }
}
