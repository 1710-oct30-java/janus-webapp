import { Component, OnInit } from '@angular/core';

// npm i jspdf --save
// npm install --save @types/jquery
import * as jsPDF from 'jspdf';

import { ReportingService } from '../../services/reporting.service';
import { environment } from '../../../environments/environment';
import { Http } from '@angular/http';
import { PDFService } from '../../services/pdf.service';

/**
 * This component display the weekly line chart. It also has a download
 * button that allows to save the graph as a PDF.
 * @author Edel Benavides
 */

@Component({
  selector: 'app-weekly-line-chart',
  templateUrl: './weekly-line-chart.component.html',
  styleUrls: ['./weekly-line-chart.component.css']
})
export class WeeklyLineChartComponent implements OnInit {

  public barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public barChartLabels: string[] = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  public barChartType = 'bar';
  public barChartLegend = true;
  public data;

  public barChartData: any[] = [
    {data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A'},
    {data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B'}
  ];

  constructor(private reportingService: ReportingService, private pdfService: PDFService, private http: Http) { }

  ngOnInit() {
    // this.http.get()
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
   * http://jsfiddle.net/xzZ7n/4861/
   */
  public downloadPDF(): void {
    this.pdfService.downloadPDF('chart');
  }

}
