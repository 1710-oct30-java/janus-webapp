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
      .subscribe( (notes) => this.setNotes(notes) );
  }

  ngOnDestroy() {
    this.notesSubscription.unsubscribe();
    this.qcStatusSubscription.unsubscribe();
  }

  ngOnChanges() {
    if (this.batch) {
      this.fetchNotes();
    }
  }

  getQcBatchNote(): Note {
    let note: Note;

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
    this.qcTraineeNotes = notes.filter(note => note.type === 'QC_TRAINEE');
    this.qcBatchNotes = notes.filter(note => note.type === 'QC_BATCH');

    this.buildStatusMap();
  }

  buildStatusMap(): void {
    this.statusMap = {};

    for (const note of this.qcTraineeNotes) {
      this.statusMap[note.trainee.traineeId] = note.qcStatus;
    }
    // console.log(this.statusMap);
  }

  setQcStatuses(statuses: string[]) {
    this.qcStatuses = statuses;
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
    // this.createNewTraineeNotesForNewWeek();
  }

  addWeekToBatch() {
    this.batch.weeks += 1;
    // this.createNewTraineeNotesForNewWeek();
    this.batchService.update(this.batch);
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
    console.log(this.qcTraineeNotes);
  }
}
