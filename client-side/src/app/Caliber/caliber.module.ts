import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { routes } from './caliber.routes';
import { CaliberComponent } from './caliber.component';
import { HomeComponent } from './home/home.component';
import { AssessComponent } from './assess/assess.component';
import { NavComponent } from '../nav/nav.component';
import { NavModule } from '../nav/nav.module';
import { ManageComponent } from './manage/manage.component';
import { ReportsComponent } from './reports/reports.component';
import { CommonModule } from '@angular/common';
import { WeeklyLineChartComponent } from './weekly-line-chart/weekly-line-chart.component';
import { TrainerService } from './services/trainer.service';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { CategoriesService } from './services/categories.service';
import { SettingsComponent } from './settings/settings.component';
import { CategoriesComponent } from './settings/categories/categories.component';
import { TrainersComponent } from './settings/trainers/trainers.component';
import { LocationsComponent } from './settings/locations/locations.component';
import { ViewAllTrainersComponent } from './settings/trainers/view-all-trainers/view-all-trainers.component';
import { DeactivateTrainerComponent } from './settings/trainers/deactivatetrainer/deactivatetrainer.component';
import { LocationService } from './services/location.service';


@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    NgbModule.forRoot(),
    RouterModule.forChild(routes),
    FormsModule,
    AngularFontAwesomeModule
  ],
  declarations: [
    CaliberComponent,
    HomeComponent,
    AssessComponent,
    ManageComponent,
    ReportsComponent,
    WeeklyLineChartComponent,
    SettingsComponent,
    CategoriesComponent,
    TrainersComponent,
    LocationsComponent,
    ViewAllTrainersComponent,
    DeactivateTrainerComponent,
  ],
  providers: [
    TrainerService,
    LocationService,
    CategoriesService,
  ]
})
export class CaliberModule { }
