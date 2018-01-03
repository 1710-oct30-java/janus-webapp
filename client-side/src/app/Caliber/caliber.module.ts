// modules
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavModule } from '../nav/nav.module';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { HttpClient } from '@angular/common/http';
import { SimpleNotificationsModule } from 'angular2-notifications';

// routing
import { routes } from './caliber.routes';
import { SpringInterceptor } from './interceptors/spring.interceptor';

// services
import { BatchService } from './services/batch.service';
import { TrainerService } from './services/trainer.service';
import { TraineeService } from './services/trainee.service';
import { EnvironmentService } from './services/environment.service';
import { AssessmentService } from './services/assessment.service';
import { RouteService } from './services/route.service';
import { PanelService } from './services/panel.service';
import { GradeService } from './services/grade.service';
import { NoteService } from './services/note.service';
import { ColorService } from './services/colors/color.service';
import { VpHomeLineGraphService } from './services/graph/vp-home-line-graph.service';
import { VpHomeSelectorService } from './services/selector/vp-home-selector.service';
import { CategoriesService } from './services/categories.service';
import { LocationService } from './services/location.service';
import { VpHomeBarGraphService } from './services/graph/vp-home-bar-graph.service';
import { VpHomePanelGraphService } from './services/graph/vp-home-panel-graph.service';
import { AlertsService } from './services/alerts.service';

// pipes
import { TraineeSearchPipePipe } from './pipes/trainee-search-pipe.pipe';
import { GraphDataPipe } from './pipes/graph-data.pipe';
import { TierPipe } from './pipes/tier-pipe';

// components
import { CaliberComponent } from './caliber.component';
import { HomeComponent } from './home/home.component';
import { AssessComponent } from './assess/assess.component';
import { NavComponent } from '../nav/nav.component';
import { ManageComponent } from './manage/manage.component';
import { ReportsComponent } from './reports/reports.component';
import { WeeklyLineChartComponent } from './weekly-line-chart/weekly-line-chart.component';
import { TraineeTechSkillsComponent } from './reports/trainee-tech-skills/trainee-tech-skills.component';
import { ToolbarComponent } from './reports/toolbar/toolbar.component';
import { TestComponent } from './components/test/test.component';
import { TrainerProfileComponent } from './trainer-profile/trainer-profile.component';
import { PanelComponent } from './panel/panel.component';
import { VpBarGraphComponent } from './home/vp-bar-graph/vp-bar-graph.component';
import { VpLineGraphComponent } from './home/vp-line-graph/vp-line-graph.component';
import { VpPanelGraphComponent } from './home/vp-panel-graph/vp-panel-graph.component';
import { SettingsComponent } from './settings/settings.component';
import { CategoriesComponent } from './settings/categories/categories.component';
import { LocationsComponent } from './settings/locations/locations.component';
import { TrainersComponent } from './settings/trainers/trainers.component';
import { DeactivateTrainerComponent } from './settings/trainers/deactivatetrainer/deactivatetrainer.component';
import { DeactivateLocationComponent } from './settings/locations/deactivatelocation/deactivatelocation.component';
import { EditlocationComponent } from './settings/locations/editlocation/editlocation.component';
import { CreatelocationComponent } from './settings/locations/createlocation/createlocation.component';
import { QualityComponent } from './quality/quality.component';
import { GraphComponent } from './reports/graph/graph.component';
import { TableComponent } from './reports/table/table.component';
import { PanelBatchAllTraineesComponent } from './reports/panel-batch-all-trainees/panel-batch-all-trainees.component';
import { AlertsComponent } from './alerts/alerts.component';
import { ReactivateLocationComponent } from './settings/locations/reactivatelocation/reactivatelocation.component';
import { BarGraphModalComponent } from './home/vp-bar-graph/bar-graph-modal/bargraphmodal.component';
import { EvaluationService } from './services/evaluation.service';
import { OrderByPipe } from './pipes/order-by.pipe';


@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    HttpClientModule,
    NgbModule.forRoot(),
    RouterModule.forChild(routes),
    FormsModule,
    ChartsModule,
    ReactiveFormsModule,
    SimpleNotificationsModule.forRoot(),
  ],
  declarations: [

    // components
    CaliberComponent,
    HomeComponent,
    AssessComponent,
    ManageComponent,
    ReportsComponent,
    WeeklyLineChartComponent,
    VpBarGraphComponent,
    VpLineGraphComponent,
    VpPanelGraphComponent,
    SettingsComponent,
    CategoriesComponent,
    TrainersComponent,
    LocationsComponent,
    DeactivateTrainerComponent,
    DeactivateLocationComponent,
    EditlocationComponent,
    CreatelocationComponent,
    PanelComponent,
    QualityComponent,
    TraineeTechSkillsComponent,
    ToolbarComponent,
    GraphComponent,
    TableComponent,
    TestComponent,
    TrainerProfileComponent,
    PanelComponent,
    ReactivateLocationComponent,
    AlertsComponent,
    BarGraphModalComponent,

    // pipes
    TraineeSearchPipePipe,
    GraphDataPipe,
    PanelBatchAllTraineesComponent,
    TierPipe,
    OrderByPipe,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: SpringInterceptor, multi: true },  // interceptor for all HTTP requests
    BatchService,
    EnvironmentService,
    TrainerService,
    TraineeService,
    AssessmentService,
    RouteService,
    PanelService,
    RouteService,
    GradeService,
    HttpClient,
    NoteService,
    VpHomeLineGraphService,
    VpHomeSelectorService,
    ColorService,
    TrainerService,
    LocationService,
    CategoriesService,
    AlertsService,
    VpHomeBarGraphService,
    VpHomePanelGraphService,
    EvaluationService,
  ],
  bootstrap: [
    TrainersComponent
  ],
  exports: [
    TraineeTechSkillsComponent,
  ],
  entryComponents: [
    BarGraphModalComponent,
  ],
})
export class CaliberModule { }
