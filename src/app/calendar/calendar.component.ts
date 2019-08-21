import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbDateAdapter, NgbDateStruct, NgbDateNativeAdapter, NgbDate, NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subject, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
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

const states = ['Alabama', 'Alaska', 'American Samoa', 'Arizona', 'Arkansas', 'California', 'Colorado',
  'Connecticut', 'Delaware', 'District Of Columbia', 'Federated States Of Micronesia', 'Florida', 'Georgia',
  'Guam', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine',
  'Marshall Islands', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana',
  'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
  'Northern Mariana Islands', 'Ohio', 'Oklahoma', 'Oregon', 'Palau', 'Pennsylvania', 'Puerto Rico', 'Rhode Island',
  'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virgin Islands', 'Virginia',
  'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  providers: [{ provide: NgbDateAdapter, useClass: NgbDateNativeAdapter }]
})
export class CalendarComponent implements OnInit {

  @ViewChild('use') use;
  @ViewChild('user') user;
  @ViewChild('secondbutt') secondbutt;
  @ViewChild('st') start;
  @ViewChild('en') end;

  model: any;



  @ViewChild('instance') instance: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();


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
  userKeyword = 'fullname';
  roleKeyword = 'role';
  startKeyword = '';
  endKeyword = '';
  ruleText: string;
  currentUser: any;
  display: any;

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
  eventRoleGroup: FormGroup;

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

    this.display = {
      week: '',
      month: '',
      annual: ''
    };
    this.ruleText = 'Does not repeat';
    this.startTime = timeArrays();
    this.setEventForm();
    this.loadCalendar(this.Calendarevent);
    this.getProfile(this.currentUser._id);
    this.setEventRole();
    this.getCalendarOption();

