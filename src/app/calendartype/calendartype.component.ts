import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CalendartypeService } from '../../services/calendartype.service';
import { Calendartype } from '../../models/calendartype.model';

@Component({
  selector: 'app-calendartype',
  templateUrl: './calendartype.component.html',
  styleUrls: ['./calendartype.component.css']
})
export class CalendartypeComponent implements OnInit {

  calendarList: Calendartype[] = [];
  resp: any;
  constructor(
    private router: Router,
    private typeService: CalendartypeService) { }

  ngOnInit() {
    this.typeService.getCalendarType()
      .valueChanges
      .subscribe(res => {
        this.resp = res.data;
        console.log(res.data);
        this.calendarList = this.resp.calendartypes;
      });
  }

  selectType(type) {
    this.router.navigate(['/mycalendar/addcalendar', type]);
  }

}
