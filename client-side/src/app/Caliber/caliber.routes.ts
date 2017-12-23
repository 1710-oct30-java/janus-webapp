import { Routes } from '@angular/router';

// components
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
        data: {
          title: 'Home',
          position: 'top',
        },
      },
      {
        path: 'assess',
        component: AssessComponent,
        data: {
          title: 'Assess Batch',
          position: 'top',
        },
      },
      {
        path: 'quality',
        component: QualityComponent
      },
      {
        path: 'manage',
        component: ManageComponent,
        data: {
          title: 'Manage Batch',
          position: 'top',
        },
      },
      {
        path: 'reports',
        component: ReportsComponent,
        data: {
          title: 'Reports',
          position: 'top',
        },
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
