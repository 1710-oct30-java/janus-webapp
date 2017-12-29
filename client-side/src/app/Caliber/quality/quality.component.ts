import { Component, OnInit } from '@angular/core';
import { Note } from '../entities/Note';
import { Batch } from '../entities/Batch';
import { NoteService } from '../services/note.service';
import { BatchService } from '../services/batch.service';
import { Console } from '@angular/core/src/console';

@Component({
  selector: 'app-quality',
  templateUrl: './quality.component.html',
  styleUrls: ['./quality.component.css']
})
export class QualityComponent implements OnInit {

  batches: Batch[];
  currentBatch: Batch;


  constructor(private noteService: NoteService, private batchService: BatchService) {
    this.batchService.fetchAll();
    this.batchService.getList().subscribe( (batches) => {
      this.batches = batches;
      this.currentBatch = this.batches[0];
    });
  }


  ngOnInit() {

  }
}

// get all batchs, set the current batch to the latest batch
// get all current notes based on the current batch
