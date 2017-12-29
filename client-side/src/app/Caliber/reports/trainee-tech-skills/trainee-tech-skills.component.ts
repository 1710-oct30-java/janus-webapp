import { Component, OnInit, transition } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { ReportingService } from '../../../services/reporting.service';
import { PDFService } from '../../../services/pdf.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-trainee-tech-skills',
  templateUrl: './trainee-tech-skills.component.html',
  styleUrls: ['./trainee-tech-skills.component.css']
})
export class TraineeTechSkillsComponent implements OnInit {


  private batchOverallSubscription: Subscription;
  private traineeOverallRadar: Subscription[];
  private closeResult: string;

  constructor(private reportsService: ReportingService, private pdfService: PDFService, private modalService: NgbModal) { }


  public trainees: number[] = [];
  // this is temp until api call.
  public batchId = 2201;
  public traineesList = [5528, 5535, 5526, 5530, 5536, 5529, 5534, 5533, 5524, 5532, 5538, 5537, 5525, 5539, 5527];
  public traineesData: any[] = [];
  public traineesNames: string[] = [];
  // Chart labels - this will be dynamic later
  public dataSetLabels: string[];

  // Dataset for chart
  public chartData: any[];

  // Chart type assignment
  public chartType = 'radar';

  ngOnInit() {

    this.traineeOverallRadar = [];
    this.chartData = [];
    // this is until I can get batch data from the api
    this.dataSetLabels = ['batch'];
    this.batchOverallSubscription = this.reportsService.batchOverallRadar$.subscribe((result) => {

      if (!result) {
        // console.log('data not received');
        this.reportsService.fetchBatchOverallRadarChart(this.batchId);
      } else {
        // console.log('data received');
        // console.log(result);
        if (this.chartData === null) {
          this.chartData = [result.data];
        } else {
          if (this.batchId === result.params.batchId) {
            this.chartData.unshift(result.data);
          }
        }
      }
    });

    for (let i = 0; i < this.traineesList.length; i++) {
      this.traineeOverallRadar.push(this.reportsService.traineeOverallRadar$.subscribe((result) => {
        if (!result) {
          // console.log('data not received');
          this.reportsService.fetchTraineeOverallRadarChart(this.traineesList[i]);
        } else {
          // console.log('data received');
          // console.log(result);
          if (this.traineesList[i] === result.params.traineeId) {
            if (this.traineesData === null) {
              this.traineesData = [result.data];
              this.traineesNames.push(this.traineesList[i].toString());
            } else {
              this.traineesData.push(result.data);
              this.traineesNames.push(this.traineesList[i].toString());
            }
          }
        }
      }));
    }
  }
  downloadPDF() {
    this.pdfService.downloadPDF('trainee-tech-skills');
  }
  open(content) {
    this.modalService.open(content).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  traineeChecked(index: number) {
    if (this.trainees.includes(this.traineesList[index])) {
      this.trainees = this.remove(this.trainees, this.traineesList[index]);
      this.chartData = this.remove(this.chartData, this.traineesData[index]);
      this.dataSetLabels = this.remove(this.dataSetLabels, this.traineesNames[index]);
    } else {
      this.trainees.push(this.traineesList[index]);
      this.dataSetLabels = this.dataSetLabels.concat([this.traineesNames[index]]);
      this.chartData = this.chartData.concat([this.traineesData[index]]);
    }
  }
  remove(array: any[], element: any) {
    return array.filter(e => e !== element);
  }
}

