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

export class PDFService {

/**
 * Creates a PDF from a given element id, then downloads it.
 * It creates an image of the elemtns and saves it as a PDF.
 */
  public downloadPDF(chartToDownload): void {
    html2canvas(document.getElementById(chartToDownload)).then(canvas => {
        const pdf = new jsPDF();
        pdf.addImage(canvas, 'JPEG', 10, 20, 190, 0);
        pdf.save('report.pdf');
    });
  }

}
