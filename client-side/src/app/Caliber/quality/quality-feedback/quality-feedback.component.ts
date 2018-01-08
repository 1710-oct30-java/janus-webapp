import { Component, OnInit, OnDestroy, Input, OnChanges } from '@angular/core';
import { Batch } from '../../entities/Batch';
import { NoteService } from '../../services/note.service';
import { Note } from '../../entities/Note';
import { Subscription } from 'rxjs/Subscription';
import { Trainee } from '../../entities/Trainee';
import { QCStatusService } from '../../services/qcstatus.service';
import { BatchService } from '../../services/batch.service';

@Component({
  selector: 'app-quality-feedback',
  templateUrl: './quality-feedback.component.html',
  styleUrls: ['./quality-feedback.component.css']
})
export class QualityFeedbackComponent implements OnInit, OnDestroy, OnChanges {

  @Input() batch: Batch;
  qcBatchNotes: Note[];
  qcTraineeNotes: Note[];

  notesSubscription: Subscription;
  qcStatusSubscription: Subscription;

  qcStatuses: string[];
  selectedStatus: string;

  week = 1;
  statusMap;

  constructor(private noteService: NoteService, private qcStatusService: QCStatusService, private batchService: BatchService) {
    this.qcTraineeNotes = [];
    this.qcStatuses = [];
   }

  ngOnInit() {
    this.qcStatusSubscription = this.qcStatusService.getList()
      .subscribe( (statuses) => this.setQcStatuses(statuses) );

    this.notesSubscription = this.noteService.getList()
      .subscribe( (notes) => {
        console.log(notes);
        this.setNotes(notes);

      });
  }

  ngOnDestroy() {
    this.notesSubscription.unsubscribe();
    this.qcStatusSubscription.unsubscribe();
  }

  ngOnChanges() {
    if (this.batch.batchId ) {
      this.fetchNotes();
    }
  }

  getQcBatchNote(): Note {
    let note: Note;

    // console.log(this.qcBatchNotes);

    if ( this.qcBatchNotes.length === 1 ) {
      note = this.qcBatchNotes[0];
    } else {
      note = {
        noteId: 0,
        type: Note.TYPE_QCBATCH,
        qcStatus: Note.STATUS_UNDEFINED,
        qcFeedback: true,
        content: '',
        week: this.week,
        batch: this.batch,
        trainee: null,
        maxVisibility: 'ROLE_PANEL',
      };
    }

    return note;
  }

  setNotes(notes: Note[]): void {
    this.qcTraineeNotes = notes.filter(note => (note.type === Note.TYPE_TRAINEE) );
    this.qcBatchNotes = notes.filter(note => (note.type === Note.TYPE_QCBATCH) );
     console.log(notes);
    this.addMissingNotes();

     // console.log(notes);

    this.buildStatusMap();

    // console.log(notes);
    // console.log(this.statusMap);

    // console.log(notes);
    // console.log(this.qcBatchNotes);
    // console.log(this.qcTraineeNotes);
  }

  buildStatusMap(): void {
    this.statusMap = {};

    for (const note of this.qcTraineeNotes) {
      this.statusMap[note.trainee.traineeId] = note.qcStatus;
    }
    // console.log(this.qcTraineeNotes);
  }

  setQcStatuses(statuses: string[]) {
    this.qcStatuses = statuses;
    // console.log(statuses);
  }

  fetchNotes() {
    this.noteService.fetchByBatchIdByWeek(this.batch.batchId, this.week);
  }

  getBatchWeeks(): number[] {
    const batchWeeks: number[] = [];
    for (let i = 1; i < this.batch.weeks + 1; i++) {
      batchWeeks.push(i);
    }
    return batchWeeks;
  }

  changeWeek(week: number) {
    this.week = week;
    this.fetchNotes();
    this.createNewTraineeNotesForNewWeek();
  }

  addWeekToBatch() {
    this.batch.weeks += 1;
    // this.createNewTraineeNotesForNewWeek();
    this.batchService.update(this.batch);
  }

  addMissingNotes(): void {
    // console.log(this.batch);

    if ( this.batch.trainees ) {
      for ( let i = 0; i < this.batch.trainees.length; i++ ) {
        const trainee = this.batch.trainees[i];
        const traineeNote = this.getNoteOnTrainee(trainee);
        if (traineeNote === null) {
          this.qcTraineeNotes.push({
            noteId: 0,
            type: Note.TYPE_QCTRAINEE,
            qcStatus: Note.STATUS_UNDEFINED,
            qcFeedback: true,
            content: '',
            week: this.week,
            batch: this.batch,
            trainee: trainee,
            maxVisibility: 'ROLE_PANEL',
          });
        }
        // console.log(i);
      }
    }

  }

  getNoteOnTrainee(trainee: Trainee) {
    let traineeNote = null;
    for (let i = 0; i < this.qcTraineeNotes.length; i++) {
      if (trainee.traineeId === this.qcTraineeNotes[i].trainee.traineeId) {
        traineeNote = this.qcTraineeNotes[i];
        break;
      }
    }
    return traineeNote;
  }

  getQcStatusOnTrainee(trainee: Trainee) {
    let traineeQcStatus = '';
    for (let i = 0; i < this.qcTraineeNotes.length; i++) {
      if (trainee.traineeId === this.qcTraineeNotes[i].trainee.traineeId) {
        traineeQcStatus = this.qcTraineeNotes[i].qcStatus;
      }
    }
    // console.log(traineeQcStatus);
    return traineeQcStatus;
  }

  updateQcStatusOnTraineeNote(status: string, trainee: Trainee) {
    const traineeNote = this.getNoteOnTrainee(trainee);
    traineeNote.qcStatus = status;
    this.statusMap[trainee.traineeId] = status;
    this.noteService.update(traineeNote);
  }

  updateTraineeNoteContent(noteContent: string, trainee: Trainee) {
    const traineeNote = this.getNoteOnTrainee(trainee);
    traineeNote.content = noteContent;
    this.noteService.update(traineeNote);
    // console.log(traineeNote);
    // console.log(traineeNote.content);
    // this.fetchNotes();
  }

  createNewTraineeNotesForNewWeek() {
    console.log('in createNewTraineeNotesForNewWeek');
    for ( let i = 0; i < this.batch.trainees.length; i++ ) {
      const trainee = this.batch.trainees[i];
      const traineeNote = this.getNoteOnTrainee(trainee);
      if (traineeNote === null) {
        this.qcTraineeNotes.push({
          noteId: 0,
          type: Note.TYPE_QCTRAINEE,
          qcStatus: Note.STATUS_UNDEFINED,
          qcFeedback: true,
          content: '',
          week: this.week,
          batch: this.batch,
          trainee: trainee,
          maxVisibility: 'ROLE_PANEL',
        });
      }
    }
    // console.log(this.qcTraineeNotes);
  }
  // test() {
  //   console.log(this.batch.batchId);
  //   console.log(this.week);
  //   console.log(this.qcBatchNote);
  //   console.log(this.qcTraineeNotes[1].trainee.name);

  // }
}
