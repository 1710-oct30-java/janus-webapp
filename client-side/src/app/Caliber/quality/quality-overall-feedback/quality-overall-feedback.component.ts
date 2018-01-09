import { Component, OnInit, OnDestroy, Input, OnChanges } from '@angular/core';

// rxjs
import { Subscription } from 'rxjs/Subscription';

// entities
import { Note } from '../../entities/Note';

// services
import { QCStatusService } from '../../services/qcstatus.service';
import { NoteService } from '../../services/note.service';


@Component({
  selector: 'app-quality-overall-feedback',
  templateUrl: './quality-overall-feedback.component.html',
  styleUrls: ['./quality-overall-feedback.component.css']
})
export class QualityOverallFeedbackComponent implements OnInit, OnDestroy, OnChanges {
  @Input() batchNote: Note;

  public qcStatuses: string[];
  public selectedStatus: string;

  private qcStatusListSubscription: Subscription;

  constructor(
    private qcStatusService: QCStatusService,
    private noteService: NoteService
  ) {
    this.selectedStatus = Note.STATUS_UNDEFINED;
  }

  /**
   * set the list of QC status values
   *
   * @param statuses
   */
  private setQCStatuses(statuses: string[]): void {
    this.qcStatuses = statuses;
    // console.log(this.batchNote);
  }

  /**
  * set the status selected value
  * to the value of the batch note's status
  * choosing a default if no batch note
  * is injected
  */
  private setSelectedStatus() {
    if ( this.batchNote ) {
      this.selectedStatus = this.batchNote.qcStatus;
    } else {
      this.selectedStatus = Note.STATUS_UNDEFINED;
    }
  }

  /**
  * push the value selected by the user
  * into the batchNote object represented
  */
  public onStatusChange(status: string) {
    if ( this.batchNote ) {
      this.batchNote.qcStatus = status;
      this.saveNote(this.batchNote);
    }

    this.setSelectedStatus();
  }

  /**
  * saves the note passed to the API
  *
  * @param note: Note
  */
  public saveNote(note: Note): void {
    if ( note.noteId === 0 ) {
      this.noteService.save(note);
    } else {
      this.noteService.update(note);
    }
  }

  /**
  * return the class switcher object
  * for the TextArea control
  *
  * @return any
  */
  public noteIsUndefined(note: Note): boolean {
    return ( note.qcStatus === Note.STATUS_UNDEFINED );
  }

  ngOnInit() {
    this.qcStatusListSubscription = this.qcStatusService.getList()
      .subscribe((list) => this.setQCStatuses(list));
  }

  ngOnChanges(): void {
    this.setSelectedStatus();
  }

  ngOnDestroy(): void {
    this.qcStatusListSubscription.unsubscribe();
  }

}
