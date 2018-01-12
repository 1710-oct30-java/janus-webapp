import { Component, OnInit, Input } from '@angular/core';
import { Note } from '../../entities/Note';

@Component({
  selector: 'app-feedback-icon',
  templateUrl: './feedback-icon.component.html',
  styleUrls: ['./feedback-icon.component.css']
})
export class FeedbackIconComponent implements OnInit {
  @Input() status: string;
  @Input() css: string;     // additinal classes you may want to apply

  constructor() { }

  public getStatusIconClass(): any {
    const cssClasses =  {
      'fa': true,
      'fa-star': ( this.status === Note.STATUS_SUPERSTAR),
      'fa-smile-o': ( this.status === Note.STATUS_GOOD),
      'fa-meh-o': ( this.status === Note.STATUS_AVERAGE),
      'fa-frown-o': ( this.status === Note.STATUS_POOR),
      'fa-question': ( this.status === Note.STATUS_UNDEFINED),
      'mx-2': true,
    };

    if ( this.css ) {
      for ( const cssClass of this.css.split(' ') ) {
          cssClasses[cssClass] = true;
      }
    }

    return cssClasses;
  }

  ngOnInit() {
  }
}
