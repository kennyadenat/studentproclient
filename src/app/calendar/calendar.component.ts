import { Component, OnInit } from '@angular/core';
import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';

// import interactionPlugin from '@fullcalendar/interaction';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {


  // calendarPlugins = [dayGridPlugin]; // important!
  constructor() { }

  ngOnInit() {

    const calendarEl = document.getElementById('calendar');

    const calendar = new Calendar(calendarEl, {
      plugins: [dayGridPlugin],
      height: 'auto',
      events: 'https://fullcalendar.io/demo-events.json'
    });
    calendar.render();

  }



}
