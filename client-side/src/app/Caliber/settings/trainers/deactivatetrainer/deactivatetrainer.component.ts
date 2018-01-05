import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Input } from '@angular/core/';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import { Trainer } from '../../../entities/Trainer';
import { TrainerService } from '../../../services/trainer.service';


@Component({
    selector: 'app-deactivatetrainer',
    templateUrl: './deactivatetrainer.component.html',
    styleUrls: ['./deactivatetrainer.component.css'],
    encapsulation: ViewEncapsulation.None,
  })
export class DeactivateTrainerComponent implements OnInit {
    @Input()
    trainer: Trainer;

    constructor(private modalService: NgbModal, private ts: TrainerService) {
    }

    ngOnInit() {

    }

    showModal(content) {
        this.modalService.open(content);
    }

    deactivateTrainer() {
        this.ts.deleteTrainer(this.trainer);
        this.trainer.tier = 'ROLE_INACTIVE';
        this.ts.fetchAll();
    }
}
