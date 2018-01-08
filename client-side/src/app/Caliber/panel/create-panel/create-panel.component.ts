import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms/';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';

// entities
import { Trainee } from '../../entities/Trainee';
import { Panel } from '../../entities/Panel';

// components
import { PanelSearchbarComponent } from '../panel-searchbar/panel-searchbar.component';

// services
import { PanelService } from '../../services/panel.service';



@Component({
  selector: 'app-create-panel',
  templateUrl: './create-panel.component.html',
  styleUrls: ['./create-panel.component.css'],
  encapsulation: ViewEncapsulation.None,  // Use the native Shadow DOM to encapsulate our CSS

})
export class CreatePanelComponent implements OnInit {
  closeResult: string;
  trainee: Trainee;
  panelForm: FormGroup;
  panelObj: any;
  serializedPanel: any;
  reformatPanel: Panel = new Panel;
  reformatDate: any;
  panelList: Panel[];
  panelRound: number;
  modalRef: NgbModalRef;

  /**
   *
   * @param modalService
   * @param searchBar
   * @param fb
   * @param panelService
   */
  constructor(private modalService: NgbModal, private searchBar: PanelSearchbarComponent, private fb: FormBuilder,
    private panelService: PanelService) { }

  /**
   * sets current trainee and creates formgroups for the add panel modal
   */
  ngOnInit() {
    this.searchBar.getTraineeSubject().subscribe((trainee) => {
      this.trainee = trainee;

      this.panelService.getList().subscribe((panelList) => {
        this.panelList = panelList;
        if (this.panelList == null) {
          this.panelRound = 1;
        } else {
          this.panelRound = this.panelList.length + 1;
        }
      });
    });

    this.panelForm = this.fb.group({
      interviewForm: this.fb.group({
        interviewDate: [''],
        interviewTime: [''],
        format: [''],
        recordingConsent: [''],
        internet: [''],
        panelRound: [''],
      }),
      generalFeedback: this.fb.group({
        associateIntro: [''],
        projectOneDescription: [''],
        projectTwoDescription: [''],
        projectThreeDescription: [''],
        communicationSkills: [''],
      }),
      feedback: this.fb.array([]),
      overallFeedback: this.fb.group({
        duration: [''],
        recordingLink: [''],
        status: [''],
        overall: ['']
      })
    });

    this.addFeedback();
  }

  /**
   * creates a new technology feedback
   */
  initFeedback() {
    return this.fb.group({
      technology: [''],
      result: [''],
      status: [''],
      comment: ['']
    });
  }

  /**
   * deletes the technology feedback
   * @param i
   */
  deleteFeedback(i) {
    const control = <FormArray>this.panelForm.controls['feedback'];
    control.removeAt(i);
  }

  /**
   * adds new technology feedback to form array
   */
  addFeedback() {
    const control = <FormArray>this.panelForm.controls['feedback'];
    const feedbCtrl = this.initFeedback();
    let panelStatus;

    for (let i = 0; i < this.panelForm.controls['feedback'].value.length; i++) {
      if (this.panelForm.controls['feedback'].value[i].status === 'Repanel') {
        this.panelForm.controls['overallFeedback'].get('status').patchValue('Repanel');
        panelStatus = 'Repanel';
      } else if (panelStatus === 'Pass') {
        this.panelForm.controls['overallFeedback'].get('status').patchValue('Pass');
      } else if (panelStatus === 'Repanel') {
        this.panelForm.controls['overallFeedback'].get('status').patchValue('Repanel');
      } else {
        panelStatus = 'Pass';
        this.panelForm.controls['overallFeedback'].get('status').patchValue('Pass');
      }
    }
    control.push(feedbCtrl);
  }

  /**
   * opens panel modal
   * @param content
   */
  open(content) {
    this.modalRef = this.modalService.open(content, { size: 'lg' });
    this.modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  /**
   * modal close reason
   * @param reason
   */
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  /**
   * creates panel object from form and saves panel to trainee
   */
  Submit() {
    this.panelObj = this.panelForm.getRawValue();
    this.reformatDate =
      this.panelObj.interviewForm.interviewDate.year +
      '-' +
      this.panelObj.interviewForm.interviewDate.month +
      '-' +
      this.panelObj.interviewForm.interviewDate.day +
      'T' +
      this.panelObj.interviewForm.interviewTime.hour +
      ':' +
      this.panelObj.interviewForm.interviewTime.minute +
      ':00Z';

    this.reformatPanel.format = this.panelObj.interviewForm.format;
    this.reformatPanel.panelRound = this.panelRound;
    this.reformatPanel.recordingConsent = this.panelObj.interviewForm.recordingConsent;
    this.reformatPanel.internet = this.panelObj.interviewForm.internet;
    this.reformatPanel.interviewDate = this.reformatDate;
    this.reformatPanel.associateIntro = this.panelObj.generalFeedback.associateIntro;
    this.reformatPanel.projectOneDescription = this.panelObj.generalFeedback.projectOneDescription;
    this.reformatPanel.projectTwoDescription = this.panelObj.generalFeedback.projectTwoDescription;
    this.reformatPanel.projectThreeDescription = this.panelObj.generalFeedback.projectThreeDescription;
    this.reformatPanel.communicationSkills = this.panelObj.generalFeedback.communicationSkills;
    this.reformatPanel.feedback = this.panelObj.feedback;
    this.reformatPanel.duration = this.panelObj.overallFeedback.duration;
    this.reformatPanel.recordingLink = this.panelObj.overallFeedback.recordingLink;
    this.reformatPanel.status = this.panelObj.overallFeedback.status;
    this.reformatPanel.overall = this.panelObj.overallFeedback.overall;
    this.reformatPanel.trainee = this.trainee;
    this.reformatPanel.panelist = {};

    this.panelService.create(this.reformatPanel);
    this.modalRef.close();
  }
}
