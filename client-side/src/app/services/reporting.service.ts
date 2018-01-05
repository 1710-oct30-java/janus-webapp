import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { CacheData } from '../entities/CacheData.entity';
import { HttpClient } from '@angular/common/http';
import { PanelReview } from '../Caliber/entities/PanelReview';



/**
 * Service handles API calls and tracks fetched data for caching.
 * Fetched data is exposed by observables which get data from private
 * BehaviorSubjects.
 *
 * @author Mitch Goshorn
 * @author Micah West
 */
@Injectable()
export class ReportingService {

  /* Subjects & Paired Observables */
  private traineeOverallRadar = new BehaviorSubject<CacheData>(null);
  public traineeOverallRadar$ = this.traineeOverallRadar.asObservable();

  private traineeWeeklyRadar = new BehaviorSubject<CacheData>(null);
  public traineeWeeklyRadar$ = this.traineeWeeklyRadar.asObservable();

  private batchOverallRadar = new BehaviorSubject<CacheData>(null);
  public batchOverallRadar$ = this.batchOverallRadar.asObservable();

  private qcStatusDoughnut = new BehaviorSubject<CacheData>(null);
  public qcStatusDoughnut$ = this.batchOverallRadar.asObservable();
  // Bar chart used for the Cumulative Scores Graph
  private batchOverallBar = new BehaviorSubject<CacheData>(null);
  public batchOverallBar$ = this.batchOverallBar.asObservable();

  private technologiesForTheWeek = new BehaviorSubject<CacheData>(null);
  public technologiesForTheWeek$ = this.technologiesForTheWeek.asObservable();

  private technologiesUpToWeek = new BehaviorSubject<CacheData>(null);
  public technologiesUpToWeek$ = this.technologiesUpToWeek.asObservable();

  private panelBatchAllTrainees = new BehaviorSubject<CacheData>(null);
  public panelBatchAllTrainees$ = this.panelBatchAllTrainees.asObservable();

  private batchOverallLineChart = new BehaviorSubject<CacheData>(null);
  public batchOverallLineChart$ = this.batchOverallLineChart.asObservable();

  // Used for a variety of API calls related to getting assessment breakdown info
  private assessmentBreakdownBarChart = new BehaviorSubject<CacheData>(null);
  public assessmentBreakdownBarChart$ = this.assessmentBreakdownBarChart.asObservable();

  private BatchWeekSortedBarChart = new BehaviorSubject<CacheData>(null);
  public BatchWeekSortedBarChart$ = this.BatchWeekSortedBarChart.asObservable();

  /*  Reports Charts */
  constructor(private httpClient: HttpClient) { }

  /**
   * Clear all data stored in subjects.
   */
  refresh() {
    // Clear all data stored in subjects
    this.traineeOverallRadar.next(null);
    this.batchOverallRadar.next(null);
    this.qcStatusDoughnut.next(null);
    this.batchOverallBar.next(null);
    this.technologiesUpToWeek.next(null);
  }

  /**
   * Returns true or false if BehaviorSubject needs to be refreshed.
   * @param sub
   * @param params
   */
  private needsRefresh(sub: BehaviorSubject<CacheData>, params: any): boolean {
    return !sub.getValue() || sub.getValue().params !== params;
  }

  /*
  =================================
          API CALLS
  =================================
  */

  /**
   * Fetch the batch comparison average script
   * @param skill Skill to compare
   * @param training Training
   * @param date Date
   * @returns Number - batch average for comparison
   */
  fetchBatchComparisonAvg(skill: string, training: string, startDate) {
    const endpoint = environment.apiBatchComparisonAvgEndpoint(skill, training, startDate);

  }


  /* Doughnut / Pie charts */

  /**
     * Fetches doughnut chart of all QC statuses for this batch
     * @param batchId the id of the batch being fetched
     * Data can be subscribed to @ qcStatusDoughnut$
     */
  fetchQcStatusDoughnutChart(batchId: Number) {
    const endpoint = environment.apiPieChartCurrentWeekQCStatus(batchId);

    // Params object for refresh check
    const params = {
      batchId: batchId
    };

    // call backend API if data is not fresh
    if (this.needsRefresh(this.qcStatusDoughnut, params)) {
      this.httpClient.get(endpoint).subscribe(
        success => this.qcStatusDoughnut.next({ params: params, data: success }));
    }
  }

