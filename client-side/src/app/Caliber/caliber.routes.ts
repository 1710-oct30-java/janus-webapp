import { Routes } from '@angular/router';
import { CaliberComponent } from './caliber.component';
import { HomeComponent } from './home/home.component';
import { AssessComponent } from './assess/assess.component';
import { ManageComponent } from './manage/manage.component';
import { ReportsComponent } from './reports/reports.component';
import { SettingsComponent } from './settings/settings.component';
import { CategoriesComponent } from './settings/categories/categories.component';
import { LocationsComponent } from './settings/locations/locations.component';
import { TrainersComponent } from './settings/trainers/trainers.component';

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
        path: 'reports',
        component: ReportsComponent
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
