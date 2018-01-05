import { Component, Input, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ReportingService } from '../../../../services/reporting.service';
import { Note } from '../../../entities/Note';

@Component({
    selector: 'app-bargraphmodal',
    templateUrl: './bargraphmodal.component.html',
    styleUrls: ['./bargraphmodal.component.css'],
})
export class BarGraphModalComponent implements OnInit {
    public modalInfoArray: any;
    public tech: Array<String>;
    public trainees: Array<Note>;
    public batchNotes: Note;

    constructor(public activeModal: NgbActiveModal) {
    }

    ngOnInit() {
    }
}
