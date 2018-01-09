import { Component, OnInit, OnDestroy, Input, OnChanges, ViewChild } from '@angular/core';
import {NgbTabChangeEvent, NgbTabset} from '@ng-bootstrap/ng-bootstrap';

// rxjs
import { Subscription } from 'rxjs/Subscription';

// services
import { NoteService } from '../../services/note.service';
import { QCStatusService } from '../../services/qcstatus.service';
import { BatchService } from '../../services/batch.service';

// entities
import { Batch } from '../../entities/Batch';
import { Note } from '../../entities/Note';
import { Trainee } from '../../entities/Trainee';



@Component({
  selector: 'app-quality-feedback',
  templateUrl: './quality-feedback.component.html',
  styleUrls: ['./quality-feedback.component.css']
})

export class QualityFeedbackComponent implements OnInit, OnDestroy, OnChanges {

  @Input() batch: Batch;
  @ViewChild('tabSet') tabs: NgbTabset;

  public statusList: string[];
  public notes: Note[];
  public week: number;
  public data: any[];

  private qcStatusSubscription: Subscription;
  private noteListSubscription: Subscription;
  private updatedBatchSubscription: Subscription;
  private noteSavedSubscription: Subscription;

  private savedNote: Note;

  constructor(
    private noteService: NoteService,
    private qcStatusService: QCStatusService,
    private batchService: BatchService
  ) {
    this.setWeek(1);
  }

  /**
  * capture the add week tab and prevet user
  * navigating to a blank tabe
  *
  * @param event: NdbTabChangeEvent
  */
  public checkForAddTab(event: NgbTabChangeEvent): void {
      if ( event.nextId === 'addWeekTab') {
        this.addWeek();
        event.preventDefault();
        this.tabs.select(`week-${this.batch.weeks}`);
      }
  }

  /**
  * sets the current week of the component
  * and performs necessary steps that are
  * required due to the change
  *
  * @param week: number
  */
  public setWeek(week: number): void {
    this.reset();
    this.week = week;
    this.fetchNotes();
  }


  /**
  * returns an array of numbers
  * representing each week of the
  * batch
  */
  public getBatchWeeks(): number[] {
    const weeks: number[] = [];

    for (let i = 0; i < this.batch.weeks; ) {
      weeks.push(++i);
    }

    return weeks;
  }

  /**
  * adds a week to the current batch
  */
  public addWeek() {
     const weeks = ++this.batch.weeks;

     this.batchService.update(this.batch);
     this.setWeek(weeks);
  }

  /**
  * return the class switcher object
  * for the TextArea control
  *
  * @return any
  */
  public noteIsUndefined(note: Note): boolean {
    return (note.qcStatus === Note.STATUS_UNDEFINED);
  }

  /**
  * filters the notes passed to return the QC Batch note
  *
  * @param notes: Note[]
  *
  * @return Note
  */
  public getBatchNote(): Note {
    const batchNotes = this.notes.filter( (note) => ( note.type === Note.TYPE_QCBATCH ) );

    switch ( batchNotes.length ) {
      case 0:
        console.log('EXCEPTION: no QC batch note found. generating new note');
        return this.createNote(Note.TYPE_QCBATCH);
      case 1:
        return batchNotes[0];
      default:
        console.log('EXCEPTION: multiple QC batch notes found. returning first one');
        return batchNotes[0];
    }
  }

  /**
  * sets the status of a note and saves
  * it to the API
  *
  * @param row: any  (struct that represents each row of data)
  * @param statu: string
  */
  public onStatusChange(row: any, status: string): void {
    const note = row.note;

    note.qcStatus = status;
    this.saveNote(note);
  }




  /**
  * filters the notes passed to return only the
  * QC Trainee notes
  *
  * @param notes: Note[]
  *
  * @return Note[]
  */
  private getTraineeNotes(): Note[] {
    return this.notes.filter( (note) => ( note.type === Note.TYPE_QCTRAINEE ) );
  }

