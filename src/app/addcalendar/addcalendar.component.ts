import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  NgForm,
  FormArray
} from '@angular/forms';
// import { ValidCalendarDate } from '../../Validators/email.validators';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateAdapter, NgbDateStruct, NgbDateNativeAdapter, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import * as timezone from 'moment-timezone';
import * as googletimezone from 'google-timezones-json';
import { ProfileService } from '../../services/profile.service';
import { AuthService } from '../../services/auth.service';
import { Profile } from '../../models/profile.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { CalendartypeService } from '../../services/calendartype.service';
import { Calendartype } from '../../models/calendartype.model';
import { CalendarService } from '../../services/calendar.service';
import * as _ from 'underscore';


@Component({
  selector: 'app-addcalendar',
  templateUrl: './addcalendar.component.html',
  styleUrls: ['./addcalendar.component.css'],
  providers: [{ provide: NgbDateAdapter, useClass: NgbDateNativeAdapter }]
})
export class AddcalendarComponent implements OnInit {
  @ViewChild('use') use;

  navID: string;
  emailfound: boolean;
  currentUser: any;
  resp: any;
  calendarList: Calendartype[] = [];
  calendarItem: Calendartype;
  // displayMonths = 3;
  // navigation = 'select';
  // showWeekNumbers = false;
  // outsideDays = 'visible';
  calendarForm: FormGroup;
  authorForm: FormGroup;
  timezoneList: any;
  profile: Profile[] = [];
  keyword: string;
  OwnerProfile: Profile;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private actRoute: ActivatedRoute,
    private authService: AuthService,
    private profileService: ProfileService,
    private typeService: CalendartypeService,
    private calendarService: CalendarService
  ) {
    this.keyword = 'fullname';
    this.currentUser = this.authService.currentUserValue;
    this.navID = this.actRoute.snapshot.params.id;
    this.getCalendarType(this.actRoute.snapshot.params.id);
    this.setCalendarForm();
    this.setCalendarAuthor();
  }

  ngOnInit() {
    this.getGoogleTimezone();
    this.getProfile(this.currentUser._id);
    // console.log(this.timezoneList);
  }

  getProfile(params) {
    this.profileService.getOneProfile(params)
      .subscribe(res => {
        this.resp = res.data;
        this.OwnerProfile = this.resp.profile;
      });
  }

  getCalendarType(params: string) {
    this.typeService.getCalendarType()
      .valueChanges
      .subscribe(res => {
        this.resp = res.data;
        this.calendarList = this.resp.calendartypes;
        this.calendarItem = _.where(this.calendarList, { type: params })[0];
      });
  }

  getTimezone() {
    const zone = timezone.tz.guess('z');
    const time = zone.split('/');
    return '(GMT' + timezone().tz(zone).format('Z') + ') ' + time[1];
  }

  setCalendarForm() {
    // check if the individual has their institution filled.
    this.calendarForm = this.fb.group({
      title: [null, Validators.required],
      institution: [null],
      type: [null, Validators.required],
      icon: [null],
      note: [null],
      authorid: [null],
      authorbio: [null],
      status: [false, Validators.required],
      timezone: ['', Validators.required],
      // startdate: [Date.now, Validators.required],
      // enddate: [Date.now, Validators.required]
      calendarauthor: this.fb.array([]),
      calendarevent: this.fb.array([])
    });
    this.calendarForm.controls['timezone'].setValue(this.getTimezone(), { onlySelf: true });
    this.calendarForm.patchValue({ type: this.actRoute.snapshot.params.id });
  }

  setCalendarAuthor() {
    this.authorForm = this.fb.group({
      calendarid: '',
      userid: '',
      avatar: '',
      email: '',
      fullname: '',
      role: '',
      isexist: false,
    });
  }

  get f() {
    return this.calendarForm.controls;
  }

  get getCalendarAuthors() {
    return this.calendarForm.get('calendarauthor') as FormArray;
  }

  ValidCalendarDate(control) {
    return control;
  }

  getGoogleTimezone() {
    this.timezoneList = Object.keys(googletimezone).map((key) => {
      return googletimezone[key];
    });
  }

  // this sets the default timezone for calendarforms
  setformzone() {
    if (!this.timezoneList.includes(this.getTimezone())) {
      this.timezoneList.push(this.getTimezone());
      // this.calendarForm.patchValue({ timezone: this.getTimezone() });
      this.calendarForm.controls['timezone'].setValue(this.getTimezone(), { onlySelf: true });
    }
  }

  addCalendar(formValue) {
    if (this.calendarForm.controls.calendarauthor.value.length === 0) {
      this.setOwnerForm();
    }
    this.calendarForm.patchValue({ icon: this.calendarItem.icon });
    this.calendarService.addCalendar(this.calendarForm.value)
      .subscribe(res => {
        console.log(res.data);
      });
  }

  selectEvent(item) {
    if (this.calendarForm.controls.calendarauthor.value.length >= 1) {
      const profileList = _.pluck(this.calendarForm.controls.calendarauthor.value, 'email');
      if (!_.contains(profileList, item.email)) {
        this.setAuthorForm(item);
      } else {
        this.use.notFound = false;
        this.use.clear();
      }
    } else {
      this.setOwnerForm();
      this.setAuthorForm(item);
    }
  }

  setOwnerForm() {
    const authorCount = this.fb.group({
      calendarid: '',
      userid: this.OwnerProfile.userid,
      avatar: this.OwnerProfile.avatar,
      email: this.OwnerProfile.email,
      fullname: this.OwnerProfile.fullname,
      role: 'owner',
      isexist: true,
    });
    this.getCalendarAuthors.push(authorCount);
  }

  setAuthorForm(item) {
    const authorCount = this.fb.group({
      calendarid: '',
      userid: item.userid,
      avatar: item.avatar,
      email: item.email,
      fullname: item.fullname,
      role: 'author',
      isexist: true,
    });
    this.getCalendarAuthors.push(authorCount);
    this.use.notFound = false;
    this.use.clear();
  }

  setUnknownAuthor(item) {
    const authorCount = this.fb.group({
      calendarid: '',
      userid: '',
      avatar: '/assets/avatar/unknown.png',
      email: item,
      fullname: 'Unknown Author',
      role: 'author',
      isexist: false,
    });
    this.getCalendarAuthors.push(authorCount);
    this.use.notFound = false;
    this.use.clear();
  }

  onChangeSearch(val: string) {
    this.emailfound = false;
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
    this.profileService.searchProfile(val)
      .valueChanges
      .subscribe(res => {
        this.resp = res.data;
        this.profile = this.resp.searchprofile;
        const List = _.pluck(this.profile, '_id');
        if (_.contains(List, this.OwnerProfile._id)) {
          this.profile = _.without(this.profile, _.findWhere(this.profile, { _id: this.OwnerProfile._id }));
        }
      });
  }

  onFocused(e) {
    // do something when input is focused
    this.profile = [];
  }

  addSearch(item: string) {
    // check if its a valid email before proceeding.
    // for future update, allow adding using mobile number
    // if not email, display message saying
    if (this.ValidateEmail(item)) {
      if (this.OwnerProfile.email !== item) {
        // check if its a valid email addres
        if (this.calendarForm.controls.calendarauthor.value.length >= 1) {
          const profileList = _.pluck(this.calendarForm.controls.calendarauthor.value, 'email');
          if (!_.contains(profileList, item)) {
            this.setUnknownAuthor(item);
          } else {
            this.use.notFound = false;
            this.use.clear();
          }
        } else {
          this.setOwnerForm();
          this.setUnknownAuthor(item);
        }
      } else {
        this.use.notFound = false;
        this.use.clear();
      }
    } else {
      this.use.notFound = false;
      this.emailfound = true;
    }

  }

  ValidateEmail(control: string) {
    // tslint:disable-next-line:max-line-length
    const EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (EMAIL_REGEXP.test(String(control).toLowerCase())) {
      return true;
    } else {
      return false;
    }
  }

  removeAuthor(params, index) {
    if (this.OwnerProfile.email !== params.email) {
      this.getCalendarAuthors.removeAt(index);
    }
  }

  clearedUser() {
    // this.use.notFoundText = 'User not found. Type it out and press enter to add to list';
  }

  resetCalendar() {
    this.setCalendarForm();
  }

}
