import { Component, OnInit } from '@angular/core';
import * as jsPDF from 'jspdf';
import { environment } from '../../../../environments/environment';
import { Http } from '@angular/http';
import { PDFService } from '../../../services/pdf.service';
import { ReportingService } from '../../../services/reporting.service';

/**
 * This component displays the QC statuses of a given batch as a doughnut chart.
 * @author Chris Worcester
*/

@Component({
  selector: 'app-qc-doughnut',
  templateUrl: './qc-doughnut.component.html',
  styleUrls: ['./qc-doughnut.component.css']
})
export class QcDoughnutComponent implements OnInit {

  constructor() { }

  public doughnutChartLabels: string[] = ['Superstar', 'Good', 'Average', 'Poor'];
  public doughnutChartData: number[] = [1, 11, 6, 2];
  public doughnutChartType = 'doughnut';

  ngOnInit() {
  }

  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }

}

