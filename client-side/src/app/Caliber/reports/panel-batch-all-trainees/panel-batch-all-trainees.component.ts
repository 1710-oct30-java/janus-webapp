import { Component, OnInit } from '@angular/core';
import { PanelReview } from '../../entities/PanelReview';
import { Subscription } from 'rxjs/Subscription';
import { ReportingService } from '../../../services/reporting.service';


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
export class PanelBatchAllTraineesComponent implements OnInit {

  public data: Array<PanelReview> = null;
  public headings: Array<String> = null;
  private dataSubscription: Subscription;

  constructor(private reportsService: ReportingService) { }

  ngOnInit() {
    this.dataSubscription = this.reportsService.panelBatchAllTrainees$
      .subscribe((result) => {
        if  (result) {
          this.data = result.data;
        } else {
          console.log('Panel data failed to load');
        }
      });

    this.reportsService.fetchPanelBatchAllTrainees(2200);
  }
}
