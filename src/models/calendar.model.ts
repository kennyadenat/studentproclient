import { Calendarauthor } from './calendarauthor.model';
export class Calendar {
  // tslint:disable-next-line: variable-name
  _id: string;
  department: string;
  title: string;
  institution: string;
  type: string;
  icon: string;
  note: string;
  status: boolean;
  timezone: string;
  calendarevent: [];
  calendarauthor: [Calendarauthor];
}
