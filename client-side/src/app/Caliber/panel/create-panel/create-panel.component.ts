import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

// entities
import { Trainee } from '../../entities/Trainee';

// components
import { PanelSearchbarComponent } from '../panel-searchbar/panel-searchbar.component';

@Component({
  selector: 'app-create-panel',
  templateUrl: './create-panel.component.html',
  styleUrls: ['./create-panel.component.css'],
  encapsulation: ViewEncapsulation.None,  // Use the native Shadow DOM to encapsulate our CSS

})
export class CreatePanelComponent implements OnInit {
  closeResult: string;
  trainee: Trainee;
  constructor(private modalService: NgbModal, private searchBar: PanelSearchbarComponent) { }

  ngOnInit() {
    this.searchBar.getTraineeSubject().subscribe((trainee) => {
      this.trainee = trainee;
    });
  }

  open(content) {
    this.modalService.open(content, { size: 'lg' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
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

  onSubmit() {

  }
}
