import { Rrule } from './rrule.model';
import { Calendareventrole } from './calendareventrole.model';
export class Calendarevent {
  // tslint:disable-next-line: variable-name
  _id: string;
  calendarid: string;
  eventid: string;
  userid: string;
  start: string;
  end: string;
  allDay: string;
  starttime: boolean;
  endtime: string;
  duration: string;
  backgroundColor: string;
  textColor: string;
  editable: string;
  rrule: Rrule;
  event: string;
  location: string;
  note: string;
  Calendareventrole: [Calendareventrole];
}
