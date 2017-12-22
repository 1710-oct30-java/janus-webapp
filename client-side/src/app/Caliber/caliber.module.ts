// modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavModule } from '../nav/nav.module';

// routing
import { routes } from './caliber.routes';

// services
import { BatchService } from './services/batch.service';
import { TrainerService } from './services/trainer.service';
import { TraineeService } from './services/trainee.service';
import { EnvironmentService } from './services/environment.service';
import { AssessmentService } from './services/assessment.service';
import { NoteService } from './services/note.service';

// components
import { CaliberComponent } from './caliber.component';
import { HomeComponent } from './home/home.component';
import { AssessComponent } from './assess/assess.component';
import { NavComponent } from '../nav/nav.component';
import { ManageComponent } from './manage/manage.component';
import { ReportsComponent } from './reports/reports.component';
import { WeeklyLineChartComponent } from './weekly-line-chart/weekly-line-chart.component';
import { TestComponent } from './components/test/test.component';
import { QualityComponent } from './quality/quality.component';

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    HttpClientModule,
    NgbModule.forRoot(),
    RouterModule.forChild(routes),
    FormsModule,
  ],
  declarations: [
    CaliberComponent,
    HomeComponent,
    AssessComponent,
    ManageComponent,
    ReportsComponent,
    WeeklyLineChartComponent,
    TestComponent,
    QualityComponent
  ],
  providers: [
    BatchService,
    EnvironmentService,
    TrainerService,
    TraineeService,
    AssessmentService,
    NoteService
  ],
})
export class CaliberModule { }