  /**
   *
   * @param batchId batchId filter value
   * @param weekId weekId filter value
   */
  fetchBatchWeekPieChart(batchId: Number, weekId: Number) {
    const endpoint = environment.apifetchBatchWeekPieChart(batchId, weekId);

    // TODO: Implement API call and subject push logic

  }


  fetchPieChartCurrentWeekQCStatus(batchId: Number) {
    const endpoint = environment.apiPieChartCurrentWeekQCStatus(batchId);
    // TODO: Implement API call and subject push logic

  }

  /* Stacked Bar Charts */

  fetchAllBatchesCurrentWeekQCStackedBarChart(batchId: Number, week: Number) {
    const endpoint = environment.apiAllBatchesCurrentWeekQCStackedBarChart(batchId, week);

    // TODO: Implement API call and subject push logic

  }

  /* Bar Charts */
  fetchBatchWeekAvgBarChart(batchId: Number, week: Number) {
    const endpoint = environment.apiBatchWeekAvgBarChart(batchId, week);

    // TODO: Implement API call and subject push logic

  }

  fetchBatchWeekSortedBarChart(batchId: Number, week: Number) {
    const endpoint = environment.apiBatchWeekSortedBarChart(batchId, week);

    const params = {
      batchId: batchId,
      week: week
    };

    if (this.needsRefresh(this.BatchWeekSortedBarChart, params)) {
      this.httpClient.get(endpoint).subscribe(
        success => this.BatchWeekSortedBarChart.next({ params: params, data: success }));
    }
  }

  fetchBatchOverallTraineeBarChart(batchId: Number, traineeId: Number) {
    const endpoint = environment.apiBatchOverallTraineeBarChart(batchId, traineeId);

    const params = {
      batchId: batchId,
      traineeId: traineeId
    };

    if (this.needsRefresh(this.assessmentBreakdownBarChart, params)) {
      this.httpClient.get(endpoint).subscribe(
        success => this.assessmentBreakdownBarChart.next({ params: params, data: success }));
    }

  }

  /**
   * Fetches overall batch for Cumulative Scores bar chart.
   * @param batchId - batch whose cumulative score data should be fetched
   * @author Edel Benavides
   */
  fetchBatchOverallBarChart(batchId: Number) {
    const endpoint = environment.apiBatchOverallBarChart(batchId);

    // Params object for refresh check
    const params = {
      batchId: batchId
    };

    // call backend API if data is not fresh
    if (this.needsRefresh(this.batchOverallBar, params)) {
      this.httpClient.get(endpoint).subscribe(
        success => this.batchOverallBar.next({ params: params, data: success }));
    }

  }

  /**
   * Fetches topical assessment data on a given week for a given user along with the
   * average assessment of a given batch
   * @param batchId
   * @param weekId
   * @param traineeId
   */
  fetchBatchWeekTraineeBarChart(batchId: Number, weekId: Number, traineeId: Number) {
    const endpoint = environment.apiBatchWeekTraineeBarChart(batchId, weekId, traineeId);

    const params = {
      batchId: batchId,
      weekId: weekId,
      traineeId: traineeId
    };

    if (this.needsRefresh(this.assessmentBreakdownBarChart, params)) {
      this.httpClient.get(endpoint).subscribe(
        success => this.assessmentBreakdownBarChart.next({ params: params, data: success }));
    }
  }

  /* Line Charts */

  fetchTraineeUpToWeekLineChart(batchId: Number, weekId: Number, traineeId: Number) {
    const endpoint = environment.apiTraineeUpToWeekLineChart(batchId, weekId, traineeId);

    // TODO: Implement API call and subject push logic

  }

  fetchTraineeOverallLineChart(batchId: Number, traineeId: Number) {
    const endpoint = environment.apiTraineeOverallLineChart(batchId, traineeId);

    // TODO: Implement API call and subject push logic

  }

  fetchBatchOverallLineChart(batchId: Number) {
    const endpoint = environment.apiBatchOverallLineChart(batchId);

    const params = {
      batchId: batchId
    };

    if (this.needsRefresh(this.batchOverallLineChart, params)) {
      this.httpClient.get(endpoint).subscribe(
        success => this.batchOverallLineChart.next({ params: params, data: success }));
    }
  }

  fetchCurrentBatchesLineChart() {
    const endpoint = environment.apiCurrentBatchesLineChart;

    // TODO: Implement API call and subject push logic

  }

  fetchCurrentPanelsLineChart() {
    const endpoint = environment.apiCurrentPanelsLineChart;

    // TODO: Implement API call and subject push logic

  }

  /* Radar Charts */

