import { Component, OnInit, Input } from '@angular/core';
import { Location } from '../../../entities/Location';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { LocationService } from '../../../services/location.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';

@Component({
  selector: 'app-editlocation',
  templateUrl: './editlocation.component.html',
  styleUrls: ['./editlocation.component.css']
})
export class EditlocationComponent implements OnInit {

  @Input()
  currEditLocation: Location;
  newCompanyName: String;
  newStreet: String;
  newCity: String;
  newZip: String;
  newState: String;

  rForm: FormGroup;
  private modalRef: NgbModalRef;
  closeResult: String;

  constructor(private modalService: NgbModal,
    private locationService: LocationService,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.popTemp();

    this.initFormControl();
  }

  // create form control with original values
  initFormControl() {
    this.rForm = this.fb.group({
      'company': [this.newCompanyName, Validators.required],
      'street': [this.newStreet, Validators.required],
      'city': [this.newCity, Validators.required],
      'zipcode': [this.newZip, Validators.required],
    });
  }

  // populate all temp variables
  popTemp() {
    this.newCompanyName = this.currEditLocation.company;
    this.newStreet = this.currEditLocation.street;
    this.newCity = this.currEditLocation.city;
    this.newZip = this.currEditLocation.zipcode;
  }


  editLocation(content) {
    this.newState = this.currEditLocation.state;
    this.modalRef = this.modalService.open(content, { size: 'lg' });
    this.modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  // When company was changed
  stateChange(newState) {
    this.newState = newState;
  }

  updateLocation(modal) {
    this.currEditLocation.state = this.newState;
    this.currEditLocation.company = modal.company;
    this.currEditLocation.city = modal.city;
    this.currEditLocation.street = modal.street;
    this.currEditLocation.zipcode = modal.zipcode;
    this.locationService.updateLocation(this.currEditLocation);
  }

  // close funciton, reset form
  close(content) {
    this.initFormControl();
    this.modalRef.close();
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
