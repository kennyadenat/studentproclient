import gql from 'graphql-tag';

export const addCalendar = gql`
mutation addcalendar(
  $title: String!,
  $institution: String,
  $type: String,
  $icon: String,
  $note: String,
  $status: Boolean,
  $timezone: String,
  $calendarevent: [
    CalendareventInputType
    ],
  $calendarauthor: [
    CalendarauthorInputType
    ]
  ) {
  addcalendar(
    title: $title,
    institution: $institution,
    type: $type,
    icon: $icon,
    note: $note,
    status: $status,
    timezone: $timezone,
    calendarevent: $calendarevent,
    calendarauthor: $calendarauthor
  ) {
    title
    institution
  }
}
`;
