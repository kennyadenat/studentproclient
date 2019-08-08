import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../guard/auth.guard';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MycalendarComponent } from './mycalendar/mycalendar.component';
import { CalendarComponent } from './calendar/calendar.component';
import { LoginlayoutComponent } from './layout/loginlayout/loginlayout.component';
import { AdminlayoutComponent } from './layout/adminlayout/adminlayout.component';
import { SignupComponent } from './signup/signup.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { CalendartypeComponent } from './calendartype/calendartype.component';
import { ProfileComponent } from './profile/profile.component';
import { AddcalendarComponent } from './addcalendar/addcalendar.component';
import { SubscribedComponent } from './subscribed/subscribed.component';
import { AuthredirectComponent } from './authredirect/authredirect.component';


const routes: Routes = [ // otherwise redirect to home
  {
    path: '',
    component: LoginlayoutComponent,
    children: [
      { path: '', component: LoginComponent, pathMatch: 'full' },
      { path: 'signin', component: LoginComponent },
      { path: 'signup', component: SignupComponent },
      { path: 'reset', component: ResetpasswordComponent },
      { path: 'authredirect/:id', component: AuthredirectComponent }
    ]
  },
  {
    path: '',
    component: AdminlayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
        pathMatch: 'full'
      },
      {
        path: 'profile',
        component: ProfileComponent,
        pathMatch: 'full'
      },
      {
        path: 'mycalendar',
        component: MycalendarComponent,
        data: { title: 'Seed Samples' }
      },
      {
        path: 'mycalendar/subscribed',
        component: SubscribedComponent,
        data: { title: 'Seed Samples' }
      },
      {
        path: 'mycalendar/addcalendar/:id',
        component: AddcalendarComponent,
        data: { title: 'Seed Samples' }
      },
      {
        path: 'mycalendar/calendar/:id',
        component: CalendarComponent,
        data: { title: 'Seed Samples' }
      },
      {
        path: 'mycalendar/calendartype',
        component: CalendartypeComponent,
        data: { title: 'Seed Samples' }
      },
    ]
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
