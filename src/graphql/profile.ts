import gql from 'graphql-tag';

export const allProfile = gql`
query allprofile {
  allprofile {
    _id
    userid
    email
    title
    role
    identityid
    avatar
    fullname
    faculty
    department
    level
    phone
    institution
  }
}
`;

export const oneProfile = gql`
query profile ($id: String!) {
  profile (id: $id) {
    _id
    userid
    email
    title
    role
    identityid
    avatar
    fullname
    faculty
    department
    level
    phone
    institution
  }
}
`;

export const searchProfile = gql`
query searchprofile ($search: String) {
  searchprofile (search: $search) {
    _id
    email
    identityid
    avatar
    userid
    fullname
  }
}
`;

export const updateProfile = gql`
mutation updateprofile (
  $_id: String!,
  $userid: String!,
  $email: String!,
  $title: String,
  $identityid: String,
  $avatar: String,
  $fullname: String!,
  $institution: String,
  $faculty: String,
  $department: String,
  $level: String,
  $role: String,
  $phone: String
  ) {
  updateprofile (
    _id: $_id,
    userid: $userid,
    email: $email,
    role: $role,
    title: $title,
    identityid: $identityid,
    avatar: $avatar,
    fullname: $fullname,
    institution: $institution,
    faculty: $faculty,
    department: $department,
    level: $level,
    phone: $phone
  ) {
    _id
    userid
    email
    role
    title
    identityid
    avatar
    fullname
    faculty
    department
    level
    phone
    institution
  }
}
`;

export const profileOption = gql`{
  institutions{
    institution
  }
  departments{
    department
  }
  facultys{
    faculty
  }
  levels{
    level
  }
}`;

export const searchInstitution = gql`
query searchinstitution ($search: String) {
  searchinstitution (search: $search) {
    institution
  }
}`;
