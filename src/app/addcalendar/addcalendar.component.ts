import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
// import { ValidCalendarDate } from '../../Validators/email.validators';
import { NgbDateAdapter, NgbDateStruct, NgbDateNativeAdapter, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import * as timezone from 'moment-timezone';
import * as googletimezone from 'google-timezones-json';

@Component({
  selector: 'app-addcalendar',
  templateUrl: './addcalendar.component.html',
  styleUrls: ['./addcalendar.component.css'],
  providers: [{ provide: NgbDateAdapter, useClass: NgbDateNativeAdapter }]
})
export class AddcalendarComponent implements OnInit {

  displayMonths = 3;
  navigation = 'select';
  showWeekNumbers = false;
  outsideDays = 'visible';
  calendarForm: FormGroup;
  timezoneList: any;
  data: any;
  keyword: string;

  constructor(
    private fb: FormBuilder) {
    this.setCalendarForm();
    this.keyword = 'name';
    this.data = [
      {
        id: 1,
        name: 'Usa'
      },
      {
        id: 2,
        name: 'England'
      },
      {
        id: 2,
        name: 'Mexico'
      }
    ];
  }

  ngOnInit() {
    //  this.getTimezoneMoment();
    this.getGoogleTimezone();
    // console.log(this.getTimezone());
  }

  getTimezone() {
    const zone = timezone.tz.guess('z');
    const time = zone.split('/');
    return '(GMT' + timezone().tz(zone).format('Z') + ') ' + time[1];
  }

  setCalendarForm() {
    this.calendarForm = this.fb.group({
      title: [null, Validators.required],
      institution: [null, Validators.required],
      type: [null, Validators.required],
      color: [null, Validators.required],
      note: [null],
      status: [false, Validators.required],
      timezone: ['', Validators.required],
      // startdate: [Date.now, Validators.required],
      // enddate: [Date.now, Validators.required]
    });
    this.calendarForm.controls['timezone'].setValue(this.getTimezone(), { onlySelf: true });
  }

  get f() {
    return this.calendarForm.controls;
  }

  ValidCalendarDate(control) {
    return control;
  }

  getTimezoneMoment() {
    const timeZones = timezone.tz.names();
    const offsetTimezone = [];

    const abbrs = {
      EST: 'Eastern Standard Time',
      EAT: 'Eastern African Time',
      EDT: 'Eastern Daylight Time',
      CST: 'Central Standard Time',
      CDT: 'Central Daylight Time',
      MST: 'Mountain Standard Time',
      MDT: 'Mountain Daylight Time',
      PST: 'Pacific Standard Time',
      PDT: 'Pacific Daylight Time',
      CAT: 'Central African Time',
      GMT: 'Greenwich Mean Time',
    };

    timezone.fn.zoneName = function () {
      const abbr = this.zoneAbbr();
      return abbrs[abbr] || abbr;
    };

    timeZones.forEach(element => {
      // console.log(element);
      offsetTimezone.push('(GMT ' + timezone().tz(element).format('Z') + ') ' + timezone().tz(element).format('zz'));
      // console.log('(GMT' + timezone().tz(element).format('Z') + ')');
    });
    console.log(offsetTimezone);
    console.log(timezone.tz.guess('zz'));
  }

  getGoogleTimezone() {
    // this.timezoneList = googletimezone;
    // console.log(this.timezoneList);
    this.timezoneList = Object.keys(googletimezone).map((key) => {
      return googletimezone[key];
    });
  }

  setformzone() {
    console.log(this.getTimezone());
    if (!this.timezoneList.includes(this.getTimezone())) {
      this.timezoneList.push(this.getTimezone());
      this.calendarForm.controls['timezone'].setValue(this.getTimezone(), { onlySelf: true });
    }
  }

  addCalendar(formValue: NgForm) {
    console.log(formValue.value);
  }

  selectEvent(item) {
    // do something with selected item
    console.log(item);
  }

  onChangeSearch(val: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.    
    this.data = [
      {
        id: 1,
        name: 'United States of America'
      }
    ];
  }

  onFocused(e) {
    // do something when input is focused
    this.data = [];
  }

  addSearch(value: string) {
    console.log(value);
  }

}
