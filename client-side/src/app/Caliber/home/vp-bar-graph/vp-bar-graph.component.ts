import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChartDataEntity } from '../../entities/ChartDataEntity';
import { iterateListLike } from '@angular/core/src/change_detection/change_detection_util';
import { VpHomeBarGraphService } from '../../services/graph/vp-home-bar-graph.service';
import { HttpClient } from '@angular/common/http';
import { VpHomeSelectorService } from '../../services/selector/vp-home-selector.service';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { Input } from '@angular/core';
import { BarGraphModalComponent } from './bar-graph-modal/bargraphmodal.component';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ReportingService } from '../../../services/reporting.service';
import { Subscription } from 'rxjs/Subscription';
import { environment } from '../../../../environments/environment';
import { EnvironmentService } from '../../services/environment.service';
import { EvaluationService } from '../../services/evaluation.service';
import { Note } from '../../entities/Note';
import { DataSet } from '../../entities/DataSet';
import { AlertsService } from '../../services/alerts.service';
import { BatchService } from '../../services/batch.service';
import { NoteService } from '../../services/note.service';
import { ReportsService } from '../../services/reports.service';

@Component({
  selector: 'app-vp-bar-graph',
  templateUrl: './vp-bar-graph.component.html',
  styleUrls: ['./vp-bar-graph.component.css', '../homeCSS/vpHomeCharts.css']
})
export class VpBarGraphComponent implements OnInit, OnDestroy {
  public barChartData: ChartDataEntity;
  public results: any;
  public addresses;
  public states: any;
  public cities: any;
  public hasBarChartData: boolean;
  public selectedBarCity = '';
  public selectedBarState = '';
  public selectedState: boolean;
  public overallBatchStatusArray = [];
  public modalInfoArray: [{
    id: number;
    week: number;
  }];
  public modal: BarGraphModalComponent;
  public techSub: Subscription;
  public QCSub: Subscription;
  public batchSub: Subscription;
  public QcBatchSub: Subscription;

  public allbatches: any;
  public hasBatchStatuses = false;


  constructor(private vpHomeBarGraphService: VpHomeBarGraphService,
    private reportingService: ReportingService,
    private evaluationService: EvaluationService,
    private modalService: NgbModal,
    private http: HttpClient,
    private alertService: AlertsService,
    private vpHomeSelectorService: VpHomeSelectorService,
    private environmentService: EnvironmentService,
    private batchService: BatchService,
    private noteService: NoteService,
    private reportsService: ReportsService) { }

  ngOnInit() {
    this.hasBarChartData = false;
    this.selectedState = false;
    this.barChartData = this.vpHomeBarGraphService.getBarChartData();
    this.http.get(this.environmentService.buildUrl('qc/batch/all')).subscribe(
      (resp) => {
        console.log(this.results);
        this.results = resp;
        this.results.sort();
        this.barChartData = this.vpHomeBarGraphService.fillChartData(this.results, this.barChartData, '', '');
        this.addresses = this.vpHomeSelectorService.populateAddresses(this.results);
        this.states = this.vpHomeSelectorService.populateStates(this.addresses);
        this.hasBarChartData = true;
        this.QcBatchSub = this.batchService.getList().subscribe( (resp2) => {
          if(resp2 === []) {
            this.batchService.fetchAll();
          }
          this.allbatches = resp2;
          this.populateBatchStatuses();
          this.alertService.success('Successfully fetched QC Progress!');
        });
        // this.http.get(this.environmentService.buildUrl('/qc/batch/all')).subscribe(
        //   (resp2) => {
        //     this.allbatches = resp2;
        //     this.populateBatchStatuses();
        //     this.alertService.success('Successfully fetched QC Progress!');
        //   });

      },
    (err) => {
      this.alertService.error('Failed to fetch QC Progress!');
    });
  }
  /** gets the statuses of the batches as well as stores the batch id and week
  * into a seperate array used for the modal
  * @return void
  */
  populateBatchStatuses() {
    this.hasBatchStatuses = false;
    this.overallBatchStatusArray = [];
    this.modalInfoArray = undefined;
    console.log(this.results);
    console.log(this.allbatches);
    for (const result of this.results) {

      const batch = this.allbatches.filter(i => i.batchId === result.id)[0];
      if (this.modalInfoArray === undefined) {
        this.modalInfoArray = [{ 'id': <number>batch.batchId, 'week': <number>batch.weeks }];
      } else {
        this.modalInfoArray.push({ 'id': <number>batch.batchId, 'week': <number>batch.weeks });
      }
      this.noteService.fetchQcBatchNotesByBatchIdByWeek(batch.batchId, batch.weeks).subscribe((resp) => {
          const temp: any = resp;
          console.log(temp);
          this.overallBatchStatusArray.push(temp.qcStatus);
        });
    }
    this.hasBatchStatuses = true;
  }
  /** called when a state is selected to get cities for the cities drop down
  * as well as re-populate the chartData
  * @param state:string
  */
  findCities(state) {
    this.hasBarChartData = false;
    this.selectedBarCity = '';
    if (state === '') {
      this.selectedState = false;
    } else {
      this.selectedState = true;
      this.cities = this.vpHomeSelectorService.populateCities(this.selectedBarState, this.addresses);
    }
    this.barChartData = this.vpHomeBarGraphService.fillChartData(this.results, this.barChartData, this.selectedBarState, '');
    this.hasBarChartData = true;
  }

  /**
   * after a city is selected, update the graph to reflect the selected city
   * @param city: string
   */
  hasCity(city) {
    if (this.cities.size > 1) {
      this.hasBarChartData = false;
      this.barChartData = this.vpHomeBarGraphService
        .fillChartData(this.results, this.barChartData, this.selectedBarState, this.selectedBarCity);
      this.hasBarChartData = true;
    }
  }

  // when you click on a bar graph, show detailed information
  onClick(event: any) {
    const chartInfo = this.modalInfoArray[event.active[0]._index];
    let tech: Array<String>;
    let trainees: Array<Note>;
    let batchNotes: Note;

    // open the Modal
    const modalRef = this.modalService.open(BarGraphModalComponent);

    // populate Technoloiges
    this.reportingService.fetchTechnologiesForTheWeek(chartInfo.id, chartInfo.week);
    this.techSub = this.reportingService.technologiesForTheWeek$.subscribe((result) => {
      if (result) {
        tech = result.data;
        modalRef.componentInstance.tech = tech;
      }
    });

    // populate detailed trainee notes
    this.evaluationService.FetchAllQCTraineeNotes(chartInfo.id, chartInfo.week);
    this.QCSub = this.evaluationService.allQCTraineeNotes$.subscribe((result) => {
      if (result) {
        trainees = result.data;

        // Styling
        trainees.forEach(item => {
          if (!item.content) {
            item.content = '-';
          }
        });

        modalRef.componentInstance.trainees = trainees;
      }
    });

    // populate qc overal information
    this.evaluationService.FetchAllQCBatchNotes(chartInfo.id, chartInfo.week);
    this.batchSub = this.evaluationService.allQCBatchNotes$.subscribe((result) => {
      if (result) {
        batchNotes = result.data;
        modalRef.componentInstance.batchNotes = batchNotes;
      }
    });
  }

  ngOnDestroy() {
  }
}
