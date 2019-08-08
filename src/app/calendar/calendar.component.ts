import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbDateAdapter, NgbDateStruct, NgbDateNativeAdapter, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  NgForm,
  FormArray
} from '@angular/forms';
import * as moment from 'moment';
/* Import Services */
import { AuthService } from '../../services/auth.service';
import { ProfileService } from '../../services/profile.service';
import { CalendarService } from '../../services/calendar.service';
/* Import Models */
import { Institution, } from '../../models/institution.model';
import { Color } from '../../models/color.model';
import { Role } from '../../models/role.model';
import { Calendarevent } from '../../models/calendarevent.model';
/* FullCalendar Plugins */
import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import Tooltip from 'tooltip.js';
import interactionPlugin from '@fullcalendar/interaction';
import { RRule, RRuleSet, rrulestr } from 'rrule';
import * as FuzzySearch from 'fuzzy-search';
import * as _ from 'underscore';


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  providers: [{ provide: NgbDateAdapter, useClass: NgbDateNativeAdapter }]
})
export class CalendarComponent implements OnInit {

  @ViewChild('use') use;
  @ViewChild('secondbutt') secondbutt;
  @ViewChild('st') start;
  @ViewChild('en') end;

  slideoption: string;
  events: any;
  displayMonths = 1;
  navigation = 'select';
  showWeekNumbers = false;
  outsideDays = 'visible';
  allday: boolean;

  navID: string;
  resp: any;
  respData: any;
  userKeyword = 'institution';
  roleKeyword = 'role';
  startKeyword = 'time';
  endKeyword = 'time';


  private institutionContext: Institution[];
  private institutionContexts: Institution[];

  private startTime = [];
  private startTimes = [];
  private endTime = [];
  private endTimes = [];

  private Calendarevent: Calendarevent[];
  private Colors: Color[];
  private Roles: Role[];
  private Role: Role[];
  calendarEl: any;
  calendar: any;
  /* Event Form Group */
  eventFormGroup: FormGroup;

  constructor(
    private authService: AuthService,
    private profileService: ProfileService,
    private caledarService: CalendarService,
    private actRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {

    this.navID = this.actRoute.snapshot.params.id;
    this.slideoption = 'slide-right';
  }


  ngOnInit() {
    // this.currentTimeArray();
    this.startTime = this.timeArrays();
    this.setEventForm();
    this.loadCalendar(this.Calendarevent);

    this.getCalendarOption();
    // this.rule();
    this.ruleSet();
    this.eventFormGroup
      .valueChanges
      .subscribe(res => {
        if (res) {
          this.addEvents(res);
        }
      });
  }


  timeArrays() {
    const x = 30; // minutes interval
    const times = []; // time array
    let tt = 0; // start time
    const ap = ['AM', 'PM']; // AM-PM

    // loop to increment the time and push results in array
    for (let i = 0; tt < 24 * 60; i++) {
      const hh = Math.floor(tt / 60); // getting hours of day in 0-24 format
      const mm = (tt % 60); // getting minutes of the hour in 0-55 format
      // tslint:disable-next-line:max-line-length
      // times[i] = ('0' + (hh % 12)).slice(-2) + ':' + ('0' + mm).slice(-2) + ' ' + ap[Math.floor(hh / 12)]; // pushing data in array in [00:00 - 12:00 AM/PM format]
      tt = tt + x;

      const extTime = {
        // tslint:disable-next-line:max-line-length
        time: hh + ':' + ('0' + mm).slice(-2) + ' ' + ap[Math.floor(hh / 12)], // pushing data in array in [00:00 - 12:00 AM/PM format]
        ext: ''
      };

      times.push(extTime);
    }
    return times;
  }


  currentTimeArray(startDate) {
    // get the current datetime
    const interval = 30;
    const arr = [];
    const tt = 0; // start time
    const ap = ['AM', 'PM']; // AM-PM

    // loop to increment the time and push results in array
    for (let i = 0; i < 48; i++) {
      //  const hh = Math.floor(tt / 60); // getting hours of day in 0-24 format
      startDate.setMinutes(startDate.getMinutes() + interval);
      const minutes = i * interval + interval;
      const extTime = {
        // tslint:disable-next-line:max-line-length
        time: startDate.getHours() + ':' + ('0' + startDate.getMinutes()).slice(-2) + ' ' + ap[Math.floor(startDate.getHours() / 12)],
        ext: ' (' + this.convertToMinutes(minutes) + ')'
      };

      arr.push(extTime);
    }
    this.endTime = arr;
    return arr;
  }

  setStartTime() {
    // get the current datetime
    const date = new Date();
    const interval = 30;
    const tt = 0; // start time
    const ap = ['AM', 'PM']; // AM-PM
    const minutes = interval;
    // tslint:disable-next-line:max-line-length
    return date.getHours() + ':' + ('0' + date.getMinutes()).slice(-2) + ' ' + ap[Math.floor(date.getHours() / 12)];

    // tslint:disable-next-line:max-line-length
    // return ('0' + (date.getHours() % 12)).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2) + ' ' + ap[Math.floor(date.getHours() / 12)];
  }

  setEndTime() {
    // get the current datetime
    const date = new Date();
    const interval = 30;
    const arr = [];
    const tt = 0; // start time
    const ap = ['AM', 'PM']; // AM-PM

    date.setMinutes(date.getMinutes() + interval);
    const minutes = interval;
    const extTime = {
      // tslint:disable-next-line:max-line-length
      time: ('0' + (date.getHours() % 12)).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2) + ' ' + ap[Math.floor(date.getHours() / 12)],
      ext: ' (' + this.convertToMinutes(minutes) + ')'
    };

    // tslint:disable-next-line:max-line-length
    // return ('0' + (date.getHours() % 12)).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2) + ' ' + ap[Math.floor(date.getHours() / 12)];

    // tslint:disable-next-line:max-line-length
    return date.getHours() + ':' + ('0' + date.getMinutes()).slice(-2) + ' ' + ap[Math.floor(date.getHours() / 12)];
  }

