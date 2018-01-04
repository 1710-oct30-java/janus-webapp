import { Routes } from '@angular/router';

// components
import { CaliberComponent } from './caliber.component';
import { HomeComponent } from './home/home.component';
import { AssessComponent } from './assess/assess.component';
import { ManageComponent } from './manage/manage.component';
import { ReportsComponent } from './reports/reports.component';
import { SettingsComponent } from './settings/settings.component';
import { CategoriesComponent } from './settings/categories/categories.component';
import { LocationsComponent } from './settings/locations/locations.component';
import { TrainersComponent } from './settings/trainers/trainers.component';
import { DeactivateTrainerComponent } from './settings/trainers/deactivatetrainer/deactivatetrainer.component';
import { QualityComponent } from './quality/quality.component';
import { PanelComponent } from './panel/panel.component';
import { TestComponent } from './components/test/test.component';
import { TrainerProfileComponent } from './trainer-profile/trainer-profile.component';
import { TrainerProfile2Component } from './trainer--profile/trainer--profile.component';
import { TempJohnComponent } from './tempjohn/tempjohn.component';

export const routes: Routes = [
  {
    path: '',
    component: CaliberComponent,
    children: [
      {
        path: 'home',
        component: HomeComponent,
      },
      {
        path: 'manage',
        component: ManageComponent
      },
      {
        path: 'assess',
        component: AssessComponent,
      },
      {
        path: 'quality',
        component: QualityComponent
      },
      {
        path: 'reports',
        component: ReportsComponent,
      },
      {
        path: 'test',
        component: TestComponent,
      },
      {
        path: 'trainer-profile',
        component: TrainerProfileComponent,
      },
      {
        path: 'trainer-dev',
        component: TrainerProfile2Component,
      },
      {
        path: 'tempjohn',
        component: TempJohnComponent,
      },
      {
        path: 'settings',
        component: SettingsComponent,
        children: [
          {
            path: 'categories',
            component: CategoriesComponent
          },
          {
            path: 'locations',
            component: LocationsComponent
          },
          {
            path: 'trainers',
            component: TrainersComponent
          }
        ]
      },
      {
        path: '**',
        pathMatch: 'full',
        redirectTo: '/Caliber/home'
      }
    ]
  }
];
