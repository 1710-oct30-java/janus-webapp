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
  newCompanyName: string;
  newStreet: string;
  newCity: string;
  newZip: string;
  newState: string;

  rForm: FormGroup;
  private modalRef: NgbModalRef;
  closeResult: string;

  constructor(private modalService: NgbModal,
    private locationService: LocationService,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.popTemp();

    this.initFormControl();
  }

  /**
   * Create a form control with pre-populated fields
   */
  initFormControl() {
    this.rForm = this.fb.group({
      'company': [this.newCompanyName, Validators.required],
      'street': [this.newStreet, Validators.required],
      'city': [this.newCity, Validators.required],
      'zipcode': [this.newZip, Validators.required],
    });
  }

  /**
   * populate all temp variables just in case update was cancelled
   */
  popTemp() {
    this.newCompanyName = this.currEditLocation.company;
    this.newStreet = this.currEditLocation.street;
    this.newCity = this.currEditLocation.city;
    this.newZip = this.currEditLocation.zipcode;
  }

  /**
   * save the original state before changing, open the modal
   * @param content: the modal that needed to be opened
   */
  editLocation(content) {
    this.newState = this.currEditLocation.state;
    this.modalRef = this.modalService.open(content, { size: 'lg' });
    this.modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  /**
   * triggers whenever state field was changed
   * @param newState: state was changed
   */
  stateChange(newState) {
    this.newState = newState;
  }

  /**
   * save all new fields into the location objet
   * send the update request
   * @param modal: fields from the modal
   */
  updateLocation(modal) {
    this.currEditLocation.state = this.newState;
    this.currEditLocation.company = modal.company;
    this.currEditLocation.city = modal.city;
    this.currEditLocation.street = modal.street;
    this.currEditLocation.zipcode = modal.zipcode;
    this.popTemp();
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