  /**
  * returns the single note that belongs to
  * the trainee passed
  *
  * @param trainee: Trainee
  *
  * @return Note
  */
  private getTraineeNote(trainee: Trainee): Note {
    const notes = this.getTraineeNotes()
      .filter( (note) => ( note.trainee.traineeId === trainee.traineeId ));

    switch ( notes.length ) {
      case 0 :
        const note = this.createNote(Note.TYPE_QCTRAINEE);
        /*
        * this MUST be done in order for the note to be attached to the
        * trainee, but it creates a circular reference on the server
        * when it succeeds and the notes can no longer be retrieved
        */
        note.trainee = trainee;
        return note;
      case 1:
        return notes[0];
      default :
        console.log(`EXCEPTION: multiple QC notes found on trainee [${trainee.name}:${trainee.traineeId}]`);
        return notes[0];
    }
  }





  /**
  * resets data associated with the component
  * back to a blank state
  */
  private reset(): void {
    if ( this.notes) {
      this.notes.length = 0;
    }

    if ( this.data ) {
      this.data.length = 0;
    }

    this.notes = [];
    this.data = [];
  }

  /**
  * set the list of possible statuses
  */
  private setStatusList(data: string[]): void {
   this.statusList = data;
  }

  /**
  * set the list of notes
  */
  private setNoteList(notes: Note[] ): void {
    this.notes = notes;
    this.compileData();
  }

  /**
  * trigger the NoteService to retrieve
  * all notes
  */
  private fetchNotes(): void {
    if (this.batch) {
      this.noteService.fetchByBatchIdByWeek(this.batch.batchId, this.week);
    }
  }

  /**
  * tranforms the data used by the component
  * into an array of objects that represent the data
  * for each row of the view and stores it in the
  * data variable
  */
  private compileData(): void {

    const data = [];

   this.batch.trainees.forEach( (trainee) => {
      const row = {
        batch: this.batch,
        trainee: trainee,
        note: this.getTraineeNote(trainee),
      };

      data.push(row);
    });

    this.data = data;
  }

  /**
  * factory method for creating a new instance
  * of a note object
  *
  * @param type: string
  * @param isQcFeedback: boolean (default: true)
  *
  * @return Note
  */
  private createNote(type: string, isQcFeedback = true): Note {
    return {
        noteId: 0,
        type: type,
        qcStatus: Note.STATUS_UNDEFINED,
        qcFeedback: isQcFeedback,
        content: '',
        week: this.week,
        batch: (type === Note.TYPE_QCBATCH) ? this.batch : null,
        trainee: null,
        maxVisibility: 'ROLE_PANEL',
    };
  }

  /**
  * saves a note to the API
  *
  * @param note: Note
  */
  private saveNote(note: Note): void {
    if ( note.noteId === 0 ) {
      this.noteService.save(note);
      this.savedNote = note;
    } else {
      this.noteService.update(note);
    }
  }

  private refreshSavedNote(data: any): void {
    console.log(data);
    if ( this.savedNote ) {
      this.savedNote.noteId = data;
    }
  }

  /**
  * copy the properties of the batch passed
  * into the current batch
  *
  * @param batch: Batch
  *
  */
  private copyBatch(batch: Batch): void {
    if ( this.batch ) {
      if ( this.batch.batchId === batch.batchId ) {
        Object.assign(this.batch, batch);
        this.setWeek(this.batch.weeks);
      }
    }
  }


/*
* ================================
* LIFECYCLE HOOKS
* ================================
*/


  ngOnInit(): void {
    this.qcStatusSubscription = this.qcStatusService.getList()
      .subscribe( (data) => this.setStatusList(data) );

    this.noteListSubscription = this.noteService.getList()
      .subscribe( (notes) => this.setNoteList(notes) );

    this.noteSavedSubscription = this.noteService.getSaved()
      .subscribe( (note) => this.refreshSavedNote(note) );

    // this.updatedBatchSubscription = this.batchService.getUpdated()
    //   .subscribe( (batch) => this.copyBatch(batch) );
  }

  ngOnDestroy(): void {
    this.noteListSubscription.unsubscribe();
    this.noteSavedSubscription.unsubscribe();
    this.qcStatusSubscription.unsubscribe();
    // this.updatedBatchSubscription.unsubscribe();
  }

  ngOnChanges(): void {
    if (this.batch) {
      this.setWeek(1);
    }
  }

}
