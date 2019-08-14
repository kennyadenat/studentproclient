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
import { Profile } from '../../models/profile.model';
import { Color } from '../../models/color.model';
import { Role } from '../../models/role.model';
import { Calendarevent } from '../../models/calendarevent.model';
/* FullCalendar Plugins */
import { Calendar } from '@fullcalendar/core';
import rrulePlugin from '@fullcalendar/rrule';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import Tooltip from 'tooltip.js';
import interactionPlugin from '@fullcalendar/interaction';
import { RRule, RRuleSet, rrulestr } from 'rrule';
import {
  timeArrays,
  currentTimeArray,
  setStartTime,
  setDefaultTime,
  mergeDefaultTime,
  setEndTime,
  eventEndTime,
  convertToMinutes,
  convertToDuration,
  mergeDateTime
} from '../../calendar/timehelper';
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
  startKeyword = '';
  endKeyword = '';
  ruleText: string;
  currentUser: any;

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
  private profile: Profile[];
  OwnerProfile: Profile;

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
    this.currentUser = this.authService.currentUserValue;
    this.navID = this.actRoute.snapshot.params.id;
    this.slideoption = 'slide-right';
  }


  ngOnInit() {
    this.ruleText = 'Does not repeat';
    this.startTime = timeArrays();
    this.setEventForm();
    this.loadCalendar(this.Calendarevent);

    this.getCalendarOption();
    this.eventFormGroup
      .valueChanges
      .subscribe(res => {
        if (res) {
          console.log(res);
          this.addEvents(res);
        }
      });
  }



  addEvents(res: any) {
    const event = this.calendar.getEventById(res.id);

    if (event) {

      event.remove();

      if (!res.starttime) {
        console.log('here');
        res.starttime = setStartTime();
      }
      if (!res.endtime) {
        res.starttime = setEndTime();
      }

      const timeStarts = mergeDateTime(res.start, res.starttime);
      const timeEnds = mergeDateTime(res.end, res.endtime);
      const x = moment(timeStarts);
      const y = moment(timeEnds);
      const duration = moment.duration(y.diff(x)).asMinutes();
      const durations = convertToDuration(duration);

      this.calendar.addEvent({
        id: res.id,
        title: res.event,
        start: timeStarts.toISOString(),
        end: timeEnds.toISOString(),
        allDay: res.allDay,
        color: res.backgroundColor.color,
        textColor: res.backgroundColor.textcolor,
        rrule: {
          freq: res.rrule.freq,
          count: res.rrule.count,
          interval: res.rrule.interval,
          dtstart: timeStarts.toISOString(),
          until: res.until
        },
        duration: durations.toString()
      });

    } else {
      console.log('no event');
      const x = moment(res.start);
      const y = moment(res.end);
      const duration = moment.duration(y.diff(x)).asMinutes();
      const durations = convertToDuration(duration);

      this.calendar.addEvent({
        id: res.id,
        title: res.event,
        start: res.start.toISOString(),
        end: res.end.toISOString(),
        allDay: res.allDay,
        color: res.backgroundColor.color,
        textColor: res.backgroundColor.textcolor,
        rrule: {
          freq: res.rrule.freq,
          count: res.rrule.count,
          interval: res.rrule.interval,
          dtstart: res.start.toISOString(),
          until: '2019-12-01'
        },
        duration: durations.toString()
      });
    }

  }

  setEventForm() {
    this.eventFormGroup = this.fb.group({
      id: [null, Validators.required],
      calendarid: [null, Validators.required],
      userid: [null, Validators.required],
      event: ['', Validators.required],
      start: [Validators.required],
      end: [Validators.required],
      until: [Date.now],
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
      rrule: {},
      Calendareventrole: this.fb.array([]),
    });
  }

  get f() {
    return this.eventFormGroup.controls;
  }

  loadCalendar(calendarEvents) {
    this.calendarEl = document.getElementById('calendar');
    this.calendar = new Calendar(this.calendarEl, {
      plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin, rrulePlugin],
      navLinks: true,
      displayEventTime: true,
      nowIndicator: true,
      eventLimit: true, // allow "more" link when too many events
      eventColor: '#fff',
      eventTextColor: '#000',
      weekNumbers: true,
      editable: true,
      selectable: true,
      height: 'auto',
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
      events: [
        {
          // standard property
          title: 'MTS',
          start: '2019-07-26',
          end: '2019-08-03',
          // ...or, an object...
          rrule: {
            freq: 'weekly',
            count: 30,
            interval: 1,
            dtstart: '2019-07-28T10:30:00',
            until: '2019-12-01'
          },

          // for specifying the end time of each instance
          duration: '24:0'
        }
      ],
      eventRender: (info) => {
        const tooltip = new Tooltip(info.el, {
          title: info.event.extendedProps.description,
          placement: 'top',
          trigger: 'hover',
          container: 'body'
        });
      },
      select: (info) => {
        this.ruleText = 'Does not repeat';

        const event = this.calendar.getEventById('aaaaa');
        if (event) {
          event.remove();
        }

        /* this adds a day to the eventend time as its usually a day
         back on display */
        const ends = moment(info.end).subtract(1, 'd').toDate();

        /// calculate the starttime and endtime for the forms
        const timeStarts = mergeDateTime(info.startStr, setStartTime());
        const timeEnds = moment(mergeDateTime(info.endStr, setEndTime())).subtract(1, 'd').toDate();
        // const timeEnds = this.mergeDateTime(info.endStr, this.setEndTime());


        this.eventFormGroup.patchValue({
          id: 'aaaaa',
          event: '',
          start: timeStarts,
          end: timeEnds,
          starttime: setStartTime(),
          endtime: setEndTime(),
          allDay: false,
          until: '2019-12-01',
          rrule: {
            freq: '',
            dtstart: timeStarts,
            count: 30,
            interval: 1,
            until: '2019-12-01'
          }
        });

        this.allday = true;

        this.endTime = currentTimeArray(mergeDateTime(info.startStr, setStartTime()));

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
      },
      eventClick: (info) => {
        const eventObj = info.event;

        if (eventObj.url) {
          alert(
            'Clicked ' + eventObj.title + '.\n' +
            'Will open ' + eventObj.url + ' in a new tab'
          );

          window.open(eventObj.url);

          info.jsEvent.preventDefault(); // prevents browser from following link in current tab.
        } else {
          alert('Clicked ' + eventObj.title);
        }
      },
    });
    this.calendar.render();

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
  }

  selectEventUser(item) {
  }

  selectEventRole(item) {
  }

  selectEventStart(item) {
    const starts = mergeDateTime(this.eventFormGroup.value.start, item);
    const timePatch = eventEndTime(mergeDateTime(this.eventFormGroup.value.start, item));
    // tslint:disable-next-line:max-line-length
    const ends = mergeDateTime(this.eventFormGroup.value.end, timePatch);

    this.eventFormGroup.patchValue({
      endtime: timePatch,
      starttime: item,
      allDay: false
    });

    this.endTime = currentTimeArray(mergeDateTime(this.eventFormGroup.value.start, item));
  }

  selectEventEnd(item) {
    console.log(item);
    this.eventFormGroup.patchValue({
      end: mergeDateTime(this.eventFormGroup.value.end, item),
      endtime: item,
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
    const searcher = new FuzzySearch(this.startTime, {
      caseSensitive: true,
    });
    const result = searcher.search(val);
    this.startTimes = [];
    this.startTimes = result;

  }

  onChangeSearchEnd(val: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
    const searcher = new FuzzySearch(this.endTime, {
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
    this.startTimes = timeArrays();
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

  checkAllDay(events) {
    const state = this.allday;

    if (state === true) {

      const start = new Date(events.value.start);
      const starts = new Date(start.toISOString().substring(0, 10) + 'T00:00:00');

      const end = new Date(events.value.end);
      const ends = new Date(end.toISOString().substring(0, 10) + 'T20:00:00');

      this.eventFormGroup.patchValue({
        id: events.value.id,
        start: starts,
        end: moment(ends).add(1, 'd').toDate(),
        starttime: setDefaultTime(),
        endtime: setDefaultTime(),
        allDay: true
      });
      this.allday = false;
    } else if (state === false) {
      const timeStarts = mergeDateTime(events.value.start, setStartTime());
      const timeEnds = mergeDateTime(events.value.end, setEndTime());
      this.eventFormGroup.patchValue({
        id: events.value.id,
        start: moment(timeStarts).add(1, 'd').toDate(),
        end: moment(timeEnds).subtract(1, 'd').toDate(),
        starttime: setStartTime(),
        endtime: setEndTime(),
        allDay: false
      });
      this.allday = true;
    }


  }

  rule(params) {
    const rule = new RRule({
      freq: RRule.DAILY,
      interval: 1,
      count: 30,
      dtstart: new Date(Date.UTC(2019, 7, 28)),
      until: new Date(Date.UTC(2019, 12, 31))
    });


    // const rule = new RRule(params);
    return rule;

  }

  setRule(option, eventForm) {
    const rules = {
      freq: '',
      interval: 1,
      dtstart: '2019-08-01T10:30:00',
      until: '2019-12-01',
    };

    switch (option) {
      case 'none': {
        this.ruleText = 'Does not repeat';
        break;
      }
      case 'daily': {
        this.ruleText = 'Daily';
        rules.freq = 'daily';
        rules.dtstart = eventForm.value.start;
        this.eventFormGroup.patchValue({
          rrule: rules
        });
        break;
      }
      case 'weekly': {
        this.ruleText = 'Weekly';
        rules.freq = 'weekly';
        rules.dtstart = eventForm.value.start;
        this.eventFormGroup.patchValue({
          rrule: rules
        });
        break;
      }
      case 'monthly': {
        this.ruleText = 'Monthly';
        rules.freq = 'monthly';
        rules.dtstart = eventForm.value.start;
        this.eventFormGroup.patchValue({
          rrule: rules
        });
        break;
      }
      case 'anually': {
        this.ruleText = 'Anually';
        rules.freq = 'anually';
        rules.dtstart = eventForm.value.start;
        this.eventFormGroup.patchValue({
          rrule: rules
        });
        break;
      }
      case 'allweek': {
        this.ruleText = 'Week Days';
        rules.dtstart = eventForm.value.start;
        // rules.byweekday = [RRule.MO, RRule.TU, RRule.WE, RRule.TH, RRule.FR];
        this.eventFormGroup.patchValue({
          rrule: rules
        });
        break;
      }
      case 'custom': {
        this.ruleText = 'Custom';
        break;
      }
      default: {
        break;
      }
    }
  }

}
