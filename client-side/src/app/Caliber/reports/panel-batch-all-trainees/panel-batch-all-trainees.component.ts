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

  private batchIdSub: Subscription;
  batchId: number = null;

  public data: Array<PanelReview> = null;
  public headings: Array<String> = null;
  private dataSubscription: Subscription;

  constructor(private reportsService: ReportingService, private granularityService: GranularityService) { }

  ngOnInit() {
    // Subscription for the data source
    this.dataSubscription = this.reportsService.panelBatchAllTrainees$
      .subscribe((result) => {
        if  (result) {
          this.data = result.data;
        } else {
          console.log('Panel data failed to load');
        }
      });

    // Subscription for batch selection in toolbar
    this.batchIdSub = this.granularityService.currentBatch$.subscribe((result) => {

      console.log('data incoming to panel from granularity');
      console.log(result);

      // Make sure batchId is not undefined
      if (result.batchId) {
        if (this.batchId !== result.batchId) {
          this.batchId = result.batchId;
          this.reportsService.fetchPanelBatchAllTrainees(this.batchId);
        }
      }
    });
  }

  ngOnDestroy() {
    this.dataSubscription.unsubscribe();
    this.batchIdSub.unsubscribe();
  }
}
