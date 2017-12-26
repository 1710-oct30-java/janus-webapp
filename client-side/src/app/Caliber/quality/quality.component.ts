import { Component, OnInit } from '@angular/core';
import { Note } from '../entities/Note';
import { Batch } from '../entities/Batch';
import { QCNoteService } from '../services/qc-note.service';

@Component({
  selector: 'app-quality',
  templateUrl: './quality.component.html',
  styleUrls: ['./quality.component.css']
})
export class QualityComponent implements OnInit {


  constructor(private qcNoteService: QCNoteService) {
  }

  ngOnInit() {
  }

}
