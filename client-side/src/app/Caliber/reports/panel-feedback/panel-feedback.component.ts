import { Component, OnInit, OnDestroy } from '@angular/core';
import { Panel } from '../../entities/Panel';

import { GranularityService } from '../services/granularity.service';
import { PanelService } from '../../services/panel.service';

import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Trainee } from '../../entities/Trainee';

/**
 * Component for individual trainee's panel feedback.
 * @author Micah West
 */

@Component({
  selector: 'app-panel-feedback',
  templateUrl: './panel-feedback.component.html',
  styleUrls: ['./panel-feedback.component.css']
})
export class PanelFeedbackComponent implements OnInit, OnDestroy {

  panelList: Array<Panel> = null;
  private panelSubscription: Subscription;
  private granularitySubscription: Subscription;
  private traineeSubscription: Subscription;

  constructor(private granularityService: GranularityService, private panelService: PanelService) { }

  ngOnInit() {
    this.traineeSubscription = this.granularityService.currentTrainee$.subscribe((trainee) => {
      this.panelService.fetchAllByTrainee(trainee);
    });

    this.panelSubscription = this.panelService.getList().subscribe((panels) => {
      this.panelList = panels;
    });
  }

  ngOnDestroy() {
    this.traineeSubscription.unsubscribe();
    this.panelSubscription.unsubscribe();
  }
}
