import { Component, OnInit } from '@angular/core';
import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import Tooltip from 'tooltip.js';
import interactionPlugin from '@fullcalendar/interaction';
import { RRule, RRuleSet, rrulestr } from 'rrule';


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    this.loadCalendar();

    // this.rule();
    this.ruleSet();
  }

  loadCalendar() {
    const calendarEl = document.getElementById('calendar');

    const calendar = new Calendar(calendarEl, {
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
            calendar.today();
          }
        }
      },
      nowIndicator: true,
      eventLimit: true, // allow "more" link when too many events
      eventColor: '#ffb822',
      eventTextColor: 'white',
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
      businessHours: true,
      height: 'auto',
      events: 'https://fullcalendar.io/demo-events.json',
      select: (info) => {
        alert('selected ' + info.startStr + ' to ' + info.endStr);
      },
      dateClick: (info) => {
        alert('clicked ' + info.dateStr);
      },
    });
    calendar.render();
  }

  rule() {
    const rule = new RRule({
      freq: RRule.WEEKLY,
      interval: 5,
      count: 30,
      dtstart: new Date(Date.UTC(2019, 7, 28)),
      until: new Date(Date.UTC(2019, 12, 31))
    });

    console.log(rule.all());
  }

  ruleSet() {
    const rruleSet = new RRuleSet();

    // Add a rrule to rruleSet
    rruleSet.rrule(new RRule({
      freq: RRule.WEEKLY,
      count: 5,
      dtstart: new Date(Date.UTC(2019, 7, 28, 10, 30))
    }));

    console.log(rruleSet.all());
  }

}
