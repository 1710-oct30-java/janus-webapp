import { Component, OnInit, Input } from '@angular/core';
import { animate, state, transition, trigger, style, keyframes } from '@angular/animations';
import { AlertsService } from '../services/alerts.service';
import { NotificationsService } from 'angular2-notifications-lite';

@Component({
  moduleId: module.id.toString(),
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.css'],
})
export class AlertsComponent implements OnInit {

  message: any;

  /**
   * global config for notification
   */
  public options = {
    position: ['top', 'left'],
    timeOut: 2500,
    maxStack: 10,
    maxLength: 36,
    lastOnBottom: true,
    showProgressBar: false,
    preventDuplicates: true,
  };

  constructor(private alertService: AlertsService,
    private notif: NotificationsService) { }

  ngOnInit() {
    this.showNotif();
  }

  /**
   * display success/error notif
   */
  showNotif() {
    this.alertService.getMessage().subscribe(message => {
      this.message = message;
      if (this.message.type === 'success') {
        this.notif.success('Success', this.message.text);
      } else {
        this.notif.error('Error', this.message.text);
      }
    });
  }
}
