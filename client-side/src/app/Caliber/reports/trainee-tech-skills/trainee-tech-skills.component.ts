import { Component, OnInit, transition, Input } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { ReportingService } from '../../../services/reporting.service';
import { PDFService } from '../../../services/pdf.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { GranularityService } from '../services/granularity.service';
import { Trainee } from '../../entities/Trainee';
import { ChartData } from '../../entities/chartData';
/**
 * @author John Hudson
*/
@Component({
  selector: 'app-trainee-tech-skills',
  templateUrl: './trainee-tech-skills.component.html',
  styleUrls: ['./trainee-tech-skills.component.css']
})
export class TraineeTechSkillsComponent implements OnInit {


  private batchOverallSubscription: Subscription;
  private traineeOverallRadar: Subscription;
  private traineeWeeklyRadar: Subscription;
  private batchFilter: Subscription;

  private batchSubscription: Subscription;
  private weekSubscription: Subscription;
  private traineeSubscription: Subscription;

  private closeResult: string;

  constructor(private reportsService: ReportingService,
    private pdfService: PDFService, private modalService: NgbModal, private granularityService: GranularityService) { }

  // batch id of batch being viewed
  public batchId: number;
  // current week
  public week: Number;
  // current trainee
  public trainee: Trainee;
  // list of trainees (id) that could be displayed
  public traineesList: number[] = [];
  // this is where trainee radar data is stored until it needs to be displayed
  public traineesData: any[] = [];
  // List of trainee names; will be label of a dataset if it needs to be displayed
  public traineesNames: string[] = [];
  // List of trainees (by id) to be displayed
  public trainees: number[] = [];
  // Datasets for chart to display - moves dataset in and out of array to control what is displayed
  public chartData: any[];
  // same but for the labels provided to the graph-data pipe
  public dataSetLabels: string[] = [];

  // Chart type assignment
  public chartType = 'radar';

  ngOnInit() {
    this.chartData = [];
    this.dataSetLabels = [];
    // set up batch overall sub; put data in index 0 of chartData
    this.batchOverallSubscription = this.reportsService.batchOverallRadar$.subscribe((result) => {
      if (result) {
        if (this.batchId === result.params.batchId) {
          this.chartData.unshift(result.data);
        }
      }
    });
    // set up trainee overall sub
    this.traineeOverallRadar = this.reportsService.traineeOverallRadar$.subscribe((result) => {
      if (result) {
        this.traineesData[this.traineesList.indexOf(result.params.traineeId)] = result.data;
      }
    });
    // set up trainee weekly sub
    this.traineeWeeklyRadar = this.reportsService.traineeWeeklyRadar$.subscribe((result) => {
      if (result) {
        this.chartData.push(result.data);
      }
    });

    // granulity week sub
    this.weekSubscription = this.granularityService.currentWeek$.subscribe(
      (result) => {
        if (result !== this.week) {
          this.week = result;
        }
      });
    // granularity trainee sub
    this.traineeSubscription = this.granularityService.currentTrainee$.subscribe(
      (result) => {
        if (result !== this.trainee) {
          this.trainee = result;
        }
      });

    // granularity batch sub; controls what setup is run.
    this.batchSubscription = this.granularityService.currentBatch$.subscribe(
      (result) => {
        // Make sure batchId is not undefined
        if (result) {
          if (result.batchId !== this.batchId) {
            this.batchId = result.batchId;
            this.dataSetLabels.push(result.trainingName);
            if (this.week === 0) {
              this.overallSetup(result);
            } else {
              this.weekSetup();
            }
          }
        }
      });
    // data formating for weekly trainee chart
    // this is a subscription since it need both datasets to be updated
    this.batchFilter = Observable.combineLatest(this.reportsService.batchOverallRadar$, this.reportsService.traineeWeeklyRadar$).subscribe(
      () => {
        // only do this there is enough data
        if (this.chartData.length === 2) {

          // swap the batch and trainee data for display purposes
          let swap = this.chartData[1];
          this.chartData[1] = this.chartData[0];
          this.chartData[0] = swap;

          swap = this.dataSetLabels[1];
          this.dataSetLabels[1] = this.dataSetLabels[0];
          this.dataSetLabels[0] = swap;

          // need the datasets to be the same length
          if (Object.entries(this.chartData[1]).length !== Object.entries(this.chartData[0]).length) {
            const objArr = [];
            const longArr = Object.entries(this.chartData[1]);
            const shortArr = Object.entries(this.chartData[0]);

            for (let i = 0; i < longArr.length; i++) {
              for (let j = 0; j < shortArr.length; j++) {
                if (longArr[i][0] === shortArr[j][0]) {
                  objArr.push(longArr[i]);
                }
              }
            }
            this.chartData[1] = {};
            for (let i = 0; i < objArr.length; i++) {
              this.chartData[1][objArr[i][0]] = objArr[i][1];
            }
          }
        }
      }
    );
  }
  /**
   * Sets up some variables and send requests for overall radar
   * @param result is the whole batch object.
   */
  overallSetup(result: any) {
    this.chartData = [];
    for (let i = 0; i < result.trainees.length; i++) {
      this.traineesList.push(result.trainees[i].traineeId);
      this.traineesNames.push(result.trainees[i].name);
    }
    this.reportsService.fetchBatchOverallRadarChart(this.batchId);
    // create requests for radar data for each trainee in traineeList
    this.traineesData = new Array<any>(this.traineesList.length);
    for (let i = 0; i < this.traineesList.length; i++) {
      this.reportsService.fetchTraineeOverallRadarChart(this.traineesList[i]);
    }
  }
  /**
   * Sets up some variables and send requests for weekly radar
   */
  weekSetup() {
    this.chartData = [];
    this.dataSetLabels.push(this.trainee.name);
    this.reportsService.fetchBatchOverallRadarChart(this.batchId);
    this.reportsService.fetchTraineeUpToWeekRadarChart(this.week, this.trainee.traineeId);
  }
  /**
   * downloads pdf via pdf service
  */
  downloadPDF() {
    this.pdfService.downloadPDF('trainee-tech-skills');
  }
  /**
   * Opens the trainee selector modal
   * @param content
   */
  open(content) {
    this.modalService.open(content).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  /**
   * closes the trainee selector modal
   * @param reason
   */
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  /**
   * Adds/removes trainee from chart based on modal checks
   * @param index is the index to the trainee in traineesList to be added/removed from chartData
  */
  traineeChecked(index: number) {
    console.log('debug: ' + this.traineesNames[index]);
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
  /**
   * removes a single element from an array
   * @param array
   * @param element
   */
  remove(array: any[], element: any) {
    return array.filter(e => e !== element);
  }
}

