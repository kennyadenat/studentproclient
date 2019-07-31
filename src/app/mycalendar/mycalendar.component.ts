import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CalendarService } from '../../services/calendar.service';
import { Calendar } from '../../models/calendar.model';

@Component({
  selector: 'app-mycalendar',
  templateUrl: './mycalendar.component.html',
  styleUrls: ['./mycalendar.component.css']
})

export class MycalendarComponent implements OnInit {

  @ViewChild('use') use;
  @ViewChild('secondbutt') secondbutt;

  slideoption: string;
  resp: any;
  isLoadingResult = true;
  limit = 10;
  page = 1;
  totalDocs = '';
  totalPages = '';
  nextPage = '';
  prevPage = '';
  hasNextPage: false;
  hasPrevPage: false;
  params: any = {};
  extParams: any = {};
  search: any;
  currentUser: any;
  calendar: Calendar[] = [];

  constructor(
    private authService: AuthService,
    private calendarService: CalendarService) {
    this.slideoption = 'slide-right';
  }

  ngOnInit() {
    this.currentUser = this.authService.currentUserValue;
    this.extParams = {
      id: this.currentUser._id,
      limit: this.limit,
      page: this.page,
      searchtxt: this.search,
    };
    this.getCalendar(this.extParams);
    // this.secondbutt.nativeElement.click();
    // document.getElementById('openModalButton').click();
    console.log(document.getElementById('openModalButton').getBoundingClientRect());
    // Body Position
    console.log('Body Position');
    console.log(document.body.getBoundingClientRect());
  }

  getCalendar(params) {
    this.calendarService.calendar(params)
      .valueChanges
      .subscribe(res => {
        this.resp = res.data;
        this.calendar = this.resp.calendar.docs;
      });
  }

}
