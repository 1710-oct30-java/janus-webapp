import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Input } from '@angular/core/';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import { Trainer } from '../../../entities/Trainer';
import { TrainerService } from '../../../services/trainer.service';

@Component({
    selector: 'app-deactivatelocation',
    templateUrl: './deactivatelocation.component.html',
    styleUrls: ['./deactivatelocation.component.css'],
    providers: [TrainerService],
    encapsulation: ViewEncapsulation.None,
  })
export class DeactivateLocationComponent implements OnInit {
    @Input()
    location: Trainer;

    constructor(private modalService: NgbModal, private ts: TrainerService) {
    }

    ngOnInit() {

    }

    showModal(content) {
        this.modalService.open(content);
    }

    deactivateTrainer() {
        this.ts.deleteTrainer(this.location);
    }
}
