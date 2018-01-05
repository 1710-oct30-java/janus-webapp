import { Component, OnInit } from '@angular/core';
import * as jsPDF from 'jspdf';
import { environment } from '../../../../environments/environment';
import { Http } from '@angular/http';
import { PDFService } from '../../../services/pdf.service';
import { ReportingService } from '../../../services/reporting.service';
import { Subscription } from 'rxjs/Subscription';
import { GranularityService } from '../services/granularity.service';

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
  public dataSetLabels: string[] = ['batch'];
  public chartData: number[];
  public chartType = 'doughnut';
  private dataSubscription: Subscription;
  private batchSubscription: Subscription;
  constructor(private reportsService: ReportingService, private pdfService: PDFService,
    private granularityService: GranularityService) { }

  ngOnInit() {

    this.batchSubscription = this.granularityService.currentBatch$.subscribe((batch) => {
      this.batchId = batch.batchId;
      this.reportsService.fetchQcStatusDoughnutChart(batch.batchId);

    });

    this.dataSubscription = this.reportsService.qcStatusDoughnut$.subscribe((result) => {
      console.log('debug');
      if (result) {
        console.log(result.data);
        this.chartData = [result.data];
      }
    });
  }

  /**
   * Sets current batch ID and returns it.
   * Access current batch from granularity to retrieve batch ID.
   */
  getBatchId(): number {
    this.granularityService.currentBatch$.subscribe(response => {
      if (response) {
        this.batchId = response.batchId;
      }
    });
    return this.batchId;
  }

  /**
   * Downloads weekly chart as a PDF file.
   */
  public downloadPDF(): void {
    this.pdfService.downloadPDF('chart');
  }
}
