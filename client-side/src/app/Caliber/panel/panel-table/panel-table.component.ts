import { Component, OnInit } from '@angular/core/';

// entities
import { Trainee } from '../../entities/Trainee';
import { Panel } from '../../entities/Panel';

// services
import { PanelService } from '../../services/panel.service';

@Component({
  selector: 'app-panel-table',
  templateUrl: './panel-table.component.html',
  styleUrls: ['./panel-table.component.css']
})
export class PanelTableComponent implements OnInit {
  panelList: Array<Panel>;
  trainee: Trainee;

  /**
  * Get the necessary services
  * @constructor
  * @param traineeservice - the TraineeService
  * @param panelService - the PanelService
  */
  constructor(private panelService: PanelService) { }

  /**
   * array of all panels
   */
  ngOnInit() {

    this.panelService.getList().subscribe((panelList) => {
      this.panelList = panelList;
    });
  }
}
