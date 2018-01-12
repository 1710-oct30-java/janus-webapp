import { Component, OnInit, OnDestroy } from '@angular/core';
import { PanelReview } from '../../entities/PanelReview';
import { Subscription } from 'rxjs/Subscription';
import { ReportingService } from '../../../services/reporting.service';
import { GranularityService } from '../services/granularity.service';

/**
 * Component utilizes service API calls to fetch and display the results of
 * panel interviews for a provided batch.
 *
 * @author Mitch Goshorn
 */
@Component({
  selector: 'app-panel-batch-all-trainees',
  templateUrl: './panel-batch-all-trainees.component.html',
  styleUrls: ['./panel-batch-all-trainees.component.css']
})
export class PanelBatchAllTraineesComponent implements OnInit, OnDestroy {

  // State data provided by granularity service for API calls
  batchId: number = null;

  // Data to be injected into view
  public data: Array<PanelReview> = null;
  public headings: Array<String> = null;

  // Subscriptions
  private dataSubscription: Subscription;
  private batchIdSub: Subscription;


  /*===================== Life Cycle Methods ======================*/

  constructor(private reportsService: ReportingService, private granularityService: GranularityService) { }

  /**
   * Initializes component and sets up subscriptions
   */
  ngOnInit() {
    // Subscription for the data source
    this.dataSubscription = this.reportsService.panelBatchAllTrainees$
      .subscribe((result) => {
        if  (result) {
          this.data = result.data;
        }
      });

    // Subscription for batch selection in toolbar
    this.batchIdSub = this.granularityService.currentBatch$.subscribe((result) => {

      // Make sure batchId is not undefined
      if (result.batchId) {
        if (this.batchId !== result.batchId) {
          this.batchId = result.batchId;
          this.reportsService.fetchPanelBatchAllTrainees(this.batchId);
        }
      }
    });
  }

  /**
   * Destroys subscriptions
   */
  ngOnDestroy() {
    this.dataSubscription.unsubscribe();
    this.batchIdSub.unsubscribe();
  }
}
