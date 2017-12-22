import { Routes } from '@angular/router';
import { CaliberComponent } from './caliber.component';
import { HomeComponent } from './home/home.component';
import { AssessComponent } from './assess/assess.component';
import { ManageComponent } from './manage/manage.component';
import { ReportsComponent } from './reports/reports.component';
import { TestComponent } from './components/test/test.component';
import { QualityComponent } from './quality/quality.component';

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
        path: 'quality',
        component: QualityComponent
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
        path: 'test',
        component: TestComponent,
      },
      {
        path: '**',
        pathMatch: 'full',
        redirectTo: '/Caliber/home'
      }
    ]
  }
];
