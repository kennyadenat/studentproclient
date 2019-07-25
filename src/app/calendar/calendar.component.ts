import { Component, OnInit } from '@angular/core';
import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import Tooltip from 'tooltip.js';
// import interactionPlugin from '@fullcalendar/interaction';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  constructor() { }

  ngOnInit() {

    const calendarEl = document.getElementById('calendar');

    const calendar = new Calendar(calendarEl, {
      plugins: [dayGridPlugin, timeGridPlugin, listPlugin],
      header: {
        left: 'dayGridMonth,timeGridWeek,timeGridDay,list',
        center: 'title',
        right: 'prevYear,prev,next,nextYear'
      },
      nowIndicator: true,
      eventLimit: true, // allow "more" link when too many events
      eventColor: '#ffb822',
      eventTextColor: 'white',
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
      events: 'https://fullcalendar.io/demo-events.json'
    });
    calendar.render();

  }



}
