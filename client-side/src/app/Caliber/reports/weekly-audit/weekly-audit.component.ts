import { Component, OnInit } from '@angular/core';

// services
import { GranularityService } from '../services/granularity.service';
import { NoteService } from '../../services/note.service';
import { ReportingService } from '../../../services/reporting.service';

// rxjs
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

// entities
import { Batch } from '../../entities/Batch';
import { Note } from '../../entities/Note';
import { Trainee } from '../../entities/Trainee';

/**
 * Creates a table showing the overall quality audit for
 * a given batch on a given week.
 * @author Micah West
 */

@Component({
  selector: 'app-weekly-audit',
  templateUrl: './weekly-audit.component.html',
  styleUrls: ['./weekly-audit.component.css']
})
export class WeeklyAuditComponent implements OnInit {

  private granularitySub: Subscription;
  private noteSub: Subscription;
  private reportSub: Subscription;

  batch: Batch;
  week: number;
  traineeNotes: Array<Note>;
  batchNote: Note;
  weekTopics: string;

  constructor(private granularityService: GranularityService,
              private noteService: NoteService,
              private reportService: ReportingService) { }

  ngOnInit() {

    this.granularitySub = Observable.combineLatest(
      this.granularityService.currentBatch$, this.granularityService.currentWeek$).subscribe((batchWeek) => {

      this.batch = batchWeek[0];
      this.week = batchWeek[1];

      this.noteService.fetchByBatchIdByWeek(this.batch.batchId, this.week);
      this.reportService.fetchTechnologiesForTheWeek(this.batch.batchId, this.week);

    });

    this.noteSub = this.noteService.getList().subscribe((list) => {
      this.traineeNotes = list.filter(note => note.type === 'QC_TRAINEE');
      this.batchNote = this.findNote(list, 'QC_BATCH');
    });

    this.reportService.technologiesForTheWeek$.subscribe((tech) => {
      if (tech) {
        this.weekTopics = this.techString(tech.data);
      }
    });
  }

  techString(tech: Array<String>) {
    let result = '';

    for (let i = 0; i < tech.length; i++) {
      result += tech[i];
      if (i < tech.length - 1) {
        result += ', ';
      }
    }
    return result;
  }

  findNote(arr: Array<Note>, type: String): Note {
    for (const note of arr) {
      if (note.type === type) {
        return note;
      }
    }
    return new Note();
  }
}
