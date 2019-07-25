import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { allgeneric } from '../graphql/generic';

@Injectable({
  providedIn: 'root'
})
export class CalendartypeService {

  constructor(private apollo: Apollo) { }

  getCalendarType() {
    return this.apollo.watchQuery({
      query: allgeneric
    });
  }
}
