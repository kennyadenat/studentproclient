import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import {
  addCalendar,
  calendar
} from '../graphql/calendar';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  constructor(
    private apollo: Apollo
  ) { }

  addCalendar(params) {
    console.log(params);
    return this.apollo.mutate({
      mutation: addCalendar,
      variables: {
        title: params.title,
        institution: params.institution,
        type: params.type,
        icon: params.icon,
        note: params.note,
        status: params.status,
        timezone: params.timezone,
        calendarevent: params.calendarevent,
        calendarauthor: params.calendarauthor
      }
    });
  }

  calendar(params) {
    return this.apollo.watchQuery({
      query: calendar,
      variables: {
        id: params.id,
        limit: params.limit,
        page: params.page,
        search: params.search
      }
    });
  }
}
