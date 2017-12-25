import { Routes } from '@angular/router';
import { CaliberComponent } from './caliber.component';
import { HomeComponent } from './home/home.component';
import { AssessComponent } from './assess/assess.component';
import { ManageComponent } from './manage/manage.component';
import { ReportsComponent } from './reports/reports.component';
import { TrainerProfileComponent } from './trainer-profile/trainer-profile.component';

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
        path: 'assess',
        component: AssessComponent
      },
      {
        path: 'manage',
        component: ManageComponent
      },
      {
        path: 'reports',
        component: ReportsComponent
      },
      {
        path: 'trainer-profile',
        component: TrainerProfileComponent
      },
      {
        path: '**',
        pathMatch: 'full',
        redirectTo: '/Caliber/home'
      }
    ]
  }
];
