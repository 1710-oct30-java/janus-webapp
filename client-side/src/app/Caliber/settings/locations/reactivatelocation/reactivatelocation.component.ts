import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Input } from '@angular/core/';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import { LocationService } from '../../../services/location.service';
import { Location } from '../../../entities/Location';

@Component({
    selector: 'app-reactivatelocation',
    templateUrl: './reactivatelocation.component.html',
    styleUrls: ['./reactivatelocation.component.css'],
    encapsulation: ViewEncapsulation.None,
  })
export class ReactivateLocationComponent implements OnInit {
    @Input()
    location: Location;

    constructor(private modalService: NgbModal, private ls: LocationService) {
    }

    ngOnInit() {

    }

    showModal(content) {
        this.modalService.open(content);
    }

    reactivateLocation() {
        this.location.active = true;
        this.ls.reactivateLocation(this.location);
    }
}
