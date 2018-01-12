import { Component, OnInit, OnDestroy } from '@angular/core';
import { GranularityService } from './services/granularity.service';
import { Subscription } from 'rxjs/Subscription';
import { Trainee } from '../entities/Trainee';
import { Observable } from 'rxjs/Observable';

/**
 * Parent component to reports charts & graphs. Handles filtering of displayed
 * components and higher level view.
 *
 * @author Mitch Goshorn
 *
 * Reports Team Members
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

  // Subscriptions
  granularitySub: Subscription;
  readySub: Subscription;

  // State data used for filtering the view
  ready = false;
  allTrainees = false;
  allWeeks = false;

  constructor(private granularityService: GranularityService) { }

  /**
   * Initializes data subscriptions necessary for component functionality
   */
  ngOnInit() {
    // subscribe to trainee and week data in order to filter subcomponents
    this.granularitySub = Observable.combineLatest(this.granularityService.currentTrainee$,
    this.granularityService.currentWeek$).subscribe((data) => {
      this.allTrainees = data[0].traineeId === 0;
      this.allWeeks = data[1] === 0;
    });

    // Listen for ready state to construct/destroy subcomponents
    this.readySub = this.granularityService.ready$.subscribe(
            (state) => { this.ready = state; });
  }

  /**
   * Unsubscribes from subscriptions
   */
  ngOnDestroy() {
    // Unsubscribe from subscriptions
    if (this.granularitySub)  { this.granularitySub.unsubscribe(); }
    if (this.readySub)        { this.readySub.unsubscribe(); }
  }
}
