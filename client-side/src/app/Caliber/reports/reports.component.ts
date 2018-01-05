import { Component, OnInit, OnDestroy } from '@angular/core';
import { GranularityService } from './services/granularity.service';
import { Subscription } from 'rxjs/Subscription';
import { Trainee } from '../entities/Trainee';

/**
 * Parent component to reports charts & graphs. Handles filtering of displayed
 * components and higher level view.
 *
 * @author Mitch Goshorn
 *
 * Reports Team
 * @author Mitch Goshorn
 * @author Micah West
 * @author John Hudson
 * @author Robert Choboy
 * @author Brandon Richardson
 * @author Edel Benavides
 * @author Chris Worcester
 */
@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit, OnDestroy {

  traineeIdSub: Subscription;
  weekIdSub: Subscription;

  // This value should be null when no trainees are selected,
  //    and otherwise contain a trainee object
  currentTrainee: Trainee = null;

  // When this has value 0, ALL TRAINEES is selected, otherwise it is a specific trainee
  weekId: number = null;

  constructor(private granularityService: GranularityService) { }

  ngOnInit() {

    // subscribe to trainee and week data in order to filter subcomponents
    this.traineeIdSub = this.granularityService.currentTrainee$.subscribe((data) => {
      if (this.currentTrainee !== data) {
        this.currentTrainee = data;
      }
    });

    this.weekIdSub = this.granularityService.currentWeek$.subscribe((data) => {
      if (this.weekId !== data) {
        this.weekId = data;
      }
    });
  }

  ngOnDestroy() {
    // Unsubscribe from subscriptions
    this.weekIdSub.unsubscribe();
    this.traineeIdSub.unsubscribe();
  }
}
