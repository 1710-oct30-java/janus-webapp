import { Component, OnInit } from '@angular/core';
import { Note } from '../entities/Note';
import { Batch } from '../entities/Batch';
import { QCNoteService } from '../services/qc-note.service';
import { BatchService } from '../services/batch.service';

@Component({
  selector: 'app-quality',
  templateUrl: './quality.component.html',
  styleUrls: ['./quality.component.css']
})
export class QualityComponent implements OnInit {

  batches: any[];


  constructor(private qcNoteService: QCNoteService, private batchService: BatchService) {
    this.batchService.fetchAll();
    this.batchService.getList().subscribe( (batches) => {
      this.batches = batches;
    });
  }

  ngOnInit() {
  }

}

// get all batchs, set the current batch to the latest batch
// get all current notes based on the current batch
