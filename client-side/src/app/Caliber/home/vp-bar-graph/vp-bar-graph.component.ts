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
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-vp-bar-graph',
  templateUrl: './vp-bar-graph.component.html',
  styleUrls: ['./vp-bar-graph.component.css', '../homeCSS/vpHomeCharts.css']
})
export class VpBarGraphComponent implements OnInit, OnDestroy {
  public barChartData: ChartDataEntity;
  public holder = [];
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
  private mergedObservablesSubscription: Subscription;
  public allbatches: any;
  public hasBatchStatuses = false;
  public counter = 0;

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

  /**
   * Does API calls and organizes the data returned from the calls
   * @memberof VpBarGraphComponent
   */
  ngOnInit() {
    this.counter = 0;
    this.batchService.fetchAll();
    this.hasBarChartData = false;
    this.selectedState = false;
    this.barChartData = this.vpHomeBarGraphService.getBarChartData();
    const Observable1: Observable<any> = this.reportsService.fetchReportsStackedBarCurrentWeek();
    const Observable2: Observable<any> = this.batchService.getList();
    this.mergedObservablesSubscription = Observable1.merge(Observable2).subscribe(
      (resp) => {
        this.counter++;
        if (resp.length > 0) {
          this.holder.push(resp);
        }
        if (this.counter > 2) {
          // have to sort to find which object is in the array the result of Observable1 will have a qcStatus field
          this.results = this.holder.filter(i => ('qcStatus' in i[0]))[0];
          // the result of Observable2 will have a batchId status.  Have to check the first item in the returned array i[0]
          this.allbatches = this.holder.filter(i => ('batchId' in i[0]))[0];
          this.barChartData = this.vpHomeBarGraphService.fillChartData(this.results, this.barChartData, '', '');
          this.addresses = this.vpHomeSelectorService.populateAddresses(this.results);
          this.states = this.vpHomeSelectorService.populateStates(this.addresses);
          this.hasBarChartData = true;
          this.populateBatchStatuses();
        }
      },
      (err) => {
        this.alertService.error('Failed to fetch QC Progress!');
      });
  }

  /**
   * gets the statuses of the batches as well as stores the batch id and week
   * into a seperate array used for the modall
   * @memberof VpBarGraphComponent
   */
  populateBatchStatuses() {
    this.hasBatchStatuses = false;
    this.overallBatchStatusArray = [];
    this.modalInfoArray = undefined;
    for (const result of this.results) {

      const batch = this.allbatches.filter(i => i.batchId === result.id)[0];
      if (this.modalInfoArray === undefined) {
        this.modalInfoArray = [{ 'id': <number>batch.batchId, 'week': <number>batch.weeks }];
      } else {
        this.modalInfoArray.push({ 'id': <number>batch.batchId, 'week': <number>batch.weeks });
      }
      this.noteService.fetchQcBatchNotesByBatchIdByWeek(batch.batchId, batch.weeks).subscribe((resp) => {
        const temp: any = resp;
        this.overallBatchStatusArray.push(temp.qcStatus);
      });
    }
    this.hasBatchStatuses = true;
  }

  /**
   * called when a state is selected to get cities for the cities drop down
   * as well as re-populate the chartData
   *
   * @param {any} state
   * @memberof VpBarGraphComponent
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
   * @param {any} city
   * @memberof VpBarGraphComponent
   */
  hasCity(city) {
    if (this.cities.size > 1) {
      this.hasBarChartData = false;
      this.barChartData = this.vpHomeBarGraphService
        .fillChartData(this.results, this.barChartData, this.selectedBarState, this.selectedBarCity);
      this.hasBarChartData = true;
    }
  }

  /**
   * when you click on a bar graph, show detailed information
   * @param {*} event
   * @memberof VpBarGraphComponent
   */
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
    try {
      this.mergedObservablesSubscription.unsubscribe();
    } catch (Exception) { }

  }
}