  eventEndTime(date) {
    // get the current datetime
    // const date = new Date();
    const interval = 30;
    const arr = [];
    const tt = 0; // start time
    const ap = ['AM', 'PM']; // AM-PM

    date.setMinutes(date.getMinutes() + interval);
    const minutes = interval;
    const extTime = {
      // tslint:disable-next-line:max-line-length
      time: ('0' + (date.getHours() % 12)).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2) + ' ' + ap[Math.floor(date.getHours() / 12)],
      ext: ' (' + this.convertToMinutes(minutes) + ')'
    };

    // tslint:disable-next-line:max-line-length
    // return ('0' + (date.getHours() % 12)).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2) + ' ' + ap[Math.floor(date.getHours() / 12)];

    // tslint:disable-next-line:max-line-length
    return date.getHours() + ':' + ('0' + date.getMinutes()).slice(-2) + ' ' + ap[Math.floor(date.getHours() / 12)];
  }

  /* covert to minutes */
  convertToMinutes(n) {
    const num = n;
    const hours = (num / 60);
    const rhours = Math.floor(hours);
    const minutes = (hours - rhours) * 60;
    const rminutes = Math.round(minutes);
    return rhours + 'hr ' + rminutes + ' mins';
  }

  mergeDateTime(day, time) {
    let hours = Number(time.match(/^(\d+)/)[1]);
    const minutes = Number(time.match(/:(\d+)/)[1]);
    const AMPM = time.match(/\s(.*)$/)[1];


    if (AMPM === 'PM' && hours < 12) {
      hours = hours + 12;
    }
    if (AMPM === 'AM' && hours === 12) {
      hours = hours - 12;
    }
    let sHours = hours.toString();
    let sMinutes = minutes.toString();
    if (hours < 10) {
      sHours = '0' + sHours;
    }
    if (minutes < 10) {
      sMinutes = '0' + sMinutes;
    }
    time = sHours + ':' + sMinutes + ':00';

    const d = new Date(day);
    const n = d.toISOString().substring(0, 10);
    const newDate = new Date(n + 'T' + time);
    return newDate;
  }


  addEvents(res: any) {
    const event = this.calendar.getEventById('aaaaa');
    if (event) {
      event.remove();
    }

    this.calendar.addEvent({
      id: 'aaaaa',
      title: res.event,
      start: res.start,
      end: res.end,
      allDay: res.allDay,
      color: res.backgroundColor.color,
      textColor: res.backgroundColor.textcolor
    });
  }


  setEventForm() {
    this.eventFormGroup = this.fb.group({
      calendarid: [null, Validators.required],
      userid: [null, Validators.required],
      event: ['', Validators.required],
      start: [Validators.required],
      end: [Validators.required],
      allDay: [false, Validators.required],
      starttime: [null],
      endtime: [null],
      duration: [null],
      backgroundColor: ['', Validators.required],
      textColor: ['', Validators.required],
      editable: [false, Validators.required],
      location: [''],
      note: [''],
      selectEventRole: this.fb.array([]),
      rrule: this.fb.array([]),
      Calendareventrole: this.fb.array([]),
    });
  }


  get f() {
    return this.eventFormGroup.controls;
  }


  loadCalendar(calendarEvents) {
    this.calendarEl = document.getElementById('calendar');
    this.calendar = new Calendar(this.calendarEl, {
      plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
      navLinks: true,
      header: {
        left: 'dayGridMonth,timeGridDay,timeGridWeek,timeGridWeeks,list,today',
        center: 'title',
        right: 'prevYear,prev,next,nextYear'
      },
      views: {
        timeGridWeek: {
          type: 'timeGrid',
          duration: { days: 3 },
          buttonText: '3 days'
        },
        timeGridWeeks: {
          type: 'timeGrid',
          duration: { days: 7 },
          buttonText: 'week'
        }
      },
      customButtons: {
        today: {
          text: 'today',
          click: () => {
            // alert('clicked custom button 1!');
            this.calendar.today();
          }
        }
      },
      displayEventTime: true,
      nowIndicator: true,
      eventLimit: true, // allow "more" link when too many events
      eventColor: '#fff',
      eventTextColor: '#000',
      weekNumbers: true,
      editable: true,
      selectable: true,
      eventRender: (info) => {
        const tooltip = new Tooltip(info.el, {
          title: info.event.extendedProps.description,
          placement: 'top',
          trigger: 'hover',
          container: 'body'
        });
      },
      height: 'auto',
      events: '',
      select: (info) => {

        const event = this.calendar.getEventById('aaaaa');
        if (event) {
          event.remove();
        }

        /* this adds a day to the eventend time as its usually a day
         back on display */
        const ends = moment(info.end).subtract(1, 'd').toDate();

        /// calculate the starttime and endtime for the forms
        const timeStarts = this.mergeDateTime(info.startStr, this.setStartTime());
        const timeEnds = moment(this.mergeDateTime(info.endStr, this.setEndTime())).subtract(1, 'd').toDate();

        this.eventFormGroup.patchValue({
          event: '',
          start: timeStarts,
          end: timeEnds,
          starttime: this.setStartTime(),
          endtime: this.setEndTime(),
          allDay: false
        });

        this.currentTimeArray(this.mergeDateTime(info.startStr, this.setStartTime()));

        // tslint:disable-next-line: deprecation
        this.events = info.jsEvent;
        const body = document.body.getBoundingClientRect();
        const bodyHalf = body.width / 2;

        if (this.events.x >= bodyHalf) {
          this.slideoption = 'slide-left';
          this.secondbutt.nativeElement.click();
        } else if (this.events.x < bodyHalf) {
          this.slideoption = 'slide-right';
          this.secondbutt.nativeElement.click();
        }
      },
      dateClick: (info) => {

        console.log(info);
      },
    });
    this.calendar.render();

  }

  rule() {
    const rule = new RRule({
      freq: RRule.WEEKLY,
      interval: 5,
      count: 30,
      dtstart: new Date(Date.UTC(2019, 7, 28)),
      until: new Date(Date.UTC(2019, 12, 31))
    });

    // console.log(rule.all());
  }

  getCalendarOption() {
    this.caledarService.getcalendarOption()
      .valueChanges
      .subscribe(res => {
        this.resp = res.data;
        this.institutionContext = this.resp.institutions;
        this.Colors = this.resp.colors;
        this.Roles = this.resp.roles;
      });
  }

  ruleSet() {
    const rruleSet = new RRuleSet();

    // Add a rrule to rruleSet
    rruleSet.rrule(new RRule({
      freq: RRule.WEEKLY,
      count: 5,
      dtstart: new Date(Date.UTC(2019, 7, 28, 10, 30))
    }));

    // console.log(rruleSet.all());
  }

  selectEventUser(item) {
  }

  selectEventRole(item) {
  }

  selectEventStart(item) {
    const starts = this.mergeDateTime(this.eventFormGroup.value.start, item.time);
    const timePatch = this.eventEndTime(starts);
    // tslint:disable-next-line:max-line-length
    const ends = this.mergeDateTime(this.eventFormGroup.value.end, timePatch);

    this.eventFormGroup.patchValue({
      end: this.mergeDateTime(this.eventFormGroup.value.end, timePatch),
      endtime: this.eventEndTime(this.mergeDateTime(this.eventFormGroup.value.start, item.time)),
      start: moment(this.mergeDateTime(this.eventFormGroup.value.start, item.time)).toDate(),
      starttime: item.time,
      allDay: false
    });

    this.currentTimeArray(starts);
  }

  selectEventEnd(item) {
    this.eventFormGroup.patchValue({
      end: this.mergeDateTime(this.eventFormGroup.value.end, item.time),
      endtime: item.time,
      allDay: false
    });
  }

  onChangeSearchUser(val: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
    const searcher = new FuzzySearch(this.institutionContext, ['institution'], {
      caseSensitive: true,
    });
    const result = searcher.search(val);
    this.institutionContexts = [];
    this.institutionContexts = result;
  }

  onChangeSearchRole(val: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
    const searcher = new FuzzySearch(this.Roles, ['role'], {
      caseSensitive: true,
    });
    const result = searcher.search(val);
    this.Role = [];
    this.Role = result;
  }

  onChangeSearchStart(val: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
    const searcher = new FuzzySearch(this.startTime, ['time'], {
      caseSensitive: true,
    });
    const result = searcher.search(val);
    this.startTimes = [];
    this.startTimes = result;

  }

  onChangeSearchEnd(val: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
    const searcher = new FuzzySearch(this.endTime, ['time'], {
      caseSensitive: true,
    });
    const result = searcher.search(val);
    this.Role = [];
    this.Role = result;
  }

  clearedUser(e) {
  }

  clearedRole(e) {
  }

  clearedStart(e) {
    this.startTimes = this.timeArrays();
  }

  clearedEnd(e) {
  }

  addSearchUser(value: string) {
  }

  addSearchRole(value: string) {
  }

  addSearchStart(value: string) {
  }

  addSearchEnd(value: string) {
  }

  checkAllDay() {
    this.allday = !this.allday;
    this.eventFormGroup.patchValue({
      allDay: !this.allday
    });
  }

}
