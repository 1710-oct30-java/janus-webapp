/**
 * This PDF service takes a screenshot of an element and creates a PDF of that image.
 * IMPORTANT: You will need to install and import: jspdf and html2canvas.
 *      npm i jspdf --save
 *      npm install --save html2canvas
 *
 * Example:
 *      HTML
 *      <div id="chartToDownload"> ... </div>
 *      <button (click)="downloadPDF()">Download as PDF</button>
 *
 *      TypeScript
 *      constructor(private pdfService: PDFService) { }
 *      this.pdfService.downloadPDF('chartToDownload');
 *
 * @author Edel Benavides
 */

import * as jsPDF from 'jspdf';
import * as html2canvas from 'html2canvas';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

// These are the pdf width and height in pixels
const pdfHeight = 787;
const pdfWidth = 531;

@Injectable()
export class PDFService {

  constructor(private http: HttpClient) { }

  /**
   * Creates a PDF from a given element id, then downloads it.
   * It creates an image of the elements and saves it as a PDF.
   * @param chartToDownload - Element id name.
   */
  public downloadPDF(chartToDownload): void {
    html2canvas(document.getElementById(chartToDownload)).then(canvas => {
        const pdf = new jsPDF();
        pdf.addImage(canvas, 'JPEG', 10, 10, 190, 0);
        pdf.save('report.pdf');
    });
  }

  /**
   * Creates a PDF with input name from a given element id, then downloads it.
   * It creates an image of the elements and saves it as a PDF.
   * @param chartToDownload - Element id name.
   * @param filename - Name of the file.
   */
  public downloadPDFwithFilename(chartToDownload, filename): void {
    html2canvas(document.getElementById(chartToDownload)).then(canvas => {
        const pdf = new jsPDF();
        pdf.addImage(canvas, 'JPEG', 10, 10, 190, 0);
        pdf.save(filename);
    });
  }

  /**
   * Creates a PDF with input name from a given element id, then downloads it.
   * It creates an image of the elements and saves it as a PDF.
   * @param chartToDownload - Element id name.
   * @param filename - Name of the file.
   */
  public downloadCharts(): void {
    const charts = document.getElementsByClassName('charts');
    const pdf = new jsPDF();  // default size in mm
    for (let i = 0; i < charts.length; i++) {
      charts[i].setAttribute('id', `chart${i}`);
      const originalHeight = charts[i].clientHeight;
      const originalWidth = charts[i].clientWidth;

      html2canvas(charts[i]).then(canvas => {
        canvas = canvas.toDataURL('image/jpeg', 1);
        // Ignore canvas if it's not an image
        if (canvas.match('image/jpeg')) {
          // new heights and width in pixels
          let newHeight = 0;
          let newWidth = 180;

          if (originalHeight > pdfHeight) {
            if (originalHeight - pdfHeight > 500) {
              newHeight = newHeight / 1.5;
              newWidth = newWidth / 1.5;
            }
          }

          // SAVE PDF
          if ((i + 1) === charts.length) {
            // Add image, add new page, and safe PDF
            pdf.addImage(canvas, 'JPEG', 10, 10, newWidth, newHeight);
            pdf.save('Charts');
          } else {
            // Add image and add new page
            pdf.addImage(canvas, 'JPEG', 10, 10, newWidth, newHeight);
            pdf.addPage();
          }
        }

      }); // end html2canvas

    } // end for loop
  }

  /**
   * Downloads HTML body content. Sends request to server to generate PDF.
   * Pending implementation.
   * @ignore Implementation not completed.
   */
  public downloadPDFwithFeedback() {
    const html = '';
    this.http.post(environment.context + 'report/generate', html).subscribe(response => {
      // console.log(response);
    },

    err => {
      // console.log('Error generating PDF!');
      // console.log(err);
    });
  }

}
