import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Input } from '@angular/core/';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import { LocationService } from '../../../services/location.service';
import { Location } from '../../../entities/Location';

@Component({
    selector: 'app-deactivatelocation',
    templateUrl: './deactivatelocation.component.html',
    styleUrls: ['./deactivatelocation.component.css'],
    encapsulation: ViewEncapsulation.None,
  })
export class DeactivateLocationComponent implements OnInit {
    @Input()
    location: Location;

    constructor(private modalService: NgbModal, private ls: LocationService) {
    }

    ngOnInit() {

    }

    showModal(content) {
        this.modalService.open(content);
    }

    deactivateLocation() {
        this.location.active = false;
        this.ls.deleteLocation(this.location);
    }
}
