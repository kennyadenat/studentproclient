import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { allgeneric } from '../graphql/generic';
import {
  allProfile,
  oneProfile,
  updateProfile,
  searchProfile
} from '../graphql/profile';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  respInst: any;
  constructor(
    private apollo: Apollo) {

  }

  updateProfile(params) {
    return this.apollo.mutate({
      mutation: updateProfile,
      variables: {
        _id: params._id,
        userid: params.userid,
        email: params.email,
        role: params.role,
        title: params.title,
        identityid: params.identityid,
        avatar: params.avatar,
        fullname: params.fullname,
        institution: params.institution,
        faculty: params.faculty,
        department: params.department,
        level: params.level,
        phone: params.phone
      }
    });
  }

  getOneProfile(params) {
    return this.apollo.query({
      query: oneProfile,
      variables: {
        id: params
      }
    });
  }

  getProfileOption() {
    return this.apollo.watchQuery({
      query: allgeneric
    });
  }

  searchProfile(params) {
    return this.apollo.watchQuery({
      query: searchProfile,
      variables: {
        search: params
      }
    });
  }

  searchInstitution(params) {
    return this.apollo.watchQuery({
      query: params,
      variables: {
        search: params
      }
    });
  }

  searchFaculty(params) {
    return this.apollo.watchQuery({
      query: params
    });
  }

  searchDepartment(params) {
    return this.apollo.watchQuery({
      query: params
    });
  }

  searchLevel(params) {
    return this.apollo.watchQuery({
      query: params
    });
  }
}
