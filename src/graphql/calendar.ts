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


export const calendar = gql`
query calendar($id: String, $limit: Int, $page: Int, $search: String) {
  calendar(id: $id, limit: $limit, page: $page, search: $search) {
    docs {
      _id,
      title,
      institution,
      timezone,
      note,
      type,
      icon,
      status
      calendarauthor{
        fullname,
        userid,
        avatar
        role
        avatar
      }
    }
    totalDocs,
    limit,
    page,
    totalPages,
    hasNextPage,
    nextPage,
    hasPrevPage,
    prevPage,
    pagingCounter
  }
}
`;