    this.eventFormGroup
      .valueChanges
      .subscribe(res => {
        this.setMomentDisplay(res.start);
        if (res.id === null) {
        } else {
          this.addEvents(res);
        }
      });
  }

  getProfile(params) {
    this.profileService.getOneProfile(params)
      .subscribe(res => {
        this.resp = res.data;
        this.OwnerProfile = this.resp.profile;
      });
  }

  setMomentDisplay(date) {
    this.display = {
      week: moment(date).format('dddd'),
      month: moment(date).format('Do '),
      annual: moment(date).format('MMMM Do')
    };
  }

  addEvents(res: any) {

    const event = this.calendar.getEventById(res.id);

    if (event) {

      event.remove();

      if (!res.starttime) {
        res.starttime = setStartTime();
      }
      if (!res.endtime) {
        res.endtime = setEndTime();
      }

      if (res.allDay === false) {

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
          color: res.backgroundcolor.color,
          textColor: res.backgroundcolor.textcolor,
          rrule: {
            freq: res.rrule.freq,
            count: res.rrule.count,
            interval: res.rrule.interval,
            dtstart: timeStarts.toISOString(),
            until: res.until
          },
          duration: durations.toString()
        });

      } else if (res.allDay === true) {

        const timeStarts = mergeDateTime(res.start, res.starttime);
        const timeEnds = moment(mergeDateTime(res.end, res.endtime)).add(1, 'd').toDate();
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
          color: res.backgroundcolor.color,
          textColor: res.backgroundcolor.textcolor,
          rrule: {
            freq: res.rrule.freq,
            count: res.rrule.count,
            interval: res.rrule.interval,
            dtstart: timeStarts.toISOString(),
            until: res.until
          },
          duration: durations.toString()
        });
      }

    } else {
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
        color: res.backgroundcolor.color,
        textColor: res.backgroundcolor.textcolor,
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
      id: '',
      calendarid: ['', Validators.required],
      userid: ['', Validators.required],
      event: ['', Validators.required],
      start: ['', Validators.required],
      end: ['', Validators.required],
      until: [Date.now],
      allDay: [false, Validators.required],
      starttime: [''],
      endtime: [''],
      duration: [''],
      backgroundcolor: '',
      textcolor: '',
      editable: [false, Validators.required],
      location: [''],
      note: [''],
      rrule: {},
      calendareventrole: this.fb.array([]),
    });
  }

  setEventRole() {
    this.eventRoleGroup = this.fb.group({
      calendarid: '',
      eventid: '',
      userid: '',
      avatar: '',
      email: '',
      identityid: '',
      fullname: '',
      role: '',
      roleoptions: this.fb.array([]),
      isexist: false,
    });
  }

  get f() {
    return this.eventFormGroup.controls;
  }

  get getCalendarEventRole() {
    return this.eventFormGroup.get('calendareventrole') as FormArray;
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
          allDay: true,
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
        //  this.setEventForm();
        this.ruleText = 'Does not repeat';

        /// calculate the starttime and endtime for the forms
        const timeStarts = mergeDateTime(info.startStr, setStartTime());
        const timeEnds = moment(mergeDateTime(info.endStr, setEndTime())).subtract(1, 'd').toDate();
        // const timeEnds = this.mergeDateTime(info.endStr, this.setEndTime());

        // this.eventFormGroup.reset();

        this.eventFormGroup.patchValue({
          id: 'aaaaa',
          event: '',
          start: timeStarts,
          end: timeEnds,
          starttime: setStartTime(),
          endtime: setEndTime(),
          allDay: false,
          until: moment(timeStarts).add(12, 'M').toDate(),
          rrule: {
            freq: '',
            dtstart: timeStarts,
            count: 30,
            interval: 1,
            until: '2019-12-01'
          },
          calendareventrole: []
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
            'Clicked ' + eventObj + '.\n' +
            'Will open ' + eventObj.url + ' in a new tab'
          );

          window.open(eventObj.url);

          info.jsEvent.preventDefault(); // prevents browser from following link in current tab.
        } else {
          // alert('Clicked ' + info);
          console.log(info.event);
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
        this.Roles = this.resp.roleoptions;
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

  setCalendarEventRole(item) {
    this.eventRoleGroup = this.fb.group({
      calendarid: '',
      eventid: '',
      userid: item._id,
      avatar: item.avatar,
      email: item.email,
      identityid: '',
      fullname: item.fullname,
      role: '',
      roleoptions: this.fb.array([]),
      isexist: false,
    });

    this.Roles.forEach(roles => {
      const roleoptions = {
        role: roles.role,
        icon: roles.icon,
      };

      this.eventRoleGroup.value.roleoptions.push(roleoptions);
    });

    this.getCalendarEventRole.push(this.eventRoleGroup);
    this.user.notFound = false;
    this.user.clear();
  }

  selectEventUser(item) {
    if (this.eventFormGroup.controls.calendareventrole.value.length >= 1) {
      const profileList = _.pluck(this.eventFormGroup.controls.calendareventrole.value, 'email');
      if (!_.contains(profileList, item.email)) {
        this.setCalendarEventRole(item);
      } else {
        this.user.notFound = false;
        this.user.clear();
      }
    } else {
      this.setCalendarEventRole(item);
    }

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
    this.eventFormGroup.patchValue({
      end: mergeDateTime(this.eventFormGroup.value.end, item),
      endtime: item,
      allDay: false
    });
  }

  onChangeSearchUser(val: string) {
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
    // this.startTimes = timeArrays();
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
        // start: starts,
        // end: moment(ends).add(1, 'd').toDate(),
        // starttime: setDefaultTime(),
        // endtime: setDefaultTime(),
        allDay: true
      });
      this.allday = false;
    } else if (state === false) {


      const timeStarts = mergeDateTime(events.value.start, setStartTime());
      const timeEnds = mergeDateTime(events.value.end, setEndTime());
      this.eventFormGroup.patchValue({
        id: events.value.id,
        start: mergeDateTime(events.value.start, setStartTime()),
        end: mergeDateTime(events.value.end, setEndTime()),
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

  toggleRole(role, options) {
    this.eventFormGroup.value.calendareventrole.forEach((element, index) => {
      if (element.email === role.email) {
        // this.eventFormGroup.value.calendareventrole[index].role ? options.role  options.role : '';
        // tslint:disable-next-line:max-line-length
        this.eventFormGroup.value.calendareventrole[index].role === options.role ? this.eventFormGroup.value.calendareventrole[index].role = '' : this.eventFormGroup.value.calendareventrole[index].role = options.role;
      }
    });

    // map function. .
    // const roles = this.eventFormGroup.value.calendareventrole.map(newRole => newRole.email);
  }

  removeRole(i) {
    this.getCalendarEventRole.removeAt(i);
  }

  saveCalendar(formValue: NgForm) {
    console.log(formValue.value);
  }

  search = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.instance.isPopupOpen()));
    const inputFocus$ = this.focus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term => (term === '' ? this.startTime
        : this.startTime.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 8))
    );
  }

}
