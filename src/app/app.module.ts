import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular'; // for FullCalendar!
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GraphQLModule } from './graphql.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { JwtInterceptor } from '../helpers/jwt.interceptor';
import { ErrorInterceptor } from '../helpers/error.interceptor';
import { NgxMaskModule, IConfig } from 'ngx-mask';


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
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { AuthredirectComponent } from './authredirect/authredirect.component';

export let options: Partial<IConfig> | (() => Partial<IConfig>);

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
    SubscribedComponent,
    ConfirmationComponent,
    AuthredirectComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GraphQLModule,
    HttpClientModule,
    FullCalendarModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    AutocompleteLibModule,
    NgxMaskModule.forRoot(options)
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