  fetchTraineeUpToWeekRadarChart(week: Number, traineeId: Number) {
    const endpoint = environment.apiTraineeUpToWeekRadarChart(week, traineeId);

    // Params object for refresh check
    const params = {
      traineeId: traineeId,
      week: week
    };

    // call backend API if data is not fresh
    if (this.needsRefresh(this.traineeOverallRadar, params)) {
      this.httpClient.get(endpoint).subscribe(
        success => this.traineeWeeklyRadar.next({ params: params, data: success }));
    }

  }


  /**
   * Updates Trainee overall tech skills data if necessary
   * Data can be subscribed to @ traineeOverallRadar$
   * @param traineeId - trainee whose skill data should be fetched
   */
  fetchTraineeOverallRadarChart(traineeId: Number) {
    const endpoint = environment.apiTraineeOverallRadarChart(traineeId);

    // Params object for refresh check
    const params = {
      traineeId: traineeId
    };

    // call backend API if data is not fresh
    if (this.needsRefresh(this.traineeOverallRadar, params)) {
      this.httpClient.get(endpoint).subscribe(
        success => this.traineeOverallRadar.next({ params: params, data: success }));
    }
  }

  /**
   * Updates Batch overall tech skills data if necessary
   * Data can be subscribed to @ batchOverallRadar$
   * @param batchId - batch whose skill data should be fetched
   */
  fetchBatchOverallRadarChart(batchId: Number) {

    const endpoint = environment.apiBatchOverallRadarChart(batchId);

    // Params object for refresh check
    const params = {
      batchId: batchId
    };

    // call backend API if data is not fresh
    if (this.needsRefresh(this.batchOverallRadar, params)) {
      this.httpClient.get(endpoint).subscribe(
        success => this.batchOverallRadar.next({ params: params, data: success }));
    }
  }

  fetchBatchAllTraineesRadarChart(batchId: Number) {
    const endpoint = environment.apiBatchAllTraineesRadarChart(batchId);

    // TODO: Implement API call and subject push logic

  }

  /* Misc. */

  fetchBatchWeekAverageValue(batchId: Number, weekId: Number) {
    const endpoint = environment.apiBatchWeekAverageValue(batchId, weekId);

    // TODO: Implement API call and subject push logic

  }

  /**
   * Updates the single week subject to contain the topics covered
   * by a given batch for a given week.
   * @param batchId - Batch whose week topics we're fetching.
   * @param week - How many weeks we're requesting.
   */
  fetchTechnologiesForTheWeek(batchId: Number, weekId: Number) {
    const endpoint = environment.apiTechnologiesForTheWeek(batchId, weekId);
    console.log(endpoint);

    // Params object for refresh check
    const params = {
      batchId: batchId,
      weekId: weekId
    };

    // call backend API if data is not fresh
    if (this.needsRefresh(this.technologiesForTheWeek, params)) {
      this.httpClient.get(endpoint).subscribe(
        success => this.technologiesForTheWeek.next({ params: params, data: success }));
    }
  }

  /**
   * Updates the multiple weeks subject to contain all the topics
   * covered up to the given week within the given batch.
   * @param batchId - Batch whose week topics we're fetching.
   * @param week - How many weeks we're requesting.
   */
  fetchTechnologiesUpToWeek(batchId: Number, week: Number) {

    const params = { batchId: batchId };

    if (this.needsRefresh(this.technologiesUpToWeek, params)) {
      const result = Array<any>(week);
      let currentSub = 0;

      for (let i = 0; i < week; i++) {
        const endpoint = environment.apiTechnologiesForTheWeek(batchId, i + 1);

        this.httpClient.get(endpoint).subscribe((success) => {
          result[i] = success;
          currentSub++;

          if (currentSub === week) {
            this.technologiesUpToWeek.next({ params: params, data: result });
          }
        });
      }
    }
  }

  /**
   * Fetches data for displaying panel results.
   *
   * Note: While the endpoint suggests this is a reporting endpoint
   * the handler is located in the PanelController.
   */
  fetchPanelBatchAllTrainees(batchId: Number) {
    const endpoint = environment.apiPanelBatchAllTrainees(batchId);
    // console.log(endpoint);
    const params = {
      batchId: batchId
    };

    if (this.needsRefresh(this.panelBatchAllTrainees, params)) {
      this.httpClient.get(endpoint).subscribe(
        success => {
          // console.log(success);
          this.panelBatchAllTrainees.next({params: params, data: success});
        });
    }
  }
}
