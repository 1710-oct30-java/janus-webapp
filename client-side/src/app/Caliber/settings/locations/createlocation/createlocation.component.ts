import { Component, OnInit, Input } from '@angular/core';
import { Location } from '../../../entities/Location';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { LocationService } from '../../../services/location.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';


@Component({
  selector: 'app-createlocation',
  templateUrl: './createlocation.component.html',
  styleUrls: ['./createlocation.component.css'],
})
export class CreatelocationComponent implements OnInit {

  currNewLocation = new Location();
  newState: string;
  show: boolean;
  rForm: FormGroup;
  private modalRef: NgbModalRef;
  closeResult: string;

  constructor(private modalService: NgbModal,
    private locationService: LocationService,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.initFormControl();

  }

  /**
   * Create a form control with null fields
   */
  initFormControl() {
    this.rForm = this.fb.group({
      'company': [null, Validators.required],
      'street': [null, Validators.required],
      'city': [null, Validators.required],
      'zipcode': [null, Validators.required],
      'state': [false, Validators.requiredTrue],
    });
    this.currNewLocation.state = 'holder';
  }

  /**
   * open the modal
   * @param content: the modal that needed to be opened
   */
  newLocation(content) {
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
    this.rForm.get('state').setValue(true);
    this.newState = newState;
  }

  /**
 * save all new fields into the location objet
 * send the post request to create new location
 * @param modal: fields from the modal
 */
  addLocation(modal) {
    this.currNewLocation.state = this.newState;
    this.currNewLocation.company = modal.company;
    this.currNewLocation.city = modal.city;
    this.currNewLocation.street = modal.street;
    this.currNewLocation.zipcode = modal.zipcode;
    this.currNewLocation.active = true;
    this.locationService.addLocation(this.currNewLocation);
    this.locationService.getSaved().subscribe((succ) => {
      this.locationService.fetchAll();
    });
  }

  /**
   * close the modal and reset input fields
   * @param content: modal to close
   */
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
