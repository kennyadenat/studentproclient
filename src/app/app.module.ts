import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular'; // for FullCalendar!

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GraphQLModule } from './graphql.module';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './layout/footer/footer.component';
import { HeaderComponent } from './layout/header/header.component';
import { QuicknavComponent } from './layout/quicknav/quicknav.component';
import { ScrolltopComponent } from './layout/scrolltop/scrolltop.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
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

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    HomeComponent,
    FooterComponent,
    HeaderComponent,
    QuicknavComponent,
    ScrolltopComponent,
    SidebarComponent,
    MycalendarComponent,
    CalendarComponent,
    LoginlayoutComponent,
    AdminlayoutComponent,
    SignupComponent,
    ResetpasswordComponent,
    CalendartypeComponent,
    ProfileComponent,
    AddcalendarComponent,
    SubscribedComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GraphQLModule,
    HttpClientModule,
    FullCalendarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
